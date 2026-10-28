export class HorrorAudio {
  private ctx: AudioContext | null = null;
  private started = false;
  tension = 0;

  async unlock() {
    if (this.started) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    this.ctx = ctx;
    this.started = true;
    await ctx.resume().catch(() => {});
    this.startAmbience();
    this.startScore();
  }

  private startAmbience() {
    const ctx = this.ctx;
    if (!ctx) return;
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      brown = brown * 0.985 + white * 0.015;
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
    gain.gain.value = 0.22;
    noise.connect(low);
    low.connect(air);
    air.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 46;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.07;
    hum.connect(humGain);
    humGain.connect(ctx.destination);
    hum.start();

    const hum2 = ctx.createOscillator();
    hum2.type = "sine";
    hum2.frequency.value = 48.4;
    const hum2Gain = ctx.createGain();
    hum2Gain.gain.value = 0.035;
    hum2.connect(hum2Gain);
    hum2Gain.connect(ctx.destination);
    hum2.start();
  }

  private startScore() {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const [freq, vol] of [
      [65.4, 0.02],
      [98, 0.014],
      [155.6, 0.008],
    ] as const) {
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

  setTension(n: number) {
    this.tension = n;
  }
  setDarkRoom(_on: boolean) {}
  doorAppear() {}
  doorCreak() {}
  footstep() {}
  scream(_close?: boolean) {}
  cry() {}
  terrorVoice() {}
  jumpscare() {}

  dispose() {
    const ctx = this.ctx;
    this.ctx = null;
    this.started = false;
    if (ctx) void ctx.close().catch(() => {});
  }
}
