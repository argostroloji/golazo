"use client";
import { useEffect, useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useConnect } from "wagmi";
import { GROUPS, MATCHES, TOTAL, type Pick } from "@/lib/worldcup";
import { RegisterButton } from "@/components/RegisterButton";
import { ShareSlip } from "@/components/ShareSlip";
import { Leaderboard } from "@/components/Leaderboard";

type View = "connect" | "predict" | "review" | "success" | "leaderboard";
const flag = (c: string) => `https://flagcdn.com/${c}.svg`;
const chipBg: Record<Pick, string> = { "1": "var(--lime)", X: "var(--amber)", "2": "var(--acc)" };

export default function Page() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const [view, setView] = useState<View>("connect");
  const [group, setGroup] = useState("A");
  const [picks, setPicks] = useState<Record<number, Pick>>({});

  useEffect(() => { if (!isFrameReady) setFrameReady(); }, [isFrameReady, setFrameReady]);
  // In-client the wallet auto-connects — skip the connect screen when it does.
  useEffect(() => { if (isConnected && view === "connect") setView("predict"); }, [isConnected, view]);

  const count = Object.keys(picks).length;
  const progress = Math.round((count / TOTAL) * 100);
  const groupMatches = useMemo(() => MATCHES.filter((m) => m.g === group), [group]);
  const picked = useMemo(() => MATCHES.filter((m) => picks[m.id]), [picks]);
  const groupDone = (g: string) => MATCHES.filter((m) => m.g === g).every((m) => picks[m.id]);
  const groupCount = (g: string) => MATCHES.filter((m) => m.g === g && picks[m.id]).length;

  const username = context?.user?.username
    ? `@${context.user.username}`
    : address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  function setPick(id: number, o: Pick) {
    setPicks((p) => { const n = { ...p }; if (n[id] === o) delete n[id]; else n[id] = o; return n; });
  }
  function fillRandom() {
    setPicks((p) => { const n = { ...p };
      groupMatches.forEach((m) => { n[m.id] = (["1", "X", "2"] as Pick[])[Math.floor(Math.random() * 3)]; });
      return n; });
  }
  function clearGroup() {
    setPicks((p) => { const n = { ...p }; groupMatches.forEach((m) => delete n[m.id]); return n; });
  }

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand"><b>GOLAZO<span className="dot">.</span></b><span className="basechip">on Base</span></div>
        {username && <div className="addr"><span className="av" />{username}</div>}
      </div>

      <div className="scroll">
        {view === "connect" && (
          <div className="hero">
            <div className="crest">🏆</div>
            <div className="eyebrow" style={{ marginTop: 18 }}>World Cup 2026 · Pick'em</div>
            <h1 className="h1" style={{ fontSize: 62 }}>PICK<br />EVERY<br />MATCH.</h1>
            <p className="muted">Predict World Cup 2026 group matches — win, draw or loss. Lock your slip onchain. Free to enter.</p>
            <div className="statline">
              <div className="stat"><div className="n">72</div><div className="l">group matches</div></div>
              <div className="stat"><div className="n acc">12</div><div className="l">groups · A–L</div></div>
              <div className="stat"><div className="n lime">FREE</div><div className="l">gas-only entry</div></div>
            </div>
            <button className="btn" onClick={() => connectors[0] && connect({ connector: connectors[0] })}>
              Connect &amp; play
            </button>
          </div>
        )}

        {view === "predict" && (
          <>
            <div className="phasebar">
              <div><div className="eyebrow">Your slip</div><div className="pct">{count}<small> / {TOTAL} picks</small></div></div>
              <div className="phasetag">Group stage</div>
            </div>
            <div className="prog"><i style={{ width: `${progress}%` }} /></div>
            <div className="tabs">
              {GROUPS.map((x) => (
                <button key={x.g} className={`tab ${x.g === group ? "active" : ""}`} onClick={() => setGroup(x.g)}>
                  {x.g}{groupDone(x.g) && <span className="done">✓</span>}
                </button>
              ))}
            </div>
            <div className="gtitle"><b>Group {group}</b>
              <span style={{ display: "inline-flex", gap: 6, verticalAlign: "middle" }}>
                {GROUPS.find((x) => x.g === group)!.teams.map((t) => <img key={t.code} className="flag" src={flag(t.code)} alt="" />)}
              </span>
            </div>

            {groupMatches.map((m) => {
              const p = picks[m.id];
              return (
                <div className="match" key={m.id}>
                  <div className="mrow">
                    <div className="team"><img className="flag" src={flag(m.home.code)} alt="" /><span className="tname">{m.home.name}</span></div>
                    <span className="mid">#{m.id}</span>
                    <div className="team r"><img className="flag" src={flag(m.away.code)} alt="" /><span className="tname">{m.away.name}</span></div>
                  </div>
                  <div className="picks">
                    <button className={`pick ${p === "1" ? "on" : ""}`} data-o="1" onClick={() => setPick(m.id, "1")}><b>1</b><small>Home</small></button>
                    <button className={`pick ${p === "X" ? "on" : ""}`} data-o="X" onClick={() => setPick(m.id, "X")}><b>X</b><small>Draw</small></button>
                    <button className={`pick ${p === "2" ? "on" : ""}`} data-o="2" onClick={() => setPick(m.id, "2")}><b>2</b><small>Away</small></button>
                  </div>
                </div>
              );
            })}

            <div className="helper">
              <a onClick={fillRandom}>⤬ fill randomly</a>
              <a onClick={clearGroup}>clear group</a>
            </div>
            <div className="hint">Pick as many or as few as you like — only your picks are scored.</div>
            <button className={`btn ${count >= 1 ? "lime" : ""}`} disabled={count < 1} onClick={() => setView("review")}>
              {count >= 1 ? `Review ${count} pick${count > 1 ? "s" : ""} →` : "Make at least one pick"}
            </button>
            <div style={{ height: 14 }} />
          </>
        )}

        {view === "review" && (
          <>
            <div style={{ paddingTop: 18 }}><div className="eyebrow">Final step</div>
              <h1 className="h1" style={{ fontSize: 34 }}>REVIEW &amp; REGISTER</h1></div>
            <div className="card" style={{ marginTop: 18 }}>
              <div className="sumrow"><span className="k">Your picks</span><span className="v">{count} / {TOTAL}</span></div>
              <div className="sumrow"><span className="k">Groups</span><span className="v">12 · A–L</span></div>
              <div style={{ marginTop: 12 }}><div className="grid12">
                {GROUPS.map((x) => { const c = groupCount(x.g); const cls = c === 6 ? "full" : c > 0 ? "part" : "";
                  return <div className={`gpill ${cls}`} key={x.g}>{x.g}</div>; })}
              </div></div>
            </div>
            <div className="hint" style={{ textAlign: "left", margin: "10px 2px 0" }}>Unpicked matches are skipped — they score 0, no penalty.</div>
            <div className="feebox">
              <div><div className="eyebrow" style={{ color: "var(--txt2)" }}>Entry</div><div className="n">FREE <small>· gas only</small></div></div>
            </div>
            <div className="ownerline">Your picks are written onchain in the same transaction and locked until kickoff.<br />contract call · <b>registerAndPredict(uint8[72])</b></div>
            <div style={{ marginTop: 18 }}>
              <RegisterButton picks={picks} onConfirmed={() => setView("success")} />
            </div>
            <button className="btn ghost" onClick={() => setView("predict")} style={{ marginTop: 10 }}>← back to picks</button>
            <div style={{ height: 14 }} />
          </>
        )}

        {view === "success" && (
          <div className="successwrap">
            <div className="check"><svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0a0b0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            <div className="eyebrow">Confirmed on Base</div>
            <h1 className="h1" style={{ fontSize: 36, marginTop: 8 }}>YOU'RE IN.</h1>
            <p className="muted" style={{ margin: "12px auto 4px", maxWidth: 310, fontSize: 14.5 }}>
              {count} pick{count > 1 ? "s" : ""} locked onchain. Share your slip and challenge your friends.
            </p>

            <div className="slip" style={{ padding: 16, textAlign: "left" }}>
              <div className="eyebrow">Your slip</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "4px 0 14px" }}>
                <span style={{ fontFamily: "Anton", fontSize: 56, color: "var(--lime)" }}>{count}</span>
                <span style={{ fontFamily: "Anton", fontSize: 22 }}>PICKS LOCKED</span>
              </div>
              {picked.slice(0, 4).map((m) => {
                const o = picks[m.id]!;
                return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0" }}>
                  <img className="flag" src={flag(m.home.code)} alt="" />
                  <span className="tname" style={{ flex: 1 }}>{m.home.name}</span>
                  <span style={{ fontFamily: "Anton", fontSize: 16, color: "#0a0b0d", background: chipBg[o], borderRadius: 8, padding: "3px 12px" }}>{o}</span>
                  <span className="tname" style={{ flex: 1, textAlign: "right" }}>{m.away.name}</span>
                  <img className="flag" src={flag(m.away.code)} alt="" />
                </div>
                );
              })}
              {count > 4 && <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>+ {count - 4} more picks</div>}
            </div>

            <div className="shareRow">
              <ShareSlip count={count} />
              <a className="sbtn x" target="_blank" rel="noopener"
                 href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just locked ${count} World Cup 2026 picks onchain with GOLAZO ⚽ Predict free on Base 👇`)}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_URL || "https://golazo.xyz")}`}>
                Post on X
              </a>
            </div>
            <button className="btn" onClick={() => setView("leaderboard")} style={{ marginTop: 12 }}>View leaderboard →</button>
          </div>
        )}

        {view === "leaderboard" && (
          <>
            <div className="lbhead"><div><div className="eyebrow">Standings</div>
              <h1 className="h1" style={{ fontSize: 30 }}>LEADERBOARD</h1></div>
              <div className="phasetag">Group stage</div></div>
            <div className="banner">Each correct pick = <b style={{ color: "var(--lime)" }}>3 pts</b>. Points settle as results are posted onchain.</div>
            <Leaderboard me={address} />
            <div style={{ height: 16 }} />
          </>
        )}
      </div>

      {isConnected && view !== "connect" && (
        <div className="nav">
          <button className={view === "predict" || view === "review" ? "on" : ""} onClick={() => setView("predict")}><span className="ic">◎</span>Predict</button>
          <button className={view === "leaderboard" ? "on" : ""} onClick={() => setView("leaderboard")}><span className="ic">♚</span>Leaderboard</button>
        </div>
      )}
    </div>
  );
}
