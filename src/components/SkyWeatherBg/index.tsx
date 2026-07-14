'use client';

/**
 * SkyWeatherBg — ambient sky background for the Philosophy section.
 *
 * Shows a live sky gradient keyed to the current hour, a dashed sun-arc,
 * and sunrise / sunset times computed for ~13 °N latitude (Bangalore).
 * No external API needed — purely time-based.
 */

import { useEffect, useMemo, useState } from 'react';

/* ─── Solar maths (simplified, ±5 min accuracy for 13 °N) ── */

interface RegionConfig {
    label: string;
    lat: number;
    timeZone: string;
}

const DEFAULT_REGION_CODE = 'IN-BLR';
const MORNING_WARP_OFFSET_HOURS = 2.5;
const MORNING_WARP_ENABLED_KEY = 'portfolio-sky-morning-warp-enabled';
const MORNING_WARP_HOUR_KEY = 'portfolio-sky-morning-warp-hour';

const REGION_PRESETS: Record<string, Omit<RegionConfig, 'code'>> = {
    'IN-BLR': { label: 'IN-BLR', lat: 12.97, timeZone: 'Asia/Kolkata' },
    'ES-MAD': { label: 'ES-MAD', lat: 40.42, timeZone: 'Europe/Madrid' },
    'US-NYC': { label: 'US-NYC', lat: 40.71, timeZone: 'America/New_York' },
    'JP-TYO': { label: 'JP-TYO', lat: 35.68, timeZone: 'Asia/Tokyo' },
};

function resolveRegion(regionCode: string): RegionConfig {
    const normalized = regionCode.toUpperCase();
    const preset =
        REGION_PRESETS[normalized] ?? REGION_PRESETS[DEFAULT_REGION_CODE];
    return {
        label: preset.label,
        lat: preset.lat,
        timeZone: preset.timeZone,
    };
}

function getZonedNow(timeZone: string): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
} {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(new Date());

    const getPart = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find((part) => part.type === type)?.value ?? '0');

    return {
        year: getPart('year'),
        month: getPart('month'),
        day: getPart('day'),
        hour: getPart('hour'),
        minute: getPart('minute'),
        second: getPart('second'),
    };
}

function calcSunTimes(region: RegionConfig): {
    rise: number;
    set: number;
    now: number;
} {
    const zoned = getZonedNow(region.timeZone);
    const now = zoned.hour + zoned.minute / 60 + zoned.second / 3600;

    const doy = Math.floor(
        (Date.UTC(zoned.year, zoned.month - 1, zoned.day) -
            Date.UTC(zoned.year, 0, 0)) /
            86_400_000,
    );
    const decl = 23.45 * Math.sin(((284 + doy) / 365) * 2 * Math.PI);
    const latRad = region.lat * (Math.PI / 180);
    const declRad = decl * (Math.PI / 180);
    const cosHA = -Math.tan(latRad) * Math.tan(declRad);
    const ha = (Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180) / Math.PI;
    return { rise: 12 - ha / 15, set: 12 + ha / 15, now };
}

function fmt(h: number): string {
    const totalMinutes = ((Math.floor(h * 60) % 1440) + 1440) % 1440;
    const hh = Math.floor(totalMinutes / 60);
    const mm = totalMinutes % 60;
    const ap = hh < 12 ? 'AM' : 'PM';
    const dh = hh % 12 === 0 ? 12 : hh % 12;
    return `${dh}:${String(mm).padStart(2, '0')} ${ap}`;
}

/* ─── Sky gradient driven by hour ──────────────────────────── */

function skyColors(now: number): [string, string] {
    // [top, bottom]
    if (now >= 5.5 && now < 7) return ['#1a1060', '#f97316']; // dawn
    if (now >= 7 && now < 17) return ['#0c2350', '#1e4a80']; // day
    if (now >= 17 && now < 19) return ['#1a0840', '#c2410c']; // dusk
    if (now >= 19 && now < 21) return ['#0a0520', '#4c1d95']; // twilight
    return ['#020408', '#080d1a']; // night
}

/* ─── Component ─────────────────────────────────────────────── */

export default function SkyWeatherBg({
    regionCode = DEFAULT_REGION_CODE,
    widgetPlacement = 'bottom',
}: {
    regionCode?: string;
    widgetPlacement?: 'bottom' | 'title-right';
}) {
    const region = useMemo(() => resolveRegion(regionCode), [regionCode]);
    const [, setTick] = useState(0);
    const [morningWarp, setMorningWarp] = useState(false);
    const isTitleWidget = widgetPlacement === 'title-right';

    useEffect(() => {
        const id = setInterval(() => setTick((value) => value + 1), 30_000);
        return () => clearInterval(id);
    }, []);

    const { rise, set, now } = calcSunTimes(region);
    const realIsDay = now >= rise && now <= set;
    const warpHour = (rise + MORNING_WARP_OFFSET_HOURS) % 24;
    const displayNow = morningWarp && !realIsDay ? warpHour : now;
    const [top, bot] = skyColors(displayNow);
    const titleWidgetRight =
        'calc((100% - min(var(--container-max), 100%)) / 2 + 1.5rem)';
    const titleWidgetTop = '5.5rem';

    // Sun arc progress: 0 = sunrise, 1 = sunset
    const prog = Math.max(0, Math.min(1, (displayNow - rise) / (set - rise)));
    const isDay = displayNow >= rise && displayNow <= set;
    const dayLength = set - rise;
    const nightLength = 24 - dayLength;
    const nightSinceSet =
        displayNow >= set ? displayNow - set : displayNow + 24 - set;
    const moonProg = Math.max(0, Math.min(1, nightSinceSet / nightLength));

    // Arc geometry (SVG viewport: 500 × 140)
    const AW = 500,
        AH = 110;
    const cx = AW / 2,
        cy = AH + 10;
    const rx = AW / 2 - 24,
        ry = AH - 10;

    // Angle: 0 at left (sunrise), π at right (sunset) — arc goes UP
    const angle = prog * Math.PI;
    const sx = cx - Math.cos(angle) * rx;
    const sy = cy - Math.sin(angle) * ry;
    const moonAngle = moonProg * Math.PI;
    const mx = cx - Math.cos(moonAngle) * rx;
    const my = cy - Math.sin(moonAngle) * ry;
    const markerX = isDay ? sx : mx;
    const markerY = isDay ? sy : my;
    const leftLabel = isDay ? fmt(rise) : fmt(set);
    const rightLabel = isDay ? fmt(set) : fmt(rise);

    useEffect(() => {
        const enabled = morningWarp && !realIsDay;

        localStorage.setItem(MORNING_WARP_ENABLED_KEY, enabled ? '1' : '0');
        localStorage.setItem(MORNING_WARP_HOUR_KEY, String(warpHour));

        window.dispatchEvent(
            new CustomEvent('sky-morning-warp', {
                detail: { enabled, hour: warpHour },
            }),
        );

        return () => {
            localStorage.setItem(MORNING_WARP_ENABLED_KEY, '0');
            localStorage.setItem(MORNING_WARP_HOUR_KEY, String(warpHour));
            window.dispatchEvent(
                new CustomEvent('sky-morning-warp', {
                    detail: { enabled: false, hour: warpHour },
                }),
            );
        };
    }, [morningWarp, realIsDay, warpHour]);

    return (
        <div
            aria-label="Sky weather background"
            style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to bottom, ${top} 0%, ${bot} 100%)`,
                overflow: 'hidden',
            }}
        >
            {/* Subtle star-like dots for night only */}
            {!isDay && (
                <svg
                    width="100%"
                    height="100%"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.5,
                        pointerEvents: 'none',
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {[
                        [8, 12],
                        [18, 5],
                        [30, 18],
                        [45, 8],
                        [62, 14],
                        [74, 4],
                        [85, 19],
                        [92, 9],
                        [15, 30],
                        [38, 25],
                        [55, 33],
                        [70, 28],
                        [88, 35],
                        [25, 42],
                        [50, 48],
                        [78, 44],
                    ].map(([x, y], i) => (
                        <circle
                            key={i}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="1"
                            fill="white"
                            opacity="0.6"
                        />
                    ))}
                </svg>
            )}

            {/* Sun arc */}
            <div
                style={{
                    position: 'absolute',
                    bottom: isTitleWidget ? 'auto' : 0,
                    top: isTitleWidget ? titleWidgetTop : 'auto',
                    right: isTitleWidget ? titleWidgetRight : 'auto',
                    left: isTitleWidget ? 'auto' : '50%',
                    transform: isTitleWidget ? 'none' : 'translateX(-50%)',
                    width: isTitleWidget
                        ? 'min(500px, calc(100vw - 3rem))'
                        : AW,
                    pointerEvents: realIsDay ? 'none' : 'auto',
                    opacity: isTitleWidget ? 0.72 : 1,
                    zIndex: 4,
                }}
            >
                <svg
                    width={AW}
                    height={AH + 30}
                    viewBox={`0 0 ${AW} ${AH + 30}`}
                >
                    {/* Dashed arc path */}
                    <ellipse
                        cx={cx}
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        fill="none"
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth="1"
                        strokeDasharray="5 7"
                        strokeLinecap="round"
                        // Only upper half: clip via clipPath
                        clipPath="url(#arcClip)"
                    />
                    <defs>
                        <clipPath id="arcClip">
                            <rect x={0} y={0} width={AW} height={cy} />
                        </clipPath>
                    </defs>

                    {/* Horizon line */}
                    <line
                        x1={cx - rx - 8}
                        y1={cy}
                        x2={cx + rx + 8}
                        y2={cy}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                    />

                    {/* Sunrise label */}
                    <text
                        x={cx - rx - 4}
                        y={cy + 18}
                        fill="rgba(255,255,255,0.45)"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                    >
                        {leftLabel}
                    </text>
                    {/* Sunset label */}
                    <text
                        x={cx + rx + 4}
                        y={cy + 18}
                        fill="rgba(255,255,255,0.45)"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                    >
                        {rightLabel}
                    </text>

                    {/* Sun / Moon marker */}
                    {isDay ? (
                        <>
                            {/* Glow */}
                            <circle
                                cx={sx}
                                cy={sy}
                                r="14"
                                fill="rgba(251,191,36,0.18)"
                            />
                            <circle
                                cx={sx}
                                cy={sy}
                                r="7"
                                fill="#fbbf24"
                                opacity="0.92"
                            />
                        </>
                    ) : (
                        <circle
                            cx={mx}
                            cy={my}
                            r="5"
                            fill="#c8d8ff"
                            opacity="0.6"
                        />
                    )}

                    {/* Position marker (outline circle) */}
                    <circle
                        cx={markerX}
                        cy={markerY}
                        r={isDay ? 10 : 9}
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth="1"
                    />

                    {/* Night easter egg: click marker to toggle morning view */}
                    {!realIsDay && (
                        <circle
                            cx={markerX}
                            cy={markerY}
                            r="24"
                            fill="rgba(255,255,255,0.001)"
                            pointerEvents="all"
                            style={{ cursor: 'pointer' }}
                            onPointerDown={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setMorningWarp((v) => !v);
                            }}
                        />
                    )}
                </svg>
            </div>

            {/* Time label bottom-right */}
            <p
                style={{
                    position: 'absolute',
                    bottom: isTitleWidget ? 'auto' : '1rem',
                    top: isTitleWidget
                        ? `calc(${titleWidgetTop} + ${AH + 28}px)`
                        : 'auto',
                    right: isTitleWidget ? titleWidgetRight : '1.5rem',
                    color: 'rgba(255,255,255,0.30)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: isTitleWidget ? '0.67rem' : '0.6875rem',
                    letterSpacing: '0.08em',
                    margin: 0,
                }}
            >
                {fmt(displayNow)} {region.label}
            </p>
        </div>
    );
}
