#!/usr/bin/env python3
"""THE SLEEPING GODS v2 — tighter edit, punchier VO, real music score (no noise bed)."""
import subprocess, os, json, sys

SRC = "/app/conversations/69f56989777455158d4472f4/mythos-vault/docs/cinematic-gods"
OUT = "/tmp/cine-v2/segs"
FPS = 24; W = H = 1080
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
XF = 0.5

os.makedirs(OUT, exist_ok=True)

BEATS = [
    ("01-HEARTLAND-DAWN",   6.0, [1.02,1.14], [[.5,.5],[.44,.55]],   None,  "fadeblack"),
    ("02-KILN-ROAD",        5.0, [1.10,1.12], [[.42,.5],[.60,.5]],   None,  "fade"),
    ("03-WARM-STONE",       5.0, [1.05,1.22], [[.5,.45],[.5,.62]],   None,  "fade"),
    ("04-LANTERN-RITE",     7.0, [1.06,1.09], [[.5,.5],[.52,.48]],  "clip-lantern-m.mp4", "fadeblack"),
    ("05-THE-LAND-REVEALED",5.5, [1.18,1.01], [[.44,.56],[.5,.42]],  None,  "fade"),
    ("06-THE-GOD-RISES",    5.0, [1.16,1.04], [[.5,.44],[.5,.56]],  "clip-god-rises-m.mp4", "fadeblack"),
    ("07-THE-PILGRIM-LOOKS-UP",4.5,[1.08,1.11],[[.5,.5],[.5,.48]],   None,  "fade"),
    ("08-SOMETHING-ELSE",   4.0, [1.04,1.10], [[.5,.5],[.47,.52]],  None,  "fadeblack"),
    ("09-THE-MARK-IGNITES", 3.5, [1.10,1.34], [[.5,.55],[.5,.58]],  None,  "fade"),
    ("10-THE-EYE",          4.5, [1.02,1.30], [[.5,.5],[.5,.47]],    "clip-the-eye-m.mp4", "fade"),
]

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0:
        print("FAILED:", cmd[:180]); print(r.stderr[-1400:]); raise SystemExit(1)

def kb_filter(d, z, p):
    n = int(d * FPS)
    zex = f"{z[0]}+({z[1]}-{z[0]})*on/{n}"
    px = f"({p[0][0]}+({p[1][0]}-{p[0][0]})*on/{n})"
    py = f"({p[0][1]}+({p[1][1]}-{p[0][1]})*on/{n})"
    return (f"scale=2160:2160,zoompan=z='{zex}'"
            f":x='(iw-iw/zoom)*{px}':y='(ih-ih/zoom)*{py}'"
            f":d={n}:s={W}x{H}:fps={FPS}")

def render_still(shot, d, z, p):
    seg = f"{OUT}/{shot}.mp4"
    vf = kb_filter(d, z, p) + ",format=yuv420p"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/{shot}.jpg" -vf "{vf}" '
        f'-t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_clip_beat(shot, clipfile, d, mid_overlay=False):
    seg = f"{OUT}/{shot}.mp4"
    if mid_overlay:
        cin = f"[1:v]scale={W}:{H},fps={FPS},setpts=PTS-STARTPTS," \
              f"fade=t=in:st=2.0:d=0.6:alpha=1," \
              f"fade=t=out:st={2.0+5.04-0.6:.2f}:d=0.6:alpha=1[cv]"
        fc = f"{cin};[0:v]{kb_filter(d,[1.06,1.09],[[.5,.5],[.52,.48]])}[bg];" \
              f"[bg][cv]overlay=0:0:format=auto,format=yuv420p[v]"
        run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/{shot}.jpg" '
            f'-i "{SRC}/{clipfile}" -filter_complex "{fc}" '
            f'-map "[v]" -t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    else:
        run(f'ffmpeg -y -v error -i "{SRC}/{clipfile}" '
            f'-vf "scale={W}:{H},fps={FPS},fade=t=in:st=0:d=0.4,'
            f'trim=duration={d},setpts=PTS-STARTPTS,format=yuv420p" '
            f'-t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_logo_head():
    seg = f"{OUT}/head-logo.mp4"
    vf = (f"scale={W}:{H},fps={FPS},fade=t=in:st=0.2:d=0.5:alpha=1,"
          f"fade=t=out:st=2.0:d=0.5:alpha=1,format=yuv420p")
    fc = f"[0:v]{vf}[l];color=c=black:s={W}x{H}:d=2.5:r={FPS}[b];[b][l]overlay=0:0[v]"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/STUDIO-LOGO.png" '
         f'-filter_complex "{fc}" -map "[v]" -t 2.5 -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_title():
    seg = f"{OUT}/title.mp4"
    d = 5.5
    n = int(d * FPS)
    vf = (f"scale=-1:720,fps={FPS},zoompan=z='1.00+0.08*on/{n}'"
          f":x='(iw-iw/zoom)/2':y='(ih-iw/zoom)/2':d={n}:s={W}x{H}"
          f":fps={FPS},fade=t=in:st=0.3:d=0.7,fade=t=out:st={d-1.0}:d=1.0")
    tag = ("THE SLEEPING GODS")
    sub = ("they were never mountains.  they were waiting.")
    cred = ("A BUD E404 FILM   \u00b7   BIG ENTERTAINMENT")
    def txt(t, size, y, start, end, col="0xE8D9B0"):
        a = (f"if(lt(t,{start}),0,if(lt(t,{start+0.7}),(t-{start})/0.7,"
             f"if(lt(t,{end}),1,if(lt(t,{end+0.7}),({end+0.7}-t)/0.7,0))))")
        return (f",drawtext=fontfile={FONT}:text='{t}':fontsize={size}"
                f":fontcolor={col}:x=(w-text_w)/2:y={y}:alpha='{a}'")
    vf += txt(tag, 64, 170, 1.8, 4.0)
    vf += txt(sub, 30, 250, 2.6, 4.2)
    vf += txt(cred, 26, 950, 3.8, 5.0, "0x9a8a66")
    vf += ",format=yuv420p"
    fc = f"[0:v]{vf}[l];color=c=black:s={W}x{H}:d={d}:r={FPS}[b];[b][l]overlay=(W-w)/2:60[v]"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/TITLE-LOGO.png" '
         f'-filter_complex "{fc}" -map "[v]" -t {d} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def main():
    segs, trans = [render_logo_head()], ["fadeblack"]
    for bid, d, z, p, vid, x in BEATS:
        if bid == "04-LANTERN-RITE":
            segs.append(render_clip_beat(bid, vid, d, mid_overlay=True))
        elif vid:
            segs.append(render_clip_beat(bid, vid, d))
        else:
            segs.append(render_still(bid, d, z, p))
        trans.append(x)
    segs.append(render_title())
    trans = trans[:len(segs) - 1]

    durs = []
    for s in segs:
        r = subprocess.run(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{s}"',
                           shell=True, capture_output=True, text=True)
        durs.append(float(r.stdout.strip()))
    starts = [0.0]
    for i in range(1, len(segs)):
        starts.append(starts[-1] + durs[i - 1] - XF)
    names = ["head","s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","title"]
    idx = {n: starts[i] for i, n in enumerate(names)}
    total = sum(durs) - XF * (len(segs) - 1)
    print("starts:", json.dumps({n: round(starts[i],2) for i,n in enumerate(names)}))
    print("total:", round(total, 2))

    # ---- music score ----
    cues = {"s4": idx["s4"], "s6": idx["s6"], "s9": idx["s9"], "title": idx["title"]}
    subprocess.run(f'python3 /tmp/cine-v2/score.py {total} \'{json.dumps(cues)}\'',
                   shell=True, check=True)

    # ---- stitch video ----
    fc = []
    off = durs[0] - XF
    fc.append(f"[0:v][1:v]xfade=transition={trans[0]}:duration={XF}:offset={off:.3f}[x0]")
    for i in range(1, len(segs) - 1):
        off = off + durs[i] - XF
        fc.append(f"[x{i-1}][{i+1}:v]xfade=transition={trans[i]}:duration={XF}:offset={off:.3f}[x{i}]")
    fc.append(f"[x{len(segs)-2}]noise=alls=4:allf=t,vignette=PI/5,format=yuv420p[vout]")
    vgraph = ";".join(fc)

    # ---- audio: score + VO (NO noise sources) ----
    vo = [("vo-warm2.mp3", idx["s3"] + 1.5),
          ("vo-land2.mp3", idx["s5"] + 1.2),
          ("vo-waiting2.mp3", idx["s9"] + 0.6)]
    parts = [f"amovie=/tmp/cine-v2/score.wav[sc]"]
    for n, st in vo:
        ms = int(st * 1000)
        parts.append(f"amovie=/tmp/cine-v2/{n},adelay={ms}|{ms}[{n[:-4]}]")
    amix = "".join(f"[{n[:-4]}]" for n, _ in vo)
    agraph = ";".join(parts) + f";[sc]{amix}amix=inputs={1+len(vo)}:normalize=0," \
        "volume=2.0,acompressor=threshold=-20dB:ratio=3:attack=8:release=200," \
        "alimiter=limit=0.9,aformat=sample_fmts=fltp:channel_layouts=stereo," \
        "loudnorm=I=-16:TP=-1.5:LRA=11[aout]"

    inputs = " ".join(f'-i "{s}"' for s in segs)
    final = "/tmp/cine-v2/sleeping-gods-cinematic-v2.mp4"
    run(f'ffmpeg -y -v error {inputs} -i /tmp/cine-v2/score.wav '
        f'-filter_complex "{vgraph};{agraph}" '
        f'-map "[vout]" -map "[aout]" -c:v libx264 -preset medium -crf 20 '
        f'-c:a aac -b:a 192k -movflags +faststart "{final}"')
    print("DONE:", final, os.path.getsize(final), "bytes,", round(total,1), "s")

main()
