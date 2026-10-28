import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as SpotLight, C as Object3D, D as SRGBColorSpace, E as PointLight, M as Vector2, N as Vector3, O as Scene, P as WebGLRenderer, S as MeshStandardMaterial, T as PlaneGeometry, _ as FogExp2, a as GLTFLoader, b as MathUtils, c as BoxGeometry, d as CapsuleGeometry, f as Clock, g as Float32BufferAttribute, h as DirectionalLight, i as EffectComposer, j as TorusGeometry, k as SphereGeometry, l as BufferAttribute, m as CylinderGeometry, n as UnrealBloomPass, o as AmbientLight, p as Color, r as RenderPass, s as Box3, t as OutputPass, u as BufferGeometry, v as Group, w as PerspectiveCamera, x as Mesh, y as HemisphereLight } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BQ4F4d1c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HorrorAudio = class {
	ctx = null;
	started = false;
	tension = 0;
	async unlock() {
		if (this.started) return;
		const Ctx = window.AudioContext || window.webkitAudioContext;
		if (!Ctx) return;
		const ctx = new Ctx();
		this.ctx = ctx;
		this.started = true;
		await ctx.resume().catch(() => {});
		this.startAmbience();
		this.startScore();
	}
	startAmbience() {
		const ctx = this.ctx;
		if (!ctx) return;
		const len = ctx.sampleRate * 3;
		const buf = ctx.createBuffer(1, len, ctx.sampleRate);
		const data = buf.getChannelData(0);
		let brown = 0;
		for (let i = 0; i < len; i++) {
			const white = Math.random() * 2 - 1;
			brown = brown * .985 + white * .015;
			data[i] = brown * 4.2;
		}
		const noise = ctx.createBufferSource();
		noise.buffer = buf;
		noise.loop = true;
		const low = ctx.createBiquadFilter();
		low.type = "lowpass";
		low.frequency.value = 280;
		const air = ctx.createBiquadFilter();
		air.type = "highpass";
		air.frequency.value = 40;
		const gain = ctx.createGain();
		gain.gain.value = .22;
		noise.connect(low);
		low.connect(air);
		air.connect(gain);
		gain.connect(ctx.destination);
		noise.start();
		const hum = ctx.createOscillator();
		hum.type = "sine";
		hum.frequency.value = 46;
		const humGain = ctx.createGain();
		humGain.gain.value = .07;
		hum.connect(humGain);
		humGain.connect(ctx.destination);
		hum.start();
		const hum2 = ctx.createOscillator();
		hum2.type = "sine";
		hum2.frequency.value = 48.4;
		const hum2Gain = ctx.createGain();
		hum2Gain.gain.value = .035;
		hum2.connect(hum2Gain);
		hum2Gain.connect(ctx.destination);
		hum2.start();
	}
	startScore() {
		const ctx = this.ctx;
		if (!ctx) return;
		for (const [freq, vol] of [
			[65.4, .02],
			[98, .014],
			[155.6, .008]
		]) {
			const osc = ctx.createOscillator();
			osc.type = "triangle";
			osc.frequency.value = freq;
			const filter = ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = 420;
			const gain = ctx.createGain();
			gain.gain.value = vol;
			osc.connect(filter);
			filter.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
		}
	}
	setTension(n) {
		this.tension = n;
	}
	setDarkRoom(_on) {}
	doorAppear() {}
	doorCreak() {}
	footstep() {}
	scream(_close) {}
	cry() {}
	terrorVoice() {}
	jumpscare() {}
	dispose() {
		const ctx = this.ctx;
		this.ctx = null;
		this.started = false;
		if (ctx) ctx.close().catch(() => {});
	}
};
var EYE = 1.62;
var RADIUS = .2;
var WALK = 2.05;
var SPRINT = 3.35;
var JUMP_V = 3.35;
var GRAVITY = 16;
var MOUSE_SENS = .00205;
var DRAG_SENS = .0042;
var SCAN_URL = "/scan.glb";
var CORRIDOR_URL = "/corridor.glb";
var ROOM_INSET = .95;
var TUNNEL_BASE = new Vector3(40, -18, 0);
var COPIES = 3;
var STRIDE = 8.3;
var Z0 = -4.184;
var SPINE_MIN = -2.62;
var SPINE_MAX = -1.18;
var HALL_X = -1.9;
var RIBBON = new Float32Array([
	-4.21,
	-1.01,
	-.13,
	-4.13,
	-2.05,
	-.05,
	-4.05,
	-2.85,
	-.05,
	-3.97,
	-2.85,
	-.05,
	-3.89,
	-2.85,
	-.05,
	-3.81,
	-2.85,
	-.05,
	-3.73,
	-2.85,
	-.05,
	-3.65,
	-2.85,
	-.05,
	-3.57,
	-2.85,
	-.05,
	-3.49,
	-2.85,
	-.05,
	-3.41,
	-2.85,
	-.05,
	-3.33,
	-2.85,
	-.05,
	-3.25,
	-2.85,
	-.05,
	-3.17,
	-2.85,
	-.05,
	-3.09,
	-2.85,
	-.05,
	-3.01,
	-2.85,
	-.05,
	-2.93,
	-2.85,
	-.05,
	-2.85,
	-2.85,
	-.05,
	-2.77,
	-2.85,
	-.05,
	-2.69,
	-2.85,
	-1.25,
	-2.61,
	-2.77,
	-1.33,
	-2.53,
	-2.61,
	-1.33,
	-2.45,
	-2.61,
	-1.33,
	-2.37,
	-2.61,
	-1.33,
	-2.29,
	-2.61,
	-1.33,
	-2.21,
	-2.61,
	-1.33,
	-2.13,
	-2.61,
	-1.33,
	-2.05,
	-2.61,
	-1.33,
	-1.97,
	-2.61,
	-1.33,
	-1.89,
	-2.61,
	-1.33,
	-1.81,
	-2.61,
	-1.33,
	-1.73,
	-2.61,
	-1.33,
	-1.65,
	-2.61,
	-1.33,
	-1.57,
	-2.61,
	-1.33,
	-1.49,
	-2.61,
	-1.33,
	-1.41,
	-2.61,
	-1.33,
	-1.33,
	-2.61,
	-1.33,
	-1.25,
	-2.61,
	-1.33,
	-1.17,
	-2.61,
	-1.33,
	-1.09,
	-2.61,
	-1.33,
	-1.01,
	-2.61,
	-1.33,
	-.93,
	-2.61,
	-1.33,
	-.85,
	-2.61,
	-1.33,
	-.77,
	-2.61,
	-1.33,
	-.69,
	-2.61,
	-1.33,
	-.61,
	-2.61,
	-1.33,
	-.53,
	-2.61,
	-1.33,
	-.45,
	-2.61,
	-1.33,
	-.37,
	-2.61,
	-1.33,
	-.29,
	-2.61,
	-1.33,
	-.21,
	-2.61,
	-1.33,
	-.13,
	-2.61,
	-1.33,
	-.05,
	-2.61,
	-1.33,
	.03,
	-2.61,
	-1.33,
	.11,
	-2.53,
	-1.33,
	.19,
	-2.61,
	-1.33,
	.27,
	-2.61,
	2.11,
	.35,
	-2.61,
	2.11,
	.43,
	-2.61,
	2.11,
	.51,
	-2.61,
	2.11,
	.59,
	-2.61,
	2.19,
	.67,
	-2.61,
	2.19,
	.75,
	-2.45,
	2.19,
	.83,
	-2.45,
	2.19,
	.91,
	-2.45,
	2.19,
	.99,
	-1.89,
	2.19,
	1.07,
	-2.45,
	2.19,
	1.15,
	-2.45,
	2.19,
	1.23,
	-2.53,
	2.19,
	1.31,
	-2.53,
	2.19,
	1.39,
	-2.53,
	2.19,
	1.47,
	-2.53,
	2.19,
	1.55,
	-2.53,
	2.19,
	1.63,
	-2.53,
	2.19,
	1.71,
	-2.53,
	2.19,
	1.79,
	-2.53,
	2.19,
	1.87,
	-2.53,
	2.19,
	1.95,
	-2.53,
	2.19,
	2.03,
	-2.53,
	.43,
	2.11,
	-2.53,
	.51,
	2.19,
	-2.53,
	2.19,
	2.27,
	-2.53,
	.43,
	2.35,
	-2.53,
	.43,
	2.43,
	-2.53,
	-1.17,
	2.51,
	-2.53,
	-1.25,
	2.59,
	-2.53,
	-1.25,
	2.67,
	-2.45,
	-1.25,
	2.75,
	-2.45,
	-1.25,
	2.83,
	-2.37,
	-1.25,
	2.91,
	-2.37,
	-1.25,
	2.99,
	-2.37,
	-1.25,
	3.07,
	-2.45,
	-1.25,
	3.15,
	-2.53,
	-1.25,
	3.23,
	-2.53,
	-1.25,
	3.31,
	-2.53,
	-1.25,
	3.39,
	-2.53,
	-1.25,
	3.47,
	-2.53,
	-1.25,
	3.55,
	-2.53,
	-1.25,
	3.63,
	-2.53,
	-1.25,
	3.71,
	-2.53,
	-1.25,
	3.79,
	-2.53,
	-1.25,
	3.87,
	-2.53,
	-1.25,
	3.95,
	-2.53,
	-1.25,
	4.03,
	-2.53,
	-1.25,
	4.11,
	-2.53,
	-1.33,
	4.19,
	-2.53,
	-1.25
]);
var GameEngine = class {
	canvas;
	renderer;
	composer;
	bloom;
	scene;
	camera;
	clock = new Clock();
	running = false;
	disposed = false;
	audio = new HorrorAudio();
	tmp = new Vector3();
	tmp2 = new Vector3();
	moveDir = new Vector3();
	right = new Vector3();
	yaw = 0;
	pitch = 0;
	keys = {};
	locked = false;
	pointerBound = false;
	dragging = false;
	dragLast = {
		x: 0,
		y: 0
	};
	floorY = -1.63;
	bounds = new Box3(new Vector3(-2.4, -1.7, -5.5), new Vector3(2.4, 1.7, 5.5));
	phase = "title";
	playTime = 0;
	footTimer = 0;
	loading = true;
	loadProgress = 0;
	error = null;
	prompt = null;
	onHud = null;
	zone = "house";
	loop = 1;
	fade = 0;
	fading = "none";
	pendingZone = null;
	flashLight = null;
	flashCore = null;
	viewmodel = null;
	amb = new AmbientLight(1709602, .14);
	hemi = new HemisphereLight(2761756, 328712, .16);
	handBase = new Vector3(.34, -.02, -.5);
	vy = 0;
	jumpY = 0;
	onGround = true;
	jumpHeld = false;
	flickerT = 0;
	roomCenter = new Vector3();
	spawnPos = new Vector3();
	spawnYaw = Math.PI;
	houseDoor = null;
	houseLeaf = null;
	houseDoorOpen = 0;
	houseDoorTarget = 0;
	houseDoorPos = new Vector3();
	houseDoorYaw = 0;
	tunnel = null;
	tunnelDoorPos = new Vector3();
	tunnelFloorY = -18;
	tunnelSpawn = new Vector3();
	tunnelYaw = 0;
	bulbs = [];
	bulbMats = [];
	nextLoop = 1;
	touchLookId = null;
	touchLookLast = {
		x: 0,
		y: 0
	};
	touchMove = {
		x: 0,
		y: 0
	};
	onKeyDown = (e) => {
		if (this.phase !== "playing") return;
		this.keys[e.code] = true;
		const k = e.key.toLowerCase();
		if (k === "w" || k === "z") this.keys["KeyW"] = true;
		if (k === "s") this.keys["KeyS"] = true;
		if (k === "a" || k === "q") this.keys["KeyA"] = true;
		if (k === "d") this.keys["KeyD"] = true;
		if (k === "e" || e.code === "KeyE") this.tryInteract();
		if (e.code === "Escape") this.unlock();
		if ([
			"KeyW",
			"KeyA",
			"KeyS",
			"KeyD",
			"KeyE",
			"ArrowUp",
			"ArrowDown",
			"ArrowLeft",
			"ArrowRight",
			"ShiftLeft",
			"ShiftRight",
			"Space"
		].includes(e.code)) e.preventDefault();
	};
	onKeyUp = (e) => {
		this.keys[e.code] = false;
		const k = e.key.toLowerCase();
		if (k === "w" || k === "z") this.keys["KeyW"] = false;
		if (k === "s") this.keys["KeyS"] = false;
		if (k === "a" || k === "q") this.keys["KeyA"] = false;
		if (k === "d") this.keys["KeyD"] = false;
	};
	onMouseMove = (e) => {
		if (this.phase !== "playing") return;
		if (this.locked) {
			this.applyLook(-e.movementX * MOUSE_SENS, -e.movementY * MOUSE_SENS);
			return;
		}
		if (this.dragging) {
			const dx = e.clientX - this.dragLast.x;
			const dy = e.clientY - this.dragLast.y;
			this.dragLast = {
				x: e.clientX,
				y: e.clientY
			};
			this.applyLook(-dx * DRAG_SENS, -dy * DRAG_SENS);
		}
	};
	onPointerDown = (e) => {
		if (this.phase !== "playing") return;
		if (e.button !== 0 && e.button !== 2) return;
		this.canvas.focus({ preventScroll: true });
		if (!this.locked) {
			this.dragging = true;
			this.dragLast = {
				x: e.clientX,
				y: e.clientY
			};
			try {
				this.canvas.setPointerCapture(e.pointerId);
			} catch {}
		}
	};
	onPointerUp = (e) => {
		this.dragging = false;
		try {
			this.canvas.releasePointerCapture(e.pointerId);
		} catch {}
	};
	onPointerLockChange = () => {
		this.locked = document.pointerLockElement === this.canvas;
		if (this.locked) this.dragging = false;
	};
	onVisibility = () => {
		if (document.hidden) this.keys = {};
	};
	onContextMenu = (e) => {
		if (this.phase === "playing") e.preventDefault();
	};
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.tabIndex = 0;
		this.canvas.style.outline = "none";
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: true,
			powerPreference: "high-performance"
		});
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
		this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = .7;
		this.renderer.shadowMap.enabled = false;
		this.scene = new Scene();
		this.scene.background = new Color(460298);
		this.scene.fog = new FogExp2(460298, .05);
		this.camera = new PerspectiveCamera(68, 1, .05, 80);
		this.camera.position.set(0, this.floorY + EYE, 2);
		this.scene.add(this.amb);
		this.scene.add(this.hemi);
		this.flashLight = new SpotLight(16773588, 30, 16, Math.PI / 6.2, .38, 1.05);
		this.flashLight.castShadow = false;
		this.flashCore = new SpotLight(16775144, 46, 14, Math.PI / 15, .22, 1.15);
		this.flashCore.castShadow = false;
		this.buildViewmodel();
		this.scene.add(this.camera);
		this.buildTunnel();
		const size = new Vector2();
		this.renderer.getSize(size);
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.bloom = new UnrealBloomPass(size, .04, .2, .96);
		this.bloom.enabled = false;
		this.composer.addPass(this.bloom);
		this.composer.addPass(new OutputPass());
		this.bindInput();
		this.resize();
	}
	buildViewmodel() {
		const vm = new Group();
		vm.position.copy(this.handBase);
		vm.rotation.set(-.42, -.55, -.38);
		vm.scale.setScalar(1.35);
		vm.visible = false;
		this.camera.add(vm);
		this.viewmodel = vm;
		const gray = new MeshStandardMaterial({
			color: 13158608,
			roughness: .42,
			metalness: .18,
			toneMapped: false
		});
		const headMat = new MeshStandardMaterial({
			color: 15000810,
			roughness: .32,
			metalness: .12,
			toneMapped: false
		});
		const band = new MeshStandardMaterial({
			color: 9276822,
			roughness: .55,
			metalness: .08,
			toneMapped: false
		});
		const skin = new MeshStandardMaterial({
			color: 13867636,
			roughness: .62,
			metalness: 0,
			toneMapped: false
		});
		const add = (mesh) => {
			mesh.layers.enable(1);
			mesh.castShadow = false;
			mesh.receiveShadow = false;
			mesh.frustumCulled = false;
			vm.add(mesh);
			return mesh;
		};
		const head = add(new Mesh(new SphereGeometry(.058, 28, 20), headMat));
		head.scale.set(1.08, .9, 1.02);
		head.position.set(0, .108, 0);
		add(new Mesh(new CylinderGeometry(.03, .034, .028, 18), gray)).position.set(0, .052, 0);
		add(new Mesh(new CylinderGeometry(.026, .03, .03, 16), gray)).position.set(0, .026, 0);
		add(new Mesh(new CylinderGeometry(.033, .033, .15, 22), gray)).position.set(0, -.062, 0);
		add(new Mesh(new CylinderGeometry(.035, .035, .038, 18), band)).position.set(0, -.02, 0);
		const button = add(new Mesh(new CylinderGeometry(.009, .009, .012, 12), band));
		button.rotation.z = Math.PI / 2;
		button.position.set(-.034, -.008, .008);
		const tail = add(new Mesh(new SphereGeometry(.036, 18, 14), gray));
		tail.scale.set(1, .62, 1);
		tail.position.set(0, -.142, 0);
		const lip = add(new Mesh(new TorusGeometry(.034, .006, 8, 18), gray));
		lip.rotation.x = Math.PI / 2;
		lip.position.set(0, -.128, 0);
		const thumb = add(new Mesh(new CapsuleGeometry(.014, .055, 4, 8), skin));
		thumb.rotation.z = 1.15;
		thumb.rotation.y = .35;
		thumb.position.set(-.012, -.012, .03);
		const palm = add(new Mesh(new SphereGeometry(.042, 16, 12), skin));
		palm.scale.set(.85, 1.15, .7);
		palm.position.set(.04, -.055, .008);
		for (let i = 0; i < 3; i++) {
			const finger = add(new Mesh(new CapsuleGeometry(.011, .05, 3, 6), skin));
			finger.rotation.z = .95 + i * .08;
			finger.position.set(.034, -.028 - i * .022, .012);
		}
		const wrist = add(new Mesh(new CapsuleGeometry(.026, .16, 4, 8), skin));
		wrist.rotation.z = -.7;
		wrist.rotation.x = .15;
		wrist.position.set(.085, -.17, .02);
		const aim = new Object3D();
		aim.position.set(0, -.02, -12);
		this.camera.add(aim);
		if (this.flashLight) {
			this.flashLight.position.set(.06, -.05, -.12);
			this.camera.add(this.flashLight);
			this.flashLight.target = aim;
		}
		if (this.flashCore) {
			this.flashCore.position.set(.06, -.05, -.12);
			this.camera.add(this.flashCore);
			this.flashCore.target = aim;
		}
		const rim = new DirectionalLight(16774378, 1.8);
		rim.layers.set(1);
		rim.position.set(-.3, .6, .8);
		const rimAt = new Object3D();
		rimAt.position.set(0, 0, -.08);
		vm.add(rim, rimAt);
		rim.target = rimAt;
		const fill = new DirectionalLight(14015462, .7);
		fill.layers.set(1);
		fill.position.set(-.35, .05, .4);
		const fillAt = new Object3D();
		fillAt.position.set(0, -.02, -.05);
		vm.add(fill, fillAt);
		fill.target = fillAt;
		this.camera.layers.enable(1);
	}
	tryJump() {
		if (this.phase !== "playing" || this.fading !== "none" || !this.onGround) return;
		this.vy = JUMP_V;
		this.onGround = false;
	}
	applyLook(dyaw, dpitch) {
		this.yaw += dyaw;
		this.pitch += dpitch;
		this.pitch = Math.max(-1.25, Math.min(1.25, this.pitch));
	}
	setHudListener(fn) {
		this.onHud = fn;
		this.emitHud();
	}
	emitHud() {
		this.onHud?.({
			phase: this.phase,
			prompt: this.prompt,
			loading: this.loading,
			loadProgress: this.loadProgress,
			error: this.error,
			loop: this.loop,
			inTunnel: this.zone === "tunnel",
			fade: this.fade
		});
	}
	async load() {
		this.loading = true;
		this.emitHud();
		try {
			const loader = new GLTFLoader();
			const root = (await new Promise((resolve, reject) => {
				loader.load(SCAN_URL, resolve, (ev) => {
					if (ev.total > 0) {
						this.loadProgress = Math.min(.99, ev.loaded / ev.total);
						this.emitHud();
					}
				}, reject);
			})).scene;
			this.styleScan(root, false);
			this.scene.add(root);
			const box = new Box3().setFromObject(root);
			this.bounds = new Box3(new Vector3(box.min.x + ROOM_INSET, box.min.y, box.min.z + ROOM_INSET), new Vector3(box.max.x - ROOM_INSET, box.max.y, box.max.z - ROOM_INSET));
			this.floorY = box.min.y;
			const center = box.getCenter(new Vector3());
			this.roomCenter.copy(center);
			this.spawnPos.set(center.x, this.floorY + EYE, center.z);
			this.camera.position.copy(this.spawnPos);
			this.spawnYaw = Math.PI;
			this.yaw = this.spawnYaw;
			this.placeHouseDoor(box);
			this.addHousePracticals(box);
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
	placeHouseDoor(box) {
		const center = box.getCenter(new Vector3());
		const spawnX = center.x;
		const spawnZ = center.z;
		const margin = .7;
		const candidates = [
			{
				d: Math.abs(spawnX - (this.bounds.min.x + .2)),
				x: this.bounds.min.x + .2,
				z: MathUtils.clamp(spawnZ, this.bounds.min.z + margin, this.bounds.max.z - margin)
			},
			{
				d: Math.abs(spawnX - (this.bounds.max.x - .2)),
				x: this.bounds.max.x - .2,
				z: MathUtils.clamp(spawnZ, this.bounds.min.z + margin, this.bounds.max.z - margin)
			},
			{
				d: Math.abs(spawnZ - (this.bounds.min.z + .2)),
				x: MathUtils.clamp(spawnX, this.bounds.min.x + margin, this.bounds.max.x - margin),
				z: this.bounds.min.z + .2
			},
			{
				d: Math.abs(spawnZ - (this.bounds.max.z - .2)),
				x: MathUtils.clamp(spawnX, this.bounds.min.x + margin, this.bounds.max.x - margin),
				z: this.bounds.max.z - .2
			}
		];
		candidates.sort((a, b) => a.d - b.d);
		const spot = candidates[0];
		const pos = new Vector3(spot.x, this.floorY, spot.z);
		const toRoom = center.clone().sub(pos);
		toRoom.y = 0;
		if (toRoom.lengthSq() < .01) toRoom.set(0, 0, -1);
		toRoom.normalize();
		const yaw = Math.atan2(toRoom.x, toRoom.z);
		this.houseDoorPos.copy(pos);
		this.houseDoorYaw = yaw;
		const root = new Group();
		root.position.copy(pos);
		root.rotation.y = yaw;
		const wood = new MeshStandardMaterial({
			color: 4863012,
			roughness: .72,
			metalness: .04
		});
		const trim = new MeshStandardMaterial({
			color: 2892056,
			roughness: .66,
			metalness: .06
		});
		const brass = new MeshStandardMaterial({
			color: 11569738,
			roughness: .32,
			metalness: .72
		});
		const frame = new Mesh(new BoxGeometry(1.12, 2.22, .08), trim);
		frame.position.y = 1.11;
		root.add(frame);
		const leaf = new Group();
		leaf.position.set(-.46, 0, .02);
		const panel = new Mesh(new BoxGeometry(.9, 2.08, .045), wood);
		panel.position.set(.45, 1.05, 0);
		leaf.add(panel);
		const knob = new Mesh(new SphereGeometry(.045, 16, 12), brass);
		knob.position.set(.78, 1.02, .05);
		leaf.add(knob);
		root.add(leaf);
		this.houseLeaf = leaf;
		const sconce = new PointLight(16761994, .85, 4.2, 2);
		sconce.position.set(0, 2.05, .35);
		root.add(sconce);
		const bulbMat = new MeshStandardMaterial({
			color: 16769712,
			emissive: 16756832,
			emissiveIntensity: 1.1,
			roughness: .3
		});
		const bulb = new Mesh(new SphereGeometry(.045, 10, 8), bulbMat);
		bulb.position.copy(sconce.position);
		root.add(bulb);
		this.houseDoor = root;
		this.scene.add(root);
	}
	addHousePracticals(box) {
		const c = box.getCenter(new Vector3());
		for (const p of [new Vector3(c.x - 1.2, this.floorY + 2.15, c.z), new Vector3(c.x + 1.1, this.floorY + 2.05, c.z - 1.4)]) {
			const light = new PointLight(16765602, .42, 5.2, 2);
			light.position.copy(p);
			this.scene.add(light);
		}
	}
	styleScan(root, horror = false) {
		const mul = horror ? .32 : .88;
		root.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh) return;
			mesh.castShadow = false;
			mesh.receiveShadow = false;
			const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			for (const m of mats) {
				if (!m) continue;
				if ("map" in m && m.map) {
					const map = m.map;
					map.colorSpace = SRGBColorSpace;
					map.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
					if (horror) this.shrinkMap(map);
				}
				if ("color" in m && m.color instanceof Color) {
					m.color.multiplyScalar(mul);
					if (horror) m.color.lerp(new Color(1181194), .28);
				}
				if ("roughness" in m) {
					const std = m;
					std.roughness = Math.min(1, (std.roughness ?? .85) * .9 + (horror ? .18 : .04));
					std.metalness = Math.min(.04, std.metalness ?? 0);
					std.envMapIntensity = horror ? .02 : .3;
				}
			}
		});
	}
	shrinkMap(map) {
		try {
			const img = map.image;
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
		} catch {}
	}
	openEnds(geo, matrix, mode) {
		const pos = geo.getAttribute("position");
		const idx = geo.getIndex();
		if (!pos || !idx) return geo;
		const src = idx.array;
		const keep = new Uint32Array(src.length);
		let n = 0;
		const pa = new Vector3();
		const pb = new Vector3();
		const pc = new Vector3();
		for (let i = 0; i < src.length; i += 3) {
			const ia = src[i] ?? 0;
			const ib = src[i + 1] ?? 0;
			const ic = src[i + 2] ?? 0;
			pa.fromBufferAttribute(pos, ia).applyMatrix4(matrix);
			pb.fromBufferAttribute(pos, ib).applyMatrix4(matrix);
			pc.fromBufferAttribute(pos, ic).applyMatrix4(matrix);
			const cz = (pa.z + pb.z + pc.z) / 3;
			if ((mode === "south" || mode === "both") && cz < -3.45 || (mode === "north" || mode === "both") && cz > 3.45) continue;
			keep[n++] = ia;
			keep[n++] = ib;
			keep[n++] = ic;
		}
		const g = new BufferGeometry();
		for (const name of Object.keys(geo.attributes)) {
			const attr = geo.getAttribute(name);
			if (attr) g.setAttribute(name, attr);
		}
		g.setIndex(new BufferAttribute(keep.subarray(0, n), 1));
		return g;
	}
	async loadCorridor() {
		if (!this.tunnel) return;
		const model = (await new GLTFLoader().loadAsync(CORRIDOR_URL)).scene;
		this.styleScan(model, true);
		model.updateMatrixWorld(true);
		const parts = [];
		model.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh) return;
			parts.push({
				geo: mesh.geometry,
				mat: mesh.material,
				matrix: mesh.matrixWorld.clone()
			});
		});
		for (let i = 0; i < COPIES; i++) {
			const mode = i === 0 ? "south" : i === 2 ? "north" : "both";
			const piece = new Group();
			piece.position.z = -i * STRIDE;
			for (const part of parts) {
				const mesh = new Mesh(this.openEnds(part.geo, part.matrix, mode), part.mat);
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
		const box = new Box3().setFromObject(this.tunnel);
		this.tunnelFloorY = box.min.y;
		this.tunnelSpawn.set(TUNNEL_BASE.x + HALL_X, this.tunnelFloorY + EYE, TUNNEL_BASE.z + 3.2);
		this.tunnelYaw = Math.PI;
		const exitZ = -3.62 - 2 * STRIDE;
		this.tunnelDoorPos.set(TUNNEL_BASE.x + HALL_X, this.tunnelFloorY + EYE * .45, TUNNEL_BASE.z + exitZ);
		const bulbZs = [
			-2.2,
			.2,
			2.6
		];
		for (let i = 0; i < COPIES; i++) for (const z of bulbZs) {
			const light = new PointLight(6960152, .16, 2.8, 2.2);
			light.position.set(HALL_X, .55, z - i * STRIDE);
			this.tunnel.add(light);
			this.bulbs.push(light);
		}
	}
	stampJunctions(parts) {
		if (!this.tunnel) return;
		const zLo = -3.75;
		const zHi = -1.9;
		const c = -6.95;
		for (let i = 0; i < 2; i++) {
			const wrap = new Group();
			wrap.position.z = -i * STRIDE;
			for (const part of parts) {
				const geo = this.cloneStamp(part.geo, part.matrix, zLo, zHi, c);
				if (!geo) continue;
				const srcMat = Array.isArray(part.mat) ? part.mat[0] : part.mat;
				const mat = srcMat ? srcMat.clone() : new MeshStandardMaterial({ color: 3354668 });
				if ("side" in mat) mat.side = 2;
				const mesh = new Mesh(geo, mat);
				mesh.castShadow = false;
				mesh.receiveShadow = false;
				wrap.add(mesh);
			}
			for (const dz of [
				-8.05,
				-7.15,
				-6.25
			]) for (const part of parts) {
				const geo = this.cloneCover(part.geo, part.matrix, 2.62, 3.58, dz);
				if (!geo) continue;
				const srcMat = Array.isArray(part.mat) ? part.mat[0] : part.mat;
				const mat = srcMat ? srcMat.clone() : new MeshStandardMaterial({ color: 3354668 });
				if ("side" in mat) mat.side = 2;
				const mesh = new Mesh(geo, mat);
				mesh.castShadow = false;
				mesh.receiveShadow = false;
				wrap.add(mesh);
			}
			const seal = new MeshStandardMaterial({
				color: 3814444,
				roughness: .96,
				metalness: 0,
				side: 2
			});
			const left = new Mesh(new PlaneGeometry(2.9, 3.35), seal);
			left.rotation.y = Math.PI / 2;
			left.position.set(-3.02, .02, -4.15);
			const ceil = new Mesh(new PlaneGeometry(3.3, 2.9), seal);
			ceil.rotation.x = Math.PI / 2;
			ceil.position.set(-1.55, 1.66, -4.15);
			wrap.add(left, ceil);
			this.tunnel.add(wrap);
		}
	}
	cloneStamp(geo, matrix, zLo, zHi, c) {
		const pos = geo.getAttribute("position");
		const uv = geo.getAttribute("uv");
		const idx = geo.getIndex();
		if (!pos || !idx) return null;
		const src = idx.array;
		const pa = new Vector3();
		const pb = new Vector3();
		const pc = new Vector3();
		const outP = [];
		const outU = [];
		const read = (v, i) => v.fromBufferAttribute(pos, i).applyMatrix4(matrix);
		for (let i = 0; i < src.length; i += 3) {
			const ia = src[i] ?? 0;
			const ib = src[i + 1] ?? 0;
			const ic = src[i + 2] ?? 0;
			read(pa, ia);
			read(pb, ib);
			read(pc, ic);
			const cz = (pa.z + pb.z + pc.z) / 3;
			if (cz < zLo || cz > zHi) continue;
			outP.push(pa.x, pa.y, c - pa.z, pc.x, pc.y, c - pc.z, pb.x, pb.y, c - pb.z);
			if (uv) outU.push(uv.getX(ia), uv.getY(ia), uv.getX(ic), uv.getY(ic), uv.getX(ib), uv.getY(ib));
		}
		if (outP.length === 0) return null;
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(outP, 3));
		if (outU.length) g.setAttribute("uv", new Float32BufferAttribute(outU, 2));
		g.computeVertexNormals();
		return g;
	}
	cloneCover(geo, matrix, zLo, zHi, dz) {
		const pos = geo.getAttribute("position");
		const uv = geo.getAttribute("uv");
		const idx = geo.getIndex();
		if (!pos || !idx) return null;
		const src = idx.array;
		const pa = new Vector3();
		const pb = new Vector3();
		const pc = new Vector3();
		const outP = [];
		const outU = [];
		const read = (v, i) => v.fromBufferAttribute(pos, i).applyMatrix4(matrix);
		const push = (v, i) => {
			let x = v.x;
			let y = v.y;
			if (x < -2.15) x -= .08;
			if (x > -1.4) x += .08;
			if (y > 1) y += .05;
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
			if (!(cx < -2.2 || cx > -1.42 || cy > 1.02)) continue;
			push(pa, ia);
			push(pb, ib);
			push(pc, ic);
		}
		if (outP.length === 0) return null;
		const g = new BufferGeometry();
		g.setAttribute("position", new Float32BufferAttribute(outP, 3));
		if (outU.length) g.setAttribute("uv", new Float32BufferAttribute(outU, 2));
		g.computeVertexNormals();
		return g;
	}
	buildTunnel() {
		const g = new Group();
		g.position.copy(TUNNEL_BASE);
		this.tunnel = g;
		this.scene.add(g);
	}
	bindInput() {
		window.addEventListener("keydown", this.onKeyDown, { capture: true });
		window.addEventListener("keyup", this.onKeyUp, { capture: true });
		document.addEventListener("pointerlockchange", this.onPointerLockChange);
		document.addEventListener("visibilitychange", this.onVisibility);
		this.canvas.addEventListener("mousemove", this.onMouseMove);
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
		} catch {}
		this.phase = "playing";
		this.playTime = 0;
		this.loop = 1;
		this.zone = "house";
		this.keys = {};
		this.fade = 0;
		this.fading = "none";
		this.houseDoorOpen = 0;
		this.houseDoorTarget = 0;
		this.nextLoop = 1;
		this.resetToHouse();
		this.emitHud();
		this.canvas.focus({ preventScroll: true });
		this.lock();
	}
	resetToHouse() {
		this.zone = "house";
		this.camera.position.copy(this.spawnPos);
		this.yaw = this.spawnYaw;
		this.pitch = 0;
		this.scene.fog = new FogExp2(460298, .045);
		this.scene.background = new Color(460298);
		this.renderer.toneMappingExposure = .68;
		this.amb.intensity = .14;
		this.hemi.intensity = .16;
		this.jumpY = 0;
		this.vy = 0;
		this.onGround = true;
		this.setFlash(false);
		if (this.houseLeaf) this.houseLeaf.rotation.y = 0;
		this.houseDoorOpen = 0;
		this.houseDoorTarget = 0;
	}
	setFlash(tunnel) {
		const flash = this.flashLight;
		const core = this.flashCore;
		if (!flash || !core) return;
		if (!tunnel) {
			flash.color.setHex(16773588);
			flash.angle = Math.PI / 8.2;
			flash.penumbra = .5;
			flash.distance = 8;
			flash.decay = 1.35;
			flash.intensity = 7;
			core.color.setHex(16775406);
			core.angle = Math.PI / 16;
			core.distance = 6.5;
			core.decay = 1.4;
			core.intensity = 8;
			return;
		}
		const hot = this.loop >= 3 ? 16758954 : this.loop === 2 ? 14221268 : 16773588;
		flash.color.setHex(hot);
		core.color.setHex(this.loop >= 3 ? 16765124 : this.loop === 2 ? 15400938 : 16775406);
		flash.angle = Math.PI / 13;
		flash.penumbra = .12;
		flash.distance = 18;
		flash.decay = .65;
		core.angle = Math.PI / 24;
		core.penumbra = .05;
		core.distance = 16;
		core.decay = .75;
	}
	applyTunnelMood() {
		const mood = [
			{
				light: 3809296,
				emissive: 1707014,
				fog: 131336,
				exp: .16,
				density: .22
			},
			{
				light: 405528,
				emissive: 136202,
				fog: 66306,
				exp: .11,
				density: .28
			},
			{
				light: 3803148,
				emissive: 1573638,
				fog: 262402,
				exp: .08,
				density: .34
			}
		][Math.min(2, Math.max(0, this.loop - 1))];
		this.scene.fog = new FogExp2(mood.fog, mood.density);
		this.scene.background = new Color(mood.fog);
		this.renderer.toneMappingExposure = mood.exp;
		this.amb.intensity = .008;
		this.hemi.intensity = .006;
		for (const b of this.bulbs) b.color.setHex(mood.light);
		for (const m of this.bulbMats) {
			m.emissive.setHex(mood.emissive);
			m.emissiveIntensity = this.loop >= 3 ? .15 : .4;
		}
	}
	enterTunnel() {
		this.zone = "tunnel";
		this.loop = this.nextLoop;
		this.camera.position.copy(this.tunnelSpawn);
		this.yaw = this.tunnelYaw;
		this.pitch = 0;
		this.jumpY = 0;
		this.vy = 0;
		this.onGround = true;
		this.applyTunnelMood();
		this.setFlash(true);
	}
	lock() {
		if (this.phase !== "playing") return;
		try {
			const p = this.canvas.requestPointerLock?.();
			Promise.resolve(p).catch(() => {});
		} catch {}
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
		this.nextLoop = 1;
		this.keys = {};
		this.unlock();
		this.resetToHouse();
		this.emitHud();
	}
	setTouchMove(x, y) {
		this.touchMove.x = x;
		this.touchMove.y = y;
	}
	beginTouchLook(id, x, y) {
		this.touchLookId = id;
		this.touchLookLast = {
			x,
			y
		};
	}
	moveTouchLook(id, x, y) {
		if (id !== this.touchLookId) return;
		const dx = x - this.touchLookLast.x;
		const dy = y - this.touchLookLast.y;
		this.touchLookLast = {
			x,
			y
		};
		if (this.phase !== "playing") return;
		this.applyLook(-dx * .005, -dy * .005);
	}
	endTouchLook(id) {
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
	beginFade(to) {
		if (this.fading !== "none") return;
		this.fading = "out";
		this.pendingZone = to;
	}
	getForward() {
		return this.tmp.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
	}
	getRight() {
		return this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
	}
	start() {
		if (this.running) return;
		this.running = true;
		this.clock.start();
		this.renderer.setAnimationLoop(() => this.frame());
	}
	frame() {
		if (this.disposed) return;
		const dt = Math.min(this.clock.getDelta(), .05);
		this.flickerT += dt;
		this.updateFlicker();
		if (this.phase === "playing") this.updatePlaying(dt);
		this.updateFade(dt);
		if (this.viewmodel) {
			this.viewmodel.visible = this.phase === "playing" && this.fade < .9;
			if (this.viewmodel.visible) this.updateViewmodel();
		}
		this.camera.rotation.order = "YXZ";
		this.camera.rotation.y = this.yaw;
		this.camera.rotation.x = this.pitch;
		this.composer.render();
	}
	updateFlicker() {
		const flash = this.flashLight;
		const core = this.flashCore;
		if (!flash || !core) return;
		if (this.zone !== "tunnel") {
			const dip = Math.random() > .985 ? .45 : 1;
			const wobble = 1 + Math.sin(this.flickerT * 6.4) * .03;
			flash.intensity = 7 * wobble * dip;
			core.intensity = 8 * wobble * dip;
			return;
		}
		const loop3 = this.loop >= 3;
		const cut = loop3 && Math.random() < .06 ? .55 : 1;
		const base = loop3 ? 95 : this.loop === 2 ? 115 : 140;
		const coreBase = loop3 ? 140 : this.loop === 2 ? 170 : 200;
		const wobble = 1 + Math.sin(this.flickerT * (loop3 ? 18 : 7)) * (loop3 ? .06 : .02);
		flash.intensity = base * wobble * cut;
		core.intensity = coreBase * wobble * cut;
		this.renderer.toneMappingExposure = this.loop >= 3 ? .08 : this.loop === 2 ? .11 : .16;
		for (let i = 0; i < this.bulbs.length; i++) {
			const own = loop3 ? Math.sin(this.flickerT * (11 + i) + i) > .82 ? .4 : .05 : .15;
			this.bulbs[i].intensity = .04 * own;
		}
		for (const m of this.bulbMats) m.emissiveIntensity = .04;
	}
	updateJump(dt) {
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
	updateViewmodel() {
		const vm = this.viewmodel;
		if (!vm) return;
		const moving = this.moveDir.lengthSq() > 1e-4 && this.fading === "none";
		const rate = !!(this.keys["ShiftLeft"] || this.keys["ShiftRight"]) ? 12 : 9;
		const bob = moving ? Math.sin(this.playTime * rate) : 0;
		const sway = moving ? Math.cos(this.playTime * rate * .5) : 0;
		vm.position.set(this.handBase.x + sway * .012, this.handBase.y + bob * .018 - this.jumpY * .12, this.handBase.z);
		vm.rotation.set(-.42, -.55 + sway * .02, -.38);
	}
	updatePlaying(dt) {
		this.playTime += dt;
		this.audio.setTension(this.zone === "tunnel" ? .4 + this.loop * .08 : .2);
		this.houseDoorOpen = MathUtils.damp(this.houseDoorOpen, this.houseDoorTarget, 6, dt);
		if (this.houseLeaf) this.houseLeaf.rotation.y = -this.houseDoorOpen * 1.45;
		const forward = this.getForward().clone();
		const right = this.getRight().clone();
		this.moveDir.set(0, 0, 0);
		if (this.keys["KeyW"] || this.keys["ArrowUp"]) this.moveDir.add(forward);
		if (this.keys["KeyS"] || this.keys["ArrowDown"]) this.moveDir.sub(forward);
		if (this.keys["KeyD"] || this.keys["ArrowRight"]) this.moveDir.add(right);
		if (this.keys["KeyA"] || this.keys["ArrowLeft"]) this.moveDir.sub(right);
		if (Math.abs(this.touchMove.y) > .08 || Math.abs(this.touchMove.x) > .08) {
			this.moveDir.addScaledVector(forward, -this.touchMove.y);
			this.moveDir.addScaledVector(right, this.touchMove.x);
		}
		const sprint = this.keys["ShiftLeft"] || this.keys["ShiftRight"];
		const speed = sprint ? SPRINT : WALK;
		this.updateJump(dt);
		const moving = this.moveDir.lengthSq() > 0 && this.fading === "none";
		const bob = moving ? Math.sin(this.playTime * (sprint ? 12 : 9)) * .016 : 0;
		const targetY = this.currentFloor() + EYE + bob + this.jumpY;
		if (moving) {
			this.moveDir.normalize();
			this.tryMove(this.moveDir.x * speed * dt, this.moveDir.z * speed * dt);
			this.footTimer += dt * (sprint ? 1.55 : 1);
			if (this.footTimer > .48) this.footTimer = 0;
			this.camera.position.y = targetY;
		} else if (!this.onGround) this.camera.position.y = targetY;
		else this.camera.position.y = MathUtils.damp(this.camera.position.y, targetY, 8, dt);
		if (this.zone === "house") this.clampHouse();
		else this.clampTunnel();
		this.updatePrompt();
	}
	updatePrompt() {
		let next = null;
		if (this.fading === "none" && this.phase === "playing") {
			if (this.zone === "house") {
				if (this.camera.position.distanceTo(this.houseDoorPos) < 1.75) next = "(E entra)";
			} else if (this.camera.position.distanceTo(this.tunnelDoorPos) < 1.9) next = "(E entra)";
		}
		if (next !== this.prompt) {
			this.prompt = next;
			this.emitHud();
		}
	}
	updateFade(dt) {
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
	currentFloor() {
		return this.zone === "tunnel" ? this.tunnelFloorY : this.floorY;
	}
	clampHouse() {
		const b = this.bounds;
		const pad = .22;
		this.camera.position.x = MathUtils.clamp(this.camera.position.x, b.min.x + pad, b.max.x - pad);
		this.camera.position.z = MathUtils.clamp(this.camera.position.z, b.min.z + pad, b.max.z - pad);
	}
	unmap(worldZ) {
		const z = worldZ - TUNNEL_BASE.z;
		let shifted = z - Z0;
		shifted = (shifted % STRIDE + STRIDE) % STRIDE;
		const canonical = Z0 + shifted;
		return {
			z,
			canonical,
			copy: Math.min(2, Math.max(0, Math.round((canonical - z) / STRIDE)))
		};
	}
	sampleRibbon(canonicalZ) {
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
		} else for (let i = 0; i < last; i += 3) {
			const z0 = r[i] ?? 0;
			const z1 = r[i + 3] ?? z0;
			if (canonicalZ < z0 || canonicalZ > z1) continue;
			const t = z1 === z0 ? 0 : (canonicalZ - z0) / (z1 - z0);
			minX = (r[i + 1] ?? minX) + ((r[i + 4] ?? minX) - (r[i + 1] ?? minX)) * t;
			maxX = (r[i + 2] ?? maxX) + ((r[i + 5] ?? maxX) - (r[i + 2] ?? maxX)) * t;
			break;
		}
		const junction = canonicalZ < -3.15 || canonicalZ > 3.32;
		if (junction) {
			minX = -2.48;
			maxX = -1.3199999999999998;
		} else {
			minX = Math.max(minX, SPINE_MIN);
			maxX = Math.min(maxX, SPINE_MAX);
			if (maxX - minX < .95) {
				minX = Math.min(minX, -2.4);
				maxX = Math.max(maxX, -1.4);
			}
		}
		const inset = junction ? .02 : .1;
		minX += inset;
		maxX -= inset;
		if (maxX - minX < .36) {
			const mid = (minX + maxX) * .5;
			minX = mid - .18;
			maxX = mid + .18;
		}
		return {
			minX,
			maxX
		};
	}
	clampTunnel() {
		let worldZ = this.camera.position.z;
		let mapped = this.unmap(worldZ);
		if (mapped.copy === 0 && mapped.canonical > 3.7) {
			worldZ = TUNNEL_BASE.z + 3.7;
			this.camera.position.z = worldZ;
			mapped = this.unmap(worldZ);
		}
		if (mapped.copy === 2 && mapped.canonical < -3.62) {
			worldZ = TUNNEL_BASE.z + (-3.62 - 2 * STRIDE);
			this.camera.position.z = worldZ;
			mapped = this.unmap(worldZ);
		}
		const lim = this.sampleRibbon(mapped.canonical);
		const x = this.camera.position.x - TUNNEL_BASE.x;
		const cx = MathUtils.clamp(x, lim.minX + RADIUS, lim.maxX - RADIUS);
		this.camera.position.x = TUNNEL_BASE.x + cx;
	}
	tryMove(dx, dz) {
		const pos = this.camera.position;
		if (!this.blocked(pos.x + dx, pos.z + dz)) {
			pos.x += dx;
			pos.z += dz;
			return;
		}
		if (Math.abs(dx) > 1e-6 && !this.blocked(pos.x + dx, pos.z)) pos.x += dx;
		if (Math.abs(dz) > 1e-6 && !this.blocked(pos.x, pos.z + dz)) pos.z += dz;
	}
	blocked(x, z) {
		if (this.zone === "tunnel") {
			const mapped = this.unmap(z);
			if (mapped.copy === 0 && mapped.canonical > 3.72) return true;
			if (mapped.copy === 2 && mapped.canonical < -3.64) return true;
			const lim = this.sampleRibbon(mapped.canonical);
			const lx = x - TUNNEL_BASE.x;
			if (lx < lim.minX + RADIUS || lx > lim.maxX - RADIUS) return true;
			return false;
		}
		const b = this.bounds;
		const pad = RADIUS;
		if (x < b.min.x + pad || x > b.max.x - pad || z < b.min.z + pad || z > b.max.z - pad) return true;
		if (this.houseDoorOpen < .45 && this.houseDoor) {
			const local = this.tmp2.set(x, 0, z).sub(this.houseDoorPos);
			const c = Math.cos(-this.houseDoorYaw);
			const s = Math.sin(-this.houseDoorYaw);
			const lx = local.x * c - local.z * s;
			const lz = local.x * s + local.z * c;
			if (Math.abs(lx) < .55 && Math.abs(lz) < .28) return true;
		}
		return false;
	}
	getControlsProbe() {
		return {
			getYaw: () => this.yaw,
			getPosition: () => this.camera.position.toArray(),
			getPhase: () => this.phase,
			getLoop: () => this.loop,
			getZone: () => this.zone,
			setKeys: (codes) => {
				this.keys = {};
				for (const c of codes) this.keys[c] = true;
			},
			getDoorPos: () => this.houseDoorPos.toArray(),
			goToDoor: () => {
				const toCenter = this.roomCenter.clone().sub(this.houseDoorPos).setY(0);
				if (toCenter.lengthSq() < .01) toCenter.set(0, 0, -1);
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
			}
		};
	}
	dispose() {
		this.disposed = true;
		this.running = false;
		this.renderer.setAnimationLoop(null);
		window.removeEventListener("keydown", this.onKeyDown, { capture: true });
		window.removeEventListener("keyup", this.onKeyUp, { capture: true });
		document.removeEventListener("pointerlockchange", this.onPointerLockChange);
		document.removeEventListener("visibilitychange", this.onVisibility);
		if (this.pointerBound) {
			this.canvas.removeEventListener("mousemove", this.onMouseMove);
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
};
var initialHud = {
	phase: "title",
	prompt: null,
	loading: true,
	loadProgress: 0,
	error: null,
	loop: 1,
	inTunnel: false,
	fade: 0
};
var ENGINE_BUILD = 43;
var TERMS_BLOB = Array.from({ length: 18 }, (_, i) => `${i + 1}. L'utente concede licenza irrevocabile, mondiale, perpetua e sublicenziabile su voce, immagine, posizione, reti wireless, identificatori del dispositivo, metadati CSI, registri di prossimità e qualsiasi segnale catturato durante l'esecuzione. Il titolare può conservare, fondere, trasferire e riprodurre tali dati anche dopo la chiusura. Nessun recesso. Nessuna copia. Nessun risarcimento. Il consenso è la condizione di accesso. `).join("");
var FICTION_LINES = [
	"This game is purely fictitious. It cannot harm you in any way, shape, or form.",
	"Ce jeu est une fiction. Il ne peut être dangereux sous quelque forme que ce soit.",
	"Dieses Spiel ist reine Fiktion. Es kann dich auf keine Weise und in keiner Form verletzen.",
	"Este juego es completamente ficticio. De ningún modo puede hacerte daño.",
	"このゲームは完全なる創作であり、あなたに危害を及ぼすことは絶対にありません",
	"Questo è un gioco di pura fantasia. Non può farti del male in nessun modo.",
	"O jogo é meramente fictício. Não é capaz de te machucar, seja como for."
];
var sharedEngine = null;
var sharedCanvas = null;
var sharedBuild = -1;
function wantsPlay() {
	if (typeof window === "undefined") return false;
	return new URLSearchParams(window.location.search).has("play");
}
function HorrorGame() {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const stickRef = (0, import_react.useRef)(null);
	const [hud, setHud] = (0, import_react.useState)(initialHud);
	const [showControls, setShowControls] = (0, import_react.useState)(false);
	const [boot, setBoot] = (0, import_react.useState)("terms");
	const [loadPct, setLoadPct] = (0, import_react.useState)(0);
	const [rejectNudge, setRejectNudge] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let engine;
		if (sharedEngine && sharedCanvas === canvas && sharedBuild === ENGINE_BUILD) engine = sharedEngine;
		else {
			if (sharedEngine) {
				try {
					sharedEngine.dispose();
				} catch {}
				sharedEngine = null;
			}
			engine = new GameEngine(canvas);
			sharedEngine = engine;
			sharedCanvas = canvas;
			sharedBuild = ENGINE_BUILD;
			engine.start();
			engine.load().then(async () => {
				if (sharedEngine !== engine) return;
				window.__horrorGame = engine;
				window.__controlsTest = engine.getControlsProbe();
				if (!wantsPlay()) return;
				await engine.startPlay();
				if (new URLSearchParams(window.location.search).has("tunnel")) window.setTimeout(() => engine.getControlsProbe().forceEnter(), 300);
			});
		}
		engineRef.current = engine;
		engine.setHudListener(setHud);
		const onResize = () => engine.resize();
		window.addEventListener("resize", onResize);
		const mq = window.matchMedia("(pointer: coarse)");
		const updateControls = () => setShowControls(mq.matches || window.innerWidth < 900);
		updateControls();
		mq.addEventListener("change", updateControls);
		window.addEventListener("resize", updateControls);
		if (wantsPlay()) setBoot("off");
		return () => {
			window.removeEventListener("resize", onResize);
			window.removeEventListener("resize", updateControls);
			mq.removeEventListener("change", updateControls);
			engine.setHudListener(() => {});
			engineRef.current = null;
		};
	}, []);
	const onRestart = (0, import_react.useCallback)(() => {
		engineRef.current?.restart();
		setLoadPct(0);
		setBoot("fiction");
	}, []);
	(0, import_react.useEffect)(() => {
		if (boot !== "loading") return;
		let pct = 0;
		const id = window.setInterval(() => {
			pct = Math.min(99, pct + 1 + Math.floor(Math.random() * 2));
			setLoadPct(pct);
			if (pct >= 99) window.clearInterval(id);
		}, 40);
		return () => window.clearInterval(id);
	}, [boot]);
	(0, import_react.useEffect)(() => {
		if (boot !== "loading" || loadPct < 99 || hud.loading || hud.error) return;
		const t = window.setTimeout(() => {
			engineRef.current?.startPlay();
			setBoot("off");
		}, 400);
		return () => window.clearTimeout(t);
	}, [
		boot,
		loadPct,
		hud.loading,
		hud.error
	]);
	(0, import_react.useEffect)(() => {
		if (!showControls || hud.phase !== "playing" || boot !== "off") return;
		const el = stickRef.current;
		const engine = engineRef.current;
		if (!el || !engine) return;
		let activeId = null;
		let origin = {
			x: 0,
			y: 0
		};
		const onStartTouch = (e) => {
			if (activeId != null) return;
			const t = e.changedTouches[0];
			if (!t || t.clientX > window.innerWidth * .45) return;
			activeId = t.identifier;
			origin = {
				x: t.clientX,
				y: t.clientY
			};
			e.preventDefault();
		};
		const onMove = (e) => {
			if (activeId == null) return;
			for (let i = 0; i < e.changedTouches.length; i++) {
				const t = e.changedTouches[i];
				if (t.identifier !== activeId) continue;
				const dx = (t.clientX - origin.x) / 48;
				const dy = (t.clientY - origin.y) / 48;
				const len = Math.hypot(dx, dy) || 1;
				const s = Math.min(1, len);
				engine.setTouchMove(dx / len * s, dy / len * s);
				e.preventDefault();
			}
		};
		const onEnd = (e) => {
			for (let i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === activeId) {
				activeId = null;
				engine.setTouchMove(0, 0);
			}
		};
		const onLookStart = (e) => {
			for (let i = 0; i < e.changedTouches.length; i++) {
				const t = e.changedTouches[i];
				if (t.clientX >= window.innerWidth * .45) engine.beginTouchLook(t.identifier, t.clientX, t.clientY);
			}
		};
		const onLookMove = (e) => {
			for (let i = 0; i < e.changedTouches.length; i++) {
				const t = e.changedTouches[i];
				engine.moveTouchLook(t.identifier, t.clientX, t.clientY);
			}
		};
		const onLookEnd = (e) => {
			for (let i = 0; i < e.changedTouches.length; i++) engine.endTouchLook(e.changedTouches[i].identifier);
		};
		el.addEventListener("touchstart", onStartTouch, { passive: false });
		el.addEventListener("touchmove", onMove, { passive: false });
		el.addEventListener("touchend", onEnd);
		el.addEventListener("touchcancel", onEnd);
		window.addEventListener("touchstart", onLookStart, { passive: true });
		window.addEventListener("touchmove", onLookMove, { passive: true });
		window.addEventListener("touchend", onLookEnd);
		window.addEventListener("touchcancel", onLookEnd);
		return () => {
			el.removeEventListener("touchstart", onStartTouch);
			el.removeEventListener("touchmove", onMove);
			el.removeEventListener("touchend", onEnd);
			el.removeEventListener("touchcancel", onEnd);
			window.removeEventListener("touchstart", onLookStart);
			window.removeEventListener("touchmove", onLookMove);
			window.removeEventListener("touchend", onLookEnd);
			window.removeEventListener("touchcancel", onLookEnd);
		};
	}, [
		showControls,
		hud.phase,
		boot
	]);
	const loopClass = hud.loop >= 3 ? "is-red" : hud.loop === 2 ? "is-green" : "is-warm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "game-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "game-canvas"
			}),
			hud.inTunnel && boot === "off" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `vignette ${loopClass}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fade",
				style: { opacity: hud.fade }
			}),
			boot === "off" && hud.phase === "title" && !hud.loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "title-screen",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "PANOPTICON" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Beta test Videogioco" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void engineRef.current?.startPlay(),
						children: "ENTRA"
					})
				]
			}),
			hud.phase === "ended" && boot === "off" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "title-screen",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "PANOPTICON" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onRestart,
					children: "DI NUOVO"
				})]
			}),
			boot === "off" && hud.phase === "playing" && hud.prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prompt",
				children: hud.prompt
			}),
			boot === "off" && hud.phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "crosshair" }),
			hud.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "error-banner",
				children: hud.error
			}),
			boot === "terms" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-wrap",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `dialog ${rejectNudge ? "shake" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "TERMINI E CONDIZIONI" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "terms-body",
							children: TERMS_BLOB
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dialog-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ghost",
								onClick: () => setRejectNudge(true),
								children: "REJECT ALL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setBoot("wifi"),
								children: "ACCEPT ALL"
							})]
						})
					]
				})
			}),
			boot === "wifi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Consent, {
				title: "CONSENTIRE L'ACCESSO AI DATI CSI DEL WI-FI",
				onOk: () => setBoot("mic")
			}),
			boot === "mic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Consent, {
				title: "CONSENTIRE L'ACCESSO AL MICROFONO",
				onOk: () => setBoot("cam")
			}),
			boot === "cam" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Consent, {
				title: "CONSENTIRE L'ACCESSO ALLA FOTOCAMERA",
				onOk: () => setBoot("fiction")
			}),
			boot === "fiction" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "fiction",
				onClick: () => setBoot("loading"),
				children: FICTION_LINES.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line }, line))
			}),
			boot === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "loading-screen",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "loading-num",
					children: [loadPct, "%"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "loading-bar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${loadPct}%` } })
				})]
			}),
			showControls && boot === "off" && hud.phase === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stick",
				ref: stickRef
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "jump-btn",
				onPointerDown: () => engineRef.current?.tryJump(),
				children: "SALTO"
			})] })
		]
	});
}
function Consent({ title, onOk }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "modal-wrap",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "dialog slim",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dialog-actions center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onOk,
					children: "ACCETTA"
				})
			})]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HorrorGame, {});
}
//#endregion
export { Home as component };
