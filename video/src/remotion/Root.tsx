import { Composition, registerRoot } from "remotion";
import camp from "../../apps/camp-booking/video.config";
import retail from "../../apps/retail-pipeline/video.config";
import shopifyAdmin from "../../apps/shopify-admin/video.config";
import ora from "../../apps/ora/video.config";
import agentWorkflow from "../../apps/agent-workflow/video.config";
import arxIpfs from "../../apps/arx-ipfs/video.config";
import rexbyCreator from "../../apps/rexby-creator/video.config";
import rexbyVideo from "../../apps/rexby-video/video.config";
import fmSynth from "../../apps/fm-synth/video.config";
import wobbleCoffee from "../../apps/wobble-coffee/video.config";
import { Loop } from "./Loop";
import { Main } from "./Main";
import { CAPTION, Storyboard, storyboardFrames } from "./Storyboard";
import { timeline } from "./timeline";

// One entry per app. Adding an app = apps/<id>/{capture,video.config}.ts + a line here.
const apps = [camp, retail, shopifyAdmin, ora, agentWorkflow, arxIpfs, rexbyCreator, rexbyVideo, fmSynth, wobbleCoffee];

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
