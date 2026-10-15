import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreePipelineCanvasProps {
  onNodeSelect: (nodeInfo: string) => void;
  selectedNodeText: string;
}

export const ThreePipelineCanvas: React.FC<ThreePipelineCanvasProps> = ({
  onNodeSelect,
  selectedNodeText,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'3d' | 'diagram'>('3d');
  const [isRotating, setIsRotating] = useState(true);

  // References for Three.js instance
  const stateRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    animId?: number;
    nodes: THREE.Mesh[];
    pulses: { mesh: THREE.Mesh; progress: number; curve: THREE.CatmullRomCurve3 }[];
  }>({
    nodes: [],
    pulses: [],
  });

  useEffect(() => {
    if (activeView !== '3d' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 230;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f0b, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2e24, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x70f3be, 3, 20);
    pointLight.position.set(0, 3, 4);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x50d6a3, 1.8);
    rimLight.position.set(-4, -2, -2);
    scene.add(rimLight);

    // 4. Group to hold everything
    const pipelineGroup = new THREE.Group();
    scene.add(pipelineGroup);

    // 5. Build 4 Distinct Pipeline Nodes
    // Node 0: Agent Teena Core (-2.2, 0, 0)
    // Node 1: EVM Smart Safe (-0.75, 0.65, 0)
    // Node 2: x402 Micropay Engine (0.75, -0.65, 0)
    // Node 3: Paid API Settled Node (2.2, 0, 0)
    const nodePositions = [
      new THREE.Vector3(-2.2, 0, 0),
      new THREE.Vector3(-0.75, 0.7, 0),
      new THREE.Vector3(0.75, -0.65, 0),
      new THREE.Vector3(2.2, 0, 0),
    ];

    const nodeMetadata = [
      {
        name: 'Agent Teena #01',
        detail: 'Agent Teena (Groq LLaMA-3.3 70B): Active sub-second tool caller. Requesting SerpApi Grounding payload. Spend cap: 2.50 USDC.',
        color: 0x70f3be,
        geometry: new THREE.IcosahedronGeometry(0.42, 1),
      },
      {
        name: 'EVM Smart Safe',
        detail: 'EVM Safe 0x71C4...8A29: Account abstraction session key validated on Base Sepolia. Zero unverified drain.',
        color: 0x50d6a3,
        geometry: new THREE.BoxGeometry(0.65, 0.65, 0.65),
      },
      {
        name: 'x402 Micropay Engine',
        detail: 'x402 Protocol: Instant 0.40 USDC micropayment handshake verified with Base Sepolia mempool finality.',
        color: 0xc1e3d2,
        geometry: new THREE.TorusGeometry(0.36, 0.12, 16, 32),
      },
      {
        name: 'Paid API Settled',
        detail: 'Paid API & Base Sepolia: Block #18921043 finality reached. 0 gas leak, instantaneous stream response.',
        color: 0x77fac4,
        geometry: new THREE.OctahedronGeometry(0.44, 0),
      },
    ];

    const nodeMeshes: THREE.Mesh[] = [];

    nodeMetadata.forEach((meta, idx) => {
      const pos = nodePositions[idx];
      const mat = new THREE.MeshStandardMaterial({
        color: meta.color,
        emissive: meta.color,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.85,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(meta.geometry, mat);
      mesh.position.copy(pos);
      mesh.userData = { id: idx, ...meta };
      pipelineGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Outer glowing wireframe cage
      const wireMat = new THREE.MeshBasicMaterial({
        color: meta.color,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const wireCage = new THREE.Mesh(meta.geometry.clone(), wireMat);
      wireCage.scale.set(1.28, 1.28, 1.28);
      mesh.add(wireCage);
    });

    // 6. Connective Cyber Splines
    const curve1 = new THREE.CatmullRomCurve3([
      nodePositions[0],
      new THREE.Vector3(-1.4, 0.45, 0.3),
      nodePositions[1],
    ]);
    const curve2 = new THREE.CatmullRomCurve3([
      nodePositions[1],
      new THREE.Vector3(0, 0.15, -0.2),
      nodePositions[2],
    ]);
    const curve3 = new THREE.CatmullRomCurve3([
      nodePositions[2],
      new THREE.Vector3(1.5, -0.3, 0.25),
      nodePositions[3],
    ]);
    const curves = [curve1, curve2, curve3];

    curves.forEach((curve) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.022, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x3d4a43,
        transparent: true,
        opacity: 0.6,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      pipelineGroup.add(tubeMesh);
    });

    // 7. Data Packet Pulses traversing the conduits
    const pulses: { mesh: THREE.Mesh; progress: number; curve: THREE.CatmullRomCurve3 }[] = [];
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x70f3be,
    });

    for (let i = 0; i < 6; i++) {
      const pMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), pulseMat);
      const cIndex = i % curves.length;
      pipelineGroup.add(pMesh);
      pulses.push({
        mesh: pMesh,
        progress: (i * 0.33) % 1,
        curve: curves[cIndex],
      });
    }

    // 8. Background Particle Field
    const partGeo = new THREE.BufferGeometry();
    const partCount = 120;
    const posArr = new Float32Array(partCount * 3);
    for (let p = 0; p < partCount * 3; p += 3) {
      posArr[p] = (Math.random() - 0.5) * 10;
      posArr[p + 1] = (Math.random() - 0.5) * 6;
      posArr[p + 2] = (Math.random() - 0.5) * 6;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x50d6a3,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    stateRef.current = {
      renderer,
      scene,
      camera,
      nodes: nodeMeshes,
      pulses,
    };

    // Mouse Interaction / Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const info = hit.userData?.detail || 'Node active in settlement pipeline.';
        onNodeSelect(info);

        // Flash node highlight
        if (hit.material instanceof THREE.MeshStandardMaterial) {
          hit.material.emissiveIntensity = 1.2;
          setTimeout(() => {
            if (hit.material instanceof THREE.MeshStandardMaterial) {
              hit.material.emissiveIntensity = 0.35;
            }
          }, 400);
        }
      }
    };

    const canvasElem = renderer.domElement;
    canvasElem.addEventListener('click', handlePointerDown);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Slow gentle pipeline sway/rotation
      if (isRotating) {
        pipelineGroup.rotation.y = Math.sin(time * 0.45) * 0.22;
        pipelineGroup.rotation.x = Math.cos(time * 0.3) * 0.12;
      }

      // Rotate individual node meshes
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += delta * (0.8 + idx * 0.2);
        mesh.rotation.x += delta * 0.4;
      });

      // Update pulses along curves
      pulses.forEach((p) => {
        p.progress += delta * 0.48;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      // Rotate particles
      particles.rotation.y = time * 0.04;

      renderer.render(scene, camera);
      stateRef.current.animId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('click', handlePointerDown);
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
      renderer.dispose();
      partGeo.dispose();
      partMat.dispose();
    };
  }, [activeView, isRotating, onNodeSelect]);

  return (
    <div className="relative w-full rounded-xl bg-[#191d18] overflow-hidden shadow-xl p-3 space-y-2 border border-[#3d4a43]/40">
      {/* Header Bar */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#70f3be] text-[16px]">hub</span>
          <span className="font-label-caps text-[#e0e4dc] uppercase tracking-wider font-semibold">
            Autonomous Settlement Pipeline
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#0b0f0b] p-0.5 rounded border border-[#3d4a43]/40">
            <button
              onClick={() => setActiveView('3d')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-0.5 transition-colors ${
                activeView === '3d'
                  ? 'bg-[#70f3be] text-[#003826] font-bold'
                  : 'text-[#bccac0] hover:text-[#e0e4dc]'
              }`}
            >
              <span className="material-symbols-outlined text-[11px]">view_in_ar</span>
              3D
            </button>
            <button
              onClick={() => setActiveView('diagram')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-0.5 transition-colors ${
                activeView === 'diagram'
                  ? 'bg-[#70f3be] text-[#003826] font-bold'
                  : 'text-[#bccac0] hover:text-[#e0e4dc]'
              }`}
            >
              <span className="material-symbols-outlined text-[11px]">account_tree</span>
              2D
            </button>
          </div>

          <span className="flex items-center gap-1 font-mono text-[11px] text-[#70f3be] bg-[#70f3be]/10 px-2 py-0.5 rounded border border-[#70f3be]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] animate-pulse"></span>
            <span>LIVE PIPELINE</span>
          </span>
        </div>
      </div>

      {/* 3D Canvas or 2D Diagram */}
      {activeView === '3d' ? (
        <div className="relative w-full h-56 rounded-lg bg-[#0b0f0b] overflow-hidden flex items-center justify-center select-none border border-[#272b26]">
          {/* Ambient Cybernetic Glow behind stage */}
          <div className="absolute w-44 h-44 rounded-full bg-[#70f3be]/5 blur-2xl pointer-events-none -top-10 -left-10"></div>
          <div className="absolute w-36 h-36 rounded-full bg-[#50d6a3]/5 blur-2xl pointer-events-none -bottom-8 -right-8"></div>

          {/* Mount Container */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Quick 3D Camera & Rotation Controls */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#101410]/80 backdrop-blur px-2 py-1 rounded border border-[#3d4a43]/50 z-20">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="text-[#bccac0] hover:text-[#70f3be] text-[11px] font-mono flex items-center gap-1"
              title="Toggle Auto Rotation"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isRotating ? 'sync' : 'sync_disabled'}
              </span>
              <span>{isRotating ? 'Spin' : 'Paused'}</span>
            </button>
          </div>

          {/* Node Legend Pills Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-20 pointer-events-none">
            <span className="font-label-caps text-[9px] bg-[#1d211c]/90 text-[#bccac0] px-1.5 py-0.5 rounded border border-[#3d4a43]/40">
              TAP NODES TO INSPECT
            </span>
          </div>
        </div>
      ) : (
        /* 2D Interactive Diagram View (matching User screenshot) */
        <div className="relative w-full h-56 rounded-lg bg-[#0b0f0b] overflow-hidden flex items-center justify-center select-none border border-[#272b26]">
          {/* Ambient Cybernetic Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-[#70f3be]/5 blur-2xl pointer-events-none -top-10 -left-10"></div>
          <div className="absolute w-36 h-36 rounded-full bg-[#70f3be]/5 blur-2xl pointer-events-none -bottom-8 -right-8"></div>

          {/* Connecting Synaptic SVG Lines with Animated Traveling Packets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow3d">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 50 112 C 100 65, 120 65, 175 65"
              fill="none"
              stroke="#3d4a43"
              strokeDasharray="3,3"
              strokeWidth="1.5"
            />
            <path
              d="M 175 65 C 230 65, 250 112, 300 112"
              fill="none"
              stroke="#3d4a43"
              strokeDasharray="3,3"
              strokeWidth="1.5"
            />
            <path
              d="M 50 112 C 100 160, 120 160, 175 160"
              fill="none"
              stroke="#3d4a43"
              strokeDasharray="3,3"
              strokeWidth="1.5"
            />
            <path
              d="M 175 160 C 230 160, 250 112, 300 112"
              fill="none"
              stroke="#3d4a43"
              strokeDasharray="3,3"
              strokeWidth="1.5"
            />

            {/* Traveling Data Packets */}
            <circle r="3" fill="#70f3be" filter="url(#glow3d)">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M 50 112 C 100 65, 120 65, 175 65 C 230 65, 250 112, 300 112 C 250 112, 230 160, 175 160 C 120 160, 100 112, 50 112"
              />
            </circle>
            <circle r="2" fill="#50d6a3" opacity="0.6">
              <animateMotion
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
                path="M 50 112 C 100 65, 120 65, 175 65 C 230 65, 250 112, 300 112"
              />
            </circle>
          </svg>

          {/* Interactive Nodes */}
          <div className="relative w-full h-full flex items-center justify-between px-4 sm:px-8 py-3">
            {/* Node 1: Agent Teena Core */}
            <div
              className="flex flex-col items-center group cursor-pointer transition-transform active:scale-95 z-10"
              onClick={() =>
                onNodeSelect(
                  'Agent Teena (Groq LLaMA-3.3 70B): Requesting SerpApi Grounding payload. Spend limit: 2.50 USDC. 4,844 tok/s.'
                )
              }
            >
              <div className="w-12 h-12 rounded-xl bg-[#272b26] border border-[#3d4a43] shadow-md flex items-center justify-center relative hover:border-[#70f3be] transition-colors">
                <span className="material-symbols-outlined text-[#70f3be] text-[22px]">psychology</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#70f3be] rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-[#003826] rounded-full"></span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#e0e4dc] mt-1 font-semibold">Agent Teena</span>
              <span className="font-label-caps text-[9px] text-[#bccac0]">AGENT #01</span>
            </div>

            {/* Center Node Cluster: EVM Safe + x402 Engine */}
            <div className="flex flex-col items-center justify-center gap-6 z-10">
              <div
                className="flex flex-col items-center cursor-pointer transition-transform active:scale-95"
                onClick={() =>
                  onNodeSelect(
                    'EVM Safe 0x71C4: Pre-signed allowance authorization for micropayment verification on Base Sepolia.'
                  )
                }
              >
                <div className="w-11 h-11 rounded-xl bg-[#70f3be]/10 border border-[#70f3be]/30 shadow-sm flex items-center justify-center hover:bg-[#70f3be]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#70f3be] text-[20px]">
                    account_balance_wallet
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#70f3be] font-medium mt-0.5">EVM Safe</span>
                <span className="font-label-caps text-[9px] text-[#bccac0]">0x71C4</span>
              </div>

              <div
                className="flex flex-col items-center cursor-pointer transition-transform active:scale-95"
                onClick={() =>
                  onNodeSelect(
                    'x402 Protocol: Instant 0.40 USDC micropayment handshake confirmed on Base Sepolia.'
                  )
                }
              >
                <div className="w-11 h-11 rounded-xl bg-[#272b26] border border-[#3d4a43] shadow-sm flex items-center justify-center hover:border-[#70f3be] transition-colors">
                  <span className="material-symbols-outlined text-[#50d6a3] text-[20px]">handshake</span>
                </div>
                <span className="font-mono text-[11px] text-[#c1e3d2] font-medium mt-0.5">x402 Pay</span>
                <span className="font-label-caps text-[9px] text-[#bccac0]">0.40 USDC</span>
              </div>
            </div>

            {/* Node 3: Paid API Settled */}
            <div
              className="flex flex-col items-center group cursor-pointer transition-transform active:scale-95 z-10"
              onClick={() =>
                onNodeSelect(
                  'Paid API & Base Sepolia: Block #18921043 finality reached with 0.00004 ETH gas fee. 0 Gas Leak.'
                )
              }
            >
              <div className="w-12 h-12 rounded-xl bg-[#272b26] border border-[#3d4a43] shadow-md flex items-center justify-center hover:border-[#70f3be] transition-colors">
                <span className="material-symbols-outlined text-[#70f3be] text-[22px]">api</span>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#50d6a3] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-[#003826]">check</span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#e0e4dc] mt-1 font-semibold">Paid API</span>
              <span className="font-label-caps text-[9px] text-[#70f3be]">SETTLED</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Node Feedback Ticker */}
      <div className="bg-[#272b26]/90 backdrop-blur-md px-2.5 py-1.5 rounded text-center border border-[#3d4a43]/50 transition-all duration-300">
        <span className="font-mono text-[11px] text-[#c0c9c1] flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] animate-pulse shrink-0"></span>
          <span className="truncate">{selectedNodeText}</span>
        </span>
      </div>

      {/* Telemetry Status Pills Footer */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <div className="flex items-center gap-1 bg-[#1d211c] border border-[#3d4a43]/40 px-2 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#70f3be] shadow-[0_0_4px_#70f3be]"></span>
          <span className="font-label-caps text-[10px] text-[#e0e4dc] font-medium">Agent Teena Active (Groq LLaMA-3.3 70B)</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1d211c] border border-[#3d4a43]/40 px-2 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#50d6a3]"></span>
          <span className="font-label-caps text-[10px] text-[#50d6a3] font-medium">Handshake Verified (0.40 USDC)</span>
        </div>
        <div className="flex items-center gap-1 bg-[#1d211c] border border-[#3d4a43]/40 px-2 py-1 rounded">
          <span className="material-symbols-outlined text-[11px] text-[#bccac0]">dataset</span>
          <span className="font-label-caps text-[10px] text-[#bccac0] font-medium">Base Sepolia #18921043</span>
        </div>
      </div>
    </div>
  );
};
