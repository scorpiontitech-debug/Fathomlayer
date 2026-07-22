/**
 * Peça 3D do hero (design system 5.2): malha de dados em três camadas —
 * os três pilares do índice — em Three.js puro.
 *
 * Física real: springs amortecidos com inércia no pointer, flutuação com
 * peso por camada, dolly de câmera em Z no scroll (scroll nativo intacto).
 *
 * Orçamento de performance (não "testar depois"):
 *   draw calls: 3 nós instanciados + 3 malhas de linha + 1 cross-links
 *               + 1 pulsos = 8 (meta: < 100)
 *   geometria: ~270 esferas low-poly instanciadas (1 geometria compartilhada)
 *   DPR: ≤ 2 desktop, ≤ 1.5 mobile · pausa fora de viewport/tab oculta
 */

import * as THREE from "three";
import { gsap } from "gsap";

export type HeroSceneHandle = {
  dispose: () => void;
  setPaused: (paused: boolean) => void;
  drawCalls: () => number;
};

type LayerSpec = {
  color: number;
  accent: number;
  y: number;
  z: number;
  radius: number;
  count: number;
  speed: number;
  phase: number;
};

export function createHeroScene(
  canvas: HTMLCanvasElement,
  { reducedMotion }: { reducedMotion: boolean }
): HeroSceneHandle {
  const isMobile = window.innerWidth < 640;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0b, 7.5, 16);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
  const CAM_BASE = new THREE.Vector3(0, 0.35, 9);
  camera.position.copy(CAM_BASE);

  const world = new THREE.Group();
  world.rotation.x = -0.14;
  scene.add(world);

  // Camadas com presença real: mais nós, mais claras, mais separadas em Z —
  // o objeto precisa ler como peça central, não como textura de fundo.
  const LAYERS: LayerSpec[] = [
    { color: 0xa8a8b2, accent: 0x6f9bff, y: 1.35, z: 1.1, radius: 2.7, count: isMobile ? 60 : 118, speed: 0.05, phase: 0 },
    { color: 0x8e8e99, accent: 0x4d84ff, y: 0, z: 0, radius: 3.35, count: isMobile ? 68 : 136, speed: -0.034, phase: 2.1 },
    { color: 0x6e6e79, accent: 0x2f66e0, y: -1.35, z: -1.1, radius: 4.0, count: isMobile ? 74 : 148, speed: 0.021, phase: 4.2 },
  ];

  const nodeGeometry = new THREE.SphereGeometry(0.042, 8, 6);
  const disposables: { dispose: () => void }[] = [renderer, nodeGeometry];
  const fadeMaterials: (THREE.Material & { opacity: number })[] = [];
  const layerGroups: THREE.Group[] = [];
  const crossAnchors: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
  const dummy = new THREE.Object3D();
  const baseColor = new THREE.Color();

  LAYERS.forEach((spec) => {
    const group = new THREE.Group();
    group.position.set(0, spec.y, spec.z);
    world.add(group);
    layerGroups.push(group);

    // Nós: distribuição em disco com miolo vazio (anel orgânico)
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < spec.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = spec.radius * (0.45 + 0.55 * Math.sqrt(Math.random()));
      positions.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          (Math.random() - 0.5) * 0.16,
          Math.sin(angle) * r * 0.72
        )
      );
    }

    const nodeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, spec.count);
    positions.forEach((p, i) => {
      dummy.position.copy(p);
      const s = 0.7 + Math.random() * 0.9;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodes.setMatrixAt(i, dummy.matrix);
      // ~22% dos nós no acento — o azul é dado, não decoração
      baseColor.setHex(Math.random() < 0.22 ? spec.accent : spec.color);
      nodes.setColorAt(i, baseColor);
    });
    nodes.instanceMatrix.needsUpdate = true;
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
    group.add(nodes);
    disposables.push(nodeMaterial);
    fadeMaterials.push(nodeMaterial);

    // Arestas: cada nó liga aos 2 vizinhos mais próximos
    const linePoints: THREE.Vector3[] = [];
    positions.forEach((p, i) => {
      const nearest = positions
        .map((q, j) => ({ j, d: i === j ? Infinity : p.distanceToSquared(q) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      nearest.forEach(({ j }) => {
        if (j > i) linePoints.push(p, positions[j]);
      });
    });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: spec.color,
      transparent: true,
      opacity: 0,
    });
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));
    disposables.push(lineGeometry, lineMaterial);
    fadeMaterials.push(lineMaterial);

    // Âncoras para os links entre camadas
    for (let i = 0; i < 5; i++) {
      const p = positions[Math.floor(Math.random() * positions.length)];
      crossAnchors.push({
        from: p.clone().add(group.position),
        to: new THREE.Vector3(),
      });
    }
  });

  // Links entre camadas + pulsos de dados percorrendo-os
  const crossLinks: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
  const crossPoints: THREE.Vector3[] = [];
  for (let i = 0; i < (isMobile ? 8 : 12); i++) {
    const la = layerGroups[i % 2];
    const lb = layerGroups[(i % 2) + 1];
    const na = la.children[0] as THREE.InstancedMesh;
    const nb = lb.children[0] as THREE.InstancedMesh;
    const ma = new THREE.Matrix4();
    const mb = new THREE.Matrix4();
    na.getMatrixAt(Math.floor(Math.random() * na.count), ma);
    nb.getMatrixAt(Math.floor(Math.random() * nb.count), mb);
    const a = new THREE.Vector3().setFromMatrixPosition(ma).add(la.position);
    const b = new THREE.Vector3().setFromMatrixPosition(mb).add(lb.position);
    crossLinks.push({ a, b });
    crossPoints.push(a, b);
  }
  const crossGeometry = new THREE.BufferGeometry().setFromPoints(crossPoints);
  const crossMaterial = new THREE.LineBasicMaterial({
    color: 0x4d84ff,
    transparent: true,
    opacity: 0,
  });
  world.add(new THREE.LineSegments(crossGeometry, crossMaterial));
  disposables.push(crossGeometry, crossMaterial);
  fadeMaterials.push(crossMaterial);

  const pulseCount = crossLinks.length;
  const pulseGeometry = new THREE.BufferGeometry();
  pulseGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(pulseCount * 3), 3)
  );
  const pulseMaterial = new THREE.PointsMaterial({
    color: 0x4d84ff,
    size: 0.13,
    transparent: true,
    opacity: 0,
    sizeAttenuation: true,
  });
  const pulses = new THREE.Points(pulseGeometry, pulseMaterial);
  world.add(pulses);
  disposables.push(pulseGeometry, pulseMaterial);
  fadeMaterials.push(pulseMaterial);
  const pulseSpeeds = Array.from({ length: pulseCount }, () => 0.12 + Math.random() * 0.2);
  const pulseOffsets = Array.from({ length: pulseCount }, () => Math.random());

  // --- Física: spring amortecido para o pointer (inércia real) ---
  const spring = { x: 0, y: 0, vx: 0, vy: 0 };
  const target = { x: 0, y: 0 };
  const STIFFNESS = 14;
  const DAMPING = 5.2;

  function onPointerMove(e: PointerEvent) {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  // --- Resize ---
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

  // --- Loop ---
  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  let userPaused = false;
  let inView = true;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // Integração do spring (semi-implícito)
    spring.vx += (target.x - spring.x) * STIFFNESS * dt;
    spring.vy += (target.y - spring.y) * STIFFNESS * dt;
    spring.vx *= Math.exp(-DAMPING * dt);
    spring.vy *= Math.exp(-DAMPING * dt);
    spring.x += spring.vx * dt;
    spring.y += spring.vy * dt;

    world.rotation.y = spring.x * 0.14;
    world.rotation.x = -0.14 + spring.y * 0.08;

    // Dolly em Z no scroll — profundidade real, scroll nativo
    const sy = window.scrollY;
    camera.position.z = CAM_BASE.z + Math.min(sy, 900) * 0.0016;
    camera.position.y = CAM_BASE.y + Math.min(sy, 900) * 0.0007;
    camera.position.x = spring.x * 0.35;
    camera.lookAt(0, 0, 0);

    // Deriva por camada: velocidades diferentes = paralaxe de profundidade
    layerGroups.forEach((group, i) => {
      const spec = LAYERS[i];
      group.rotation.y += spec.speed * dt;
      group.position.y = spec.y + Math.sin(t * 0.4 + spec.phase) * 0.07;
    });

    // Pulsos percorrendo os links
    const attr = pulseGeometry.getAttribute("position") as THREE.BufferAttribute;
    crossLinks.forEach((link, i) => {
      const u = (t * pulseSpeeds[i] + pulseOffsets[i]) % 1;
      attr.setXYZ(
        i,
        link.a.x + (link.b.x - link.a.x) * u,
        link.a.y + (link.b.y - link.a.y) * u,
        link.a.z + (link.b.z - link.a.z) * u
      );
    });
    attr.needsUpdate = true;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || userPaused || !inView || reducedMotion) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // Pausa automática fora do viewport / aba oculta
  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }
  document.addEventListener("visibilitychange", onVisibility);

  // --- Entrada coreografada (uma vez) ou frame estático (reduced motion) ---
  if (reducedMotion) {
    fadeMaterials.forEach((m) => (m.opacity = m instanceof THREE.LineBasicMaterial ? 0.3 : 1));
    pulseMaterial.opacity = 0;
    renderer.render(scene, camera);
  } else {
    const intro = gsap.timeline();
    intro.from(camera.position, { z: 12.5, duration: 1.7, ease: "power3.out" }, 0);
    layerGroups.forEach((group, i) => {
      intro.from(
        group.position,
        { y: LAYERS[i].y - 0.7, duration: 1.2, ease: "power2.out" },
        0.12 * i
      );
    });
    fadeMaterials.forEach((m, i) => {
      const isLine = m instanceof THREE.LineBasicMaterial;
      const targetOpacity = m === pulseMaterial ? 1 : isLine ? 0.3 : 1;
      intro.to(m, { opacity: targetOpacity, duration: 1.1, ease: "power2.out" }, 0.1 + 0.08 * i);
    });
    start();
  }

  return {
    setPaused(paused: boolean) {
      userPaused = paused;
      if (paused) stop();
      else start();
    },
    drawCalls() {
      return renderer.info.render.calls;
    },
    dispose() {
      stop();
      gsap.globalTimeline.clear();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      disposables.forEach((d) => d.dispose());
    },
  };
}
