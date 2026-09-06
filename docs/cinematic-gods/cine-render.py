#!/usr/bin/env python3
"""THE SLEEPING GODS — single-file cinematic render (1080x1080, 24fps).
Recreates the web cut v4: Ken Burns beats, video beats, cards, VO, drone bed,
booms, grain, title slam. Output: sleeping-gods-cinematic.mp4"""
import subprocess, os, json

SRC = "/app/conversations/69f56989777455158d4472f4/mythos-vault/docs/cinematic-gods"
OUT = "/tmp/cine-build"
FPS = 24
W = H = 1080
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0:
        print("FAILED:", cmd[:180])
        print(r.stderr[-1400:])
        raise SystemExit(1)

# ---------- beat table (from the web BEATS array) ----------
BEATS = [
    ("01-HEARTLAND-DAWN",   9.0, [1.02,1.14], [[.5,.5],[.44,.55]],   None,  None, "fadeblack"),
    ("02-KILN-ROAD",        7.5, [1.10,1.12], [[.42,.5],[.60,.5]],   None,  None, "fade"),
    ("03-WARM-STONE",       7.0, [1.05,1.22], [[.5,.45],[.5,.62]],   None,  "The stones were warm.", "fade"),
    ("04-LANTERN-RITE",     9.5, [1.06,1.09], [[.5,.5],[.52,.48]],  "clip-lantern-m.mp4", None, "fadeblack"),
    ("05-THE-LAND-REVEALED",9.0, [1.18,1.01], [[.44,.56],[.5,.42]],  None,  "The land was never land.", "fade"),
    ("06-THE-GOD-RISES",    5.1, [1.16,1.04], [[.5,.44],[.5,.56]],  "clip-god-rises-m.mp4", None, "fadeblack"),
    ("07-THE-PILGRIM-LOOKS-UP",7.0,[1.08,1.11],[[.5,.5],[.5,.48]],  None,  None, "fade"),
    ("08-SOMETHING-ELSE",   6.0, [1.04,1.10], [[.5,.5],[.47,.52]],  None,  None, "fadeblack"),
    ("09-THE-MARK-IGNITES", 4.8, [1.10,1.34], [[.5,.55],[.5,.58]],  None,  None, "fade"),
    ("10-THE-EYE",          5.1, [1.02,1.30], [[.5,.5],[.5,.47]],    "clip-the-eye-m.mp4", None, "fade"),
]
XF = 0.7  # xfade duration

def kb_filter(d, z, p):
    """zoompan Ken Burns for duration d."""
    n = int(d * FPS)
    zex = f"{z[0]}+({z[1]}-{z[0]})*on/{n}"
    px = f"({p[0][0]}+({p[1][0]}-{p[0][0]})*on/{n})"
    py = f"({p[0][1]}+({p[1][1]}-{p[0][1]})*on/{n})"
    return (f"scale=2160:2160,zoompan=z='{zex}'"
            f":x='(iw-iw/zoom)*{px}':y='(ih-ih/zoom)*{py}'"
            f":d={n}:s={W}x{H}:fps={FPS}")

def render_still(shot, d, z, p, card=None):
    seg = f"{OUT}/{shot}.mp4"
    vf = kb_filter(d, z, p)
    if card:
        a = ("if(lt(t,3),0,if(lt(t,3.9),(t-3)/0.9,"
             "if(lt(t,{c1}),1,if(lt(t,{c2}),({c2}-t)/0.9,0))))"
             ).format(c1=d-1.6, c2=d-0.7)
        vf += (f",drawtext=fontfile={FONT}:text='{card}':fontsize=44"
               f":fontcolor=0xE8D9B0:x=(w-text_w)/2:y=h-190:alpha='{a}'"
               f":shadowx=2:shadowy=2:shadowcolor=black@0.6")
    vf += ",format=yuv420p"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/{shot}.jpg" -vf "{vf}" '
        f'-t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_clip_beat(shot, clipfile, d, fade_in=0.4, mid_overlay=False):
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
            f'-vf "scale={W}:{H},fps={FPS},fade=t=in:st=0:d={fade_in},'
            f'trim=duration={d},setpts=PTS-STARTPTS,format=yuv420p" '
            f'-t {d} -r {FPS} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_logo_head():
    seg = f"{OUT}/head-logo.mp4"
    vf = (f"scale={W}:{H},fps={FPS},fade=t=in:st=0.2:d=0.6:alpha=1,"
          f"fade=t=out:st=2.2:d=0.6:alpha=1,format=yuv420p")
    fc = f"[0:v]{vf}[l];color=c=black:s={W}x{H}:d=3.0:r={FPS}[b];[b][l]overlay=0:0[v]"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/STUDIO-LOGO.png" '
        f'-filter_complex "{fc}" -map "[v]" -t 3.0 -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def render_title():
    seg = f"{OUT}/title.mp4"
    d = 7.0
    n = int(d * FPS)
    vf = (f"scale=-1:720,fps={FPS},zoompan=z='1.00+0.08*on/{n}'"
          f":x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={n}:s={W}x{H}"
          f":fps={FPS},fade=t=in:st=0.4:d=1.0,fade=t=out:st={d-1.2}:d=1.2")
    tag = ("THE SLEEPING GODS")
    sub = ("they were never mountains.  they were waiting.")
    cred = ("A BUD E404 FILM   \u00b7   BIG ENTERTAINMENT")
    def txt(t, size, y, start, end, col="0xE8D9B0"):
        a = (f"if(lt(t,{start}),0,if(lt(t,{start+0.9}),(t-{start})/0.9,"
             f"if(lt(t,{end}),1,if(lt(t,{end+0.9}),({end+0.9}-t)/0.9,0))))")
        return (f",drawtext=fontfile={FONT}:text='{t}':fontsize={size}"
                f":fontcolor={col}:x=(w-text_w)/2:y={y}:alpha='{a}'")
    vf += txt(tag, 64, 170, 2.6, 5.2)
    vf += txt(sub, 30, 250, 3.4, 5.2)
    vf += txt(cred, 26, 950, 5.0, 6.3, "0x9a8a66")
    vf += ",format=yuv420p"
    fc = f"[0:v]{vf}[l];color=c=black:s={W}x{H}:d={d}:r={FPS}[b];[b][l]overlay=(W-w)/2:60[v]"
    run(f'ffmpeg -y -v error -loop 1 -i "{SRC}/TITLE-LOGO.png" '
        f'-filter_complex "{fc}" -map "[v]" -t {d} -c:v libx264 -preset fast -crf 19 "{seg}"')
    return seg

def stitch(segs, transitions):
    """xfade-chain segments; returns (filter graph, total duration)."""
    durs = []
    for s in segs:
        r = subprocess.run(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{s}"',
                           shell=True, capture_output=True, text=True)
        durs.append(float(r.stdout.strip()))
    fc = []
    off = durs[0] - XF
    fc.append(f"[0:v][1:v]xfade=transition={transitions[0]}:duration={XF}:offset={off:.3f}[x0]")
    for i in range(1, len(segs) - 1):
        off = off + durs[i] - XF
        fc.append(f"[x{i-1}][{i+1}:v]xfade=transition={transitions[i]}:duration={XF}:offset={off:.3f}[x{i}]")
    out = f"x{len(segs)-2}"
    total = sum(durs) - XF * (len(segs) - 1)
    fc.append(f"[{out}]noise=alls=5:allf=t,vignette=PI/5,format=yuv420p[vout]")
    return ";".join(fc), total

def build_audio(total, vo_cues):
    drone = ("aevalsrc='0.30*sin(2*PI*55*t)+0.18*sin(2*PI*110.35*t)"
             "+0.06*sin(2*PI*164.8*t)':s=44100:c=stereo:d=%.3f[dr]" % total)
    air = ("anoisesrc=color=brown:amplitude=0.03:d=%.3f,"
           "lowpass=f=500,aformat=channel_layouts=stereo[air]" % total)
    boom6 = ("aevalsrc='0.9*sin(2*PI*46*t)*exp(-2.6*t)':s=44100:c=stereo:d=2.0,"
             "adelay=%d|%d[bo6]" % (int(vo_cues["s6"][0] * 1000), int(vo_cues["s6"][0] * 1000)))
    crack9 = ("anoisesrc=color=white:amplitude=0.5:d=0.35,"
              "highpass=f=1500,aformat=channel_layouts=stereo,"
              "adelay=%d|%d[cr9]" % (int(vo_cues["s9_hit"] * 1000), int(vo_cues["s9_hit"] * 1000)))
    boom10 = ("aevalsrc='0.7*sin(2*PI*40*t)*exp(-2.2*t)':s=44100:c=stereo:d=2.2,"
              "adelay=%d|%d[bo10]" % (int(vo_cues["title"] * 1000), int(vo_cues["title"] * 1000)))
    vo_parts = []
    for name, start in vo_cues["vo"]:
        ms = int(start * 1000)
        vo_parts.append(
            f"amovie={SRC}/{name}.mp3,adelay={ms}|{ms},apad=pad_dur=0.1[v_{name}]")
    mix_ins = "[dr][air][bo6][cr9][bo10]" + "".join(f"[v_{n}]" for n, _ in vo_cues["vo"])
    a = (f"{drone};{air};{boom6};{crack9};{boom10};"
         + ";".join(vo_parts)
         + f";{mix_ins}amix=inputs={5+len(vo_cues['vo'])}:normalize=0,"
           "volume=2.1,acompressor=threshold=-20dB:ratio=3:attack=8:release=200,"
           "alimiter=limit=0.9,aformat=sample_fmts=fltp:channel_layouts=stereo,"
           "loudnorm=I=-16:TP=-1.5:LRA=11[aout]")
    return a

def main():
    os.makedirs(OUT, exist_ok=True)
    segs, trans = [], []
    segs.append(render_logo_head()); trans.append("fadeblack")
    for bid, d, z, p, vid, card, x in BEATS:
        if bid == "04-LANTERN-RITE":
            segs.append(render_clip_beat(bid, vid, d, mid_overlay=True))
        elif vid:
            segs.append(render_clip_beat(bid, vid, d))
        else:
            segs.append(render_still(bid, d, z, p, card))
        trans.append(x)
    segs.append(render_title())
    trans = trans[:len(segs) - 1]
    print("segments:", len(segs))

    durs = []
    for s in segs:
        r = subprocess.run(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{s}"',
                           shell=True, capture_output=True, text=True)
        durs.append(float(r.stdout.strip()))
    starts = [0.0]
    for i in range(1, len(segs)):
        starts.append(starts[-1] + durs[i - 1] - XF)
    names = ["head", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "title"]
    idx = {n: starts[i] for i, n in enumerate(names)}
    print(json.dumps({n: round(starts[i], 2) for i, n in enumerate(names)}))

    vo_cues = {
        "vo": [("vo-warm", idx["s3"] + 2.6),
               ("vo-land", idx["s5"] + 2.6),
               ("vo-waiting", idx["s9"] + 1.3)],
        "s6": (idx["s6"],),
        "s9_hit": idx["s9"] + 0.2,
        "title": idx["title"] + 0.2,
    }
    fc, total = stitch(segs, trans)
    agraph = build_audio(total, vo_cues)
    inputs = " ".join(f'-i "{s}"' for s in segs)
    final = f"{OUT}/sleeping-gods-cinematic.mp4"
    run(f'ffmpeg -y -v error {inputs} '
        f'-filter_complex "{fc};{agraph}" '
        f'-map "[vout]" -map "[aout]" -c:v libx264 -preset medium -crf 20 '
        f'-c:a aac -b:a 192k -movflags +faststart "{final}"')
    print("DONE:", final, os.path.getsize(final), "bytes, total", round(total, 1), "s")

main()
