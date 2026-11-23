#!/bin/sh
# Render the portrait (9:16) phone cut and copy it to the site. export.sh runs this too.
# Usage: npm run export:mobile -- <app-id> [site-asset-dir]
set -eu
APP=${1:?usage: npm run export:mobile -- <app-id> [site-asset-dir]}
SITE=${2:-../public/projects/$APP}
OUT=out/$APP
# Apps re-recorded at a phone viewport have their own config (Root.tsx uses it for this composition).
CFG=./apps/$APP; [ -d "apps/$APP-mobile" ] && CFG=./apps/$APP-mobile
mkdir -p "$OUT" "$SITE"

npx remotion render src/remotion/Root.tsx "$APP-mobile" "$OUT/mobile-master.mp4" --codec=h264 --crf=16 --log=error

POSTER_AT=$(npx tsx -e "import c from '$CFG/video.config'; console.log(c.posterAt)")
if [ -n "$(npx tsx -e "import c from '$CFG/video.config'; console.log(c.audio ? 1 : '')")" ]; then A="-c:a aac -b:a 128k"; else A=-an; fi
ffmpeg -y -loglevel error -i "$OUT/mobile-master.mp4" -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -crf 30 $A "$OUT/mobile-1080.mp4"
ffmpeg -y -loglevel error -ss "$POSTER_AT" -i "$OUT/mobile-master.mp4" -frames:v 1 -q:v 3 "$OUT/mobile-poster.jpg"

cp "$OUT/mobile-1080.mp4" "$OUT/mobile-poster.jpg" "$SITE/"
ls -lh "$OUT/mobile-1080.mp4" "$OUT/mobile-poster.jpg" | awk '{print $5, $9}'
