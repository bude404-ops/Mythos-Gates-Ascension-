#!/usr/bin/env python3
"""Hand-composed engine score for THE SLEEPING GODS cinematic v2.
Replaces the noise/wind bed (Big's 'static' complaint) with real music:
D minor progression, brass motif, choir pad, taiko pulse, riser, booms."""
import numpy as np, wave, sys, json

SR = 44100
def save(path, L, R):
    data = np.clip(np.stack([L, R], axis=1), -1, 1)
    pcm = (data * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())

def note(m): return 2 ** ((m - 69) / 12) * 440

class Score:
    def __init__(self, dur):
        self.dur = dur
        self.L = np.zeros(int(dur * SR)); self.R = np.zeros(int(dur * SR))
    def add(self, sig, t0, panL=1.0, panR=1.0):
        i0 = int(t0 * SR); i1 = min(i0 + len(sig), len(self.L))
        if i0 >= len(self.L): return
        seg = sig[:i1 - i0]
        self.L[i0:i1] += seg * panL; self.R[i0:i1] += seg * panR
    def pad(self, midis, t0, dur, amp=0.11, att=1.0, rel=1.5, det=0.0015):
        n = int(dur * SR); t = np.arange(n) / SR
        sig = np.zeros(n)
        for m in midis:
            f = note(m)
            for dt in (-det, 0.0, det):
                sig += np.sin(2 * np.pi * f * (1 + dt) * t) / 3
            sig += 0.18 * np.sin(2 * np.pi * f * 2 * t) / (len(midis) * 3)
        sig /= max(1, len(midis))
        env = np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (dur - t) / rel))
        self.add(sig * env * amp, t0)
    def brass(self, midi, t0, dur, amp=0.16):
        n = int(dur * SR); t = np.arange(n) / SR
        f = note(midi); sig = np.zeros(n)
        for h in range(1, 9):
            sig += np.sin(2 * np.pi * f * h * t + 0.5 * h) / (h ** 1.3)
        env = np.minimum(1, t / 0.35) * np.exp(-t / (dur * 0.8))
        self.add(sig * env * amp, t0)
    def taiko(self, t0, amp=0.5, f0=82):
        n = int(0.9 * SR); t = np.arange(n) / SR
        f = f0 * np.exp(-t * 3) + 42
        sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.5)
        thump = np.random.RandomState(7).randn(n)
        a = np.exp(-2 * np.pi * 180 / SR); y = 0.0; lp = np.empty(n)
        for i in range(n):
            y = (1 - a) * thump[i] + a * y; lp[i] = y
        sig += lp * np.exp(-t * 30) * 0.6
        self.add(sig * amp, t0, 0.9, 1.0)
    def boom(self, t0, amp=0.8, f0=46):
        n = int(2.4 * SR); t = np.arange(n) / SR
        f = f0 * np.exp(-t * 1.5) + 30
        self.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) * amp, t0)
    def riser(self, t0, dur, amp=0.22):
        n = int(dur * SR); t = np.arange(n) / SR
        noise = np.random.RandomState(3).randn(n)
        out = np.zeros(n); y = 0.0
        for i in range(n):
            fc = 150 + 1900 * (i / n) ** 2
            a = np.exp(-2 * np.pi * fc / SR)
            y = (1 - a) * noise[i] + a * y; out[i] = y
        self.add(out * (t / dur) ** 2 * amp, t0, 0.85, 1.0)
    def subdrop(self, t0, amp=0.5):
        n = int(1.8 * SR); t = np.arange(n) / SR
        f = 55 - 25 * t / 1.8
        self.add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6) * amp, t0)

def build(total, cues):
    s = Score(total)
    acts = [
        (0.0,  7.5, [38, 50]),
        (7.0,  7.0, [50, 53, 57]),
        (13.5, 7.5, [46, 50, 53]),
        (20.0, 6.5, [41, 45, 48]),
        (25.5, 7.5, [36, 43, 48]),
        (32.0, 9.0, [38, 50, 57]),
        (total - 6.5, 6.5, [38, 50, 53, 57]),
    ]
    for st, du, ms in acts:
        s.pad(ms, st, du, amp=0.10 + (0.02 if st > 20 else 0))
    for t0 in [cues['s4'], cues['s6'], cues['s9'], cues['title']]:
        for j, m in enumerate([50, 57, 62]):
            s.brass(m, t0 + j * 0.42, 1.6, amp=0.13 if t0 < cues['s9'] else 0.17)
    t = cues['s6']
    while t < cues['s9']:
        s.taiko(t, amp=0.32); t += 0.77
    t = cues['s9']
    while t < cues['title'] - 0.5:
        s.taiko(t, amp=0.4); s.taiko(t + 0.385, amp=0.22); t += 0.77
    s.boom(cues['s6'] + 0.55, amp=0.75)
    s.boom(cues['title'] + 0.25, amp=0.85)
    s.subdrop(cues['title'] + 0.05, amp=0.45)
    s.riser(cues['s9'] - 1.0, (cues['title'] + 0.25) - (cues['s9'] - 1.0), amp=0.16)
    mix = np.stack([s.L, s.R], axis=1)
    mix = np.tanh(mix * 1.3) * 0.62
    n = len(mix); fade = np.ones(n)
    fo = int(2.0 * SR); fade[-fo:] = np.linspace(1, 0, fo)
    fi = int(0.8 * SR); fade[:fi] = np.linspace(0, 1, fi)
    mix *= fade[:, None]
    save('/tmp/cine-v2/score.wav', mix[:, 0], mix[:, 1])
    print('score.wav built:', round(total, 1), 's')

if __name__ == '__main__':
    build(float(sys.argv[1]), json.loads(sys.argv[2]))
