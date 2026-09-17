import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createDetoxGeometries } from './DetoxLettersGeometry';
import { useTheme } from '../ThemeContext';

interface DetoxWordmark3DProps {
  className?: string;
  mode?: 'dark' | 'light';
}

export const DetoxWordmark3D: React.FC<DetoxWordmark3DProps> = ({ className = '', mode: propMode }) => {
  const { mode: contextMode } = useTheme();
  const currentMode = propMode || contextMode;
  const modeRef = useRef(currentMode);

  useEffect(() => {
    modeRef.current = currentMode;
  }, [currentMode]);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup - looking down onto the workbench with slight pitch
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, -0.6, 12.5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Group for the floating wordmark
    const wordmarkGroup = new THREE.Group();
    scene.add(wordmarkGroup);

    // Material for the DETOX letters:
    // Dark mode: Deep oxblood red (#5D0D18)
    // Light mode: Black / near-black (#111111)
    const initialColor = modeRef.current === 'light' ? 0x111111 : 0x5d0d18;
    const letterMaterial = new THREE.MeshPhysicalMaterial({
      color: initialColor,
      roughness: 0.35, // Matte-to-satin physical material
      metalness: 0.08, // Solid manufactured coated material
      clearcoat: 0.14, // Subtle physical sheen on beveled chamfers
      clearcoatRoughness: 0.3,
      reflectivity: 0.5,
    });

    // Subdued chamfer edge highlight material
    const lettersData = createDetoxGeometries();
    const meshes: THREE.Mesh[] = [];

    lettersData.forEach(({ geom, xOffset }) => {
      const mesh = new THREE.Mesh(geom, letterMaterial);
      mesh.position.set(xOffset, 0, 0.6); // Hovering 0.6 units above shadow plane
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      wordmarkGroup.add(mesh);
      meshes.push(mesh);
    });

    // Shadow receiver plane (invisible surface that catches realistic directional cast shadow)
    const shadowPlaneGeom = new THREE.PlaneGeometry(32, 20);
    const initialShadowOpacity = modeRef.current === 'light' ? 0.42 : 0.82;
    const shadowPlaneMat = new THREE.ShadowMaterial({
      opacity: initialShadowOpacity,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowPlane.position.set(0, 0, 0);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Ambient Occlusion contact shadow discs beneath each letter for ground-truth physical elevation
    const contactShadowGroup = new THREE.Group();
    contactShadowGroup.position.set(0, 0, 0.02);
    lettersData.forEach(({ xOffset }) => {
      // Soft radial texture
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
        gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.5)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      const shadowTex = new THREE.CanvasTexture(canvas);
      const contactGeom = new THREE.PlaneGeometry(2.6, 2.6);
      const contactMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const contactMesh = new THREE.Mesh(contactGeom, contactMat);
      contactMesh.position.set(xOffset, -0.05, 0);
      contactShadowGroup.add(contactMesh);
    });
    scene.add(contactShadowGroup);

    // Lighting setup: Neutral balanced lighting to clearly articulate oxblood form and beveled edges
    // 1. Ambient light for baseline depth visibility (neutral balanced grey)
    const ambientLight = new THREE.AmbientLight(0x646468, 1.5);
    scene.add(ambientLight);

    // 2. Primary directional overhead key light (casts soft physical shadows onto the mat)
    const dirLight = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight.position.set(3.2, 5.8, 8.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 6;
    dirLight.shadow.camera.bottom = -6;
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.radius = 3.5;
    scene.add(dirLight);

    // 3. Subtle neutral raking light catching chamfered bevels
    const rimLight = new THREE.DirectionalLight(0xe4e4e6, 0.85);
    rimLight.position.set(-5.5, -4, 4);
    scene.add(rimLight);

    // 4. Subtle top-left soft neutral fill light
    const fillLight = new THREE.DirectionalLight(0xd0d0d4, 0.9);
    fillLight.position.set(-4.5, 4.5, 6);
    scene.add(fillLight);

    // Pointer move handler with normalization (-1 to +1)
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp for pointer interaction
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      // Micro hover float (tactile hover sensation ~15mm above the mat)
      const hoverZ = 0.6 + Math.sin(elapsedTime * 1.4) * 0.04;
      wordmarkGroup.position.z = hoverZ;

      // Restrained parallax tilt (less than 4 degrees)
      wordmarkGroup.rotation.x = -mouse.y * 0.07;
      wordmarkGroup.rotation.y = mouse.x * 0.09;
      wordmarkGroup.position.x = mouse.x * 0.18;
      wordmarkGroup.position.y = mouse.y * 0.14;

      // Contact shadow subtly shifts with hover elevation
      contactShadowGroup.position.x = -mouse.x * 0.06;
      contactShadowGroup.position.y = -mouse.y * 0.06;
      const contactScale = 1.0 - (hoverZ - 0.6) * 0.3;
      contactShadowGroup.scale.set(contactScale, contactScale, 1);

      // Shift key light position slightly with mouse so shadow tracks dynamically
      dirLight.position.x = 3.2 + mouse.x * 1.5;
      dirLight.position.y = 5.8 + mouse.y * 1.2;

      // Smooth mode transition for material color and physical shadow
      const isLight = modeRef.current === 'light';
      const targetColorHex = isLight ? 0x111111 : 0x5d0d18;
      letterMaterial.color.lerp(new THREE.Color(targetColorHex), 0.055);

      const targetShadowOpacity = isLight ? 0.42 : 0.82;
      shadowPlaneMat.opacity += (targetShadowOpacity - shadowPlaneMat.opacity) * 0.055;

      const targetContactOpacity = isLight ? 0.40 : 0.85;
      contactShadowGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.material.opacity += (targetContactOpacity - child.material.opacity) * 0.055;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      // Adjust camera distance on narrow/mobile viewports so wordmark fits nicely
      if (w < 768) {
        camera.position.z = 18;
      } else if (w < 1200) {
        camera.position.z = 14.5;
      } else {
        camera.position.z = 12.5;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      lettersData.forEach(({ geom }) => geom.dispose());
      letterMaterial.dispose();
      shadowPlaneGeom.dispose();
      shadowPlaneMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px] flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};
