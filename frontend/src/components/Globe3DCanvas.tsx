'use client';

import React, { useEffect, useRef } from 'react';

interface Globe3DCanvasProps {
  size?: number;
  className?: string;
}

// Major international airport coordinates (lat, lon) in degrees
const WORLD_CITIES = [
  { name: 'Bangkok', lat: 13.75, lon: 100.5, hub: true },
  { name: 'Tokyo', lat: 35.67, lon: 139.65, hub: true },
  { name: 'Singapore', lat: 1.35, lon: 103.8, hub: true },
  { name: 'Seoul', lat: 37.56, lon: 126.97, hub: true },
  { name: 'Beijing', lat: 39.9, lon: 116.4, hub: true },
  { name: 'London', lat: 51.5, lon: -0.12, hub: true },
  { name: 'Paris', lat: 48.85, lon: 2.35, hub: true },
  { name: 'Frankfurt', lat: 50.11, lon: 8.68, hub: false },
  { name: 'Dubai', lat: 25.2, lon: 55.27, hub: true },
  { name: 'Doha', lat: 25.28, lon: 51.53, hub: false },
  { name: 'New York', lat: 40.71, lon: -74.0, hub: true },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24, hub: true },
  { name: 'Sydney', lat: -33.86, lon: 151.2, hub: true },
  { name: 'Hong Kong', lat: 22.31, lon: 114.16, hub: true },
  { name: 'Taipei', lat: 25.03, lon: 121.56, hub: false },
  { name: 'Rome', lat: 41.9, lon: 12.49, hub: false },
  { name: 'Toronto', lat: 43.65, lon: -79.38, hub: false },
  { name: 'Vancouver', lat: 49.28, lon: -123.12, hub: false },
  { name: 'São Paulo', lat: -23.55, lon: -46.63, hub: false },
  { name: 'Cairo', lat: 30.04, lon: 31.23, hub: false },
  { name: 'Mumbai', lat: 19.07, lon: 72.87, hub: false },
  { name: 'Johannesburg', lat: -26.2, lon: 28.04, hub: false },
  { name: 'Auckland', lat: -36.84, lon: 174.76, hub: false }
];

// Flight route connections between city indices
const FLIGHT_ROUTES = [
  [0, 1], // BKK -> TYO
  [0, 2], // BKK -> SIN
  [0, 8], // BKK -> DXB
  [1, 10], // TYO -> NYC
  [1, 11], // TYO -> LAX
  [2, 12], // SIN -> SYD
  [5, 10], // LON -> NYC
  [5, 6],  // LON -> CDG
  [6, 8],  // CDG -> DXB
  [8, 10], // DXB -> NYC
  [3, 1],  // ICN -> TYO
  [4, 0]   // PEK -> BKK
];

export function Globe3DCanvas({ size = 340, className = '' }: Globe3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotation = 0;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.44;
    const cx = size / 2;
    const cy = size / 2;
    const axialTilt = (23.5 * Math.PI) / 180; // 23.5 deg Earth tilt

    // 3D coordinate transformation function
    const project = (latDeg: number, lonDeg: number, rot: number) => {
      const phi = (latDeg * Math.PI) / 180;
      const lambda = (lonDeg * Math.PI) / 180 + rot;

      // 3D sphere surface
      const x0 = Math.cos(phi) * Math.sin(lambda);
      const y0 = Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(lambda);

      // Tilt around X-axis
      const x = x0;
      const y = y0 * Math.cos(axialTilt) - z0 * Math.sin(axialTilt);
      const z = y0 * Math.sin(axialTilt) + z0 * Math.cos(axialTilt);

      return {
        x: cx + radius * x,
        y: cy - radius * y,
        z,
        visible: z > 0
      };
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Constant smooth rotation: 1 revolution every 32 seconds
      rotation += dt * (Math.PI * 2 / 32);

      ctx.clearRect(0, 0, size, size);

      // 1. Soft Atmospheric Glow behind the globe
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.25);
      glow.addColorStop(0, 'rgba(186, 223, 219, 0.45)');
      glow.addColorStop(0.6, 'rgba(255, 189, 189, 0.25)');
      glow.addColorStop(1, 'rgba(252, 249, 234, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Translucent Globe Base Sphere
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      sphereGrad.addColorStop(0.5, 'rgba(240, 250, 248, 0.7)');
      sphereGrad.addColorStop(0.85, 'rgba(186, 223, 219, 0.5)');
      sphereGrad.addColorStop(1, 'rgba(255, 164, 164, 0.4)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(186, 223, 219, 0.85)';
      ctx.stroke();
      ctx.clip(); // Clip everything inside the 3D sphere

      // 3. Render Latitude Parallels
      const latitudes = [-60, -40, -20, 0, 20, 40, 60];
      latitudes.forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lat, lon, rotation);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = lat === 0 ? 'rgba(29, 107, 99, 0.4)' : 'rgba(186, 223, 219, 0.45)';
        ctx.lineWidth = lat === 0 ? 1.5 : 0.8;
        ctx.stroke();
      });

      // 4. Render Longitude Meridians (rotating around polar axis)
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const pt = project(lat, lon, rotation);
          if (pt.visible) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = 'rgba(186, 223, 219, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 5. Draw Flight Arcs between cities
      FLIGHT_ROUTES.forEach(([i, j]) => {
        const c1 = WORLD_CITIES[i];
        const c2 = WORLD_CITIES[j];
        const p1 = project(c1.lat, c1.lon, rotation);
        const p2 = project(c2.lat, c2.lon, rotation);

        if (p1.visible && p2.visible) {
          // Midpoint elevated off surface to form 3D great-circle arc
          const midLat = (c1.lat + c2.lat) / 2;
          const midLon = (c1.lon + c2.lon) / 2;
          const pMid = project(midLat, midLon, rotation);

          // Control point pulled outwards
          const cpX = pMid.x + (pMid.x - cx) * 0.2;
          const cpY = pMid.y + (pMid.y - cy) * 0.2;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
          ctx.strokeStyle = 'rgba(255, 164, 164, 0.45)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 6. Draw City Beacon Nodes
      WORLD_CITIES.forEach((city) => {
        const pt = project(city.lat, city.lon, rotation);
        if (pt.visible) {
          const depthAlpha = Math.max(0.2, pt.z); // brighter when facing viewer

          // Pulsing halo for major hubs
          if (city.hub) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5 * depthAlpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 164, 164, ${0.4 * depthAlpha})`;
            ctx.fill();
          }

          // Core node
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (city.hub ? 2.2 : 1.5) * depthAlpha, 0, Math.PI * 2);
          ctx.fillStyle = city.hub ? `rgba(29, 107, 99, ${0.9 * depthAlpha})` : `rgba(255, 164, 164, ${0.85 * depthAlpha})`;
          ctx.fill();
        }
      });

      // 7. Sphere Shading & Specular Rim Light
      ctx.restore(); // unclip

      // Outer Glow Ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(186, 223, 219, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
