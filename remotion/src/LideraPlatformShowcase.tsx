import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

const C = {
  bg: '#050A14',
  card: '#0A1324',
  border: '#22314B',
  blue: '#1E88E5',
  green: '#4CAF50',
  orange: '#F57C00',
  white: '#FFFFFF',
  gray: '#A9BDD8',
  muted: '#7FA0C2',
  dark2: '#060D1A',
};

/* ── Animated Background ── */
const Bg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.blue}12, transparent 70%)`,
          top: -100 + Math.sin(frame * 0.015) * 20,
          right: -100,
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.green}10, transparent 70%)`,
          bottom: -50 + Math.cos(frame * 0.02) * 15,
          left: -50,
          filter: 'blur(60px)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/* ── Scene 1: Dashboard Overview (0-120) ── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const xpWidth = interpolate(frame, [20, 80], [0, 72], { extrapolateRight: 'clamp' });
  const streakScale = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 80 } });
  const exitOp = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60, opacity: exitOp }}>
      {/* Browser chrome mockup */}
      <div style={{ transform: `scale(${cardScale})`, width: 1100, borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: `0 30px 80px rgba(0,0,0,0.5)` }}>
        {/* Browser bar */}
        <div style={{ background: '#0D1728', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4CAF50' }} />
          <div style={{ flex: 1, marginLeft: 12, background: '#1A2E4A', borderRadius: 8, padding: '6px 16px', fontSize: 13, color: C.muted, fontFamily: 'system-ui' }}>
            lideralearning.vercel.app/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{ background: C.bg, padding: 40, display: 'flex', gap: 24 }}>
          {/* Left: XP Card */}
          <div style={{ flex: 1, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${C.blue}, #0B4A8F)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: C.white, fontFamily: 'system-ui' }}>7</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 1.5, textTransform: 'uppercase' as const, fontFamily: 'system-ui' }}>Nível 7</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: 'system-ui' }}>2.450 XP</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' as const }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.orange, fontFamily: 'system-ui' }}>🔥 12</div>
                <div style={{ fontSize: 10, color: C.muted, fontFamily: 'system-ui' }}>dias seguidos</div>
              </div>
            </div>

            {/* XP Progress bar */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.muted, fontFamily: 'system-ui' }}>
                <span>Nível 7</span><span>Nível 8</span>
              </div>
              <div style={{ marginTop: 6, height: 10, borderRadius: 5, background: '#1A2E4A', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 5, width: `${xpWidth}%`, background: `linear-gradient(90deg, ${C.blue}, #42A5F5)`, transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* Stats */}
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              {[{ v: '185', l: 'XP semana', c: C.blue }, { v: '12', l: 'Streak', c: C.orange }, { v: '23', l: 'Maior', c: C.green }].map((s, i) => (
                <div key={i} style={{ flex: 1, background: '#0D1B30', borderRadius: 10, padding: '12px 8px', textAlign: 'center' as const, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.white, fontFamily: 'system-ui' }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: C.muted, fontFamily: 'system-ui' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Achievements */}
          <div style={{ width: 420, display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: 'system-ui', marginBottom: 4 }}>Conquistas recentes</div>
            {[
              { icon: '🎯', title: 'Primeiro Passo', desc: 'Completou a primeira aula', color: C.blue, delay: 0 },
              { icon: '🔥', title: 'Semana Perfeita', desc: '7 dias seguidos de estudo', color: C.orange, delay: 15 },
              { icon: '🎓', title: 'Graduado', desc: 'Primeiro curso completo', color: C.green, delay: 30 },
            ].map((a, i) => {
              const s = spring({ frame: frame - 40 - a.delay, fps, config: { damping: 12, stiffness: 80 } });
              return (
                <div key={i} style={{
                  transform: `scale(${Math.min(s, 1)}) translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
                  opacity: Math.min(s, 1),
                  background: `${a.color}10`,
                  border: `1px solid ${a.color}30`,
                  borderRadius: 14,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: 'system-ui' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: C.gray, fontFamily: 'system-ui' }}>{a.desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: a.color, fontFamily: 'system-ui' }}>+50 XP</div>
                </div>
              );
            })}

            {/* Streak animation */}
            <div style={{
              transform: `scale(${Math.min(streakScale, 1)})`,
              marginTop: 8,
              background: `${C.orange}08`,
              border: `1px solid ${C.orange}20`,
              borderRadius: 14,
              padding: 18,
              textAlign: 'center' as const,
            }}>
              <div style={{ fontSize: 32 }}>⚡</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, fontFamily: 'system-ui', marginTop: 4 }}>Streak ativo!</div>
              <div style={{ fontSize: 11, color: C.gray, fontFamily: 'system-ui' }}>Continue amanhã para manter</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 2: Assessment + PDI (120-240) ── */
const SceneAssessment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const exitOp = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const dimensions = ['Facilitador', 'Orientador', 'Garantidor', 'Estrategista', 'Mentor'];
  const scores = [4.2, 3.1, 4.8, 2.5, 3.7];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60, opacity: exitOp }}>
      <div style={{ transform: `scale(${cardScale})`, width: 1100, display: 'flex', gap: 24 }}>
        {/* Left: Assessment */}
        <div style={{ flex: 1, background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: 32, boxShadow: `0 20px 60px rgba(0,0,0,0.4)` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: 2, textTransform: 'uppercase' as const, fontFamily: 'system-ui' }}>Autoavaliação</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.white, fontFamily: 'system-ui', marginTop: 8 }}>5 Dimensões da Liderança</div>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
            {dimensions.map((dim, i) => {
              const barWidth = interpolate(frame, [20 + i * 8, 50 + i * 8], [0, scores[i] / 5 * 100], { extrapolateRight: 'clamp' });
              const colors = [C.blue, C.orange, C.green, '#F44336', '#7CB342'];
              return (
                <div key={dim}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: 'system-ui' }}>{dim}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: colors[i], fontFamily: 'system-ui' }}>{scores[i].toFixed(1)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#1A2E4A', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${barWidth}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: PDI */}
        <div style={{ width: 420, background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, padding: 32, boxShadow: `0 20px 60px rgba(0,0,0,0.4)` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 2, textTransform: 'uppercase' as const, fontFamily: 'system-ui' }}>Gerado automaticamente</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: 'system-ui', marginTop: 8 }}>Seu PDI</div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            {[
              { text: 'Desenvolver visão estratégica', priority: 'Alta', c: '#F44336' },
              { text: 'Praticar feedback assertivo', priority: 'Alta', c: C.orange },
              { text: 'Implementar mentoria reversa', priority: 'Média', c: C.blue },
              { text: 'Fortalecer delegação eficaz', priority: 'Média', c: C.green },
            ].map((item, i) => {
              const op = interpolate(frame, [40 + i * 12, 55 + i * 12], [0, 1], { extrapolateRight: 'clamp' });
              const x = interpolate(frame, [40 + i * 12, 55 + i * 12], [20, 0], { extrapolateRight: 'clamp' });
              return (
                <div key={i} style={{ opacity: op, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 12, background: '#0D1B30', borderRadius: 10, padding: '12px 16px', border: `1px solid ${C.border}` }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: `${C.green}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, color: C.green }}>✓</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.white, fontFamily: 'system-ui' }}>{item.text}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: item.c, background: `${item.c}15`, padding: '3px 8px', borderRadius: 6, fontFamily: 'system-ui' }}>{item.priority}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, background: `${C.green}10`, border: `1px solid ${C.green}20`, borderRadius: 12, padding: 16, textAlign: 'center' as const }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: 'system-ui' }}>Roteiro de 12 semanas gerado</div>
            <div style={{ fontSize: 10, color: C.gray, fontFamily: 'system-ui', marginTop: 4 }}>Baseado na sua autoavaliação</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 3: CTA (240-300) ── */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${s})`, textAlign: 'center' as const }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 52, fontWeight: 900, color: C.white, fontFamily: 'system-ui' }}>Lidera</span>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.green }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.gray, fontFamily: 'system-ui' }}>
          Treinamentos, Mentorias e Palestras
        </div>
        <div style={{
          marginTop: 30,
          background: `linear-gradient(135deg, ${C.orange}, #FF9800)`,
          borderRadius: 16,
          padding: '16px 40px',
          display: 'inline-block',
          boxShadow: `0 8px 30px ${C.orange}40`,
        }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: 'system-ui' }}>COMECE SEU DIAGNÓSTICO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Main Composition — 10s (300 frames @ 30fps) ── */
export const LideraPlatformShowcase: React.FC = () => {
  return (
    <Bg>
      <Sequence from={0} durationInFrames={120}>
        <SceneDashboard />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <SceneAssessment />
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <SceneCTA />
      </Sequence>
    </Bg>
  );
};
