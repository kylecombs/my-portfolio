# Portfolio videos

Screen recordings of my apps, composited with callouts and exported for the
portfolio site. Separate from the site's own `package.json`, so it needs its own install.

```sh
cd video && npm install
```

Needs Google Chrome installed (Playwright drives it with `channel: "chrome"`
because bundled Chromium can't play H.264 video) and `ffmpeg` on the PATH.

## Commands

| Step | Command | Output |
| --- | --- | --- |
| Re-record | `npm run capture camp-booking` | `public/camp-booking/clips/*.mp4` and `events.json` |
| Storyboard | `npm run storyboard -- camp-booking` | `out/camp-booking/storyboard.jpg` contact sheet + one panel per beat in `out/camp-booking/storyboard/` |
| Preview / tweak | `npm run studio` | Remotion Studio at http://localhost:3000 (the `<id>-storyboard` composition updates live) |
| Export | `npm run export -- camp-booking` | `out/camp-booking/*`, plus the files the site uses copied to `../public/assets/projects/camp-booking/` |

A storyboard takes about 20 seconds, so iterate there first: copy, callouts, zoom regions, colors and logo
all show up in it. Only re-export once the board looks right.

A capture takes about 5 minutes, most of it ffmpeg encoding the 4K clips. An export takes several minutes.

## How it fits together

- **Capture** (`apps/<id>/capture.ts`) runs a scripted tour in one continuous take,
  because flows like checkout are stateful. `rec.clip("02-name")` starts the next clip.
  `rec.event("label", locator)` logs a moment, plus the element's box, for syncing.
  `src/capture/recorder.ts` records over the CDP screencast at 2x and cuts one mp4 per clip.
  Launch Chrome with `--window-size=<viewport>` and `--force-device-scale-factor=2` (see the CAMP
  capture script). Without them the screencast sends 1x frames of a shorter window, and the video comes out stretched.
  `src/capture/human.ts` handles the visible cursor, eased mouse moves and scrolling, typing, and pauses.
  To re-shoot one beat, re-run the whole capture. Clip lengths and event times
  update in `events.json`, and the config follows them by label.
- **Compose** (`src/remotion/`) does the title card, then one beat per clip inside a browser frame
  with spring zooms and callouts, then the outro. A second composition, `<id>-loop`, is the
  seamless hover loop.
- **Config** (`apps/<id>/video.config.ts`) holds all copy, colors, timing, speeds, zoom regions
  and loop/poster choice. Regions are in the app's CSS pixels, so take them from
  `events.json` boxes or from screenshots. `at` values are seconds or event labels with an offset.

## Template and storyboard

`src/remotion/template.tsx` is the shared look for every app: title card (with optional `logo`),
browser window, callout column and outro. Change it there and every app's video and storyboard follow.

The storyboard renders that template with one still screenshot per beat in place of the clip, with
animations settled and the camera at the zoom in effect at that moment. Each panel has a caption
strip with clip, duration, speed and screenshot time.

- Screenshots are `public/<id>/storyboard/<clip>.jpg`, at the capture viewport's aspect ratio.
  Missing ones are grabbed from the clips; `--reshoot` re-grabs them all, for example after a new capture.
- The moment shown is the beat's `board` (an `At`), defaulting to `callout.at`.
- It still reads clip durations and event times from `events.json`, so a new app needs one capture
  before its first storyboard. After that, swapping in screenshots and editing the config needs no re-capture.

## Exports

`out/<id>/`:
- `master.mp4`: 1080p H.264 at CRF 16
- `web-{1080,720}.{mp4,webm}`: no audio, faststart, made for muted autoplay loops
- `loop-{1080,720}.{mp4,webm}`: hover loop
- `poster.jpg`: frame at `posterAt`

## Adding an app

1. `apps/<id>/capture.ts`: copy the CAMP one and write the new tour.
2. `apps/<id>/video.config.ts`: copy and edit. Put a logo in `public/<id>/` if it has one.
3. Add the config to `apps` in `src/remotion/Root.tsx`.
4. `npm run capture <id>`, then `npm run storyboard -- <id>` and `npm run studio` to tune, then `npm run export -- <id>`.

## Notes for the CAMP capture

Reaching checkout creates a real cart that holds 2 GA seats for about 10 minutes. Nothing is
purchased. The script picks a date about a week out and steps forward if a day has no slots.
