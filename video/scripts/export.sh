#!/bin/sh
# Render the master + hover loop with Remotion, then make web versions with ffmpeg.
# Usage: npm run export -- <app-id> [site-asset-dir]
set -eu
APP=${1:?usage: npm run export -- <app-id> [site-asset-dir]}
SITE=${2:-../public/assets/projects/$APP}
OUT=out/$APP
ENTRY=src/remotion/Root.tsx
mkdir -p "$OUT" "$SITE"

npx remotion render $ENTRY "$APP" "$OUT/master.mp4" --codec=h264 --crf=16 --log=error
npx remotion render $ENTRY "$APP-loop" "$OUT/loop-master.mp4" --codec=h264 --crf=16 --log=error

POSTER_AT=$(npx tsx -e "import c from './apps/$APP/video.config'; console.log(c.posterAt)")
X264="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart"
VP9="-c:v libvpx-vp9 -b:v 0 -row-mt 1 -deadline good -cpu-used 2"
# Keep sound only for apps that recorded some (the config's `audio`); the hover loop is always silent.
HAS_AUDIO=$(npx tsx -e "import c from './apps/$APP/video.config'; console.log(c.audio ? 1 : '')")

web() { # <in> <name> <crf-h264> <crf-vp9> <audio: 1 or empty>
  if [ -n "$5" ]; then A264="-c:a aac -b:a 128k"; AVP9="-c:a libopus -b:a 96k"; else A264=-an; AVP9=-an; fi
  for H in 1080 720; do
    ffmpeg -y -loglevel error -i "$1" -vf "scale=-2:$H:flags=lanczos" $X264 -crf "$3" $A264 "$OUT/$2-$H.mp4"
    ffmpeg -y -loglevel error -i "$1" -vf "scale=-2:$H:flags=lanczos" $VP9 -crf "$4" $AVP9 "$OUT/$2-$H.webm"
  done
}
web "$OUT/master.mp4" web 30 42 "$HAS_AUDIO"
web "$OUT/loop-master.mp4" loop 30 42 ""
ffmpeg -y -loglevel error -ss "$POSTER_AT" -i "$OUT/master.mp4" -frames:v 1 -vf "scale=-2:1080" -q:v 3 "$OUT/poster.jpg"
# Collapsed-card thumbnail: the title card once its text has risen in, before it fades.
ffmpeg -y -loglevel error -ss 1.3 -i "$OUT/master.mp4" -frames:v 1 -vf "scale=-2:1080" -q:v 3 "$OUT/thumb.jpg"

cp "$OUT/web-1080.mp4" "$OUT/poster.jpg" "$OUT/thumb.jpg" "$SITE/" # what the site card uses
ls -lh "$OUT" | awk 'NR>1 {print $5, $9}'
echo "copied web-1080.mp4, poster.jpg and thumb.jpg to $SITE"
