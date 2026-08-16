import type { HudInfo } from "../hooks/useHud";

type Props = HudInfo;

export function HudBar({ notesCount, memKb, uptime, clock }: Props) {
  return (
    <div className="hud-bar" data-testid="hud-bar">
      <div className="hud-item"><span className="dot"></span><span>SYS.ONLINE</span></div>
      <div className="hud-item"><span className="dot cyan"></span><span data-testid="hud-notes">{notesCount} NOTES</span></div>
      <div className="hud-item"><span className="dot amber"></span><span data-testid="hud-mem">MEM {memKb.toFixed(1)}KB</span></div>
      <div className="hud-spacer"></div>
      <div className="hud-item"><span>UPTIME</span><span data-testid="hud-uptime">{uptime}</span></div>
      <div className="hud-item"><span className="hud-clock" data-testid="hud-clock">{clock}</span></div>
    </div>
  );
}
