/**
 * RPIX — Immersive Hero Three.js Scene
 * Abstract cinematic particle field with gold accent lighting.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  className?: string;
  particleCount?: number;
};

export default function HeroScene({ className = '', particleCount = 1200 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const count = reduced ? 200 : isMobile ? Math.min(particleCount, 600) : particleCount;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.035);

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x1a1814, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xc9a84c, 1.2);
    key.position.set(4, 6, 8);
    scene.add(key);

    const fill = new THREE.PointLight(0x3a3528, 0.8, 30);
    fill.position.set(-6, -2, 4);
    scene.add(fill);

    const rim = new THREE.PointLight(0xe8e4dc, 0.4, 20);
    rim.position.set(0, 4, -6);
    scene.add(rim);

    // Particle field
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const gold = new THREE.Color(0xc9a84c);
    const platinum = new THREE.Color(0xe8e4dc);
    const ink = new THREE.Color(0x3a3528);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i3 + 2] = radius * Math.cos(phi) - 2;

      const mix = Math.random();
      const c = mix > 0.85 ? gold : mix > 0.5 ? platinum : ink;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
      sizes[i] = 0.5 + Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Soft gold torus knot — abstract luxury form
    const torusGeo = new THREE.TorusKnotGeometry(1.4, 0.35, isMobile ? 80 : 160, isMobile ? 12 : 24);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(0, 0, 0);
    scene.add(torus);

    // Wireframe ghost
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const wire = new THREE.Mesh(torusGeo.clone(), wireMat);
    wire.scale.setScalar(1.08);
    scene.add(wire);

    // Mouse parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = x * 0.6;
      targetY = -y * 0.35;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animate
    let frame = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      frame++;

      if (!reduced) {
        currentX += (targetX - currentX) * 0.04;
        currentY += (targetY - currentY) * 0.04;

        torus.rotation.x = t * 0.12 + currentY * 0.3;
        torus.rotation.y = t * 0.18 + currentX * 0.4;
        wire.rotation.x = -t * 0.08;
        wire.rotation.y = t * 0.14;

        points.rotation.y = t * 0.03 + currentX * 0.15;
        points.rotation.x = currentY * 0.1;

        camera.position.x = currentX * 0.5;
        camera.position.y = currentY * 0.3;
        camera.lookAt(0, 0, 0);

        // Subtle pulse on material
        material.opacity = 0.7 + Math.sin(t * 0.5) * 0.15;
        key.intensity = 1.0 + Math.sin(t * 0.7) * 0.2;
      }

      // Skip frames on low power if needed
      if (isMobile && frame % 2 === 0) {
        /* still render every frame for smoothness on most devices */
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      wireMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [particleCount]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 -z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
