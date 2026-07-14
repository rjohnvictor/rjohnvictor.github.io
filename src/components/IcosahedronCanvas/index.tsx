"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function IcosahedronCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 5;

    // Outer icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(2, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x58a6ff,
      transparent: true,
      opacity: 0.35,
    });
    const outer = new THREE.LineSegments(outerEdges, outerMat);
    scene.add(outer);

    // Inner icosahedron (counter-rotates)
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: 0x1f6feb,
      transparent: true,
      opacity: 0.25,
    });
    const inner = new THREE.LineSegments(innerEdges, innerMat);
    scene.add(inner);

    // Intersection observer — pause when off screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(mount);

    let rafId: number;
    let t = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!visible) return;
      t += 0.01;
      outer.rotation.x = t * 0.3;
      outer.rotation.y = t * 0.5;
      outer.rotation.z = Math.sin(t * 0.2) * 0.15;
      inner.rotation.x = -t * 0.4;
      inner.rotation.y = -t * 0.3;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      outerGeo.dispose(); outerEdges.dispose(); outerMat.dispose();
      innerGeo.dispose(); innerEdges.dispose(); innerMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "280px",
        height: "280px",
        position: "absolute",
        right: "0",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  );
}
