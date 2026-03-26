import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Colors (shared design tokens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const COLORS = {
  dark: '#060D1A',
  darkBlue: '#0B1D36',
  blue: '#1565C0',
  lightBlue: '#1E88E5',
  orange: '#F57C00',
  white: '#FFFFFF',
  gray: '#A9BDD8',
  gold: '#FFB300',
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Animated Background (horizontal)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const AnimatedBg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const gradientAngle = interpolate(frame, [0, 300], [135, 220]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${COLORS.dark} 0%, ${COLORS.darkBlue} 40%, #0D2847 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Large ambient orb */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.blue}25, transparent 70%)`,
          top: -200 + Math.sin(frame * 0.025) * 40,
          right: -300 + Math.cos(frame * 0.02) * 30,
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.orange}15, transparent 70%)`,
          bottom: -200 + Math.cos(frame * 0.025) * 30,
          left: -200 + Math.sin(frame * 0.02) * 25,
          filter: 'blur(100px)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Particle System for Logo Scene
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Particles: React.FC = () => {
  const frame = useCurrentFrame();

  // Generate deterministic particles
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const seed = i * 137.508; // golden angle for distribution
    const angle = (seed % 360) * (Math.PI / 180);
    const speed = 1.5 + (i % 5) * 0.8;
    const startRadius = 20 + (i % 8) * 10;
    const radius = startRadius + frame * speed;
    const opacity = interpolate(frame, [0, 10, 50, 60], [0, 0.8, 0.6, 0], {
      extrapolateRight: 'clamp',
    });
    const size = 3 + (i % 4) * 2;

    const x = 960 + Math.cos(angle) * radius;
    const y = 540 + Math.sin(angle) * radius;
    const color = i % 3 === 0 ? COLORS.orange : COLORS.lightBlue;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          opacity,
          boxShadow: `0 0 ${size * 3}px ${color}80`,
        }}
      />
    );
  });

  return <>{particles}</>;
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Scene 1: Logo + Particles (0-60 frames)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SceneLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 10, stiffness: 60 } });
  const dotScale = interpolate(frame, [0, 12, 25], [0, 1.4, 1], { extrapolateRight: 'clamp' });

  const tagOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });
  const tagY = interpolate(frame, [20, 35], [20, 0], { extrapolateRight: 'clamp' });

  // Exit fade
  const exitOpacity = interpolate(frame, [48, 60], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitOpacity,
      }}
    >
      <Particles />

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transform: `scale(${logoScale})`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-3px',
          }}
        >
          Lidera
        </span>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: COLORS.lightBlue,
            transform: `scale(${dotScale})`,
            boxShadow: `0 0 30px ${COLORS.lightBlue}80`,
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 20,
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '8px',
            textTransform: 'uppercase',
          }}
        >
          TREINAMENTOS
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Scene 2: Problem Statement (60-120 frames)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberSpring = spring({ frame, fps, config: { damping: 15, stiffness: 50 } });
  const number = Math.round(interpolate(numberSpring, [0, 1], [0, 65]));

  const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  const lineWidth = interpolate(frame, [5, 40], [0, 400], { extrapolateRight: 'clamp' });

  // Exit
  const exitOpacity = interpolate(frame, [48, 60], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
        opacity: exitOpacity,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span
          style={{
            fontSize: 180,
            fontWeight: 900,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          {number}
        </span>
        <span
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          %
        </span>
      </div>

      <div
        style={{
          height: 3,
          width: lineWidth,
          backgroundColor: COLORS.orange,
          marginTop: 20,
          marginBottom: 20,
          borderRadius: 2,
          opacity: 0.6,
        }}
      />

      <div style={{ opacity: textOpacity, textAlign: 'center', maxWidth: 900 }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.5,
          }}
        >
          são promovidos{' '}
          <span style={{ color: COLORS.orange, fontWeight: 800 }}>sem formação</span> em liderança
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Scene 3: Solution (120-180 frames)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  const tagOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' });

  // Exit
  const exitOpacity = interpolate(frame, [48, 60], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
        opacity: exitOpacity,
      }}
    >
      {/* Tag */}
      <div style={{ opacity: tagOpacity, marginBottom: 24 }}>
        <div
          style={{
            backgroundColor: `${COLORS.lightBlue}20`,
            border: `2px solid ${COLORS.lightBlue}50`,
            borderRadius: 14,
            padding: '10px 32px',
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.lightBlue,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            8 MÓDULOS · 2 DIAS
          </span>
        </div>
      </div>

      {/* Title */}
      <div style={{ transform: `scale(${titleScale})`, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.2,
          }}
        >
          Programa de 16h
        </span>
      </div>

      <div style={{ opacity: subtitleOpacity, marginTop: 20, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: COLORS.gray,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          que{' '}
          <span style={{ color: COLORS.gold, fontWeight: 800 }}>transforma</span> supervisores
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Scene 4: Results (180-240 frames)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SceneResults: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const results = [
    { value: '+79%', label: 'Engajamento', color: COLORS.lightBlue },
    { value: '-40%', label: 'Turnover', color: COLORS.orange },
    { value: '3x', label: 'Produtividade', color: COLORS.gold },
  ];

  // Exit
  const exitOpacity = interpolate(frame, [48, 60], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 80,
          alignItems: 'center',
        }}
      >
        {results.map((r, i) => {
          const delay = i * 10;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 10, stiffness: 80 },
          });

          return (
            <div
              key={i}
              style={{
                textAlign: 'center',
                transform: `scale(${s})`,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 100,
                    fontWeight: 900,
                    color: r.color,
                    fontFamily: 'system-ui, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {r.value}
                </span>
              </div>
              <div style={{ marginTop: 10 }}>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: COLORS.gray,
                    fontFamily: 'system-ui, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                  }}
                >
                  {r.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Scene 5: CTA (240-300 frames)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const ctaOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [10, 25], [30, 0], { extrapolateRight: 'clamp' });

  const pulse = interpolate(frame, [0, 30, 60], [0.5, 1, 0.5], {
    extrapolateRight: 'extend',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
        {/* Left: Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scale(${logoScale})`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Lidera
            </span>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: COLORS.lightBlue,
                boxShadow: `0 0 ${18 * pulse}px ${COLORS.lightBlue}`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.lightBlue,
              fontFamily: 'system-ui, sans-serif',
              marginTop: 8,
            }}
          >
            Claudemir Domingos
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 2,
            height: 120,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
          }}
        />

        {/* Right: CTA */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.orange}, #FF9800)`,
              borderRadius: 20,
              padding: '24px 48px',
              boxShadow: `0 8px 30px ${COLORS.orange}40`,
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: COLORS.white,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              FAÇA SEU DIAGNÓSTICO
            </span>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: COLORS.gray,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              lideralearning.vercel.app
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Composition — 10s Teaser (300 frames)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const LideraTeaser: React.FC = () => {
  return (
    <AnimatedBg>
      {/* Scene 1: Logo + Particles (0-60) */}
      <Sequence from={0} durationInFrames={60}>
        <SceneLogo />
      </Sequence>

      {/* Scene 2: Problem (60-120) */}
      <Sequence from={60} durationInFrames={60}>
        <SceneProblem />
      </Sequence>

      {/* Scene 3: Solution (120-180) */}
      <Sequence from={120} durationInFrames={60}>
        <SceneSolution />
      </Sequence>

      {/* Scene 4: Results (180-240) */}
      <Sequence from={180} durationInFrames={60}>
        <SceneResults />
      </Sequence>

      {/* Scene 5: CTA (240-300) */}
      <Sequence from={240} durationInFrames={60}>
        <SceneCTA />
      </Sequence>
    </AnimatedBg>
  );
};
