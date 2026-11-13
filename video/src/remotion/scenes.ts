// Animated stand-ins for screen recordings, by app id. Remotion passes configs as JSON props,
// so components can't live in the config. A scene is drawn at `frame` (stage frames) in place
// of the clips, through the camera `cam` (as its viewBox: Chrome paints a CSS-scaled SVG stale
// once parts leave the frame and come back), and the app's `capture` (clip durations, event times) is written by hand.
import type { ComponentType } from "react";
import { PipelineScene } from "../../apps/retail-pipeline/scene";
import type { VideoConfig } from "../types";
import type { Camera } from "./timeline";

export const scenes: Record<
  string,
  ComponentType<{ c: VideoConfig; frame: number; cam: Camera }>
> = { "retail-pipeline": PipelineScene };
