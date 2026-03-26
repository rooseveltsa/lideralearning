import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from 'remotion';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Colors
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
   Animated Background
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const AnimatedBg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const gradientAngle = interpolate(frame, [0, 450], [135, 200]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${COLORS.dark} 0%, ${COLORS.darkBlue} 40%, #0D2847 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Floating orbs */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.blue}30, transparent 70%)`,
          top: -100 + Math.sin(frame * 0.02) * 30,
          right: -150 + Math.cos(frame * 0.015) * 20,
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.orange}20, transparent 70%)`,
          bottom: -100 + Math.cos(frame * 0.02) * 25,
          left: -100 + Math.sin(frame * 0.018) * 15,
          filter: 'blur(80px)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slide 1: Logo + Tagline (0-90 frames = 3s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [30, 50], [30, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' });

  // Dot pulse
  const dotScale = interpolate(frame, [0, 15, 30], [0, 1.3, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transform: `scale(${logoScale})`,
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-2px',
          }}
        >
          Lidera
        </span>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: COLORS.lightBlue,
            transform: `scale(${dotScale})`,
            boxShadow: `0 0 20px ${COLORS.lightBlue}80`,
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 40,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '6px',
            textTransform: 'uppercase',
          }}
        >
          TREINAMENTOS
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 60,
          opacity: subtitleOpacity,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.gray,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.5,
          }}
        >
          Transformando supervisores operacionais em{' '}
          <span style={{ color: COLORS.white, fontWeight: 700 }}>
            líderes estratégicos
          </span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slide 2: O Problema (90-180 frames = 3s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideProblema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberSpring = spring({ frame, fps, config: { damping: 15, stiffness: 60 } });
  const number = Math.round(interpolate(numberSpring, [0, 1], [0, 65]));

  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const lineWidth = interpolate(frame, [10, 50], [0, 600], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Big Number */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <span
          style={{
            fontSize: 200,
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
            fontSize: 100,
            fontWeight: 900,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
            marginBottom: 15,
          }}
        >
          %
        </span>
      </div>

      {/* Divider line */}
      <div
        style={{
          height: 3,
          width: lineWidth,
          backgroundColor: COLORS.orange,
          marginTop: 30,
          marginBottom: 30,
          borderRadius: 2,
          opacity: 0.6,
        }}
      />

      {/* Text */}
      <div
        style={{
          opacity: textOpacity,
          textAlign: 'center',
          maxWidth: 750,
        }}
      >
        <span
          style={{
            fontSize: 38,
            fontWeight: 500,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.6,
          }}
        >
          dos supervisores são promovidos por{' '}
          <span style={{ fontWeight: 800 }}>competência técnica</span>
        </span>
      </div>

      <div
        style={{
          marginTop: 30,
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' }),
          textAlign: 'center',
          maxWidth: 750,
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.gray,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.6,
          }}
        >
          mas apenas <span style={{ color: COLORS.lightBlue, fontWeight: 800 }}>30%</span>{' '}
          recebem formação em liderança
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Slide 3: A Solução / Módulos (180-300 = 4s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideSolucao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const modules = [
    { icon: '🎯', label: 'Função Estratégica' },
    { icon: '🧠', label: 'Inteligência Comportamental' },
    { icon: '⚖️', label: 'Alicerce Ético' },
    { icon: '🌍', label: 'Diversidade Geracional' },
    { icon: '👥', label: 'Engenharia de Equipes' },
    { icon: '🤖', label: 'Supervisor 4.0' },
    { icon: '📊', label: 'Padrões de Sucesso' },
    { icon: '🚀', label: 'Estratégia e Futuro' },
  ];

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: 70,
      }}
    >
      {/* Title */}
      <div style={{ opacity: titleOpacity, marginBottom: 20 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          8 MÓDULOS · 2 DIAS · 16H
        </span>
      </div>

      <div style={{ opacity: titleOpacity, marginBottom: 50 }}>
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.3,
          }}
        >
          Da Operação{'\n'}à Liderança
        </span>
      </div>

      {/* Module grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {modules.map((mod, i) => {
          const delay = i * 8 + 15;
          const modSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 100 },
          });
          const opacity = interpolate(modSpring, [0, 1], [0, 1], { extrapolateLeft: 'clamp' });
          const translateX = interpolate(modSpring, [0, 1], [-40, 0], { extrapolateLeft: 'clamp' });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                opacity,
                transform: `translateX(${translateX}px)`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: `${COLORS.blue}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  border: `1px solid ${COLORS.blue}40`,
                }}
              >
                {mod.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: COLORS.lightBlue,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: COLORS.white,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  {mod.label}
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
   Slide 4: Resultados (300-390 = 3s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideResultados: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const results = [
    { value: '+79%', label: 'Engajamento' },
    { value: '-40%', label: 'Turnover' },
    { value: '3x', label: 'Produtividade' },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <div style={{ marginBottom: 60, textAlign: 'center' }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: COLORS.orange,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          RESULTADOS COMPROVADOS
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'center' }}>
        {results.map((r, i) => {
          const delay = i * 15 + 10;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 80 },
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
                    fontSize: 120,
                    fontWeight: 900,
                    color: i === 2 ? COLORS.gold : COLORS.white,
                    fontFamily: 'system-ui, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {r.value}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span
                  style={{
                    fontSize: 30,
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
   Slide 5: CTA Final (390-450 = 2s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const ctaOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [20, 40], [40, 0], { extrapolateRight: 'clamp' });

  // Pulsing glow
  const pulse = interpolate(frame, [0, 30, 60], [0.5, 1, 0.5], {
    extrapolateRight: 'extend',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transform: `scale(${logoScale})`,
          marginBottom: 60,
        }}
      >
        <span
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Lidera
        </span>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: COLORS.lightBlue,
            boxShadow: `0 0 ${20 * pulse}px ${COLORS.lightBlue}`,
          }}
        />
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.orange}, #FF9800)`,
            borderRadius: 24,
            padding: '28px 60px',
            boxShadow: `0 8px 30px ${COLORS.orange}40`,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '1px',
            }}
          >
            FAÇA SEU DIAGNÓSTICO
          </span>
        </div>

        <div style={{ marginTop: 30 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: COLORS.gray,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            lideralearning.vercel.app
          </span>
        </div>

        <div style={{ marginTop: 50 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: COLORS.lightBlue,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Claudemir Domingos · Mentor de Líderes
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Progress bar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: 50,
        left: 40,
        right: 40,
        display: 'flex',
        gap: 6,
        zIndex: 100,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const segStart = (i / 5) * 100;
        const segEnd = ((i + 1) / 5) * 100;
        const segProgress = interpolate(progress, [segStart, segEnd], [0, 100], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${segProgress}%`,
                height: '100%',
                backgroundColor: COLORS.white,
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Composition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const LideraStories: React.FC = () => {
  return (
    <AnimatedBg>
      <ProgressBar />

      <Sequence from={0} durationInFrames={90}>
        <SlideIntro />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <SlideProblema />
      </Sequence>

      <Sequence from={180} durationInFrames={120}>
        <SlideSolucao />
      </Sequence>

      <Sequence from={300} durationInFrames={90}>
        <SlideResultados />
      </Sequence>

      <Sequence from={390} durationInFrames={60}>
        <SlideCTA />
      </Sequence>
    </AnimatedBg>
  );
};
