#!/usr/bin/env python3
"""THE SLEEPING GODS v3 — real music (Kevin MacLeod 'Anguish', CC-BY), VO ducking,
motion-continuity pans, uniform cinematic grade."""
import subprocess, os, json

SRC = "/app/conversations/69f56989777455158d4472f4/mythos-vault/docs/cinematic-gods"
MUS = "/tmp/cine-v3/music/Anguish.mp3"
OUT = "/tmp/cine-v3/segs"
FPS = 24; W = H = 1080
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
XF = 0.55
os.makedirs(OUT, exist_ok=True)

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0:
        print("FAILED:", cmd[:200]); print(r.stderr[-1600:]); raise SystemExit(1)

def kb(d, z, p):
    n = int(d * FPS)
    zex = f"{z[0]}+({z[1]}-{z[0]})*on/{n}"
    px = f"({p[0][0]}+({p[1][0]}-{p[0][0]})*on/{n})"
    py = f"({p[0][1]}+({p[1][1]}-{p[0][1]})*on/{n})"
    return (f"scale=2160:2160,zoompan=z='{zex}'"
            f":x='(iw-iw/zoom)*{px}':y='(ih-ih/zoom)*{py}'"
            f":d={n}:s={W}x{H}:fps={FPS}")

def render_still(shot, d, z, p):
    seg = f"{OUT}/{shot}.mp4"
    if os.path.exists(seg): return seg
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/{shot}.jpg" -vf "{kb(d,z,p)},format=yuv420p" '
        f'-t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_clip_beat(shot, clipfile, d, mid_overlay=False):
    seg = f"{OUT}/{shot}.mp4"
    if os.path.exists(seg): return seg
    if mid_overlay:
        cin = (f"[1:v]scale={W}:{H},fps={FPS},setpts=PTS-STARTPTS,"
               f"fade=t=in:st=2.0:d=0.7:alpha=1,"
               f"fade=t=out:st={2.0+5.04-0.7:.2f}:d=0.7:alpha=1[cv]")
        fc = f"{cin};[0:v]{kb(d,[1.06,1.10],[[.5,.5],[.52,.48]])}[bg];[bg][cv]overlay,format=yuv420p[v]"
        run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/{shot}.jpg" -i "{SRC}/{clipfile}" '
            f'-filter_complex "{fc}" -map "[v]" -t {d} -r {FPS} '
            f'-c:v libx264 -preset fast -crf 19 "{seg}"')
    else:
        run(f'ffmpeg -y -v error -i "{SRC}/{clipfile}" '
            f'-vf "scale={W}:{H},fps={FPS},fade=t=in:st=0:d=0.5,fade=t=out:st={d-0.5}:d=0.5,'
            f'trim=duration={d},setpts=PTS-STARTPTS,format=yuv420p" '
            f'-t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_logo_head():
    seg = f"{OUT}/head-logo.mp4"
    if os.path.exists(seg): return seg
    vf = ("scale={}:{},fps={},fade=t=in:st=0.2:d=0.6:alpha=1,"
          "fade=t=out:st=1.9:d=0.6:alpha=1,format=yuv420p").format(W, H, FPS)
    fc = f"[0:v]{vf}[l];color=c=black:s={W}x{H}:d=2.5:r={FPS}[b];[b][l]overlay[v]"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/STUDIO-LOGO.png" '
         f'-filter_complex "{fc}" -map "[v]" -t 2.5 -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_title():
    seg = f"{OUT}/title.mp4"
    if os.path.exists(seg): return seg
    d = 5.5; n = int(d * FPS)
    vf = (f"scale=-1:720,fps={FPS},zoompan=z='1.00+0.08*on/{n}'"
          f":x='(iw-iw/zoom)/2':y='(ih-iw/zoom)/2':d={n}:s={W}x{H}"
          f":fps={FPS},fade=t=in:st=0.4:d=0.9,fade=t=out:st={d-1.2}:d=1.2")
    def txt(t, size, y, s0, s1, col="0xE8D9B0"):
        a = (f"if(lt(t,{s0}),0,if(lt(t,{s0+0.8}),(t-{s0})/0.8,"
             f"if(lt(t,{s1}),1,if(lt(t,{s1+0.8}),({s1+0.8}-t)/0.8,0))))")
        return (f",drawtext=fontfile={FONT}:text='{t}':fontsize={size}"
                f":fontcolor={col}:x=(w-text_w)/2:y={y}:alpha='{a}'")
    vf += txt("THE SLEEPING GODS", 64, 170, 1.9, 4.2)
    vf += txt("they were never mountains.  they were waiting.", 30, 250, 2.8, 4.4)
    vf += txt("A BUD E404 FILM   \u00b7   BIG ENTERTAINMENT", 26, 950, 4.2, 5.4, "0x9a8a66")
    vf += ",format=yuv420p"
    fc = f"[0:v]{vf}[l];color=c=black:s={W}x{H}:d={d}:r={FPS}[b];[b][l]overlay=(W-w)/2:60[v]"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/TITLE-LOGO.png" '
         f'-filter_complex "{fc}" -map "[v]" -t {d} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def main():
    # Motion continuity: alternating pan direction, gentle push-ins
    BEATS = [
        ("01-HEARTLAND-DAWN",  6.0, [1.02,1.14], [[.30,.5],[.58,.5]],  "fadeblack"),  # L->R
        ("02-KILN-ROAD",       5.0, [1.10,1.12], [[.62,.5],[.36,.5]],   "fade"),       # R->L
        ("03-WARM-STONE",      5.0, [1.05,1.22], [[.40,.45],[.60,.62]], "fade"),       # L->R up
        ("04-LANTERN-RITE",    7.0, None, None,                           "fadeblack"),
        ("05-THE-LAND-REVEALED",5.5,[1.18,1.02],[[.62,.56],[.38,.42]],     "fade"),      # R->L
        ("06-THE-GOD-RISES",   5.0, None, None,                           "fadeblack"),
        ("07-THE-PILGRIM-LOOKS-UP",4.5,[1.08,1.14],[[.42,.52],[.56,.46]],"fade"),      # L->R
        ("08-SOMETHING-ELSE",  4.0, [1.04,1.10], [[.60,.5],[.46,.5]],    "fade"),      # R->L
        ("09-THE-MARK-IGNITES",3.5,[1.10,1.40],[[.5,.55],[.5,.60]],      "fade"),      # push in
        ("10-THE-EYE",         4.5, None, None,                           "fade"),
    ]
    segs = [render_logo_head()]
    trans = ["fadeblack"]
    for bid, d, z, p, x in BEATS:
        if bid == "04-LANTERN-RITE":
            segs.append(render_clip_beat(bid, "clip-lantern-m.mp4", d, mid_overlay=True))
        elif bid in ("06-THE-GOD-RISES",):
            segs.append(render_clip_beat(bid, "clip-god-rises-m.mp4", d))
        elif bid == "10-THE-EYE":
            segs.append(render_clip_beat(bid, "clip-the-eye-m.mp4", d))
        else:
            segs.append(render_still(bid, d, z, p))
        trans.append(x)
    segs.append(render_title())
    trans = trans[:len(segs)-1]

    durs = []
    for s in segs:
        r = subprocess.run(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{s}"',
                           shell=True, capture_output=True, text=True)
        durs.append(float(r.stdout.strip()))
    starts = [0.0]
    for i in range(1, len(segs)):
        starts.append(starts[-1] + durs[i-1] - XF)
    names = ["head","s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","title"]
    total = sum(durs) - XF*(len(segs)-1)
    idx = {n: starts[i] for i, n in enumerate(names)}
    print("total:", round(total,2), json.dumps({n:round(starts[i],2) for i,n in enumerate(names)}))

    # ---- video stitch ----
    fc = []
    off = durs[0] - XF
    fc.append(f"[0:v][1:v]xfade=transition={trans[0]}:duration={XF}:offset={off:.3f}[x0]")
    for i in range(1, len(segs)-1):
        off += durs[i] - XF
        fc.append(f"[x{i-1}][{i+1}:v]xfade=transition={trans[i]}:duration={XF}:offset={off:.3f}[x{i}]")
    # uniform cinematic grade + grain + vignette
    fc.append("[x{0}]eq=contrast=1.06:brightness=-0.015:saturation=1.04,"
              "colorbalance=rm=.03:gm=.01:bm=-.02:rh=.04:bh=-.04,"
              "noise=alls=3.5:allf=t,vignette=PI/5.2,format=yuv420p[vout]".format(len(segs)-2))
    vgraph = ";".join(fc)

    # ---- audio: real music + VO with sidechain ducking ----
    vo = [("vo-warm3.mp3", idx["s3"]+1.3),
          ("vo-land3.mp3", idx["s5"]+1.0),
          ("vo-wait3.mp3", idx["s9"]+0.4)]
    nseg = len(segs)                       # inputs 0..nseg-1 = video
    IM1, IM2 = nseg, nseg+1                # music (same file twice)
    IVO = [nseg+2+i for i in range(3)]      # VO inputs
    title_t = idx["title"]
    parts = [
        f"[{IM1}:a]atrim=0:{title_t:.2f},asetpts=PTS-STARTPTS,apad=pad_dur=7,volume=1.0[mus1]",
        f"[{IM2}:a]atrim=82.5:88.5,asetpts=PTS-STARTPTS,adelay={int(title_t*1000)}|{int(title_t*1000)},apad=pad_dur=3,volume=1.05[mus2]",
    ]
    for i, (f, st) in enumerate(vo):
        ms = int(st*1000)
        parts.append(f"[{IVO[i]}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,adelay={ms}|{ms}[vo{i}]")
    parts.append("[mus1][mus2]amix=inputs=2:normalize=0[musmix]")
    parts.append(f"[vo0][vo1][vo2]amix=inputs=3:normalize=0,volume=1.4,apad=whole_dur={total+1:.2f},asplit=2[vomixA][vomixB]")
    parts.append("[musmix][vomixA]sidechaincompress=threshold=0.035:ratio=5:attack=30:release=450[musduck]")
    parts.append(f"[musduck][vomixB]amix=inputs=2:normalize=0,alimiter=limit=0.92,"
                 f"atrim=0:{total:.2f},aformat=sample_fmts=fltp:channel_layouts=stereo,"
                 f"loudnorm=I=-15.5:TP=-1.5:LRA=11[aout]")
    agraph = ";".join(parts)

    final = "/tmp/cine-v3/sleeping-gods-cinematic-v3.mp4"
    inputs = " ".join(f'-i "{s}"' for s in segs)
    inputs += f' -i "{MUS}" -i "{MUS}"'
    for f, _ in vo:
        inputs += f' -i "/tmp/cine-v3/{f}"'
    run(f'ffmpeg -y -v error {inputs} '
        f'-filter_complex "{vgraph};{agraph}" '
        f'-map "[vout]" -map "[aout]" -c:v libx264 -preset medium -crf 20 '
        f'-c:a aac -b:a 192k -movflags +faststart "{final}"')
    print("DONE:", final, os.path.getsize(final), "bytes")

main()
