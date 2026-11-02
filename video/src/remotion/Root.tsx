import { Composition, registerRoot } from "remotion";
import camp from "../../apps/camp-booking/video.config";
import { Loop } from "./Loop";
import { Main } from "./Main";
import { CAPTION, Storyboard, storyboardFrames } from "./Storyboard";
import { timeline } from "./timeline";

// One entry per app. Adding an app = apps/<id>/{capture,video.config}.ts + a line here.
const apps = [camp];

function Root() {
  return (
    <>
      {apps.map((c) => (
        <Composition
          key={c.id}
          id={c.id}
          component={Main}
          defaultProps={{ c }}
          durationInFrames={timeline(c).total}
          fps={c.fps}
          width={1920}
          height={1080}
        />
      ))}
      {apps.map((c) => (
        <Composition
          key={`${c.id}-loop`}
          id={`${c.id}-loop`}
          component={Loop}
          defaultProps={{ c }}
          durationInFrames={Math.round(c.loop.seconds * c.fps)}
          fps={c.fps}
          width={1920}
          height={1080}
        />
      ))}
      {apps.map((c) => (
        <Composition
          key={`${c.id}-storyboard`}
          id={`${c.id}-storyboard`}
          component={Storyboard}
          defaultProps={{ c }}
          durationInFrames={storyboardFrames(c)}
          fps={1}
          width={1920}
          height={1080 + CAPTION}
        />
      ))}
    </>
  );
}

registerRoot(Root);
