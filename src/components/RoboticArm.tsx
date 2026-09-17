import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';

export const RoboticArm: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const containerRef = useRef<HTMLDivElement>(null);

  // Calibrated resting posture (immediately visible on initial load)
  const [angles, setAngles] = useState({
    base: 8, // Resting base rotation (deg)
    shoulder: 32, // Lower link angle (deg)
    elbow: -48, // Upper link angle (deg)
    gripper: 16, // Gripper aperture (px)
    proximity: 0, // 0 (far) to 1 (close)
  });

  const targetAnglesRef = useRef({
    base: 8,
    shoulder: 32,
    elbow: -48,
    gripper: 16,
    proximity: 0,
  });

  const currentAnglesRef = useRef({
    base: 8,
    shoulder: 32,
    elbow: -48,
    gripper: 16,
    proximity: 0,
  });

  // Track cursor proximity relative to bottom-left arm location
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const armCenterX = rect.left + rect.width / 2;
      const armCenterY = rect.top + rect.height * 0.72; // Arm base pivot

      const dx = e.clientX - armCenterX;
      const dy = e.clientY - armCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxDist = 420; // Proximity detection radius in pixels

      if (dist < maxDist) {
        // Closer = stronger reaction, non-linear curve for natural mechanical awareness
        const p = Math.pow(1 - dist / maxDist, 1.4);
        
        // Relative cursor angle
        const cursorAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

        // Subtle, restrained base swivel toward cursor (clamped to realistic workspace limits)
        const targetBase = Math.max(-16, Math.min(34, (cursorAngle + 65) * 0.22 * p));
        
        // Shoulder reacts subtly
        const targetShoulder = 32 - 12 * p;
        
        // Elbow articulates forward/down
        const targetElbow = -48 + 16 * p;

        // Gripper narrows slightly as if sensing an object
        const targetGripper = 16 - 8 * p;

        targetAnglesRef.current = {
          base: targetBase,
          shoulder: targetShoulder,
          elbow: targetElbow,
          gripper: targetGripper,
          proximity: p,
        };
      } else {
        // Return smoothly to resting home state
        targetAnglesRef.current = {
          base: 8,
          shoulder: 32,
          elbow: -48,
          gripper: 16,
          proximity: 0,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Idle micro-twitch effect (mimics physical servos holding closed-loop PWM position against gravity)
  useEffect(() => {
    const twitchInterval = setInterval(() => {
      if (targetAnglesRef.current.proximity < 0.1) {
        const jitter = (Math.random() - 0.5) * 1.8;
        targetAnglesRef.current.base = 8 + jitter;
      }
    }, 4600);

    return () => clearInterval(twitchInterval);
  }, []);

  // 60FPS Servo physics lerp loop with realistic mechanical damping
  useEffect(() => {
    let animId: number;

    const updateServos = () => {
      animId = requestAnimationFrame(updateServos);

      const cur = currentAnglesRef.current;
      const tgt = targetAnglesRef.current;

      // Heavy mechanical servo damping (smooth acceleration & deceleration)
      const lerpFactor = 0.055;
      cur.base += (tgt.base - cur.base) * lerpFactor;
      cur.shoulder += (tgt.shoulder - cur.shoulder) * lerpFactor;
      cur.elbow += (tgt.elbow - cur.elbow) * lerpFactor;
      cur.gripper += (tgt.gripper - cur.gripper) * lerpFactor;
      cur.proximity += (tgt.proximity - cur.proximity) * lerpFactor;

      setAngles({
        base: cur.base,
        shoulder: cur.shoulder,
        elbow: cur.elbow,
        gripper: cur.gripper,
        proximity: cur.proximity,
      });
    };

    animId = requestAnimationFrame(updateServos);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-8 sm:bottom-12 md:bottom-14 left-10 sm:left-14 md:left-20 lg:left-28 w-64 h-72 pointer-events-auto select-none z-30"
      style={{
        transform: 'rotate(-1.5deg)',
      }}
    >
      {/* 1. Base Mounting Plate (Physically Grounded Flat on Cutting Mat) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-24 bg-gradient-to-b from-[#1c1f26] via-[#16181d] to-[#121417] border border-zinc-700/80 rounded-xs shadow-2xl p-2 font-mono">
        {/* Corner M3 Hex Mounting Screws with Washers */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-zinc-400 border border-zinc-600 flex items-center justify-center shadow-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className="w-1 h-[1px] bg-zinc-400 rotate-45" />
          </div>
        </div>
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-zinc-400 border border-zinc-600 flex items-center justify-center shadow-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className="w-1 h-[1px] bg-zinc-400 -rotate-30" />
          </div>
        </div>
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-zinc-400 border border-zinc-600 flex items-center justify-center shadow-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className="w-1 h-[1px] bg-zinc-400 rotate-60" />
          </div>
        </div>
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-zinc-400 border border-zinc-600 flex items-center justify-center shadow-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className="w-1 h-[1px] bg-zinc-400 rotate-15" />
          </div>
        </div>

        {/* Laser-Etched Specification Stencil */}
        <div className="text-[7.5px] text-zinc-300 font-semibold tracking-wider flex justify-between border-b border-zinc-800 pb-1">
          <span className="text-zinc-200 font-bold">DETOX ROBOTICS LAB</span>
          <span className="text-[#f9a825] font-mono text-[7px]">DTX-ARM-04</span>
        </div>

        <div className="text-[6.5px] text-zinc-400 mt-1 space-y-0.5">
          <div className="flex justify-between">
            <span>AXES: 4-DOF DESKTOP</span>
            <span className="text-zinc-500">PWM 50Hz // 5.0V</span>
          </div>
          <div className="flex justify-between items-center">
            <span>AZIMUTH ANGLE:</span>
            <span className="text-zinc-200 font-mono font-bold bg-zinc-900/80 px-1 rounded-xs border border-zinc-800">
              {Math.round(angles.base + 90)}°
            </span>
          </div>
        </div>

        {/* Status Optical Micro-LEDs */}
        <div className="absolute bottom-1.5 left-8 right-8 flex items-center justify-between font-mono text-[6.5px]">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#388e3c] shadow-[0_0_5px_#388e3c]" />
            <span className="text-zinc-500">PWR</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                angles.proximity > 0.2
                  ? 'bg-[#f9a825] shadow-[0_0_7px_#f9a825]'
                  : 'bg-zinc-700'
              }`}
            />
            <span className={angles.proximity > 0.2 ? 'text-zinc-300' : 'text-zinc-600'}>
              {angles.proximity > 0.2 ? 'PROX: ACTIVE' : 'PROX: IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Ground Shadow Projected on the Cutting Mat Surface */}
      <svg
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-44 overflow-visible pointer-events-none transition-opacity duration-700 ${
          isLight ? 'opacity-40' : 'opacity-70'
        }`}
        style={{
          filter: 'blur(4px)',
          transform: `scaleY(0.46) rotate(${angles.base * 0.7}deg)`,
          transformOrigin: 'center 88%',
        }}
      >
        {/* Baseplate contact shadow */}
        <ellipse cx="128" cy="142" rx="34" ry="12" fill="#000000" />
        
        {/* Articulated lower arm shadow */}
        <line
          x1="128"
          y1="142"
          x2={128 + Math.sin((angles.shoulder * Math.PI) / 180) * 58}
          y2={142 - Math.cos((angles.shoulder * Math.PI) / 180) * 58}
          stroke="#000000"
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Articulated upper arm shadow */}
        <line
          x1={128 + Math.sin((angles.shoulder * Math.PI) / 180) * 58}
          y1={142 - Math.cos((angles.shoulder * Math.PI) / 180) * 58}
          x2={
            128 +
            Math.sin((angles.shoulder * Math.PI) / 180) * 58 +
            Math.sin(((angles.shoulder + angles.elbow) * Math.PI) / 180) * 60
          }
          y2={
            142 -
            Math.cos((angles.shoulder * Math.PI) / 180) * 58 -
            Math.cos(((angles.shoulder + angles.elbow) * Math.PI) / 180) * 60
          }
          stroke="#000000"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </svg>

      {/* 3. The Physical Articulated Robotic Arm Mechanism */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-56 pointer-events-none"
        style={{
          transform: `rotate(${angles.base}deg)`,
          transformOrigin: 'center 88%',
          transition: 'transform 0.05s linear',
        }}
      >
        <svg viewBox="0 0 160 210" className="w-full h-full overflow-visible drop-shadow-lg">
          <defs>
            {/* CNC Anodized Aluminum Spar Gradient */}
            <linearGradient id="sparGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4a505e" />
              <stop offset="45%" stopColor="#2e333d" />
              <stop offset="100%" stopColor="#1e2127" />
            </linearGradient>

            {/* Aluminum Highlight Edge Gradient */}
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#717a8c" />
              <stop offset="50%" stopColor="#444a56" />
              <stop offset="100%" stopColor="#252830" />
            </linearGradient>

            {/* Brass Pinion / Bushing Metallic Gradient */}
            <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ecd47b" />
              <stop offset="45%" stopColor="#c59f33" />
              <stop offset="100%" stopColor="#7a5f1a" />
            </linearGradient>

            {/* Micro-Servo Polycarbonate Body Gradient */}
            <linearGradient id="servoGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#203554" />
              <stop offset="60%" stopColor="#15243b" />
              <stop offset="100%" stopColor="#0d1726" />
            </linearGradient>
          </defs>

          {/* ======================================================== */}
          {/* BASE AZIMUTH TURRET & BEARING STAGE                      */}
          {/* ======================================================== */}
          <g id="base-turret">
            {/* Turntable Bearing Ring with Stamped Degree Scale */}
            <ellipse cx="80" cy="184" rx="26" ry="10" fill="#1b1d24" stroke="#373c47" strokeWidth="1.2" />
            <ellipse cx="80" cy="183" rx="22" ry="8" fill="#252932" stroke="#484e5c" strokeWidth="0.8" />
            
            {/* Machined Turret Center Riser */}
            <rect x="70" y="165" width="20" height="18" rx="2" fill="url(#sparGrad)" stroke="url(#edgeGrad)" strokeWidth="0.8" />

            {/* Base MG90S Micro-Servo Housing */}
            <rect x="64" y="157" width="32" height="15" rx="2" fill="url(#servoGrad)" stroke="#2b4266" strokeWidth="0.8" />
            {/* Servo Metallic Spec Label */}
            <rect x="68" y="161" width="24" height="4" fill="#a0a8b5" rx="0.5" />
            <text x="80" y="164" fontSize="2.8" fill="#111" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              MG-90S 2.2kg·cm
            </text>

            {/* Brass Spline Output Gear Pivot */}
            <circle cx="80" cy="157" r="4.2" fill="url(#brassGrad)" stroke="#6d5415" strokeWidth="0.7" />
            <circle cx="80" cy="157" r="1.5" fill="#181a20" />
          </g>

          {/* Flexible Multi-Conductor Servo Ribbon Cable (Brown / Red / Orange) */}
          <path
            d={`M 73 162 Q 66 128 74 ${105 + angles.shoulder * 0.18}`}
            fill="none"
            stroke="#b85f1c"
            strokeWidth="2.2"
            strokeDasharray="1.6 0.8"
          />

          {/* ======================================================== */}
          {/* LOWER ARM LINKAGE (SHOULDER PIVOT AT 80, 157)            */}
          {/* ======================================================== */}
          <g transform={`rotate(${angles.shoulder}, 80, 157)`}>
            {/* Anodized Dual Aluminum Spar */}
            <rect x="76" y="92" width="8" height="65" rx="2.5" fill="url(#sparGrad)" stroke="url(#edgeGrad)" strokeWidth="0.9" />
            
            {/* Shoulder Heavy Pivot Flange */}
            <circle cx="80" cy="157" r="5.8" fill="#23262e" stroke="#484e5c" strokeWidth="0.9" />
            <circle cx="80" cy="157" r="2.2" fill="url(#brassGrad)" />

            {/* Weight-Reduction Skeletonized Cutouts (CNC Milled Holes) */}
            <circle cx="80" cy="138" r="2.6" fill="#111317" stroke="#333742" strokeWidth="0.5" />
            <circle cx="80" cy="120" r="2.6" fill="#111317" stroke="#333742" strokeWidth="0.5" />
            <circle cx="80" cy="104" r="2.2" fill="#111317" stroke="#333742" strokeWidth="0.5" />

            {/* Cable Retainer Clips on Spar */}
            <rect x="74.5" y="112" width="2" height="4" rx="0.5" fill="#555d6e" />
            <rect x="74.5" y="130" width="2" height="4" rx="0.5" fill="#555d6e" />

            {/* ====================================================== */}
            {/* ELBOW JOINT & MID-STAGE SERVO (PIVOT AT 80, 92)        */}
            {/* ====================================================== */}
            <g id="elbow-joint" transform="translate(80, 92)">
              {/* Elbow Servo Case Bracket */}
              <rect x="-14" y="-8" width="28" height="16" rx="2" fill="url(#servoGrad)" stroke="#2b4266" strokeWidth="0.8" />
              {/* Servo Label */}
              <rect x="-10" y="-4" width="20" height="3" fill="#a0a8b5" rx="0.5" />
              <text x="0" y="-1.6" fontSize="2.2" fill="#111" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                AXIS-03 METAL
              </text>
              
              {/* Brass Pivot Output Shaft */}
              <circle cx="0" cy="0" r="4" fill="url(#brassGrad)" stroke="#6d5415" strokeWidth="0.7" />
              <circle cx="0" cy="0" r="1.4" fill="#1a1c22" />

              {/* ==================================================== */}
              {/* UPPER FOREARM LINKAGE (ROTATES BY ELBOW ANGLE)       */}
              {/* ==================================================== */}
              <g transform={`rotate(${angles.elbow})`}>
                {/* Forearm Machined Aluminum Spar */}
                <rect x="-3.5" y="-62" width="7" height="62" rx="2" fill="url(#sparGrad)" stroke="url(#edgeGrad)" strokeWidth="0.85" />
                
                {/* Weight-Reduction Cutouts */}
                <circle cx="0" cy="-45" r="2.2" fill="#111317" stroke="#333742" strokeWidth="0.5" />
                <circle cx="0" cy="-28" r="2.2" fill="#111317" stroke="#333742" strokeWidth="0.5" />
                <circle cx="0" cy="-14" r="1.8" fill="#111317" stroke="#333742" strokeWidth="0.5" />

                {/* Cable routing along forearm */}
                <path
                  d="M -3 0 Q -7 -30 -3 -58"
                  fill="none"
                  stroke="#b85f1c"
                  strokeWidth="1.6"
                  strokeDasharray="1.2 0.6"
                />

                {/* ================================================== */}
                {/* WRIST PITCH BRACKET & CLAW (AT 0, -62)            */}
                {/* ================================================== */}
                <g transform="translate(0, -62)">
                  {/* Wrist Mounting Bracket */}
                  <rect x="-9" y="-7" width="18" height="7" rx="1.5" fill="#20232b" stroke="#3b404d" strokeWidth="0.8" />
                  
                  {/* Micro-Servo Horn for Gripper */}
                  <circle cx="0" cy="-3.5" r="2" fill="url(#brassGrad)" stroke="#6d5415" strokeWidth="0.5" />

                  {/* Gripper Jaws (Dynamic Aperture) */}
                  {/* Left Finger Link */}
                  <path
                    d={`M -3 -7 L ${-angles.gripper * 0.45 - 4} -19 L ${-angles.gripper * 0.25 - 3} -27`}
                    fill="none"
                    stroke="#9ca5b5"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Right Finger Link */}
                  <path
                    d={`M 3 -7 L ${angles.gripper * 0.45 + 4} -19 L ${angles.gripper * 0.25 + 3} -27`}
                    fill="none"
                    stroke="#9ca5b5"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* High-Friction Red Silicone Rubber Grip Contact Pads on Tips */}
                  <rect
                    x={-angles.gripper * 0.25 - 4.5}
                    y="-28"
                    width="3"
                    height="4"
                    rx="0.8"
                    fill="#c62828"
                    stroke="#8e0000"
                    strokeWidth="0.4"
                  />
                  <rect
                    x={angles.gripper * 0.25 + 1.5}
                    y="-28"
                    width="3"
                    height="4"
                    rx="0.8"
                    fill="#c62828"
                    stroke="#8e0000"
                    strokeWidth="0.4"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

