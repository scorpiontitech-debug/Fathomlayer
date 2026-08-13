"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface DigitalTwinViewerProps {
  stressScore: number; // 0 to 100
  heartRate: number;
}

export function DigitalTwinViewer({ stressScore, heartRate }: DigitalTwinViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // We use refs to keep track of the three.js objects without triggering re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene, Camera, Renderer
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Create Cybernetic Particle Sphere (Digital Twin)
    const particleCount = 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color("#0ea5e9"); // Calm Blue

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 2 + (Math.random() * 0.2); // slight variance

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // 3. Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (particlesRef.current) {
        // Base rotation
        particlesRef.current.rotation.y += 0.002;
        particlesRef.current.rotation.x += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 4. Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // 5. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // 6. React to Physiologic State (Stress/HeartRate) via GSAP
  useEffect(() => {
    if (!particlesRef.current) return;

    const geometry = particlesRef.current.geometry as THREE.BufferGeometry;
    const colorsAttr = geometry.attributes.color as THREE.BufferAttribute;
    
    // Calculate target color based on stress
    // 0 = Blue (#0ea5e9), 100 = Red (#ef4444)
    const calmColor = new THREE.Color("#0ea5e9");
    const stressColor = new THREE.Color("#ef4444");
    
    const targetColor = calmColor.clone().lerp(stressColor, stressScore / 100);
    
    // Scale geometry based on heart rate (beating effect)
    const scaleMultiplier = 1 + (heartRate - 60) * 0.002;

    // Use GSAP to smoothly animate the properties
    gsap.to(particlesRef.current.scale, {
      x: scaleMultiplier,
      y: scaleMultiplier,
      z: scaleMultiplier,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    // Animate rotation speed based on stress
    gsap.to(particlesRef.current.rotation, {
      y: `+=${0.5 + (stressScore / 50)}`, // Rotate more if stressed
      duration: 2,
      ease: "power1.inOut",
    });

    // Transition colors smoothly
    const currentColor = new THREE.Color(colorsAttr.getX(0), colorsAttr.getY(0), colorsAttr.getZ(0));
    
    gsap.to(currentColor, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 2,
      onUpdate: () => {
        for (let i = 0; i < colorsAttr.count; i++) {
          colorsAttr.setXYZ(i, currentColor.r, currentColor.g, currentColor.b);
        }
        colorsAttr.needsUpdate = true;
      }
    });

  }, [stressScore, heartRate]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full absolute inset-0 -z-10"
      style={{ minHeight: "400px" }}
    />
  );
}
