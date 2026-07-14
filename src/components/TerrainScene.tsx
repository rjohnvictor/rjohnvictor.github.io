'use client';

/**
 * TerrainScene — Digitized 3D mountain terrain
 *
 * Architecture (back → front):
 *   1. Sky sphere    — gradient shader: day / sunset / night + stars
 *   2. Sun / Moon    — sphere mesh on real-clock celestial arc
 *   3. Terrain mesh  — displaced PlaneGeometry, neon shader + UV grid lines
 *   4. Grid floor    — perspective neon wireframe grid
 *   5. Path line     — glowing river-valley trail
 *   6. Flag          — pole + animated cloth flag at summit
 *   7. Clouds        — canvas sprites, scroll-boosted drift
 *   8. Rain drops    — LineSegments (Power mode)
 *   9. Autumn leaves — Sprites (Zen mode)
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme, type AppTheme } from '@/context/ThemeContext';

/* ─── Theme config ────────────────────────────────────────── */

interface ThemeConfig {
    neonPeak: number;
    neonMid: number;
    baseLow: number;
    gridColor: number;
    pathColor: number;
    flagColor: number;
    cloudColor: [number, number, number];
    cloudOpacity: number;
    lightning: boolean;
    skyTintColor: [number, number, number];
    skyTintStrength: number;
    ambientColor: number;
    ambientIntensity: number;
    sunColor: number;
    sunIntensity: number;
    fogColor: number;
    fogNear: number;
    fogFar: number;
}

const THEMES: Record<AppTheme, ThemeConfig> = {
    professional: {
        neonPeak: 0x00d4ff,
        neonMid: 0x114488,
        baseLow: 0x010810,
        gridColor: 0x003366,
        pathColor: 0x00aaff,
        flagColor: 0x00d4ff,
        cloudColor: [0.7, 0.85, 1.0],
        cloudOpacity: 0.22,
        lightning: false,
        skyTintColor: [0.06, 0.18, 0.5],
        skyTintStrength: 0.0,
        ambientColor: 0x224466,
        ambientIntensity: 0.55,
        sunColor: 0xfff0cc,
        sunIntensity: 1.2,
        fogColor: 0x010810,
        fogNear: 32,
        fogFar: 85,
    },
    power: {
        neonPeak: 0xbf5fff,
        neonMid: 0x550088,
        baseLow: 0x060010,
        gridColor: 0x440066,
        pathColor: 0xff44cc,
        flagColor: 0xbf5fff,
        cloudColor: [0.3, 0.18, 0.5],
        cloudOpacity: 0.55,
        lightning: true,
        skyTintColor: [0.25, 0.05, 0.45],
        skyTintStrength: 0.55,
        ambientColor: 0x18082a,
        ambientIntensity: 0.25,
        sunColor: 0x9966ff,
        sunIntensity: 0.8,
        fogColor: 0x060010,
        fogNear: 18,
        fogFar: 55,
    },
    zen: {
        neonPeak: 0x86efac,
        neonMid: 0x2a5a30,
        baseLow: 0x080c06,
        gridColor: 0x1a3010,
        pathColor: 0x55dd88,
        flagColor: 0x86efac,
        cloudColor: [0.88, 0.8, 0.7],
        cloudOpacity: 0.22,
        lightning: false,
        skyTintColor: [0.22, 0.35, 0.12],
        skyTintStrength: 0.2,
        ambientColor: 0x304828,
        ambientIntensity: 0.5,
        sunColor: 0xf5c060,
        sunIntensity: 0.9,
        fogColor: 0x080c06,
        fogNear: 26,
        fogFar: 70,
    },
};

/* ─── Sky shaders ─────────────────────────────────────────── */

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform float uSunHeight;  // -1..1 sin of solar arc — used for stars
  uniform float uSunPhase;   // 0=sunrise  0.25=noon  0.5=sunset  0.75=midnight
  uniform float uTime;
  uniform vec3  uThemeTint;
  uniform float uThemeTintStr;
  varying vec3  vDir;

  float hash(vec3 p) {
    p = fract(p * vec3(234.34, 435.34, 238.34));
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;

    // Day / night split
    float isDay = step(uSunPhase, 0.4999);
    // dayP: 0=sunrise → 0.5=noon → 1.0=sunset (only meaningful when isDay)
    float dayP  = clamp(uSunPhase * 2.0, 0.0, 1.0);

    // Golden-hour band: peaks at dawn (dayP≈0) and dusk (dayP≈1)
    float goldenRise = 1.0 - smoothstep(0.0, 0.32, dayP);   // fades by mid-morning
    float goldenSet  = smoothstep(0.68, 1.0,  dayP);         // builds toward dusk
    float golden     = max(goldenRise, goldenSet);            // 0 at noon, 1 at dusk/dawn

    // Night depth: 0=just turned night, peaks at midnight, 0=pre-dawn
    float nightP    = clamp((uSunPhase - 0.5) * 2.0, 0.0, 1.0);
    float deepNight = smoothstep(0.0, 0.35, nightP) * (1.0 - smoothstep(0.65, 1.0, nightP));

    // ── Color palette ──────────────────────────────────────────
    // Dawn (just-after-sunrise): purple zenith + vivid orange horizon
    vec3 dawn_z  = vec3(0.10, 0.06, 0.32);  vec3 dawn_h  = vec3(0.98, 0.42, 0.08);
    // Midday: clear deep blue zenith + pale haze horizon
    vec3 noon_z  = vec3(0.04, 0.18, 0.70);  vec3 noon_h  = vec3(0.35, 0.62, 0.92);
    // Dusk (pre-sunset): deeper purple + red-orange horizon
    vec3 dusk_z  = vec3(0.08, 0.04, 0.22);  vec3 dusk_h  = vec3(0.94, 0.26, 0.05);
    // Twilight (just after sunset / just before sunrise): dark indigo
    vec3 twil_z  = vec3(0.02, 0.01, 0.09);  vec3 twil_h  = vec3(0.06, 0.02, 0.18);
    // Deep night: near-black with slight blue
    vec3 night_z = vec3(0.005, 0.005, 0.022); vec3 night_h = vec3(0.010, 0.008, 0.040);

    vec3 zenith, horizon;
    if (isDay > 0.5) {
      // Blend dawn ↔ dusk within the golden zone depending on which side we're on
      // goldenSet / golden → 0 on morning side, 1 on evening side
      float duskSide  = goldenSet / max(golden, 0.001);
      vec3 golden_z = mix(dawn_z, dusk_z, duskSide);
      vec3 golden_h = mix(dawn_h, dusk_h, duskSide);
      zenith  = mix(noon_z, golden_z, golden);
      horizon = mix(noon_h, golden_h, golden);
    } else {
      // Night: twilight → deep night → twilight again near pre-dawn
      zenith  = mix(twil_z,  night_z, deepNight);
      horizon = mix(twil_h, night_h, deepNight);
    }

    // Vertical gradient
    vec3 sky;
    if (h >= 0.0) {
      sky = mix(horizon, zenith, pow(h, 0.38));
    } else {
      sky = mix(horizon, night_z * 0.4, clamp(-h * 2.0, 0.0, 1.0));
    }

    sky = mix(sky, uThemeTint, uThemeTintStr * (1.0 - isDay * 0.7));

    // Stars — smooth independent twinkle, 2-3 at a time
    if (h > 0.05 && uSunHeight < 0.15) {
      float fade = clamp((0.15 - uSunHeight) / 0.4, 0.0, 1.0);
      vec3 sid = floor(d * 380.0);
      float h0 = hash(sid);
      if (h0 > 0.9978) {
        float phase = h0 * 83.7 + hash(sid + vec3(1.7, 3.3, 2.1)) * 61.4;
        float cycle = fract(uTime * 0.09 + phase);
        float pulse = exp(-70.0 * (cycle - 0.5) * (cycle - 0.5));
        float brightness = 0.18 + 0.82 * pulse;
        sky += vec3(0.78, 0.88, 1.0) * 0.90 * fade * brightness;
      }
    }

    gl_FragColor = vec4(sky, 1.0);
  }
`;

/* ─── Terrain shaders ─────────────────────────────────────── */

const TERRAIN_VERT = /* glsl */ `
  varying float vHeight;
  varying vec2  vUv2;
  varying float vRiverProx;

  float riverCx(float z) {
    return sin(z * 0.18) * 3.5;
  }

  float terrainH(float x, float z) {
    float h = sin(x * 0.28 + 0.20) * 2.6
            + sin(z * 0.22 + 0.50) * 2.2
            + sin(x * 0.62 + z * 0.45) * 1.4
            + sin(x * 1.15 - z * 0.82) * 0.7
            + sin(x * 2.20 + z * 1.80) * 0.35;
    float dx = x;
    float dz = z + 2.0;
    h += 8.5 * exp(-0.06 * (dx * dx + dz * dz));
    float rx = riverCx(z);
    float rd = abs(x - rx);
    h -= 2.8 * exp(-rd * rd * 0.35);
    return h;
  }

  void main() {
    vUv2 = uv;
    float x = position.x;
    float z = position.z;
    float h = terrainH(x, z);
    vHeight = h;
    float rx = riverCx(z);
    float rd = abs(x - rx);
    vRiverProx = exp(-rd * rd * 0.35);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, h, z, 1.0);
  }
`;

const TERRAIN_FRAG = /* glsl */ `
  uniform vec3  uNeonPeak;
  uniform vec3  uNeonMid;
  uniform vec3  uBaseLow;
  uniform vec3  uGridCol;
  uniform float uSunPhase;   // 0=sunrise  0.25=noon  0.5=sunset  0.75=midnight
  uniform float uDayFactor;  // 0=night → 1=peak day
  varying float vHeight;
  varying vec2  vUv2;
  varying float vRiverProx;

  void main() {
    // Time-of-day blend factors
    float isDay  = step(uSunPhase, 0.4999);
    float dayP   = clamp(uSunPhase * 2.0, 0.0, 1.0); // 0=sunrise, 1=sunset

    // Golden-hour factor: 1 at dawn/dusk, 0 at noon
    float goldenRise = 1.0 - smoothstep(0.0, 0.32, dayP);
    float goldenSet  = smoothstep(0.68, 1.0, dayP);
    float golden     = max(goldenRise, goldenSet) * isDay;
    float midday     = (1.0 - golden) * isDay;

    // Time palette — warm amber at golden hour, soft gold at noon
    float duskSide = goldenSet / max(golden, 0.001); // 0=dawn side, 1=dusk side
    vec3 gPeak = mix(vec3(1.00, 0.52, 0.08), vec3(0.96, 0.30, 0.06), duskSide);
    vec3 gMid  = mix(vec3(0.52, 0.28, 0.04), vec3(0.38, 0.10, 0.02), duskSide);
    vec3 dayPeak = vec3(0.96, 0.86, 0.48);
    vec3 dayMid  = vec3(0.48, 0.36, 0.14);

    float splitT = midday / max(golden + midday, 0.001);
    float timeMix = golden * 0.90 + midday * 0.55;
    vec3 timePeak = mix(uNeonPeak, mix(gPeak, dayPeak, splitT), timeMix);
    vec3 timeMid  = mix(uNeonMid,  mix(gMid,  dayMid,  splitT), timeMix * 0.80);
    vec3 timeBase = mix(uBaseLow,  vec3(0.06, 0.03, 0.01), uDayFactor * 0.45);

    float t = clamp((vHeight - 0.5) / 8.5, 0.0, 1.0);
    vec3 col = mix(timeBase, mix(timeMid, timePeak, t), t * 0.85 + 0.15);

    // River water tint
    vec3 waterCol = timeBase * 0.4 + mix(vec3(0.01, 0.10, 0.28), vec3(0.04, 0.14, 0.22), uDayFactor * 0.5);
    col = mix(col, waterCol, vRiverProx * 0.55);

    // Peak glow — time-shifted color
    float peak = clamp((vHeight - 5.5) / 3.5, 0.0, 1.0);
    col += timePeak * peak * 0.30;

    // Slight dim at midday: bright sky stays dominant, text above stays readable
    col *= 1.0 - uDayFactor * 0.18;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ─── JS terrain mirror (flag + path placement) ──────────── */

function riverCxJS(z: number): number {
    return Math.sin(z * 0.18) * 3.5;
}

function terrainHJS(x: number, z: number): number {
    let h =
        Math.sin(x * 0.28 + 0.2) * 2.6 +
        Math.sin(z * 0.22 + 0.5) * 2.2 +
        Math.sin(x * 0.62 + z * 0.45) * 1.4 +
        Math.sin(x * 1.15 - z * 0.82) * 0.7 +
        Math.sin(x * 2.2 + z * 1.8) * 0.35;
    const dx = x,
        dz = z + 2.0;
    h += 8.5 * Math.exp(-0.06 * (dx * dx + dz * dz));
    const rx = riverCxJS(z);
    const rd = Math.abs(x - rx);
    h -= 2.8 * Math.exp(-rd * rd * 0.35);
    return h;
}

function findPeak(): { x: number; y: number; z: number } {
    let px = 0,
        pz = -2,
        ph = -Infinity;
    for (let xi = -4; xi <= 4; xi += 0.4) {
        for (let zi = -6; zi <= 1; zi += 0.4) {
            const h = terrainHJS(xi, zi);
            if (h > ph) {
                ph = h;
                px = xi;
                pz = zi;
            }
        }
    }
    return { x: px, y: ph, z: pz };
}

/* ─── Texture factories ───────────────────────────────────── */

function makeCloudTexture(): THREE.Texture {
    const S = 256;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const ctx = cv.getContext('2d')!;
    for (const b of [
        { x: 0.5, y: 0.48, r: 0.36 },
        { x: 0.32, y: 0.52, r: 0.26 },
        { x: 0.68, y: 0.52, r: 0.26 },
        { x: 0.42, y: 0.38, r: 0.2 },
        { x: 0.6, y: 0.38, r: 0.2 },
        { x: 0.22, y: 0.5, r: 0.18 },
        { x: 0.78, y: 0.5, r: 0.18 },
        { x: 0.5, y: 0.62, r: 0.16 },
    ]) {
        const cx = b.x * S,
            cy = b.y * S,
            r = b.r * S;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0.0, 'rgba(255,255,255,0.22)');
        g.addColorStop(0.5, 'rgba(255,255,255,0.10)');
        g.addColorStop(1.0, 'rgba(255,255,255,0.00)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
}

function makeLeafTexture(color: number): THREE.Texture {
    const S = 128;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const ctx = cv.getContext('2d')!;
    const c = new THREE.Color(color);
    const r = Math.round(c.r * 255),
        g = Math.round(c.g * 255),
        b = Math.round(c.b * 255);
    const rd = Math.round(r * 0.62),
        gd = Math.round(g * 0.62),
        bd = Math.round(b * 0.62);
    ctx.save();
    ctx.translate(S / 2, S / 2);
    ctx.beginPath();
    ctx.ellipse(0, -5, S * 0.27, S * 0.15, Math.PI / 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},0.88)`;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -S * 0.18);
    ctx.lineTo(0, S * 0.14);
    ctx.strokeStyle = `rgba(${rd},${gd},${bd},0.65)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
}

/* ─── Solar helpers ───────────────────────────────────────── */

const SOLAR_LATITUDE_DEG = 13;
const MORNING_WARP_ENABLED_KEY = 'portfolio-sky-morning-warp-enabled';
const MORNING_WARP_HOUR_KEY = 'portfolio-sky-morning-warp-hour';
const WEATHER_REFRESH_MS = 8 * 60 * 1000;
const FALLBACK_WEATHER_COORDS = { lat: 12.97, lon: 77.59 };

interface LiveWeather {
    precip01: number;
    cloud01: number;
    wind01: number;
    storm: boolean;
}

function clamp01(v: number): number {
    return Math.max(0, Math.min(1, v));
}

async function getBrowserCoords(): Promise<{ lat: number; lon: number }> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return FALLBACK_WEATHER_COORDS;
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                });
            },
            () => resolve(FALLBACK_WEATHER_COORDS),
            {
                enableHighAccuracy: false,
                timeout: 4500,
                maximumAge: 20 * 60 * 1000,
            },
        );
    });
}

async function fetchLiveWeather(
    lat: number,
    lon: number,
    signal: AbortSignal,
): Promise<LiveWeather> {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
        `&longitude=${lon}` +
        '&current=precipitation,cloud_cover,wind_speed_10m,weather_code' +
        '&timezone=auto';

    const response = await fetch(url, { signal, cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`weather http ${response.status}`);
    }

    const data = (await response.json()) as {
        current?: {
            precipitation?: number;
            cloud_cover?: number;
            wind_speed_10m?: number;
            weather_code?: number;
        };
    };

    const current = data.current ?? {};
    const code = Number(current.weather_code ?? 0);
    const precipitation = Math.max(0, Number(current.precipitation ?? 0));
    const cloud = Math.max(0, Number(current.cloud_cover ?? 0));
    const wind = Math.max(0, Number(current.wind_speed_10m ?? 0));

    return {
        precip01: clamp01(precipitation / 3.5),
        cloud01: clamp01(cloud / 100),
        wind01: clamp01(wind / 45),
        storm: code === 95 || code === 96 || code === 99,
    };
}

interface SolarClock {
    rise: number;
    set: number;
    hour: number;
    isDay: boolean;
    sunPhase: number;
    moonPhase: number;
    sunHeight: number;
}

function getSolarClock(
    date: Date = new Date(),
    hourOverride?: number,
): SolarClock {
    const clockHour =
        date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    const hour = hourOverride ?? clockHour;

    const start = new Date(date.getFullYear(), 0, 0);
    const doy = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
    const decl = 23.45 * Math.sin(((284 + doy) / 365) * 2 * Math.PI);
    const latRad = SOLAR_LATITUDE_DEG * (Math.PI / 180);
    const declRad = decl * (Math.PI / 180);
    const cosHA = -Math.tan(latRad) * Math.tan(declRad);
    const ha = (Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180) / Math.PI;
    const rise = 12 - ha / 15;
    const set = 12 + ha / 15;

    const dayLen = set - rise;
    const nightLen = 24 - dayLen;
    const isDay = hour >= rise && hour < set;

    const dayProgress = Math.max(0, Math.min(1, (hour - rise) / dayLen));
    const nightSinceSet = hour >= set ? hour - set : hour + 24 - set;
    const nightProgress = Math.max(0, Math.min(1, nightSinceSet / nightLen));

    // 0.00 sunrise → 0.25 noon → 0.50 sunset → 0.75 midnight
    const sunPhase = isDay ? dayProgress * 0.5 : 0.5 + nightProgress * 0.5;
    const moonPhase = (sunPhase + 0.5) % 1;
    const sunHeight = Math.sin(sunPhase * Math.PI * 2);

    return { rise, set, hour, isDay, sunPhase, moonPhase, sunHeight };
}

function celestialPos(
    phase: number,
    radius: number,
    alt: number,
): THREE.Vector3 {
    const a = phase * Math.PI * 2;
    return new THREE.Vector3(
        Math.cos(Math.PI - a) * radius,
        Math.sin(a) * alt + 1.5,
        -20,
    );
}

/* ─── Component ───────────────────────────────────────────── */

export default function TerrainScene() {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const themeRef = useRef(theme);
    const morningWarpRef = useRef(false);
    const morningWarpHourRef = useRef<number | null>(null);

    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const weatherRef = {
            precip01: 0,
            cloud01: 0.4,
            wind01: 0.2,
            storm: false,
        } as LiveWeather;
        const weatherCoords = {
            lat: FALLBACK_WEATHER_COORDS.lat,
            lon: FALLBACK_WEATHER_COORDS.lon,
        };
        let weatherTimer: number | null = null;
        let weatherController: AbortController | null = null;
        let disposed = false;

        const refreshLiveWeather = async (resolveCoords: boolean) => {
            try {
                if (resolveCoords) {
                    const coords = await getBrowserCoords();
                    weatherCoords.lat = coords.lat;
                    weatherCoords.lon = coords.lon;
                }
                if (disposed) return;

                weatherController?.abort();
                weatherController = new AbortController();
                const weather = await fetchLiveWeather(
                    weatherCoords.lat,
                    weatherCoords.lon,
                    weatherController.signal,
                );
                if (disposed) return;
                weatherRef.precip01 = weather.precip01;
                weatherRef.cloud01 = weather.cloud01;
                weatherRef.wind01 = weather.wind01;
                weatherRef.storm = weather.storm;
            } catch {
                // Keep previous values when weather lookup fails.
            }
        };

        void refreshLiveWeather(true);
        weatherTimer = window.setInterval(() => {
            void refreshLiveWeather(false);
        }, WEATHER_REFRESH_MS);

        const readMorningWarpFromStorage = () => {
            const enabled =
                localStorage.getItem(MORNING_WARP_ENABLED_KEY) === '1';
            const parsedHour = Number(
                localStorage.getItem(MORNING_WARP_HOUR_KEY),
            );
            morningWarpRef.current = enabled;
            morningWarpHourRef.current = Number.isFinite(parsedHour)
                ? parsedHour
                : null;
        };

        readMorningWarpFromStorage();

        const rm = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        /* ── Renderer ─────────────────────────────────────── */
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 1);
        container.appendChild(renderer.domElement);

        /* ── Scene + Camera ───────────────────────────────── */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 150);
        camera.position.set(5.0, 9.5, 23);
        camera.lookAt(0, 7.0, -2);

        let cfg = THEMES[theme];

        /* ── Sky sphere ────────────────────────────────────── */
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                uSunHeight: { value: getSolarClock().sunHeight },
                uSunPhase: { value: getSolarClock().sunPhase },
                uTime: { value: 0 },
                uThemeTint: { value: new THREE.Vector3(...cfg.skyTintColor) },
                uThemeTintStr: { value: cfg.skyTintStrength },
            },
            vertexShader: SKY_VERT,
            fragmentShader: SKY_FRAG,
            side: THREE.BackSide,
            depthWrite: false,
        });
        const skySphere = new THREE.Mesh(
            new THREE.SphereGeometry(120, 32, 32),
            skyMat,
        );
        scene.add(skySphere);

        /* ── Lights ───────────────────────────────────────── */
        const ambient = new THREE.AmbientLight(
            cfg.ambientColor,
            cfg.ambientIntensity,
        );
        scene.add(ambient);
        const sunLight = new THREE.DirectionalLight(
            cfg.sunColor,
            cfg.sunIntensity,
        );
        sunLight.castShadow = false;
        scene.add(sunLight);
        const flash = new THREE.PointLight(0xaaccff, 0, 70);
        flash.position.set(0, 22, -5);
        scene.add(flash);

        /* ── Fog ──────────────────────────────────────────── */
        scene.fog = new THREE.Fog(cfg.fogColor, cfg.fogNear, cfg.fogFar);

        /* ── Sun mesh ─────────────────────────────────────── */
        const sunGeo = new THREE.SphereGeometry(0.9, 20, 20);
        const sunMesh = new THREE.Mesh(
            sunGeo,
            new THREE.MeshBasicMaterial({ color: 0xfff8c0 }),
        );
        const sunGlowCv = document.createElement('canvas');
        sunGlowCv.width = sunGlowCv.height = 256;
        {
            const cx = sunGlowCv.getContext('2d')!;
            const g = cx.createRadialGradient(128, 128, 0, 128, 128, 128);
            g.addColorStop(0.0, 'rgba(255,255,200,0.85)');
            g.addColorStop(0.2, 'rgba(255,220,80,0.45)');
            g.addColorStop(0.55, 'rgba(255,160,30,0.12)');
            g.addColorStop(1.0, 'rgba(255,80,0,0)');
            cx.fillStyle = g;
            cx.fillRect(0, 0, 256, 256);
        }
        const sunGlowTex = new THREE.CanvasTexture(sunGlowCv);
        const sunGlowMat = new THREE.SpriteMaterial({
            map: sunGlowTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.58,
        });
        const sunGlowSprite = new THREE.Sprite(sunGlowMat);
        sunGlowSprite.scale.set(8, 8, 1);
        scene.add(sunMesh);
        scene.add(sunGlowSprite);

        /* ── Moon mesh ────────────────────────────────────── */
        const moonGeo = new THREE.SphereGeometry(0.55, 16, 16);
        const moonMesh = new THREE.Mesh(
            moonGeo,
            new THREE.MeshBasicMaterial({ color: 0xd8e8ff }),
        );
        const moonGlowCv = document.createElement('canvas');
        moonGlowCv.width = moonGlowCv.height = 192;
        {
            const cx = moonGlowCv.getContext('2d')!;
            const g = cx.createRadialGradient(96, 96, 0, 96, 96, 96);
            g.addColorStop(0.0, 'rgba(210,225,255,0.80)');
            g.addColorStop(0.3, 'rgba(170,195,255,0.30)');
            g.addColorStop(0.65, 'rgba(120,150,220,0.08)');
            g.addColorStop(1.0, 'rgba(80,100,180,0)');
            cx.fillStyle = g;
            cx.fillRect(0, 0, 192, 192);
        }
        const moonGlowTex = new THREE.CanvasTexture(moonGlowCv);
        const moonGlowSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: moonGlowTex,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            }),
        );
        moonGlowSprite.scale.set(5, 5, 1);
        scene.add(moonMesh);
        scene.add(moonGlowSprite);

        /* ── Terrain mesh ─────────────────────────────────── */
        const terrainGeo = new THREE.PlaneGeometry(44, 44, 80, 80);
        terrainGeo.rotateX(-Math.PI / 2);

        const terrainMat = new THREE.ShaderMaterial({
            uniforms: {
                uNeonPeak: { value: new THREE.Color(cfg.neonPeak) },
                uNeonMid: { value: new THREE.Color(cfg.neonMid) },
                uBaseLow: { value: new THREE.Color(cfg.baseLow) },
                uGridCol: { value: new THREE.Color(cfg.gridColor) },
                uSunPhase: { value: getSolarClock().sunPhase },
                uDayFactor: { value: 0 },
            },
            vertexShader: TERRAIN_VERT,
            fragmentShader: TERRAIN_FRAG,
            side: THREE.DoubleSide,
        });

        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        scene.add(terrainMesh);

        /* ── Grid floor ───────────────────────────────────── */
        const gridGeo = new THREE.PlaneGeometry(46, 22, 28, 14);
        gridGeo.rotateX(-Math.PI / 2);
        const gridMat = new THREE.MeshBasicMaterial({
            color: cfg.gridColor,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        gridMesh.position.set(0, -1.5, -3);
        scene.add(gridMesh);

        /* ── Flag at summit ───────────────────────────────── */
        const peak = findPeak();

        /* ── Scroll camera path: terrain-following trail → summit ── */
        // Mirrors the exact same x/z formula as the glowing path line
        const pathX = (t: number) =>
            peak.x * t + Math.sin(t * Math.PI * 1.2) * 1.2 * (1 - t);
        const pathZ = (t: number) => 12 + (peak.z - 12) * t;

        const camPts: THREE.Vector3[] = [];
        const lookPts: THREE.Vector3[] = [];

        // ── Phase 1: Mountain showcase — slow cinematic arc (5 pts ≈ 20% scroll)
        // Camera drifts from right-elevated to centered, always gazing at peak
        for (const [cx, cy, cz] of [
            [5.0, 9.5, 23],
            [3.5, 9.0, 21],
            [1.5, 8.0, 19],
            [0.5, 7.0, 17],
            [0.0, 6.5, 15],
        ] as [number, number, number][]) {
            camPts.push(new THREE.Vector3(cx, cy, cz));
            lookPts.push(new THREE.Vector3(peak.x, peak.y + 0.5, peak.z));
        }

        // ── Phase 2: Descend + pan to path start (4 pts ≈ 16% scroll)
        // Camera drops to terrain level, lookAt transitions from peak → path ahead
        const ps0x = pathX(0),
            ps0z = pathZ(0);
        const ps0y = terrainHJS(ps0x, ps0z);
        const transFrames: [number, number, number][] = [
            [0, 6.0, 14],
            [0, ps0y + 6.0, 13],
            [0, ps0y + 5.0, 12.5],
            [0, ps0y + 4.5, 12],
        ];
        const transLooks: [number, number, number][] = [
            [peak.x, peak.y * 0.8, peak.z + 1],
            [peak.x * 0.5, peak.y * 0.55, peak.z + 3],
            [
                pathX(0.08),
                terrainHJS(pathX(0.08), pathZ(0.08)) + 2.0,
                pathZ(0.08),
            ],
            [pathX(0.1), terrainHJS(pathX(0.1), pathZ(0.1)) + 1.5, pathZ(0.1)],
        ];
        for (let i = 0; i < transFrames.length; i++) {
            camPts.push(new THREE.Vector3(...transFrames[i]));
            lookPts.push(new THREE.Vector3(...transLooks[i]));
        }

        // ── Phase 3: Terrain climb → side-front flag view (16 pts ≈ 64% scroll)
        // Last 18% blends camera from path to a side-front position beside the flag
        const CLIMB_STEPS = 16;
        for (let i = 1; i <= CLIMB_STEPS; i++) {
            const t = i / CLIMB_STEPS;
            const x = pathX(t);
            const z = pathZ(t);
            const blend = t > 0.82 ? (t - 0.82) / 0.18 : 0;

            // Terrain-following → side-front: camera arrives beside/forward of pole
            const hover = 4.0 * (1 - t) + 2.5 * t;
            const tc = new THREE.Vector3(x, terrainHJS(x, z) + hover, z);
            const sc = new THREE.Vector3(
                peak.x + 1.5,
                peak.y + 0.8,
                peak.z + 2.2,
            );
            camPts.push(blend > 0 ? tc.lerp(sc, blend) : tc);

            // Look-ahead → center of flag cloth
            const lt = Math.min(1, t + 0.12);
            const lx = pathX(lt),
                lz = pathZ(lt);
            const tl = new THREE.Vector3(lx, terrainHJS(lx, lz) + 1.2, lz);
            const sl = new THREE.Vector3(peak.x + 0.28, peak.y + 0.5, peak.z);
            lookPts.push(blend > 0 ? tl.lerp(sl, blend) : tl);
        }

        const camPath = new THREE.CatmullRomCurve3(camPts);
        const lookPath = new THREE.CatmullRomCurve3(lookPts);

        // Snap camera to path start so no jarring fly-in on load
        camera.position.copy(camPts[0]);
        camera.lookAt(lookPts[0].x, lookPts[0].y, lookPts[0].z);

        // Pole — shorter (1.4 → 0.9 height)
        const POLE_H = 0.9;
        const SUMMIT_SINK = 0.06;
        const summitX = peak.x;
        const summitY = peak.y - SUMMIT_SINK;
        const summitZ = peak.z;
        const poleGeo = new THREE.CylinderGeometry(0.025, 0.04, POLE_H, 6);
        const poleMat = new THREE.MeshBasicMaterial({
            color: cfg.flagColor,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
        });
        const poleMesh = new THREE.Mesh(poleGeo, poleMat);
        poleMesh.position.set(summitX, summitY + POLE_H / 2, summitZ);
        scene.add(poleMesh);

        // Summit point light — makes flag + pole glow onto terrain
        const summitLight = new THREE.PointLight(cfg.flagColor, 4, 5);
        summitLight.position.set(summitX, summitY + POLE_H * 0.75, summitZ);
        scene.add(summitLight);

        // Flag cloth — 3:2 rectangle with dense enough segments for smooth motion
        const FLAG_W = 0.72,
            FLAG_H = 0.48;
        const FLAG_SEG_W = 15,
            FLAG_SEG_H = 10;
        const flagGeo = new THREE.PlaneGeometry(
            FLAG_W,
            FLAG_H,
            FLAG_SEG_W,
            FLAG_SEG_H,
        );
        const flagMat = new THREE.MeshPhongMaterial({
            color: cfg.flagColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.96,
            blending: THREE.NormalBlending,
            emissive: cfg.flagColor,
            emissiveIntensity: 0.22,
            shininess: 24,
        });
        let flagYaw = -0.42;
        const flagAttachHalfW = FLAG_W / 2 - 0.02;
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        // Place mesh so the pinned (left) edge stays exactly on the pole after yaw.
        flagMesh.position.set(
            summitX + flagAttachHalfW * Math.cos(flagYaw),
            summitY + POLE_H - FLAG_H / 2,
            summitZ - flagAttachHalfW * Math.sin(flagYaw),
        );
        // Slight yaw keeps cloth face visible from the default camera path.
        flagMesh.rotation.y = flagYaw;
        scene.add(flagMesh);

        const updateFlagFacing = () => {
            const toCamX = camera.position.x - summitX;
            const toCamZ = camera.position.z - summitZ;
            const targetYaw = Math.atan2(toCamX, toCamZ);
            // Always face the user camera so the flag surface stays visible.
            flagYaw = targetYaw;

            flagMesh.rotation.y = flagYaw;
            flagMesh.position.x = summitX + flagAttachHalfW * Math.cos(flagYaw);
            flagMesh.position.z = summitZ - flagAttachHalfW * Math.sin(flagYaw);
        };

        const flagPos = flagGeo.attributes.position as THREE.BufferAttribute;

        // Cloth simulation — Verlet integration + structural/shear/bend constraints
        const CW = FLAG_SEG_W + 1,
            CH = FLAG_SEG_H + 1;
        const clothRestH = FLAG_W / (CW - 1);
        const clothRestV = FLAG_H / (CH - 1);
        const clothRestD = Math.sqrt(clothRestH ** 2 + clothRestV ** 2);

        interface ClothPt {
            pos: THREE.Vector3;
            prev: THREE.Vector3;
            rest: THREE.Vector3;
            pinned: boolean;
        }
        const clothPts: ClothPt[] = [];
        for (let i = 0; i < flagPos.count; i++) {
            const p = new THREE.Vector3(flagPos.getX(i), flagPos.getY(i), 0);
            // Pin left column (ix=0, x=-FLAG_W/2) — the pole edge
            clothPts.push({
                pos: p.clone(),
                prev: p.clone(),
                rest: p.clone(),
                pinned: i % CW === 0,
            });
        }

        interface ClothSpring {
            a: number;
            b: number;
            rest: number;
        }
        const clothSprings: ClothSpring[] = [];
        for (let row = 0; row < CH; row++) {
            for (let col = 0; col < CW; col++) {
                const idx = row * CW + col;
                // Structural
                if (col < CW - 1)
                    clothSprings.push({ a: idx, b: idx + 1, rest: clothRestH });
                if (row < CH - 1)
                    clothSprings.push({
                        a: idx,
                        b: idx + CW,
                        rest: clothRestV,
                    });
                // Shear (diagonals) — resist fabric skewing
                if (col < CW - 1 && row < CH - 1)
                    clothSprings.push({
                        a: idx,
                        b: idx + CW + 1,
                        rest: clothRestD,
                    });
                if (col > 0 && row < CH - 1)
                    clothSprings.push({
                        a: idx,
                        b: idx + CW - 1,
                        rest: clothRestD,
                    });
                // Bend springs — help preserve natural rectangular silhouette
                if (col < CW - 2)
                    clothSprings.push({
                        a: idx,
                        b: idx + 2,
                        rest: clothRestH * 2,
                    });
                if (row < CH - 2)
                    clothSprings.push({
                        a: idx,
                        b: idx + CW * 2,
                        rest: clothRestV * 2,
                    });
            }
        }

        /* ── Glowing path: front-center → summit ─────────── */
        // Starts at scene center (z=12, x=0), climbs mountain face to flag
        const PATH_PTS: THREE.Vector3[] = [];
        for (let i = 0; i <= 80; i++) {
            const t = i / 80;
            // Linear x/z toward peak with gentle trail winding (fades out near summit)
            const x = peak.x * t + Math.sin(t * Math.PI * 1.2) * 1.2 * (1 - t);
            const z = 12 + (peak.z - 12) * t;
            let y = terrainHJS(x, z) + 0.18;
            // Last 15%: blend terrain surface up to exact peak height
            if (t > 0.85) {
                const blend = (t - 0.85) / 0.15;
                y = y + (peak.y - y) * blend;
            }
            PATH_PTS.push(new THREE.Vector3(x, y, z));
        }
        // Terminate exactly at pole base
        PATH_PTS.push(new THREE.Vector3(peak.x, peak.y, peak.z));

        const pathCurve = new THREE.CatmullRomCurve3(PATH_PTS);
        const pathLineGeo = new THREE.BufferGeometry().setFromPoints(
            pathCurve.getPoints(200),
        );
        const pathLineMat = new THREE.LineBasicMaterial({
            color: cfg.pathColor,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const pathLine = new THREE.Line(pathLineGeo, pathLineMat);
        scene.add(pathLine);

        // Outer glow passes — stack two for brighter halo
        const pathGlowMat = new THREE.LineBasicMaterial({
            color: cfg.pathColor,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const pathGlow = new THREE.Line(pathLineGeo, pathGlowMat);
        scene.add(pathGlow);
        const pathGlowMat2 = new THREE.LineBasicMaterial({
            color: cfg.pathColor,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const pathGlow2 = new THREE.Line(pathLineGeo, pathGlowMat2);
        scene.add(pathGlow2);

        /* ── Clouds ───────────────────────────────────────── */
        const cloudTex = makeCloudTexture();
        interface Cloud {
            sprite: THREE.Sprite;
            speed: number;
            wrapX: number;
        }
        const clouds: Cloud[] = [];
        for (const d of [
            { x: -10, y: 5.5, z: -8, sx: 14, sy: 4.5, speed: 0.01 },
            { x: 4, y: 4.0, z: -5, sx: 10, sy: 3.5, speed: 0.007 },
            { x: -4, y: 6.5, z: -12, sx: 18, sy: 5.5, speed: 0.005 },
            { x: 12, y: 3.5, z: -3, sx: 8, sy: 2.8, speed: 0.012 },
            { x: -16, y: 5.0, z: -6, sx: 12, sy: 4.0, speed: 0.009 },
            { x: 8, y: 7.0, z: -15, sx: 20, sy: 6.0, speed: 0.004 },
            { x: -6, y: 3.0, z: -2, sx: 7, sy: 2.5, speed: 0.014 },
        ]) {
            const mat = new THREE.SpriteMaterial({
                map: cloudTex,
                transparent: true,
                depthWrite: false,
                color: new THREE.Color(...cfg.cloudColor),
                opacity: cfg.cloudOpacity,
                blending: THREE.NormalBlending,
            });
            const sprite = new THREE.Sprite(mat);
            sprite.scale.set(d.sx, d.sy, 1);
            sprite.position.set(d.x, d.y, d.z);
            scene.add(sprite);
            clouds.push({ sprite, speed: d.speed, wrapX: 28 });
        }

        /* ── Rain (Power mode) ────────────────────────────── */
        const RAIN_COUNT = 600;
        interface RainDrop {
            x: number;
            y: number;
            z: number;
            speed: number;
        }
        const rainDrops: RainDrop[] = Array.from(
            { length: RAIN_COUNT },
            () => ({
                x: (Math.random() - 0.5) * 44,
                y: Math.random() * 22 - 2,
                z: (Math.random() - 0.5) * 32 - 4,
                speed: 0.18 + Math.random() * 0.14,
            }),
        );
        const rainPos = new Float32Array(RAIN_COUNT * 6);
        for (let i = 0; i < RAIN_COUNT; i++) {
            const d = rainDrops[i];
            rainPos[i * 6] = d.x;
            rainPos[i * 6 + 1] = d.y;
            rainPos[i * 6 + 2] = d.z;
            rainPos[i * 6 + 3] = d.x + 0.12;
            rainPos[i * 6 + 4] = d.y - 0.5;
            rainPos[i * 6 + 5] = d.z;
        }
        const rainGeo = new THREE.BufferGeometry();
        rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
        const rainMat = new THREE.LineBasicMaterial({
            color: 0x7799cc,
            transparent: true,
            opacity: 0.38,
        });
        const rainLines = new THREE.LineSegments(rainGeo, rainMat);
        rainLines.visible = theme === 'power';
        scene.add(rainLines);

        /* ── Autumn leaves (Zen mode) ─────────────────────── */
        const LEAF_PALETTE = [0xe05820, 0xd4821a, 0xc8a020, 0xa03a18, 0xcc6818];
        const leafTextures = LEAF_PALETTE.map(makeLeafTexture);
        interface Leaf {
            sprite: THREE.Sprite;
            vx: number;
            vy: number;
            vr: number;
            phase: number;
        }
        const LEAF_COUNT = 140;
        const leaves: Leaf[] = Array.from({ length: LEAF_COUNT }, (_, i) => {
            const mat = new THREE.SpriteMaterial({
                map: leafTextures[i % leafTextures.length],
                transparent: true,
                depthWrite: false,
                opacity: 0.72 + Math.random() * 0.25,
            });
            const sprite = new THREE.Sprite(mat);
            const s = 0.28 + Math.random() * 0.42;
            sprite.scale.set(s, s * 1.2, 1);
            sprite.position.set(
                (Math.random() - 0.5) * 44,
                Math.random() * 16 - 3,
                (Math.random() - 0.5) * 24 - 4,
            );
            sprite.visible = theme === 'zen';
            scene.add(sprite);
            return {
                sprite,
                vx: (Math.random() - 0.5) * 0.012,
                vy: -(0.008 + Math.random() * 0.01),
                vr: (Math.random() - 0.5) * 0.026,
                phase: Math.random() * Math.PI * 2,
            };
        });

        const zenCameraPos = new THREE.Vector3(0, 6.8, 16.2);
        const zenCameraLookAt = new THREE.Vector3(0, 4.8, -1.4);

        const applyZenOnlyMode = (isZen: boolean) => {
            skySphere.visible = !isZen;
            ambient.visible = !isZen;
            sunLight.visible = !isZen;
            flash.visible = !isZen;
            if (isZen) {
                sunMesh.visible = false;
                sunGlowSprite.visible = false;
                moonMesh.visible = false;
                moonGlowSprite.visible = false;
            }
            terrainMesh.visible = !isZen;
            gridMesh.visible = false;
            poleMesh.visible = !isZen;
            flagMesh.visible = !isZen;
            summitLight.visible = !isZen;
            pathLine.visible = !isZen;
            pathGlow.visible = !isZen;
            pathGlow2.visible = !isZen;
            rainLines.visible = !isZen && rainLines.visible;
            for (const { sprite } of clouds) sprite.visible = !isZen;
            for (const leaf of leaves) leaf.sprite.visible = isZen;

            if (isZen) {
                flash.intensity = 0;
            }
        };

        applyZenOnlyMode(theme === 'zen');

        /* ── Resize ───────────────────────────────────────── */
        const resize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        resize();
        window.addEventListener('resize', resize);

        /* ── Mouse ────────────────────────────────────────── */
        const mouse = { x: 0, y: 0 };
        const onMouse = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouse, { passive: true });

        /* ── Scroll → cloud boost ─────────────────────────── */
        let scrollVel = 0;
        let lastScrollY = window.scrollY;
        const onScroll = () => {
            scrollVel = window.scrollY - lastScrollY;
            lastScrollY = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        /* ── Smooth scroll state ──────────────────────────── */
        let smoothScrollT = 0;

        /* ── State ────────────────────────────────────────── */
        let nextFlash = 4 + Math.random() * 5;
        let flashTimer = 0;
        let flashing = false;
        let skyTimer = 0;
        let prevTheme = themeRef.current;

        const onMorningWarp = (event: Event) => {
            const detail = (
                event as CustomEvent<{
                    enabled?: boolean;
                    hour?: number;
                }>
            ).detail;
            const enabled = detail?.enabled;
            morningWarpRef.current = Boolean(enabled);
            morningWarpHourRef.current =
                typeof detail?.hour === 'number' ? detail.hour : null;
            // Apply immediately — don't wait for skyTimer interval
            updateCelestial();
        };
        window.addEventListener(
            'sky-morning-warp',
            onMorningWarp as EventListener,
        );

        /* ── Celestial ────────────────────────────────────── */
        function updateCelestial() {
            if (themeRef.current === 'zen') {
                sunMesh.visible = false;
                sunGlowSprite.visible = false;
                moonMesh.visible = false;
                moonGlowSprite.visible = false;
                return;
            }

            const warpHour = morningWarpHourRef.current;
            const solar =
                morningWarpRef.current && typeof warpHour === 'number'
                    ? getSolarClock(new Date(), warpHour)
                    : getSolarClock();
            const dayFactor = clamp01((solar.sunHeight + 0.12) / 1.05);
            const glareCut = 1 - dayFactor * 0.35;

            const sp = celestialPos(solar.sunPhase, 18, 12);
            sunMesh.position.copy(sp);
            sunGlowSprite.position.copy(sp);
            sunLight.position.copy(sp);
            sunMesh.visible = solar.isDay;
            sunGlowSprite.visible = solar.isDay;
            sunGlowMat.opacity = 0.48 * glareCut;
            sunGlowSprite.scale.set(
                7.2 - dayFactor * 1.4,
                7.2 - dayFactor * 1.4,
                1,
            );
            sunLight.intensity = cfg.sunIntensity * (0.72 + dayFactor * 0.38);
            const mp = celestialPos(solar.moonPhase, 18, 10);
            moonMesh.position.copy(mp);
            moonGlowSprite.position.copy(mp);
            moonMesh.visible = !solar.isDay;
            moonGlowSprite.visible = !solar.isDay;

            // Readability tuning: reduce haze and lift guide lines under strong daylight.
            (scene.fog as THREE.Fog).near = cfg.fogNear + dayFactor * 6;
            (scene.fog as THREE.Fog).far = cfg.fogFar + dayFactor * 10;
            gridMat.opacity = 0.1 + dayFactor * 0.08;
            pathGlowMat.opacity = 0.55 + dayFactor * 0.08;
            pathGlowMat2.opacity = 0.28 + dayFactor * 0.05;

            skyMat.uniforms.uSunHeight.value = solar.sunHeight;
            skyMat.uniforms.uSunPhase.value = solar.sunPhase;
            terrainMat.uniforms.uSunPhase.value = solar.sunPhase;
            terrainMat.uniforms.uDayFactor.value = dayFactor;
            // Darken background during day so text above stays readable
            if (overlayRef.current) {
                const a = (dayFactor * 0.28).toFixed(3);
                overlayRef.current.style.background = `rgba(0,0,0,${a})`;
            }
        }
        updateCelestial();

        /* ── Animate ──────────────────────────────────────── */
        const clock = new THREE.Timer();
        let rafId: number;

        const animate = () => {
            rafId = requestAnimationFrame(animate);
            if (document.hidden) return;

            // Poll shared storage so sky/terrain stay in sync even if an event was missed.
            readMorningWarpFromStorage();

            const delta = rm ? 0 : clock.getDelta();
            const elapsed = rm ? 2.5 : clock.getElapsed();

            /* Theme hot-swap */
            const cur = themeRef.current;
            if (cur !== prevTheme) {
                prevTheme = cur;
                cfg = THEMES[cur];

                ambient.color.set(cfg.ambientColor);
                ambient.intensity = cfg.ambientIntensity;
                sunLight.color.set(cfg.sunColor);
                sunLight.intensity = cfg.sunIntensity;
                skyMat.uniforms.uThemeTint.value.set(...cfg.skyTintColor);
                skyMat.uniforms.uThemeTintStr.value = cfg.skyTintStrength;
                (scene.fog as THREE.Fog).color.set(cfg.fogColor);
                (scene.fog as THREE.Fog).near = cfg.fogNear;
                (scene.fog as THREE.Fog).far = cfg.fogFar;

                terrainMat.uniforms.uNeonPeak.value.set(cfg.neonPeak);
                terrainMat.uniforms.uNeonMid.value.set(cfg.neonMid);
                terrainMat.uniforms.uBaseLow.value.set(cfg.baseLow);
                terrainMat.uniforms.uGridCol.value.set(cfg.gridColor);
                gridMat.color.set(cfg.gridColor);

                poleMat.color.set(cfg.flagColor);
                flagMat.color.set(cfg.flagColor);
                flagMat.emissive.set(cfg.flagColor);
                summitLight.color.set(cfg.flagColor);

                pathLineMat.color.set(cfg.pathColor);
                pathGlowMat.color.set(cfg.pathColor);
                pathGlowMat2.color.set(cfg.pathColor);

                for (const { sprite } of clouds) {
                    const m = sprite.material as THREE.SpriteMaterial;
                    m.color.setRGB(...cfg.cloudColor);
                    const cloudLift =
                        cur === 'zen' ? 0 : weatherRef.cloud01 * 0.42;
                    m.opacity = Math.min(0.85, cfg.cloudOpacity + cloudLift);
                }
                applyZenOnlyMode(cur === 'zen');
            }

            /* Cloth physics — Verlet integration + spring constraints */
            // gustEnv min 0.7 — wind never stops, only gusts
            const gustEnv = Math.sin(elapsed * 0.55) * 0.3 + 1.0;
            // Constant dominant base + two incommensurate modulations → never settles
            const baseWind =
                0.048 * gustEnv +
                Math.sin(elapsed * 1.8) * 0.016 * gustEnv +
                Math.sin(elapsed * 0.31 + 1.7) * 0.009 * gustEnv;
            // Integrate each particle
            if (cur !== 'zen') {
                for (let i = 0; i < clothPts.length; i++) {
                    const p = clothPts[i];
                    if (p.pinned) continue;
                    const row = Math.floor(i / CW);
                    const col = i % CW;
                    // Per-row turbulence — rows move independently
                    const turb =
                        Math.sin(elapsed * 5.0 + row * 1.5) * 0.013 * gustEnv;
                    const windZ = baseWind + turb;
                    const windX =
                        Math.sin(elapsed * 2.5 + row * 0.8) * 0.004 * gustEnv;
                    // Dual-freq Y: primary wave + high-freq flutter — prevents equilibrium
                    // Two incommensurate frequencies (3.5 & 7.3) never cancel together
                    const windY =
                        (Math.sin(elapsed * 3.5 - row * 1.4 + col * 0.2) *
                            0.03 +
                            Math.sin(elapsed * 7.3 - row * 2.9 + col * 0.4) *
                                0.012) *
                        gustEnv;
                    const vx = (p.pos.x - p.prev.x) * 0.97;
                    const vy = (p.pos.y - p.prev.y) * 0.97;
                    const vz = (p.pos.z - p.prev.z) * 0.97;
                    p.prev.copy(p.pos);
                    p.pos.x += vx + windX;
                    p.pos.y += vy - 0.0015 + windY;
                    p.pos.z += vz + windZ;
                    // Pull gently back toward rest grid to keep a rectangular silhouette.
                    p.pos.lerp(p.rest, 0.055);
                }
                // Slightly tighter constraints for natural cloth continuity.
                for (let iter = 0; iter < 4; iter++) {
                    for (const s of clothSprings) {
                        const a = clothPts[s.a],
                            b = clothPts[s.b];
                        const dx = b.pos.x - a.pos.x;
                        const dy = b.pos.y - a.pos.y;
                        const dz = b.pos.z - a.pos.z;
                        const dist =
                            Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-5;
                        const c = ((dist - s.rest) / dist) * 0.5;
                        if (!a.pinned) {
                            a.pos.x += dx * c;
                            a.pos.y += dy * c;
                            a.pos.z += dz * c;
                        }
                        if (!b.pinned) {
                            b.pos.x -= dx * c;
                            b.pos.y -= dy * c;
                            b.pos.z -= dz * c;
                        }
                    }
                }
                // Upload to GPU
                for (let i = 0; i < clothPts.length; i++) {
                    const { pos } = clothPts[i];
                    flagPos.setXYZ(i, pos.x, pos.y, pos.z);
                }
                flagPos.needsUpdate = true;
            }

            /* Lightning */
            const stormActive =
                !rm &&
                cur !== 'zen' &&
                weatherRef.storm &&
                weatherRef.precip01 > 0.2;
            if (stormActive) {
                flashTimer += delta;
                if (!flashing && flashTimer >= nextFlash) {
                    flashing = true;
                    flashTimer = 0;
                    flash.intensity = 8 + Math.random() * 14;
                    const fade = () => {
                        flash.intensity *= 0.8;
                        if (flash.intensity > 0.1) setTimeout(fade, 16);
                        else {
                            flash.intensity = 0;
                            flashing = false;
                            nextFlash = 3 + Math.random() * 6;
                        }
                    };
                    setTimeout(fade, 16);
                }
            } else if (flash.intensity > 0) {
                flash.intensity = 0;
            }

            /* Clouds + scroll boost */
            if (!rm && cur !== 'zen') {
                const boost = Math.max(0, scrollVel * 0.025);
                scrollVel *= 0.88;
                for (const { sprite, speed, wrapX } of clouds) {
                    sprite.position.x += speed * (1 + boost);
                    const m = sprite.material as THREE.SpriteMaterial;
                    const cloudLift =
                        cur === 'zen' ? 0 : weatherRef.cloud01 * 0.42;
                    m.opacity = Math.min(0.85, cfg.cloudOpacity + cloudLift);
                    if (sprite.position.x > wrapX) sprite.position.x = -wrapX;
                }
            }

            /* Rain */
            const rainThreshold = cur === 'power' ? 0.06 : 0.16;
            const rainActive =
                !rm && cur !== 'zen' && weatherRef.precip01 > rainThreshold;
            rainLines.visible = rainActive;
            if (rainActive) {
                const rainBoost =
                    weatherRef.precip01 * 0.8 + weatherRef.wind01 * 0.35;
                rainMat.opacity =
                    cur === 'power'
                        ? 0.25 + weatherRef.precip01 * 0.45
                        : 0.15 + weatherRef.precip01 * 0.32;
                for (let i = 0; i < RAIN_COUNT; i++) {
                    const d = rainDrops[i];
                    d.y -= d.speed * (1 + rainBoost);
                    d.x += 0.009 + weatherRef.wind01 * 0.03;
                    if (d.y < -8) {
                        d.y = 16 + Math.random() * 6;
                        d.x = (Math.random() - 0.5) * 44;
                    }
                    rainPos[i * 6] = d.x;
                    rainPos[i * 6 + 1] = d.y;
                    rainPos[i * 6 + 2] = d.z;
                    rainPos[i * 6 + 3] = d.x + 0.12;
                    rainPos[i * 6 + 4] = d.y - 0.5;
                    rainPos[i * 6 + 5] = d.z;
                }
                (
                    rainGeo.attributes.position as THREE.BufferAttribute
                ).needsUpdate = true;
            }

            /* Leaves */
            if (cur === 'zen' && !rm) {
                const repelX = mouse.x * 12;
                const repelY = 4.5 - mouse.y * 5.5;
                const repelRadius = 4.2;
                const repelRadius2 = repelRadius * repelRadius;
                for (const leaf of leaves) {
                    const dx = leaf.sprite.position.x - repelX;
                    const dy = leaf.sprite.position.y - repelY;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < repelRadius2) {
                        const dist = Math.sqrt(Math.max(0.0001, d2));
                        const force =
                            ((repelRadius - dist) / repelRadius) * 0.16;
                        leaf.sprite.position.x += (dx / dist) * force;
                        leaf.sprite.position.y += (dy / dist) * force * 0.55;
                    }

                    leaf.sprite.position.x +=
                        leaf.vx + Math.sin(elapsed * 0.45 + leaf.phase) * 0.009;
                    leaf.sprite.position.y += leaf.vy;
                    (leaf.sprite.material as THREE.SpriteMaterial).rotation +=
                        leaf.vr;
                    if (leaf.sprite.position.y < -5) {
                        leaf.sprite.position.y = 14 + Math.random() * 5;
                        leaf.sprite.position.x = (Math.random() - 0.5) * 44;
                    }
                    if (leaf.sprite.position.x > 22)
                        leaf.sprite.position.x = -22;
                    if (leaf.sprite.position.x < -22)
                        leaf.sprite.position.x = 22;
                }
            }

            /* Star twinkle time */
            skyMat.uniforms.uTime.value = elapsed;

            /* Celestial (every 1s) */
            skyTimer += delta;
            if (skyTimer >= 1.0) {
                skyTimer = 0;
                updateCelestial();
            }

            /* Camera */
            if (cur === 'zen') {
                camera.position.x +=
                    (zenCameraPos.x - camera.position.x) * 0.04;
                camera.position.y +=
                    (zenCameraPos.y - camera.position.y) * 0.04;
                camera.position.z +=
                    (zenCameraPos.z - camera.position.z) * 0.04;
                camera.lookAt(
                    zenCameraLookAt.x,
                    zenCameraLookAt.y,
                    zenCameraLookAt.z,
                );
            } else {
                const maxScroll = Math.max(
                    1,
                    document.documentElement.scrollHeight - window.innerHeight,
                );
                const rawScrollT = Math.min(1, window.scrollY / maxScroll);
                // Very slow ease — glides, not flies
                smoothScrollT += (rawScrollT - smoothScrollT) * 0.018;
                const camBase = camPath.getPoint(smoothScrollT);
                const lookAt = lookPath.getPoint(smoothScrollT);
                // Reduced mouse parallax
                const tgtX = camBase.x + mouse.x * 0.7;
                const tgtY = camBase.y - mouse.y * 0.3;
                camera.position.x += (tgtX - camera.position.x) * 0.03;
                camera.position.y += (tgtY - camera.position.y) * 0.03;
                camera.position.z += (camBase.z - camera.position.z) * 0.03;
                camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
            }

            if (cur !== 'zen') {
                // Keep cloth surface readable for users while staying attached to pole.
                updateFlagFacing();
            }

            renderer.render(scene, camera);
        };

        animate();

        /* ── Cleanup ──────────────────────────────────────── */
        return () => {
            disposed = true;
            if (weatherTimer !== null) {
                window.clearInterval(weatherTimer);
            }
            weatherController?.abort();
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener(
                'sky-morning-warp',
                onMorningWarp as EventListener,
            );
            skyMat.dispose();
            (sunMesh.material as THREE.Material).dispose();
            sunGeo.dispose();
            sunGlowTex.dispose();
            (sunGlowSprite.material as THREE.SpriteMaterial).dispose();
            (moonMesh.material as THREE.Material).dispose();
            moonGeo.dispose();
            moonGlowTex.dispose();
            (moonGlowSprite.material as THREE.SpriteMaterial).dispose();
            terrainGeo.dispose();
            terrainMat.dispose();
            gridGeo.dispose();
            gridMat.dispose();
            poleGeo.dispose();
            poleMat.dispose();
            flagGeo.dispose();
            flagMat.dispose();
            scene.remove(summitLight);
            pathLineGeo.dispose();
            pathLineMat.dispose();
            pathGlowMat.dispose();
            pathGlowMat2.dispose();
            cloudTex.dispose();
            for (const { sprite } of clouds)
                (sprite.material as THREE.SpriteMaterial).dispose();
            rainGeo.dispose();
            rainMat.dispose();
            for (const t of leafTextures) t.dispose();
            for (const leaf of leaves)
                (leaf.sprite.material as THREE.SpriteMaterial).dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement))
                container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            {/* Day-time readability overlay — darkens background so text above stays legible */}
            <div
                ref={overlayRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0)',
                    pointerEvents: 'none',
                    transition: 'background 3s ease',
                }}
            />
        </div>
    );
}
