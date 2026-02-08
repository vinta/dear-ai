import { Composition } from "remotion";
import { DearAiPromo } from "./DearAiPromo";
import { FPS, WIDTH, HEIGHT, TOTAL_DURATION } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DearAiPromo"
      component={DearAiPromo}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
