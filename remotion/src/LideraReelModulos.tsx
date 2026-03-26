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
   Module Data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const MODULES = [
  {
    num: 1,
    title: 'A Função Estratégica',
    topics: ['5 dimensões do líder', 'Ciclo de sucessão', 'Papel estratégico'],
    day: 1,
    period: 'Manhã',
    icon: '🎯',
  },
  {
    num: 2,
    title: 'Inteligência Comportamental',
    topics: ['Fórmula E.I.A.', 'Escuta ativa', 'Gestão emocional'],
    day: 1,
    period: 'Manhã',
    icon: '🧠',
  },
  {
    num: 3,
    title: 'Alicerce Ético',
    topics: ['Tribunal das Virtudes', 'Integridade', 'Cultura de confiança'],
    day: 1,
    period: 'Tarde',
    icon: '⚖️',
  },
  {
    num: 4,
    title: 'Diversidade Geracional',
    topics: ['Gerações X, Y, Z', 'Mentoria reversa', 'Inclusão ativa'],
    day: 1,
    period: 'Tarde',
    icon: '🌍',
  },
  {
    num: 5,
    title: 'Engenharia de Equipes',
    topics: ['Matriz competência x compromisso', 'Times de alta performance'],
    day: 2,
    period: 'Manhã',
    icon: '👥',
  },
  {
    num: 6,
    title: 'Supervisor 4.0',
    topics: ['IA para líderes', 'Prompt Mágico', 'KPI Bússola'],
    day: 2,
    period: 'Manhã',
    icon: '🤖',
  },
  {
    num: 7,
    title: 'Padrões de Sucesso',
    topics: ['Tríade da Maestria', 'Metas SMART', 'Rotinas de excelência'],
    day: 2,
    period: 'Tarde',
    icon: '📊',
  },
  {
    num: 8,
    title: 'Estratégia e Futuro',
    topics: ['PDI pessoal', '12 semanas', 'Plano de sucessão'],
    day: 2,
    period: 'Tarde',
    icon: '🚀',
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Animated Background
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const AnimatedBg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const gradientAngle = interpolate(frame, [0, 900], [135, 280]);

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
   Progress Bar (10 segments)
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
        gap: 5,
        zIndex: 100,
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const segStart = (i / 10) * 100;
        const segEnd = ((i + 1) / 10) * 100;
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
   Intro Slide: "8 Módulos que transformam"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

  // Animated counter 1..8
  const counterSpring = spring({ frame, fps, config: { damping: 18, stiffness: 40 } });
  const counterValue = Math.round(interpolate(counterSpring, [0, 1], [0, 8]));

  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [30, 50], [30, 0], { extrapolateRight: 'clamp' });

  const tagOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Animated Number */}
      <div style={{ transform: `scale(${logoScale})` }}>
        <span
          style={{
            fontSize: 260,
            fontWeight: 900,
            color: COLORS.lightBlue,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
            textShadow: `0 0 60px ${COLORS.lightBlue}50`,
          }}
        >
          {counterValue}
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 20,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.3,
          }}
        >
          Módulos que{'\n'}transformam
        </span>
      </div>

      {/* Tag */}
      <div
        style={{
          marginTop: 40,
          opacity: tagOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: `${COLORS.orange}20`,
            border: `2px solid ${COLORS.orange}60`,
            borderRadius: 16,
            padding: '14px 40px',
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: COLORS.orange,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            2 DIAS · 16 HORAS
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Module Slide (reusable per module)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideModule: React.FC<{ moduleIndex: number }> = ({ moduleIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mod = MODULES[moduleIndex];

  const dayColor = mod.day === 1 ? COLORS.lightBlue : COLORS.orange;

  // Entry animations
  const iconScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

  const numberSpring = spring({ frame: frame - 5, fps, config: { damping: 15, stiffness: 60 } });
  const animatedNum = Math.round(interpolate(numberSpring, [0, 1], [0, mod.num]));

  const titleOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [10, 25], [40, 0], { extrapolateRight: 'clamp' });

  // Exit fade (last 10 frames of 75-frame slide)
  const exitOpacity = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        padding: '0 80px',
        opacity: exitOpacity,
      }}
    >
      {/* Day + Period badges */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginBottom: 40,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: `${dayColor}20`,
            border: `2px solid ${dayColor}50`,
            borderRadius: 12,
            padding: '10px 24px',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: dayColor,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            D{mod.day}
          </span>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 12,
            padding: '10px 24px',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: COLORS.gray,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {mod.period}
          </span>
        </div>
      </div>

      {/* Icon + Module number */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: `${dayColor}20`,
            border: `2px solid ${dayColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 42,
            transform: `scale(${iconScale})`,
          }}
        >
          {mod.icon}
        </div>
        <span
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: `${dayColor}40`,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          {String(animatedNum).padStart(2, '0')}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 50,
        }}
      >
        <span
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.2,
          }}
        >
          {mod.title}
        </span>
      </div>

      {/* Bullet points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {mod.topics.map((topic, i) => {
          const delay = i * 8 + 18;
          const bulletSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 100 },
          });
          const bulletOpacity = interpolate(bulletSpring, [0, 1], [0, 1], {
            extrapolateLeft: 'clamp',
          });
          const bulletX = interpolate(bulletSpring, [0, 1], [-30, 0], {
            extrapolateLeft: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: dayColor,
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${dayColor}60`,
                }}
              />
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 500,
                  color: COLORS.gray,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {topic}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom divider accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 80,
          width: interpolate(frame, [0, 40], [0, 300], { extrapolateRight: 'clamp' }),
          height: 3,
          backgroundColor: dayColor,
          borderRadius: 2,
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CTA Slide: "Faça seu Diagnóstico Gratuito"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SlideCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const ctaOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' });
  const ctaY = interpolate(frame, [15, 35], [40, 0], { extrapolateRight: 'clamp' });

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

      {/* CTA Button */}
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
            padding: '28px 50px',
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
            DIAGNÓSTICO GRATUITO
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
   Main Composition — 30s Reel
   Intro (75f) + 8 modules (75f each = 600f) + CTA (225f) = 900f
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export const LideraReelModulos: React.FC = () => {
  const INTRO_DURATION = 75; // 2.5s
  const MODULE_DURATION = 75; // 2.5s each
  const CTA_START = INTRO_DURATION + MODULE_DURATION * 8; // 675
  const CTA_DURATION = 225; // remaining to fill 900

  return (
    <AnimatedBg>
      <ProgressBar />

      {/* Intro */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <SlideIntro />
      </Sequence>

      {/* 8 Module slides */}
      {MODULES.map((_, i) => (
        <Sequence
          key={i}
          from={INTRO_DURATION + i * MODULE_DURATION}
          durationInFrames={MODULE_DURATION}
        >
          <SlideModule moduleIndex={i} />
        </Sequence>
      ))}

      {/* CTA */}
      <Sequence from={CTA_START} durationInFrames={CTA_DURATION}>
        <SlideCTA />
      </Sequence>
    </AnimatedBg>
  );
};
