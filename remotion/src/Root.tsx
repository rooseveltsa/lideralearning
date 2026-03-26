import { Composition } from 'remotion';
import { LideraStories } from './LideraStories';
import { LideraReelModulos } from './LideraReelModulos';
import { LideraTeaser } from './LideraTeaser';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LideraStories"
        component={LideraStories}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LideraReelModulos"
        component={LideraReelModulos}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LideraTeaser"
        component={LideraTeaser}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
