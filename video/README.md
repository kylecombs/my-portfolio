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
- `poster.jpg`: frame at `posterAt` (the open card shows it until the video plays)
- `thumb.jpg`: the title card at 1.3s, shown on the collapsed card under a play button

## Adding an app

1. `apps/<id>/capture.ts`: copy the CAMP one and write the new tour.
2. `apps/<id>/video.config.ts`: copy and edit. Put a logo in `public/<id>/` if it has one.
3. Add the config to `apps` in `src/remotion/Root.tsx`.
4. `npm run capture <id>`, then `npm run storyboard -- <id>` and `npm run studio` to tune, then `npm run export -- <id>`.

## Sound

For apps that make sound (ORA), pass `{ audio: true }` to `startRecorder` and launch Chrome with
`--autoplay-policy=no-user-gesture-required`. The recorder mixes everything the page sends to its
speakers, across every AudioContext, into one recording. It keeps the recording as `clips/audio.webm`
and cuts each clip's stretch into its mp4. Set `audio: true` in the config so the web exports keep the
sound (the hover loop stays silent). On the site, `audio: true` on a `media` entry adds a
mute/unmute button. The video still starts muted, because browsers only autoplay muted video.

## Animated apps (no screen recording)

For internal apps with private data, a beat can show an animated diagram in place of a clip
(see `apps/retail-pipeline/`). `scene.tsx` draws the whole diagram at a given stage frame. It's
registered by id in `src/remotion/scenes.ts`, because Remotion passes configs as JSON props.
The config writes its `capture` by hand: clip ids and durations, plus any event times. There's no
capture step, and the storyboard draws the scene itself. The stage drops the address bar when
`url` is empty. The camera is applied as the SVG's `viewBox`: Chrome paints a CSS-scaled SVG stale
once parts of it leave the frame and come back.

## Workflow for a new video

The process the CAMP video went through, and the rules it followed:

- **Spec:** 20–40s total, about 6 beats of a few seconds each. Hide dev overlays, cookie banners and
  popups, and any real customer data. Don't show my name anywhere. Never complete a purchase or a
  real submission; stop at the step before.
- **Callout copy:** a short label plus one plain sentence on what the user sees or can do. Match labels
  to the app's own button text where it has one.
- **Loop:**
  1. Write `capture.ts` and `video.config.ts`, then run one capture.
  2. Run the storyboard and review the contact sheet (`out/<id>/storyboard.jpg`). Give notes on
     copy, zooms and framing, then re-run it. Most rounds need no re-capture.
  3. Re-capture only when the tour itself changes: timing, scrolling, or what's clicked.
  4. Export, then check frame strips of the changed beats before watching the whole thing.
- **Pitfalls hit so far:**
  - The camera and a page scroll moving at once look jumpy. Add waits in `capture.ts` so the zoom
    and the scroll happen one after the other.
  - The screencast repeats frames during scrolls and drops frames while page video plays. Use an
    `inset` for page video (see the CAMP notes below).
  - Keep the web MP4 under 4MB by raising the CRFs in `scripts/export.sh` if needed.
  - Back up `out/<id>/` and the clips before re-rendering a version you like, for example to
    `out/backups/<id>-<date>/`. Both directories are gitignored.

## Putting it on the site

`npm run export` copies `web-1080.mp4`, `poster.jpg` and `thumb.jpg` to `../public/assets/projects/<id>/`.
In `../app/data/portfolio.ts`, give the project a `media` entry like the CAMP one: `type: "video"`
plus `src`, `poster`, `thumb` and `alt`. Videos get the play button on the collapsed card automatically.

## Notes for the CAMP capture

Reaching checkout creates a real cart that holds 2 GA seats for about 10 minutes. Nothing is
purchased. The script picks a date about a week out and steps forward if a day has no slots.

The screencast drops frames while the page plays video, so the gallery video would stutter. The
config's `inset` draws the source video over it in sync (plus the player's controls). The source is
gitignored with the clips; the fetch command is above `GALLERY_VIDEO` in `apps/camp-booking/video.config.ts`.
After a re-capture, re-measure `sourceAt` (the sync offset) and the `from`/`to` times.
