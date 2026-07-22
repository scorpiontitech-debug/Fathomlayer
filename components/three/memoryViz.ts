/**
 * Visualização volumétrica da calculadora (design system 5.2): quatro
 * colunas de memória — uma por escalão — que se preenchem em 3D conforme
 * o modelo escolhido. Three.js puro.
 *
 * Física real: preenchimento via spring amortecido; rotação com arrasto
 * do pointer e inércia com atrito na soltura.
 * Orçamento: 4 caixas de aresta + 4 preenchimentos + 1 base ≈ 9 draw calls.
 * Acessibilidade: tudo que está aqui existe em HTML ao lado (a leitura
 * real é a lista de escalões); o canvas é aria-hidden.
 */

import * as THREE from "three";
import { TIERS } from "@/lib/calculator";

export type MemoryVizHandle = {
  setModelTier: (minTier: number) => void;
  dispose: () => void;
};

// Altura visual ∝ raiz da memória (16→256 GB legível sem achatar a base)
const heightFor = (gb: number) => Math.sqrt(gb) * 0.28;

export function createMemoryViz(canvas: HTMLCanvasElement): MemoryVizHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0, 2.1, 7.6);
  camera.lookAt(0, 0.9, 0);

  const world = new THREE.Group();
  world.rotation.y = -0.28;
  scene.add(world);

  const disposables: { dispose: () => void }[] = [renderer];
  const SPACING = 1.55;
  const SIZE = 0.92;

  type Column = {
    fill: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    height: number;
    target: number; // fração 0..1
    level: number;
    velocity: number;
  };
  const columns: Column[] = [];

  // Decisão do usuário (toggle global), não a media query do SO
  const reduced = document.documentElement.classList.contains("motion-off");

  TIERS.forEach((tier, i) => {
    const h = heightFor(tier.memoryGb);
    const x = (i - (TIERS.length - 1) / 2) * SPACING;

    // Contorno do "vaso" de memória
    const boxGeometry = new THREE.BoxGeometry(SIZE, h, SIZE);
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x2a2a30,
      transparent: true,
      opacity: 0.9,
    });
    const outline = new THREE.LineSegments(edges, edgeMaterial);
    outline.position.set(x, h / 2, 0);
    world.add(outline);
    disposables.push(boxGeometry, edges, edgeMaterial);

    // Preenchimento — escala Y anima via spring
    const fillGeometry = new THREE.BoxGeometry(SIZE * 0.86, 1, SIZE * 0.86);
    fillGeometry.translate(0, 0.5, 0); // pivô na base
    const material = new THREE.MeshBasicMaterial({
      color: 0x0052ff,
      transparent: true,
      opacity: 0.5,
    });
    const fill = new THREE.Mesh(fillGeometry, material);
    fill.position.set(x, 0.001, 0);
    fill.scale.y = 0.0001;
    world.add(fill);
    disposables.push(fillGeometry, material);

    columns.push({ fill, material, height: h, target: 0, level: 0, velocity: 0 });
  });

  // Linha de base
  const baseGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3((-(TIERS.length - 1) / 2) * SPACING - 0.8, 0, 0),
    new THREE.Vector3(((TIERS.length - 1) / 2) * SPACING + 0.8, 0, 0),
  ]);
  const baseMaterial = new THREE.LineBasicMaterial({
    color: 0x2a2a30,
    transparent: true,
    opacity: 0.9,
  });
  world.add(new THREE.Line(baseGeometry, baseMaterial));
  disposables.push(baseGeometry, baseMaterial);

  // --- Rotação com inércia (arrasto + atrito) ---
  let angularVelocity = 0;
  let dragging = false;
  let lastX = 0;

  function onPointerDown(e: PointerEvent) {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    world.rotation.y += dx * 0.006;
    angularVelocity = dx * 0.28;
  }
  function onPointerUp(e: PointerEvent) {
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  }
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

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

  const STIFFNESS = 26;
  const DAMPING = 7;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);

    // Springs de preenchimento
    columns.forEach((col) => {
      col.velocity += (col.target - col.level) * STIFFNESS * dt;
      col.velocity *= Math.exp(-DAMPING * dt);
      col.level += col.velocity * dt;
      col.fill.scale.y = Math.max(col.level, 0.0001) * col.height;
    });

    // Inércia da rotação + deriva lenta em repouso
    if (!dragging) {
      world.rotation.y += angularVelocity * dt;
      angularVelocity *= Math.exp(-2.2 * dt);
      world.rotation.y += 0.045 * dt;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !inView) return;
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
    { threshold: 0.05 }
  );
  io.observe(canvas);

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }
  document.addEventListener("visibilitychange", onVisibility);

  if (reduced) {
    // Sem loop: aplica estado alvo direto e renderiza sob demanda
    renderer.render(scene, camera);
  } else {
    start();
  }

  return {
    setModelTier(minTier: number) {
      const required = TIERS[minTier].memoryGb;
      columns.forEach((col, i) => {
        const capacity = TIERS[i].memoryGb;
        const fits = i >= minTier;
        // Escalões que rodam: preenchem a fração usada; os que não rodam
        // ficam cheios em cinza — capacidade tomada, insuficiente.
        col.target = fits ? required / capacity : 1;
        col.material.color.setHex(fits ? 0x0052ff : 0x3a3a40);
        col.material.opacity = fits ? 0.55 : 0.28;
      });
      if (reduced) {
        columns.forEach((col) => {
          col.level = col.target;
          col.velocity = 0;
          col.fill.scale.y = Math.max(col.level, 0.0001) * col.height;
        });
        renderer.render(scene, camera);
      }
    },
    dispose() {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      disposables.forEach((d) => d.dispose());
    },
  };
}
