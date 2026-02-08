import React from "react";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { WelcomeScreen } from "./scenes/WelcomeScreen";
import { UserTyping } from "./scenes/UserTyping";
import { FetchContent } from "./scenes/FetchContent";
import { GuideScroll } from "./scenes/GuideScroll";
import { AgentExecution } from "./scenes/AgentExecution";
import {
  SCENE_1_DURATION,
  SCENE_2_DURATION,
  SCENE_3_DURATION,
  SCENE_4_DURATION,
  SCENE_4B_DURATION,
  TRANSITION_DURATION,
} from "./constants";

loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const transitionTiming = linearTiming({ durationInFrames: TRANSITION_DURATION });

export const DearAiPromo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE_1_DURATION}>
        <WelcomeScreen />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={transitionTiming}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_2_DURATION}>
        <UserTyping />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={transitionTiming}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_3_DURATION}>
        <FetchContent />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={transitionTiming}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_4_DURATION}>
        <GuideScroll />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={transitionTiming}
      />

      <TransitionSeries.Sequence durationInFrames={SCENE_4B_DURATION}>
        <AgentExecution />
      </TransitionSeries.Sequence>

    </TransitionSeries>
  );
};
