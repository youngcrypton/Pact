import React from 'react';
import { useCurrentFrame } from 'remotion';
import { commonBackgroundStyle } from '../styles.js';
import { OutroCard } from '../components/OutroCard.js';
import { KineticSubtitles } from '../components/KineticSubtitles.js';

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();

  let currentSubtitle = 'Instant DAO bounties.';
  if (frame > 65 && frame <= 135) {
    currentSubtitle = 'Zero voter fatigue.';
  } else if (frame > 135) {
    currentSubtitle = 'Try Pactt today on NEAR Testnet at pactt.xyz';
  }

  return (
    <div style={commonBackgroundStyle}>
      <OutroCard />

      <KineticSubtitles
        tag="LIVE ON TESTNET"
        subtitle={currentSubtitle}
      />
    </div>
  );
};
