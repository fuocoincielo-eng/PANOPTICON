"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine, type HudState } from "./gameEngine";

const initialHud: HudState = {
  phase: "title",
  prompt: null,
  loading: true,
  loadProgress: 0,
  error: null,
  loop: 1,
  inTunnel: false,
  fade: 0,
};

const ENGINE_BUILD = 51;

type BootStep = "terms" | "wifi" | "mic" | "cam" | "fiction" | "loading" | "off";

const TERMS_BLOB = Array.from({ length: 18 }, (_, i) =>
  `${i + 1}. L'utente concede licenza irrevocabile, mondiale, perpetua e sublicenziabile su voce, immagine, posizione, reti wireless, identificatori del dispositivo, metadati CSI, registri di prossimità e qualsiasi segnale catturato durante l'esecuzione. Il titolare può conservare, fondere, trasferire e riprodurre tali dati anche dopo la chiusura. Nessun recesso. Nessuna copia. Nessun risarcimento. Il consenso è la condizione di accesso. `,
).join("");

const FICTION_LINES = [
  "This game is purely fictitious. It cannot harm you in any way, shape, or form.",
  "Ce jeu est une fiction. Il ne peut être dangereux sous quelque forme que ce soit.",
  "Dieses Spiel ist reine Fiktion. Es kann dich auf keine Weise und in keiner Form verletzen.",
  "Este juego es completamente ficticio. De ningún modo puede hacerte daño.",
  "このゲームは完全なる創作であり、あなたに危害を及ぼすことは絶対にありません",
  "Questo è un gioco di pura fantasia. Non può farti del male in nessun modo.",
  "O jogo é meramente fictício. Não é capaz de te machucar, seja como for.",
];

let sharedEngine: GameEngine | null = null;
let sharedCanvas: HTMLCanvasElement | null = null;
let sharedBuild = -1;

function wantsPlay() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("play");
}

export function HorrorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const [hud, setHud] = useState<HudState>(initialHud);
  const [showControls, setShowControls] = useState(false);
  const [boot, setBoot] = useState<BootStep>("terms");
  const [loadPct, setLoadPct] = useState(0);
  const [rejectNudge, setRejectNudge] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine: GameEngine;
    if (sharedEngine && sharedCanvas === canvas && sharedBuild === ENGINE_BUILD) {
      engine = sharedEngine;
    } else {
      if (sharedEngine) {
        try { sharedEngine.dispose(); } catch { /* */ }
        sharedEngine = null;
      }
      engine = new GameEngine(canvas);
      sharedEngine = engine;
      sharedCanvas = canvas;
      sharedBuild = ENGINE_BUILD;
      engine.start();
      void engine.load().then(async () => {
        if (sharedEngine !== engine) return;
        window.__horrorGame = engine;
        window.__controlsTest = engine.getControlsProbe();
        if (!wantsPlay()) return;
        await engine.startPlay();
        if (new URLSearchParams(window.location.search).has("tunnel")) {
          window.setTimeout(() => engine.getControlsProbe().forceEnter(), 300);
        }
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

  const onRestart = useCallback(() => {
    engineRef.current?.restart();
    setLoadPct(0);
    setBoot("fiction");
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (boot !== "loading") {
      engine?.setShowcase(false);
      return;
    }
    engine?.setShowcase(true);
    let pct = 0;
    const id = window.setInterval(() => {
      pct = Math.min(99, pct + 1);
      setLoadPct(pct);
      if (pct >= 99) window.clearInterval(id);
    }, 110);
    return () => {
      window.clearInterval(id);
      engineRef.current?.setShowcase(false);
    };
  }, [boot]);

  useEffect(() => {
    if (boot !== "loading" || loadPct < 99 || hud.loading || hud.error) return;
    const t = window.setTimeout(() => {
      void engineRef.current?.startPlay();
      setBoot("off");
    }, 400);
    return () => window.clearTimeout(t);
  }, [boot, loadPct, hud.loading, hud.error]);

  useEffect(() => {
    if (!showControls || hud.phase !== "playing" || boot !== "off") return;
    const el = stickRef.current;
    const engine = engineRef.current;
    if (!el || !engine) return;
    let activeId: number | null = null;
    let origin = { x: 0, y: 0 };
    const onStartTouch = (e: TouchEvent) => {
      if (activeId != null) return;
      const t = e.changedTouches[0];
      if (!t || t.clientX > window.innerWidth * 0.45) return;
      activeId = t.identifier;
      origin = { x: t.clientX, y: t.clientY };
      e.preventDefault();
    };
    const onMove = (e: TouchEvent) => {
      if (activeId == null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!;
        if (t.identifier !== activeId) continue;
        const dx = (t.clientX - origin.x) / 48;
        const dy = (t.clientY - origin.y) / 48;
        const len = Math.hypot(dx, dy) || 1;
        const s = Math.min(1, len);
        engine.setTouchMove((dx / len) * s, (dy / len) * s);
        e.preventDefault();
      }
    };
    const onEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i]!.identifier === activeId) {
          activeId = null;
          engine.setTouchMove(0, 0);
        }
      }
    };
    const onLookStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!;
        if (t.clientX >= window.innerWidth * 0.45) engine.beginTouchLook(t.identifier, t.clientX, t.clientY);
      }
    };
    const onLookMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i]!;
        engine.moveTouchLook(t.identifier, t.clientX, t.clientY);
      }
    };
    const onLookEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) engine.endTouchLook(e.changedTouches[i]!.identifier);
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
  }, [showControls, hud.phase, boot]);

  const loopClass = hud.loop >= 3 ? "is-red" : hud.loop === 2 ? "is-green" : "is-warm";

  return (
    <div className={`game-root${boot === "off" && hud.phase === "playing" ? " is-playing" : ""}`}>
      <canvas ref={canvasRef} className="game-canvas" />
      {hud.inTunnel && boot === "off" && <div className={`vignette ${loopClass}`} />}
      <div className="fade" style={{ opacity: hud.fade }} />

      {boot === "off" && hud.phase === "title" && !hud.loading && (
        <div className="title-screen">
          <h1>PANOPTICON</h1>
          <p>Beta test Videogioco</p>
          <button type="button" onClick={() => { engineRef.current?.capturePointer(); void engineRef.current?.startPlay(); }}>ENTRA</button>
        </div>
      )}

      {hud.phase === "ended" && boot === "off" && (
        <div className="title-screen">
          <h1>PANOPTICON</h1>
          <button type="button" onClick={onRestart}>DI NUOVO</button>
        </div>
      )}

      {boot === "off" && hud.phase === "playing" && hud.prompt && (
        <div className="prompt">{hud.prompt}</div>
      )}
      {boot === "off" && hud.phase === "playing" && <div className="crosshair" />}

      {hud.error && <div className="error-banner">{hud.error}</div>}

      {boot === "terms" && (
        <div className="modal-wrap">
          <div className={`dialog ${rejectNudge ? "shake" : ""}`}>
            <h2>TERMINI E CONDIZIONI</h2>
            <div className="terms-body">{TERMS_BLOB}</div>
            <div className="dialog-actions">
              <button type="button" className="ghost" onClick={() => setRejectNudge(true)}>REJECT ALL</button>
              <button type="button" onClick={() => setBoot("wifi")}>ACCEPT ALL</button>
            </div>
          </div>
        </div>
      )}

      {boot === "wifi" && (
        <Consent title="CONSENTIRE L'ACCESSO AI DATI CSI DEL WI-FI" onOk={() => setBoot("mic")} />
      )}
      {boot === "mic" && (
        <Consent title="CONSENTIRE L'ACCESSO AL MICROFONO" onOk={() => setBoot("cam")} />
      )}
      {boot === "cam" && (
        <Consent title="CONSENTIRE L'ACCESSO ALLA FOTOCAMERA" onOk={() => setBoot("fiction")} />
      )}

      {boot === "fiction" && (
        <button type="button" className="fiction" onClick={() => { engineRef.current?.capturePointer(); setBoot("loading"); }}>
          {FICTION_LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </button>
      )}

      {boot === "loading" && (
        <div
          className="loading-screen"
          onPointerDown={(e) => {
            (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            (e.currentTarget as HTMLDivElement).dataset.x = String(e.clientX);
            (e.currentTarget as HTMLDivElement).dataset.y = String(e.clientY);
            (e.currentTarget as HTMLDivElement).dataset.drag = "1";
          }}
          onPointerMove={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            if (el.dataset.drag !== "1") return;
            const x = Number(el.dataset.x || e.clientX);
            const y = Number(el.dataset.y || e.clientY);
            engineRef.current?.nudgeShowcase(e.clientX - x, e.clientY - y);
            el.dataset.x = String(e.clientX);
            el.dataset.y = String(e.clientY);
          }}
          onPointerUp={(e) => {
            (e.currentTarget as HTMLDivElement).dataset.drag = "0";
            engineRef.current?.releaseShowcase();
          }}
          onPointerCancel={() => engineRef.current?.releaseShowcase()}
        >
          <div className="loading-hud">
            <div className="loading-num">{loadPct}%</div>
            <div className="loading-bar"><span style={{ width: `${loadPct}%` }} /></div>
          </div>
        </div>
      )}

      {showControls && boot === "off" && hud.phase === "playing" && (
        <>
          <div className="stick" ref={stickRef} />
          <button type="button" className="jump-btn" onPointerDown={() => engineRef.current?.tryJump()}>
            SALTO
          </button>
        </>
      )}
    </div>
  );
}

function Consent({ title, onOk }: { title: string; onOk: () => void }) {
  return (
    <div className="modal-wrap">
      <div className="dialog slim">
        <h2>{title}</h2>
        <div className="dialog-actions center">
          <button type="button" onClick={onOk}>ACCETTA</button>
        </div>
      </div>
    </div>
  );
}
