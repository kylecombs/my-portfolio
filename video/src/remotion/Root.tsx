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
import campPhone from "../../apps/camp-booking-mobile/video.config";
import wobblePhone from "../../apps/wobble-coffee-mobile/video.config";
import { Loop } from "./Loop";
import { Main, MainMobile } from "./Main";
import { CAPTION, Storyboard, storyboardFrames } from "./Storyboard";
import { MOBILE } from "./template";
import { timeline } from "./timeline";

// One entry per app. Adding an app = apps/<id>/{capture,video.config}.ts + a line here.
const apps = [camp, retail, shopifyAdmin, ora, agentWorkflow, arxIpfs, rexbyCreator, rexbyVideo, fmSynth, wobbleCoffee];
// Apps re-recorded at a phone viewport (apps/<id>-mobile/): their <id>-mobile cut uses that config instead.
const phone = Object.fromEntries(
  [campPhone, wobblePhone].map((c) => [c.id, c])
);

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
          key={`${c.id}-mobile`}
          id={`${c.id}-mobile`}
          component={MainMobile}
          defaultProps={{ c: phone[`${c.id}-mobile`] ?? c }}
          durationInFrames={timeline(phone[`${c.id}-mobile`] ?? c).total}
          fps={c.fps}
          width={MOBILE.width}
          height={MOBILE.height}
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
