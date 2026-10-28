import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { HorrorAudio } from "./audio";

export type GamePhase = "title" | "playing" | "ended";

export type HudState = {
  phase: GamePhase;
  prompt: string | null;
  loading: boolean;
  loadProgress: number;
  error: string | null;
  loop: number;
  inTunnel: boolean;
  fade: number;
};

type Keys = Record<string, boolean>;
type Zone = "house" | "tunnel";
type CapMode = "south" | "north" | "both";

const EYE = 1.62;
const RADIUS = 0.2;
const WALK = 2.05;
const SPRINT = 3.35;
const JUMP_V = 3.35;
const GRAVITY = 16;
const MOUSE_SENS = 0.00205;
const SCAN_URL = "/scan.glb";
const CORRIDOR_URL = "/corridor.glb";
const ROOM_INSET = 0.95;
const TUNNEL_BASE = new THREE.Vector3(40, -18, 0);
const COPIES = 3;
const STRIDE = 8.3;
const Z0 = -4.184;
const SPINE_MIN = -2.62;
const SPINE_MAX = -1.18;
const HALL_X = -1.9;

const RIBBON = new Float32Array([-4.21,-1.01,-0.13,-4.13,-2.05,-0.05,-4.05,-2.85,-0.05,-3.97,-2.85,-0.05,-3.89,-2.85,-0.05,-3.81,-2.85,-0.05,-3.73,-2.85,-0.05,-3.65,-2.85,-0.05,-3.57,-2.85,-0.05,-3.49,-2.85,-0.05,-3.41,-2.85,-0.05,-3.33,-2.85,-0.05,-3.25,-2.85,-0.05,-3.17,-2.85,-0.05,-3.09,-2.85,-0.05,-3.01,-2.85,-0.05,-2.93,-2.85,-0.05,-2.85,-2.85,-0.05,-2.77,-2.85,-0.05,-2.69,-2.85,-1.25,-2.61,-2.77,-1.33,-2.53,-2.61,-1.33,-2.45,-2.61,-1.33,-2.37,-2.61,-1.33,-2.29,-2.61,-1.33,-2.21,-2.61,-1.33,-2.13,-2.61,-1.33,-2.05,-2.61,-1.33,-1.97,-2.61,-1.33,-1.89,-2.61,-1.33,-1.81,-2.61,-1.33,-1.73,-2.61,-1.33,-1.65,-2.61,-1.33,-1.57,-2.61,-1.33,-1.49,-2.61,-1.33,-1.41,-2.61,-1.33,-1.33,-2.61,-1.33,-1.25,-2.61,-1.33,-1.17,-2.61,-1.33,-1.09,-2.61,-1.33,-1.01,-2.61,-1.33,-0.93,-2.61,-1.33,-0.85,-2.61,-1.33,-0.77,-2.61,-1.33,-0.69,-2.61,-1.33,-0.61,-2.61,-1.33,-0.53,-2.61,-1.33,-0.45,-2.61,-1.33,-0.37,-2.61,-1.33,-0.29,-2.61,-1.33,-0.21,-2.61,-1.33,-0.13,-2.61,-1.33,-0.05,-2.61,-1.33,0.03,-2.61,-1.33,0.11,-2.53,-1.33,0.19,-2.61,-1.33,0.27,-2.61,2.11,0.35,-2.61,2.11,0.43,-2.61,2.11,0.51,-2.61,2.11,0.59,-2.61,2.19,0.67,-2.61,2.19,0.75,-2.45,2.19,0.83,-2.45,2.19,0.91,-2.45,2.19,0.99,-1.89,2.19,1.07,-2.45,2.19,1.15,-2.45,2.19,1.23,-2.53,2.19,1.31,-2.53,2.19,1.39,-2.53,2.19,1.47,-2.53,2.19,1.55,-2.53,2.19,1.63,-2.53,2.19,1.71,-2.53,2.19,1.79,-2.53,2.19,1.87,-2.53,2.19,1.95,-2.53,2.19,2.03,-2.53,0.43,2.11,-2.53,0.51,2.19,-2.53,2.19,2.27,-2.53,0.43,2.35,-2.53,0.43,2.43,-2.53,-1.17,2.51,-2.53,-1.25,2.59,-2.53,-1.25,2.67,-2.45,-1.25,2.75,-2.45,-1.25,2.83,-2.37,-1.25,2.91,-2.37,-1.25,2.99,-2.37,-1.25,3.07,-2.45,-1.25,3.15,-2.53,-1.25,3.23,-2.53,-1.25,3.31,-2.53,-1.25,3.39,-2.53,-1.25,3.47,-2.53,-1.25,3.55,-2.53,-1.25,3.63,-2.53,-1.25,3.71,-2.53,-1.25,3.79,-2.53,-1.25,3.87,-2.53,-1.25,3.95,-2.53,-1.25,4.03,-2.53,-1.25,4.11,-2.53,-1.33,4.19,-2.53,-1.25]);

export class GameEngine {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private bloom: UnrealBloomPass;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private running = false;
  private disposed = false;

  private audio = new HorrorAudio();
  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private moveDir = new THREE.Vector3();
  private right = new THREE.Vector3();

  private yaw = 0;
  private pitch = 0;
  private keys: Keys = {};
  private locked = false;
  private pointerBound = false;
  private dragging = false;
  private lookReady = false;
  private dragLast = { x: 0, y: 0 };

  private floorY = -1.63;
  private bounds = new THREE.Box3(
    new THREE.Vector3(-2.4, -1.7, -5.5),
    new THREE.Vector3(2.4, 1.7, 5.5),
  );
  private phase: GamePhase = "title";
  private playTime = 0;
  private footTimer = 0;
  private loading = true;
  private loadProgress = 0;
  private error: string | null = null;
  private prompt: string | null = null;
  private onHud: ((s: HudState) => void) | null = null;

  private zone: Zone = "house";
  private loop = 1;
  private fade = 0;
  private fading: "none" | "out" | "in" = "none";
  private pendingZone: Zone | null = null;

  private amb = new THREE.AmbientLight(0x1a1622, 0.14);
  private hemi = new THREE.HemisphereLight(0x2a241c, 0x050408, 0.16);
  private beam = new THREE.SpotLight(0xfff4e0, 0, 18, 0.32, 0.48, 2);
  private beamTarget = new THREE.Object3D();
  private vy = 0;
  private jumpY = 0;
  private onGround = true;
  private jumpHeld = false;
  private flickerT = 0;
  private roomCenter = new THREE.Vector3();
  private spawnPos = new THREE.Vector3();
  private spawnYaw = Math.PI;

  private houseDoor: THREE.Group | null = null;
  private houseLeaf: THREE.Group | null = null;
  private houseDoorOpen = 0;
  private houseDoorTarget = 0;
  private houseDoorPos = new THREE.Vector3();
  private houseDoorYaw = 0;

  private tunnel: THREE.Group | null = null;
  private tunnelDoorPos = new THREE.Vector3();
  private tunnelFloorY = -18;
  private tunnelSpawn = new THREE.Vector3();
  private tunnelYaw = 0;
  private bulbs: THREE.PointLight[] = [];
  private bulbMats: THREE.MeshStandardMaterial[] = [];
  private nextLoop = 1;
  private houseReady = false;
  private houseRadius = 4;
  private showcase = false;
  private showcaseYaw = 0.6;
  private showcasePitch = 0.32;
  private showcaseDrag = false;

  private touchLookId: number | null = null;
  private touchLookLast = { x: 0, y: 0 };
  private touchMove = { x: 0, y: 0 };

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.phase !== "playing") return;
    this.keys[e.code] = true;
    const k = e.key.toLowerCase();
    if (k === "w" || k === "z") this.keys["KeyW"] = true;
    if (k === "s") this.keys["KeyS"] = true;
    if (k === "a" || k === "q") this.keys["KeyA"] = true;
    if (k === "d") this.keys["KeyD"] = true;
    if (k === "e" || e.code === "KeyE") this.tryInteract();
    if (e.code === "Escape") this.unlock();
    else this.capturePointer();
    if (
      [
        "KeyW", "KeyA", "KeyS", "KeyD", "KeyE",
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "ShiftLeft", "ShiftRight", "Space",
      ].includes(e.code)
    ) {
      e.preventDefault();
    }
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
    const k = e.key.toLowerCase();
    if (k === "w" || k === "z") this.keys["KeyW"] = false;
    if (k === "s") this.keys["KeyS"] = false;
    if (k === "a" || k === "q") this.keys["KeyA"] = false;
    if (k === "d") this.keys["KeyD"] = false;
  };
  private onMouseMove = (e: MouseEvent) => {
    if (this.showcase && this.phase !== "playing") {
      if (this.locked) this.nudgeShowcase(e.movementX, e.movementY);
      return;
    }
    if (this.phase !== "playing") return;
    let dx = e.movementX;
    let dy = e.movementY;
    if (!dx && !dy) {
      if (!this.lookReady) {
        this.dragLast = { x: e.clientX, y: e.clientY };
        this.lookReady = true;
        return;
      }
      dx = e.clientX - this.dragLast.x;
      dy = e.clientY - this.dragLast.y;
    }
    this.dragLast = { x: e.clientX, y: e.clientY };
    this.lookReady = true;
    if (dx || dy) this.applyLook(-dx * MOUSE_SENS, -dy * MOUSE_SENS);
  };
  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.button !== 2) return;
    this.canvas.focus({ preventScroll: true });
    this.capturePointer();
  };
  private onPointerUp = () => {
    this.dragging = false;
  };
  private onPointerLockChange = () => {
    this.locked = document.pointerLockElement === this.canvas;
    this.lookReady = false;
    if (this.locked) this.dragging = false;
  };
  private onVisibility = () => {
    if (document.hidden) this.keys = {};
  };
  private onContextMenu = (e: Event) => {
    if (this.phase === "playing") e.preventDefault();
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.tabIndex = 0;
    this.canvas.style.outline = "none";
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.7;
    this.renderer.shadowMap.enabled = false;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x07060a);
    this.scene.fog = new THREE.FogExp2(0x07060a, 0.05);

    this.camera = new THREE.PerspectiveCamera(68, 1, 0.05, 80);
    this.camera.position.set(0, this.floorY + EYE, 2);
    this.beam.position.set(0, 0, 0);
    this.beamTarget.position.set(0, 0, -1);
    this.beam.target = this.beamTarget;
    this.camera.add(this.beam);
    this.camera.add(this.beamTarget);

    this.scene.add(this.amb);
    this.scene.add(this.hemi);
    this.scene.add(this.camera);

    this.buildTunnel();

    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(size, 0.04, 0.2, 0.96);
    this.bloom.enabled = false;
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.bindInput();
    this.resize();
  }

  tryJump() {
    if (this.phase !== "playing" || this.fading !== "none" || !this.onGround) return;
    this.vy = JUMP_V;
    this.onGround = false;
  }

  private applyLook(dyaw: number, dpitch: number) {
    this.yaw += dyaw;
    this.pitch += dpitch;
    this.pitch = Math.max(-1.25, Math.min(1.25, this.pitch));
  }

  setHudListener(fn: (s: HudState) => void) {
    this.onHud = fn;
    this.emitHud();
  }

  private emitHud() {
    this.onHud?.({
      phase: this.phase,
      prompt: this.prompt,
      loading: this.loading,
      loadProgress: this.loadProgress,
      error: this.error,
      loop: this.loop,
      inTunnel: this.zone === "tunnel",
      fade: this.fade,
    });
  }

  async load() {
    this.loading = true;
    this.emitHud();
    try {
      const loader = new GLTFLoader();
      const gltf = await new Promise<Awaited<ReturnType<typeof loader.loadAsync>>>((resolve, reject) => {
        loader.load(
          SCAN_URL,
          resolve,
          (ev) => {
            if (ev.total > 0) {
              this.loadProgress = Math.min(0.99, ev.loaded / ev.total);
              this.emitHud();
            }
          },
          reject,
        );
      });

      const root = gltf.scene;
      this.styleScan(root, false);
      this.scene.add(root);

      const box = new THREE.Box3().setFromObject(root);
      const span = box.getSize(this.tmp);
      this.houseRadius = Math.max(span.x, span.z) * 0.5;
      this.bounds = new THREE.Box3(
        new THREE.Vector3(box.min.x + ROOM_INSET, box.min.y, box.min.z + ROOM_INSET),
        new THREE.Vector3(box.max.x - ROOM_INSET, box.max.y, box.max.z - ROOM_INSET),
      );
      this.floorY = box.min.y;
      const center = box.getCenter(new THREE.Vector3());
      this.roomCenter.copy(center);
      // Geometric center of the shell is outside the room. Start on the interior floor.
      this.spawnPos.set(-1.05, this.floorY + EYE, 0.35);
      this.camera.position.copy(this.spawnPos);
      this.spawnYaw = 0.35;
      this.yaw = this.spawnYaw;

      this.placeHouseDoor(box);
      this.addHousePracticals(box);
      this.houseReady = true;
      await this.loadCorridor();

      this.loadProgress = 1;
      this.loading = false;
      this.emitHud();
    } catch (err) {
      console.error(err);
      this.error = "Impossibile caricare la scansione.";
      this.loading = false;
      this.emitHud();
    }
  }

  private placeHouseDoor(_box: THREE.Box3) {
    // Flat white wall on the west side of the salon, normal facing +X into the room.
    const pos = new THREE.Vector3(-3.34, -1.46, 1.15);
    const yaw = Math.PI / 2;
    this.houseDoorPos.copy(pos);
    this.houseDoorYaw = yaw;

    const root = new THREE.Group();
    root.position.copy(pos);
    root.rotation.y = yaw;

    const wood = new THREE.MeshStandardMaterial({ color: 0x4a3424, roughness: 0.72, metalness: 0.04 });
    const trim = new THREE.MeshStandardMaterial({ color: 0x2c2118, roughness: 0.66, metalness: 0.06 });
    const brass = new THREE.MeshStandardMaterial({ color: 0xb08a4a, roughness: 0.32, metalness: 0.72 });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.12, 2.22, 0.08), trim);
    frame.position.y = 1.11;
    root.add(frame);

    const leaf = new THREE.Group();
    leaf.position.set(-0.46, 0, 0.02);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.08, 0.045), wood);
    panel.position.set(0.45, 1.05, 0);
    leaf.add(panel);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), brass);
    knob.position.set(0.78, 1.02, 0.05);
    leaf.add(knob);
    root.add(leaf);
    this.houseLeaf = leaf;

    const sconce = new THREE.PointLight(0xffc48a, 0.85, 4.2, 2);
    sconce.position.set(0, 2.05, 0.35);
    root.add(sconce);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffe2b0,
      emissive: 0xffb060,
      emissiveIntensity: 1.1,
      roughness: 0.3,
    });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), bulbMat);
    bulb.position.copy(sconce.position);
    root.add(bulb);

    this.houseDoor = root;
    root.visible = !this.showcase;
    this.scene.add(root);
  }

  private addHousePracticals(box: THREE.Box3) {
    const c = box.getCenter(new THREE.Vector3());
    for (const p of [
      new THREE.Vector3(c.x - 1.2, this.floorY + 2.15, c.z),
      new THREE.Vector3(c.x + 1.1, this.floorY + 2.05, c.z - 1.4),
    ]) {
      const light = new THREE.PointLight(0xffd2a2, 0.42, 5.2, 2);
      light.position.copy(p);
      this.scene.add(light);
    }
  }

  private styleScan(root: THREE.Object3D, horror = false) {
    const mul = horror ? 0.67 : 0.88;
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        if (!m) continue;
        if ("map" in m && m.map) {
          const map = m.map as THREE.Texture;
          map.colorSpace = THREE.SRGBColorSpace;
          map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
          if (horror) this.shrinkMap(map);
        }
        if ("color" in m && m.color instanceof THREE.Color) {
          m.color.multiplyScalar(mul);
          if (horror) m.color.lerp(new THREE.Color(0x12060a), 0.12);
        }
        if ("roughness" in m) {
          const std = m as THREE.MeshStandardMaterial;
          std.roughness = Math.min(1, (std.roughness ?? 0.85) * 0.9 + (horror ? 0.18 : 0.04));
          std.metalness = Math.min(0.04, std.metalness ?? 0);
          std.envMapIntensity = horror ? 0.02 : 0.3;
        }
      }
    });
  }

  private shrinkMap(map: THREE.Texture) {
    try {
      const img = map.image as CanvasImageSource & { width?: number; height?: number };
      const w = img?.width ?? 0;
      const h = img?.height ?? 0;
      if (!w || w <= 1024) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = Math.max(1, Math.round(h * (1024 / w)));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      map.image = canvas;
      map.needsUpdate = true;
    } catch {
      /* keep the original scan texture */
    }
  }

  private openEnds(geo: THREE.BufferGeometry, matrix: THREE.Matrix4, mode: CapMode) {
    const pos = geo.getAttribute("position");
    const idx = geo.getIndex();
    if (!pos || !idx) return geo;
    const src = idx.array;
    const keep = new Uint32Array(src.length);
    let n = 0;
    const pa = new THREE.Vector3();
    const pb = new THREE.Vector3();
    const pc = new THREE.Vector3();
    for (let i = 0; i < src.length; i += 3) {
      const ia = src[i] ?? 0;
      const ib = src[i + 1] ?? 0;
      const ic = src[i + 2] ?? 0;
      pa.fromBufferAttribute(pos as THREE.BufferAttribute, ia).applyMatrix4(matrix);
      pb.fromBufferAttribute(pos as THREE.BufferAttribute, ib).applyMatrix4(matrix);
      pc.fromBufferAttribute(pos as THREE.BufferAttribute, ic).applyMatrix4(matrix);
      const cz = (pa.z + pb.z + pc.z) / 3;
      const dropSouth = (mode === "south" || mode === "both") && cz < -3.45;
      const dropNorth = (mode === "north" || mode === "both") && cz > 3.45;
      if (dropSouth || dropNorth) continue;
      keep[n++] = ia;
      keep[n++] = ib;
      keep[n++] = ic;
    }
    const g = new THREE.BufferGeometry();
    for (const name of Object.keys(geo.attributes)) {
      const attr = geo.getAttribute(name);
      if (attr) g.setAttribute(name, attr);
    }
    g.setIndex(new THREE.BufferAttribute(keep.subarray(0, n), 1));
    return g;
  }

  private async loadCorridor() {
    if (!this.tunnel) return;
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(CORRIDOR_URL);
    const model = gltf.scene;
    this.styleScan(model, true);
    model.updateMatrixWorld(true);

    const parts: { geo: THREE.BufferGeometry; mat: THREE.Material | THREE.Material[]; matrix: THREE.Matrix4 }[] = [];
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      parts.push({ geo: mesh.geometry, mat: mesh.material, matrix: mesh.matrixWorld.clone() });
    });

    for (let i = 0; i < COPIES; i++) {
      const mode: CapMode = i === 0 ? "south" : i === COPIES - 1 ? "north" : "both";
      const piece = new THREE.Group();
      piece.position.z = -i * STRIDE;
      for (const part of parts) {
        const mesh = new THREE.Mesh(this.openEnds(part.geo, part.matrix, mode), part.mat);
        mesh.matrix.copy(part.matrix);
        mesh.matrixAutoUpdate = false;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        piece.add(mesh);
      }
      this.tunnel.add(piece);
    }
    this.stampJunctions(parts);
    this.tunnel.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(this.tunnel);
    this.tunnelFloorY = box.min.y;

    // Arrive in the doorway hole between the south room and the hall, looking at it.
    this.tunnelSpawn.set(TUNNEL_BASE.x + HALL_X, this.tunnelFloorY + EYE, TUNNEL_BASE.z - 3.38);
    this.tunnelYaw = Math.PI;
    const exitZ = -2.92 - (COPIES - 1) * STRIDE;
    this.tunnelDoorPos.set(TUNNEL_BASE.x + HALL_X, this.tunnelFloorY + EYE * 0.45, TUNNEL_BASE.z + exitZ);

    const bulbZs = [-2.2, 0.2, 2.6];
    for (let i = 0; i < COPIES; i++) {
      for (const z of bulbZs) {
        const light = new THREE.PointLight(0x6a3418, 0.6, 10, 2);
        light.position.set(HALL_X, 0.55, z - i * STRIDE);
        this.tunnel.add(light);
        this.bulbs.push(light);
      }
    }
  }

  private stampJunctions(parts: { geo: THREE.BufferGeometry; mat: THREE.Material | THREE.Material[]; matrix: THREE.Matrix4 }[]) {
    if (!this.tunnel) return;
    // Wide south room (z≈-3.7) through the real doorway into the narrow hall (z≈-1.9).
    // Mirrored along Z so the wide end meets the wide cut and the hall meets the hall.
    const zLo = -3.75;
    const zHi = -1.9;
    const c = -6.95;
    for (let i = 0; i < COPIES - 1; i++) {
      const wrap = new THREE.Group();
      wrap.position.z = -i * STRIDE;
      for (const part of parts) {
        const geo = this.cloneStamp(part.geo, part.matrix, zLo, zHi, c);
        if (!geo) continue;
        const srcMat = Array.isArray(part.mat) ? part.mat[0] : part.mat;
        const mat = srcMat ? srcMat.clone() : new THREE.MeshStandardMaterial({ color: 0x33302c });
        if ("side" in mat) (mat as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        wrap.add(mesh);
      }
      // Real hall walls and ceiling, repeated over the join so the black gap on the side is closed.
      for (const dz of [-8.05, -7.15, -6.25]) {
        for (const part of parts) {
          const geo = this.cloneCover(part.geo, part.matrix, 2.62, 3.58, dz);
          if (!geo) continue;
          const srcMat = Array.isArray(part.mat) ? part.mat[0] : part.mat;
          const mat = srcMat ? srcMat.clone() : new THREE.MeshStandardMaterial({ color: 0x33302c });
          if ("side" in mat) (mat as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
          const mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          wrap.add(mesh);
        }
      }
      const seal = new THREE.MeshStandardMaterial({
        color: 0x3a342c,
        roughness: 0.96,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      const left = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 3.35), seal);
      left.rotation.y = Math.PI / 2;
      left.position.set(-3.02, 0.02, -4.15);
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 2.9), seal);
      ceil.rotation.x = Math.PI / 2;
      ceil.position.set(-1.55, 1.66, -4.15);
      wrap.add(left, ceil);
      this.tunnel.add(wrap);
    }
  }

  private cloneStamp(geo: THREE.BufferGeometry, matrix: THREE.Matrix4, zLo: number, zHi: number, c: number) {
    const pos = geo.getAttribute("position");
    const uv = geo.getAttribute("uv");
    const idx = geo.getIndex();
    if (!pos || !idx) return null;
    const src = idx.array;
    const pa = new THREE.Vector3();
    const pb = new THREE.Vector3();
    const pc = new THREE.Vector3();
    const outP: number[] = [];
    const outU: number[] = [];
    const read = (v: THREE.Vector3, i: number) => v.fromBufferAttribute(pos as THREE.BufferAttribute, i).applyMatrix4(matrix);
    for (let i = 0; i < src.length; i += 3) {
      const ia = src[i] ?? 0;
      const ib = src[i + 1] ?? 0;
      const ic = src[i + 2] ?? 0;
      read(pa, ia);
      read(pb, ib);
      read(pc, ic);
      const cz = (pa.z + pb.z + pc.z) / 3;
      if (cz < zLo || cz > zHi) continue;
      // z' = c - z mirrors the slice; swap winding so the faces stay outward.
      outP.push(pa.x, pa.y, c - pa.z, pc.x, pc.y, c - pc.z, pb.x, pb.y, c - pb.z);
      if (uv) {
        outU.push(uv.getX(ia), uv.getY(ia), uv.getX(ic), uv.getY(ic), uv.getX(ib), uv.getY(ib));
      }
    }
    if (outP.length === 0) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(outP, 3));
    if (outU.length) g.setAttribute("uv", new THREE.Float32BufferAttribute(outU, 2));
    g.computeVertexNormals();
    return g;
  }

  private cloneCover(geo: THREE.BufferGeometry, matrix: THREE.Matrix4, zLo: number, zHi: number, dz: number) {
    const pos = geo.getAttribute("position");
    const uv = geo.getAttribute("uv");
    const idx = geo.getIndex();
    if (!pos || !idx) return null;
    const src = idx.array;
    const pa = new THREE.Vector3();
    const pb = new THREE.Vector3();
    const pc = new THREE.Vector3();
    const outP: number[] = [];
    const outU: number[] = [];
    const read = (v: THREE.Vector3, i: number) => v.fromBufferAttribute(pos as THREE.BufferAttribute, i).applyMatrix4(matrix);
    const push = (v: THREE.Vector3, i: number) => {
      let x = v.x;
      let y = v.y;
      if (x < -2.15) x -= 0.08;
      if (x > -1.4) x += 0.08;
      if (y > 1.0) y += 0.05;
      outP.push(x, y, v.z + dz);
      if (uv) outU.push(uv.getX(i), uv.getY(i));
    };
    for (let i = 0; i < src.length; i += 3) {
      const ia = src[i] ?? 0;
      const ib = src[i + 1] ?? 0;
      const ic = src[i + 2] ?? 0;
      read(pa, ia);
      read(pb, ib);
      read(pc, ic);
      const cz = (pa.z + pb.z + pc.z) / 3;
      if (cz < zLo || cz > zHi) continue;
      const cx = (pa.x + pb.x + pc.x) / 3;
      const cy = (pa.y + pb.y + pc.y) / 3;
      const wall = cx < -2.2 || cx > -1.42 || cy > 1.02;
      if (!wall) continue;
      push(pa, ia);
      push(pb, ib);
      push(pc, ic);
    }
    if (outP.length === 0) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(outP, 3));
    if (outU.length) g.setAttribute("uv", new THREE.Float32BufferAttribute(outU, 2));
    g.computeVertexNormals();
    return g;
  }

  private buildTunnel() {
    const g = new THREE.Group();
    g.position.copy(TUNNEL_BASE);
    this.tunnel = g;
    this.scene.add(g);
  }

  private bindInput() {
    window.addEventListener("keydown", this.onKeyDown, { capture: true });
    window.addEventListener("keyup", this.onKeyUp, { capture: true });
    document.addEventListener("pointerlockchange", this.onPointerLockChange);
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerUp);
    this.canvas.addEventListener("contextmenu", this.onContextMenu);
    this.pointerBound = true;
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.bloom.setSize(w, h);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  async startPlay() {
    if (this.loading || this.error) return;
    try {
      await this.audio.unlock();
    } catch {
      /* ambient can fail without a gesture; the game still starts */
    }
    this.phase = "playing";
    this.playTime = 0;
    this.loop = 1;
    this.zone = "house";
    this.keys = {};
    this.fade = 0;
    this.fading = "none";
    this.lookReady = false;
    this.houseDoorOpen = 0;
    this.houseDoorTarget = 0;
    this.nextLoop = 1;
    this.resetToHouse();
    this.emitHud();
    this.canvas.focus({ preventScroll: true });
    this.lock();
  }

  private resetToHouse() {
    this.zone = "house";
    this.camera.position.copy(this.spawnPos);
    this.yaw = this.spawnYaw;
    this.pitch = 0;
    this.scene.fog = new THREE.FogExp2(0x07060a, 0.045);
    this.scene.background = new THREE.Color(0x07060a);
    this.renderer.toneMappingExposure = 0.68;
    this.amb.intensity = 0.14;
    this.hemi.intensity = 0.16;
    this.jumpY = 0;
    this.vy = 0;
    this.onGround = true;
    if (this.houseLeaf) this.houseLeaf.rotation.y = 0;
    this.houseDoorOpen = 0;
    this.houseDoorTarget = 0;
    this.syncBeam();
  }

  private applyTunnelMood() {
    const moods = [
      { light: 0x8a4a28, emissive: 0x4a220e, fog: 0x07040a, exp: 2.15, density: 0.04 },
      { light: 0x0e5a28, emissive: 0x063018, fog: 0x020a06, exp: 1.7, density: 0.055 },
      { light: 0x7a1016, emissive: 0x3a060a, fog: 0x100206, exp: 1.33, density: 0.075 },
    ] as const;
    const mood = moods[Math.min(2, Math.max(0, this.loop - 1))]!;
    this.scene.fog = new THREE.FogExp2(mood.fog, mood.density);
    this.scene.background = new THREE.Color(mood.fog);
    this.renderer.toneMappingExposure = mood.exp;
    this.amb.intensity = 1.05;
    this.hemi.intensity = 0.65;
    for (const b of this.bulbs) b.color.setHex(mood.light);
    for (const m of this.bulbMats) {
      m.emissive.setHex(mood.emissive);
      m.emissiveIntensity = this.loop >= 3 ? 0.35 : 0.7;
    }
    this.syncBeam();
  }

  private syncBeam() {
    const playing = this.phase === "playing";
    this.beam.intensity = !playing ? 0 : this.zone === "house" ? 5 : 12;
    this.beam.color.setHex(this.zone === "house" ? 0xffe6c8 : 0xfff6e4);
    this.beam.angle = this.zone === "house" ? 0.38 : 0.3;
  }

  private enterTunnel() {
    this.zone = "tunnel";
    this.loop = this.nextLoop;
    this.camera.position.copy(this.tunnelSpawn);
    this.yaw = this.tunnelYaw;
    this.pitch = 0;
    this.jumpY = 0;
    this.vy = 0;
    this.onGround = true;
    this.applyTunnelMood();
  }

  capturePointer() {
    if (this.locked || document.pointerLockElement === this.canvas) return;
    const req = this.canvas.requestPointerLock?.bind(this.canvas);
    if (!req) return;
    try {
      const pending = req({ unadjustedMovement: true });
      void Promise.resolve(pending).catch(() => {
        try { void Promise.resolve(req()).catch(() => {}); } catch { /* */ }
      });
    } catch {
      try { req(); } catch { /* */ }
    }
  }

  lock() {
    if (this.phase !== "playing") return;
    this.capturePointer();
  }

  unlock() {
    if (document.pointerLockElement) document.exitPointerLock();
    this.dragging = false;
  }

  restart() {
    this.phase = "title";
    this.playTime = 0;
    this.loop = 1;
    this.prompt = null;
    this.fade = 0;
    this.fading = "none";
    this.lookReady = false;
    this.nextLoop = 1;
    this.keys = {};
    this.unlock();
    this.resetToHouse();
    this.emitHud();
  }

  setTouchMove(x: number, y: number) {
    this.touchMove.x = x;
    this.touchMove.y = y;
  }
  beginTouchLook(id: number, x: number, y: number) {
    this.touchLookId = id;
    this.touchLookLast = { x, y };
  }
  moveTouchLook(id: number, x: number, y: number) {
    if (id !== this.touchLookId) return;
    const dx = x - this.touchLookLast.x;
    const dy = y - this.touchLookLast.y;
    this.touchLookLast = { x, y };
    if (this.phase !== "playing") return;
    this.applyLook(-dx * 0.005, -dy * 0.005);
  }
  endTouchLook(id: number) {
    if (id === this.touchLookId) this.touchLookId = null;
  }

  tryInteract() {
    if (this.phase !== "playing" || this.fading !== "none") return;
    if (this.zone === "house") {
      if (this.camera.position.distanceTo(this.houseDoorPos) < 1.75) {
        this.houseDoorTarget = 1;
        this.nextLoop = 1;
        this.beginFade("tunnel");
      }
      return;
    }
    if (this.camera.position.distanceTo(this.tunnelDoorPos) < 1.85) {
      this.nextLoop = this.loop + 1;
      this.beginFade("tunnel");
    }
  }

  private beginFade(to: Zone) {
    if (this.fading !== "none") return;
    this.fading = "out";
    this.pendingZone = to;
  }

  private getForward() {
    return this.tmp.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }
  private getRight() {
    return this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
  }

  setShowcase(on: boolean) {
    this.showcase = on;
    if (this.houseDoor) this.houseDoor.visible = !on;
    if (!on) {
      this.showcaseDrag = false;
      if (this.phase !== "playing") {
        this.renderer.toneMappingExposure = 0.68;
        this.amb.intensity = 0.14;
        this.hemi.intensity = 0.16;
        this.scene.fog = new THREE.FogExp2(0x07060a, 0.045);
      }
      return;
    }
    this.showcaseYaw = 0.9;
    this.showcasePitch = 0.38;
    this.renderer.toneMappingExposure = 1.7;
    this.amb.intensity = 0.85;
    this.hemi.intensity = 0.62;
    this.beam.intensity = 0;
    this.scene.fog = new THREE.FogExp2(0x0c0a10, 0.012);
    if (this.houseDoor) this.houseDoor.visible = false;
  }

  nudgeShowcase(dx: number, dy: number) {
    this.showcaseDrag = true;
    this.showcaseYaw -= dx * 0.008;
    this.showcasePitch = THREE.MathUtils.clamp(this.showcasePitch + dy * 0.0045, 0.02, 0.85);
  }

  releaseShowcase() {
    this.showcaseDrag = false;
  }

  private updateShowcase(dt: number) {
    if (!this.houseReady) return;
    if (!this.showcaseDrag) this.showcaseYaw += dt * ((Math.PI * 2) / 14);
    const center = this.roomCenter.clone();
    center.y = this.floorY + 1.35;
    const dist = Math.max(8, this.houseRadius * 1.25);
    const pitch = this.showcasePitch;
    this.camera.position.set(
      center.x + Math.sin(this.showcaseYaw) * Math.cos(pitch) * dist,
      center.y + Math.sin(pitch) * dist * 0.8,
      center.z + Math.cos(this.showcaseYaw) * Math.cos(pitch) * dist,
    );
    this.camera.lookAt(center);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this.renderer.setAnimationLoop(() => this.frame());
  }

  private frame() {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.flickerT += dt;
    if (this.showcase) this.updateShowcase(dt);
    else this.updateFlicker();
    if (this.phase === "playing" && !this.showcase) this.updatePlaying(dt);
    this.updateFade(dt);
    if (!this.showcase) {
      this.camera.rotation.order = "YXZ";
      this.camera.rotation.x = this.pitch;
      this.camera.rotation.y = this.yaw;
      this.camera.rotation.z = 0;
      this.syncBeam();
    }
    this.composer.render();
  }

  private updateFlicker() {
    if (this.zone !== "tunnel") return;
    const loop3 = this.loop >= 3;
    const wobble = 1 + Math.sin(this.flickerT * (loop3 ? 14 : 2.2)) * (loop3 ? 0.08 : 0.03);
    this.renderer.toneMappingExposure = (this.loop >= 3 ? 1.33 : this.loop === 2 ? 1.7 : 2.15) * wobble;
    for (let i = 0; i < this.bulbs.length; i++) {
      const own = loop3
        ? (Math.sin(this.flickerT * (9 + i) + i) > 0.2 ? 1 : 0.25)
        : 0.75 + Math.sin(this.flickerT * (1.2 + i * 0.15) + i) * 0.2;
      this.bulbs[i]!.intensity = (loop3 ? 2.9 : 2.5) * own;
    }
    const glow = loop3 ? (Math.random() < 0.15 ? 0.08 : 0.7) : 0.55;
    for (const m of this.bulbMats) m.emissiveIntensity = glow;
  }

  private updateJump(dt: number) {
    const space = !!this.keys["Space"];
    if (space && !this.jumpHeld) this.tryJump();
    this.jumpHeld = space;
    if (this.onGround) return;
    this.vy -= GRAVITY * dt;
    this.jumpY += this.vy * dt;
    if (this.jumpY <= 0) {
      this.jumpY = 0;
      this.vy = 0;
      this.onGround = true;
    }
  }

  private updatePlaying(dt: number) {
    this.playTime += dt;
    this.audio.setTension(this.zone === "tunnel" ? 0.4 + this.loop * 0.08 : 0.2);
    this.houseDoorOpen = THREE.MathUtils.damp(this.houseDoorOpen, this.houseDoorTarget, 6, dt);
    if (this.houseLeaf) this.houseLeaf.rotation.y = -this.houseDoorOpen * 1.45;

    const forward = this.getForward().clone();
    const right = this.getRight().clone();
    this.moveDir.set(0, 0, 0);
    if (this.keys["KeyW"] || this.keys["ArrowUp"]) this.moveDir.add(forward);
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) this.moveDir.sub(forward);
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) this.moveDir.add(right);
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) this.moveDir.sub(right);
    if (Math.abs(this.touchMove.y) > 0.08 || Math.abs(this.touchMove.x) > 0.08) {
      this.moveDir.addScaledVector(forward, -this.touchMove.y);
      this.moveDir.addScaledVector(right, this.touchMove.x);
    }
    const sprint = this.keys["ShiftLeft"] || this.keys["ShiftRight"];
    const speed = sprint ? SPRINT : WALK;
    this.updateJump(dt);
    const moving = this.moveDir.lengthSq() > 0 && this.fading === "none";
    const bob = moving ? Math.sin(this.playTime * (sprint ? 12 : 9)) * 0.016 : 0;
    const targetY = this.currentFloor() + EYE + bob + this.jumpY;
    if (moving) {
      this.moveDir.normalize();
      this.tryMove(this.moveDir.x * speed * dt, this.moveDir.z * speed * dt);
      this.footTimer += dt * (sprint ? 1.55 : 1);
      if (this.footTimer > 0.48) this.footTimer = 0;
      this.camera.position.y = targetY;
    } else if (!this.onGround) {
      this.camera.position.y = targetY;
    } else {
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetY, 8, dt);
    }
    if (this.zone === "house") this.clampHouse();
    else this.clampTunnel();

    this.updatePrompt();
  }

  private updatePrompt() {
    let next: string | null = null;
    if (this.fading === "none" && this.phase === "playing") {
      if (this.zone === "house") {
        if (this.camera.position.distanceTo(this.houseDoorPos) < 1.75) next = "(E entra)";
      } else if (this.camera.position.distanceTo(this.tunnelDoorPos) < 1.9) {
        next = "(E entra)";
      }
    }
    if (next !== this.prompt) {
      this.prompt = next;
      this.emitHud();
    }
  }

  private updateFade(dt: number) {
    if (this.fading === "out") {
      this.fade = Math.min(1, this.fade + dt * 1.8);
      if (this.fade >= 1 && this.pendingZone) {
        if (this.pendingZone === "tunnel") this.enterTunnel();
        else this.resetToHouse();
        this.pendingZone = null;
        this.fading = "in";
        this.emitHud();
      }
    } else if (this.fading === "in") {
      this.fade = Math.max(0, this.fade - dt * 1.15);
      if (this.fade <= 0) this.fading = "none";
    }
    if (this.phase === "playing" && (this.fading !== "none" || this.fade > 0)) this.emitHud();
  }

  private currentFloor() {
    return this.zone === "tunnel" ? this.tunnelFloorY : this.floorY;
  }

  private clampHouse() {
    const b = this.bounds;
    const pad = RADIUS + 0.02;
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, b.min.x + pad, b.max.x - pad);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, b.min.z + pad, b.max.z - pad);
  }

  private unmap(worldZ: number) {
    const z = worldZ - TUNNEL_BASE.z;
    let shifted = z - Z0;
    shifted = ((shifted % STRIDE) + STRIDE) % STRIDE;
    const canonical = Z0 + shifted;
    const copy = Math.min(COPIES - 1, Math.max(0, Math.round((canonical - z) / STRIDE)));
    return { z, canonical, copy };
  }

  private sampleRibbon(canonicalZ: number) {
    const r = RIBBON;
    const last = r.length - 3;
    let minX = r[1] ?? SPINE_MIN;
    let maxX = r[2] ?? SPINE_MAX;
    if (canonicalZ <= (r[0] ?? 0)) {
      minX = r[1] ?? minX;
      maxX = r[2] ?? maxX;
    } else if (canonicalZ >= (r[last] ?? 0)) {
      minX = r[last + 1] ?? minX;
      maxX = r[last + 2] ?? maxX;
    } else {
      for (let i = 0; i < last; i += 3) {
        const z0 = r[i] ?? 0;
        const z1 = r[i + 3] ?? z0;
        if (canonicalZ < z0 || canonicalZ > z1) continue;
        const t = z1 === z0 ? 0 : (canonicalZ - z0) / (z1 - z0);
        minX = (r[i + 1] ?? minX) + ((r[i + 4] ?? minX) - (r[i + 1] ?? minX)) * t;
        maxX = (r[i + 2] ?? maxX) + ((r[i + 5] ?? maxX) - (r[i + 2] ?? maxX)) * t;
        break;
      }
    }
    const junction = canonicalZ < -3.15 || canonicalZ > 3.32;
    if (junction) {
      minX = HALL_X - 0.58;
      maxX = HALL_X + 0.58;
    } else {
      minX = Math.max(minX, SPINE_MIN);
      maxX = Math.min(maxX, SPINE_MAX);
      if (maxX - minX < 0.95) {
        minX = Math.min(minX, HALL_X - 0.5);
        maxX = Math.max(maxX, HALL_X + 0.5);
      }
    }
    const inset = junction ? 0.02 : 0.1;
    minX += inset;
    maxX -= inset;
    if (maxX - minX < 0.36) {
      const mid = (minX + maxX) * 0.5;
      minX = mid - 0.18;
      maxX = mid + 0.18;
    }
    return { minX, maxX };
  }

  private clampTunnel() {
    let worldZ = this.camera.position.z;
    let mapped = this.unmap(worldZ);
    if (mapped.copy === 0 && mapped.canonical > 3.7) {
      worldZ = TUNNEL_BASE.z + 3.7;
      this.camera.position.z = worldZ;
      mapped = this.unmap(worldZ);
    }
    if (mapped.copy === COPIES - 1 && mapped.canonical < -3.62) {
      worldZ = TUNNEL_BASE.z + (-3.62 - (COPIES - 1) * STRIDE);
      this.camera.position.z = worldZ;
      mapped = this.unmap(worldZ);
    }
    const lim = this.sampleRibbon(mapped.canonical);
    const x = this.camera.position.x - TUNNEL_BASE.x;
    const cx = THREE.MathUtils.clamp(x, lim.minX + RADIUS, lim.maxX - RADIUS);
    this.camera.position.x = TUNNEL_BASE.x + cx;
  }

  private tryMove(dx: number, dz: number) {
    const pos = this.camera.position;
    if (!this.blocked(pos.x + dx, pos.z + dz)) {
      pos.x += dx;
      pos.z += dz;
      return;
    }
    if (Math.abs(dx) > 1e-6 && !this.blocked(pos.x + dx, pos.z)) pos.x += dx;
    if (Math.abs(dz) > 1e-6 && !this.blocked(pos.x, pos.z + dz)) pos.z += dz;
  }

  private blocked(x: number, z: number) {
    if (this.zone === "tunnel") {
      const mapped = this.unmap(z);
      if (mapped.copy === 0 && mapped.canonical > 3.72) return true;
      if (mapped.copy === COPIES - 1 && mapped.canonical < -3.64) return true;
      const lim = this.sampleRibbon(mapped.canonical);
      const lx = x - TUNNEL_BASE.x;
      if (lx < lim.minX + RADIUS || lx > lim.maxX - RADIUS) return true;
      return false;
    }
    const b = this.bounds;
    const pad = RADIUS;
    if (x < b.min.x + pad || x > b.max.x - pad || z < b.min.z + pad || z > b.max.z - pad) return true;
    if (this.houseDoorOpen < 0.45 && this.houseDoor) {
      const local = this.tmp2.set(x, 0, z).sub(this.houseDoorPos);
      const c = Math.cos(-this.houseDoorYaw);
      const s = Math.sin(-this.houseDoorYaw);
      const lx = local.x * c - local.z * s;
      const lz = local.x * s + local.z * c;
      if (Math.abs(lx) < 0.55 && Math.abs(lz) < 0.28) return true;
    }
    return false;
  }

  getControlsProbe() {
    return {
      getYaw: () => this.yaw,
      getPosition: () => this.camera.position.toArray() as [number, number, number],
      getPhase: () => this.phase,
      getLoop: () => this.loop,
      getZone: () => this.zone,
      setKeys: (codes: string[]) => {
        this.keys = {};
        for (const c of codes) this.keys[c] = true;
      },
      getDoorPos: () => this.houseDoorPos.toArray() as [number, number, number],
      goToDoor: () => {
        const toCenter = this.roomCenter.clone().sub(this.houseDoorPos).setY(0);
        if (toCenter.lengthSq() < 0.01) toCenter.set(0, 0, -1);
        toCenter.normalize();
        const stand = this.houseDoorPos.clone().addScaledVector(toCenter, 1.15);
        this.camera.position.set(stand.x, this.floorY + EYE, stand.z);
        const dx = this.houseDoorPos.x - stand.x;
        const dz = this.houseDoorPos.z - stand.z;
        this.yaw = Math.atan2(-dx, -dz);
      },
      openDoor: () => this.tryInteract(),
      forceEnter: () => {
        this.nextLoop = Math.max(1, this.loop);
        this.beginFade("tunnel");
      },
      forceLoop: () => {
        this.nextLoop = this.loop + 1;
        this.beginFade("tunnel");
      },
    };
  }

  dispose() {
    this.disposed = true;
    this.running = false;
    this.renderer.setAnimationLoop(null);
    window.removeEventListener("keydown", this.onKeyDown, { capture: true } as EventListenerOptions);
    window.removeEventListener("keyup", this.onKeyUp, { capture: true } as EventListenerOptions);
    document.removeEventListener("pointerlockchange", this.onPointerLockChange);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("mousemove", this.onMouseMove);
    if (this.pointerBound) {
      this.canvas.removeEventListener("pointerdown", this.onPointerDown);
      this.canvas.removeEventListener("pointerup", this.onPointerUp);
      this.canvas.removeEventListener("pointercancel", this.onPointerUp);
      this.canvas.removeEventListener("contextmenu", this.onContextMenu);
    }
    this.unlock();
    this.audio.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}

declare global {
  interface Window {
    __controlsTest?: ReturnType<GameEngine["getControlsProbe"]>;
    __horrorGame?: GameEngine;
  }
}
