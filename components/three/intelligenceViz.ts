/**
 * Visualização de rede neural / nós de inteligência para o pilar Intelligence.
 * Three.js puro, otimizado para baixas draw calls (< 5).
 * 
 * Reage ao pointer (parallax suave) e tem rotação autônoma constante.
 */

import * as THREE from "three";

export type IntelligenceVizHandle = {
  dispose: () => void;
};

export function createIntelligenceViz(canvas: HTMLCanvasElement): IntelligenceVizHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
  camera.position.set(0, 0, 10);

  const world = new THREE.Group();
  scene.add(world);

  const disposables: { dispose: () => void }[] = [renderer];

  // Configuração da rede
  const NODE_COUNT = 45;
  const RADIUS = 4;
  const nodes: THREE.Vector3[] = [];
  const velocities: THREE.Vector3[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    // Posição aleatória em uma esfera
    const r = RADIUS * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    nodes.push(new THREE.Vector3(x, y, z));
    // Velocidade de drift (breathing effect)
    velocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1,
      (Math.random() - 0.5) * 0.1
    ));
  }

  // Partículas (Nós)
  const particlesGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  const particlesMat = new THREE.PointsMaterial({
    color: 0x0052ff,
    size: 0.12,
    transparent: true,
    opacity: 0.8,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  world.add(particles);
  disposables.push(particlesGeo, particlesMat);

  // Linhas (Conexões)
  const linesGeo = new THREE.BufferGeometry();
  // Alocar buffer pro maximo de linhas (cada nó conectado a uns 3 próximos)
  const maxLines = NODE_COUNT * 4;
  const positions = new Float32Array(maxLines * 6);
  const opacities = new Float32Array(maxLines * 2);
  linesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  linesGeo.setAttribute('alpha', new THREE.BufferAttribute(opacities, 1));
  
  // Custom shader pra suportar opacidade por vértice baseada na distância
  const linesMat = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0x0052ff) }
    },
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(color, vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const lines = new THREE.LineSegments(linesGeo, linesMat);
  world.add(lines);
  disposables.push(linesGeo, linesMat);

  // --- Parallax suave com pointer ---
  let targetX = 0;
  let targetY = 0;

  function onPointerMove(e: PointerEvent) {
    // Normalizado de -1 a 1
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  window.addEventListener("pointermove", onPointerMove);

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const { clientWidth: w, clientHeight: h } = parent;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  let inView = true;
  const reduced = document.documentElement.classList.contains("motion-off");

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);

    // Parallax
    camera.position.x += (targetX * 1.5 - camera.position.x) * 2 * dt;
    camera.position.y += (targetY * 1.5 - camera.position.y) * 2 * dt;
    camera.lookAt(0, 0, 0);

    // Rotação autônoma do grupo
    world.rotation.y += 0.08 * dt;
    world.rotation.x += 0.03 * dt;

    // Breathing e reconstrução das linhas
    let lineIdx = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const v = nodes[i];
      const vel = velocities[i];
      v.addScaledVector(vel, dt);
      
      // Rebate nas bordas da esfera virtual
      if (v.length() > RADIUS) {
        v.normalize().multiplyScalar(RADIUS);
        vel.multiplyScalar(-1);
      }

      // Conexões com próximos
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = v.distanceTo(nodes[j]);
        if (dist < 2.5 && lineIdx < maxLines) {
          const alpha = 1.0 - (dist / 2.5); // Fade out ao distanciar
          
          positions[lineIdx * 6] = v.x;
          positions[lineIdx * 6 + 1] = v.y;
          positions[lineIdx * 6 + 2] = v.z;
          opacities[lineIdx * 2] = alpha * 0.4;
          
          positions[lineIdx * 6 + 3] = nodes[j].x;
          positions[lineIdx * 6 + 4] = nodes[j].y;
          positions[lineIdx * 6 + 5] = nodes[j].z;
          opacities[lineIdx * 2 + 1] = alpha * 0.4;
          
          lineIdx++;
        }
      }
    }
    
    // Atualiza buffers
    particlesGeo.setFromPoints(nodes);
    linesGeo.setDrawRange(0, lineIdx * 2);
    linesGeo.attributes.position.needsUpdate = true;
    linesGeo.attributes.alpha.needsUpdate = true;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !inView || reduced) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }
  document.addEventListener("visibilitychange", onVisibility);

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    start();
  }

  return {
    dispose() {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
    },
  };
}
