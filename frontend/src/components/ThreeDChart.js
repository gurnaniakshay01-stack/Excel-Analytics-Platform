import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Removed import of FontLoader as it is not exported from 'three' package

const ThreeDChart = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!data || data.length === 0 || !xAxis || !yAxis) {
      return;
    }

    // Clear previous scene if any
    while (mountRef.current && mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Setup scene with cyberpunk background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a); // Deep black background

    // Setup camera
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 25, 45);

    // Setup renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // 🚀 CYBERPUNK LIGHTING SETUP
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.3);
    scene.add(ambientLight);

    // Main directional light with cyber colors
    const mainLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Secondary accent light
    const accentLight = new THREE.PointLight(0xff00ff, 1, 100);
    accentLight.position.set(-10, 15, -10);
    scene.add(accentLight);

    // Pulsing rim light
    const rimLight = new THREE.SpotLight(0x00ff00, 0.8, 100, Math.PI / 6);
    rimLight.position.set(0, 30, 0);
    rimLight.target.position.set(0, 0, 0);
    scene.add(rimLight);
    scene.add(rimLight.target);

    // Find indices of selected axes in header row
    const headers = data[0];
    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) return;

    // 🚀 CYBERPUNK GRID SYSTEM
    const gridGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -0.1;
    scene.add(grid);

    // 🚀 CYBERPUNK BARS WITH GLOW EFFECTS
    const bars = [];
    const maxValue = Math.max(...data.slice(1).map(row => Number(row[yIndex]) || 0));

    for (let i = 1; i < data.length; i++) {
      const value = Number(data[i][yIndex]) || 0;
      const normalizedHeight = value / maxValue * 15; // Scale to max height of 15

      // Main bar geometry
      const geometry = new THREE.BoxGeometry(1.5, normalizedHeight, 1.5);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 - (i / data.length) * 0.3, 1, 0.6),
        emissive: new THREE.Color().setHSL(0.6 - (i / data.length) * 0.3, 1, 0.2),
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });

      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(i * 3 - (data.length * 1.5), normalizedHeight / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;

      // 🚀 GLOW EFFECT
      const glowGeometry = new THREE.BoxGeometry(1.8, normalizedHeight + 0.5, 1.8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 - (i / data.length) * 0.3, 1, 0.8),
        transparent: true,
        opacity: 0.3
      });
      const glowBar = new THREE.Mesh(glowGeometry, glowMaterial);
      glowBar.position.copy(bar.position);
      scene.add(glowBar);

      // 🚀 PARTICLE SYSTEM FOR EACH BAR
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 20;
      const positions = new Float32Array(particleCount * 3);

      for (let j = 0; j < particleCount; j++) {
        positions[j * 3] = (Math.random() - 0.5) * 2 + bar.position.x;
        positions[j * 3 + 1] = Math.random() * normalizedHeight + bar.position.y;
        positions[j * 3 + 2] = (Math.random() - 0.5) * 2 + bar.position.z;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color().setHSL(0.6 - (i / data.length) * 0.3, 1, 0.8),
        size: 0.1,
        transparent: true,
        opacity: 0.6
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      scene.add(bar);
      bars.push({ bar, glowBar, particles, originalY: bar.position.y });
    }

    // 🚀 CYBERPUNK DATA LABELS
    // Removed FontLoader usage as it is not exported from 'three'

    // 🚀 ENHANCED ANIMATION LOOP
    let time = 0;
    const animate = () => {
      if (!isAnimating) return;

      requestAnimationFrame(animate);
      time += 0.016;

      // 🚀 DYNAMIC CAMERA MOVEMENT
      camera.position.x = Math.sin(time * 0.5) * 5;
      camera.position.z = 45 + Math.cos(time * 0.3) * 10;
      camera.lookAt(0, 5, 0);

      // 🚀 BAR ANIMATIONS
      bars.forEach((barGroup, index) => {
        const { bar, glowBar, particles } = barGroup;

        // Floating animation
        bar.position.y = barGroup.originalY + Math.sin(time * 2 + index) * 0.3;
        glowBar.position.y = bar.position.y;

        // Color pulsing
        const hue = (0.6 - (index / bars.length) * 0.3 + Math.sin(time + index) * 0.1) % 1;
        bar.material.color.setHSL(hue, 1, 0.6);
        bar.material.emissive.setHSL(hue, 1, 0.2);
        glowBar.material.color.setHSL(hue, 1, 0.8);

        // Particle animation
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time * 3 + i) * 0.01;
          if (positions[i + 1] > bar.position.y + bar.geometry.parameters.height / 2 + 2) {
            positions[i + 1] = bar.position.y - 1;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
      });

      // 🚀 LIGHT ANIMATIONS
      mainLight.intensity = 1.5 + Math.sin(time * 2) * 0.3;
      accentLight.intensity = 1 + Math.sin(time * 1.5) * 0.5;
      rimLight.intensity = 0.8 + Math.sin(time * 3) * 0.2;

      // 🚀 GRID ANIMATION
      grid.material.opacity = 0.1 + Math.sin(time * 0.5) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // 🚀 RESPONSIVE HANDLING
    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      while (mountRef.current && mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [data, xAxis, yAxis, isAnimating]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full rounded-2xl overflow-hidden border border-cyber-primary/30 shadow-cyber-glow"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)' }}
      />

      {/* 🚀 CYBERPUNK CONTROLS */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-3 py-1 bg-cyber-surface/80 backdrop-blur-cyber border border-cyber-primary/50 rounded-lg text-cyber-primary text-sm font-cyber-body hover:bg-cyber-primary/20 transition-all duration-300"
        >
          {isAnimating ? '⏸️ PAUSE' : '▶️ PLAY'}
        </button>
      </div>

      {/* 🚀 CYBERPUNK SCAN LINES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-primary/5 to-transparent animate-cyber-scan opacity-20"></div>
      </div>
    </div>
  );
};

export default ThreeDChart;
