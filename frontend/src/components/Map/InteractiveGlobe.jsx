import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export const InteractiveGlobe = ({ className }) => {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;
    let globe = null;

    if (!canvasRef.current) return;

    try {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: 0.4, // Slight tilt for better view of Nigeria
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.047, 0.078, 0.121], // #0c141f
        markerColor: [0.2, 0.8, 0.5], // Emerald marker
        glowColor: [0.02, 0.588, 0.412],
        markers: [
          // Nigeria Coordinates (Lat,Lon)
          { location: [9.0820, 7.4913], size: 0.1 }, // Abuja (Capital)
          { location: [6.5244, 3.3792], size: 0.08 }, // Lagos
          { location: [12.0022, 8.5920], size: 0.06 }, // Kano
          { location: [4.8156, 7.0498], size: 0.06 }, // Port Harcourt
        ],
        onRender: (state) => {
          state.phi = phi;
          phi += 0.005;
        },
      });
    } catch (e) {
      console.warn("Interactive Globe failed to initialize (WebGL issue):", e);
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
    };
  }, []);

  return (
    <div className={`relative w-full aspect-square max-w-[600px] mx-auto ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", contain: "layout paint size" }}
      />
      {/* Glow Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-nigeria-green/10 to-transparent pointer-events-none opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-reg-dark to-transparent pointer-events-none" />
    </div>
  );
};
