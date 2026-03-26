import { Composition } from 'remotion';
import { LideraStories } from './LideraStories';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LideraStories"
        component={LideraStories}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
