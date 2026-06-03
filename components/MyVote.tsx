"use client";
import { useReadContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS, CHAIN } from "@/lib/contract";
import { MATCHES, type Pick } from "@/lib/worldcup";

const flag = (c: string) => `https://flagcdn.com/${c}.svg`;
const chipBg: Record<Pick, string> = { "1": "var(--lime)", X: "var(--amber)", "2": "var(--acc)" };

export function MyVote({ me }: { me?: `0x${string}` }) {
  const { data: isRegistered, isLoading: loadingReg } = useReadContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: "registered",
    args: me ? [me] : undefined, query: { enabled: !!me }, chainId: CHAIN.id,
  });

  const { data: predsRaw, isLoading: loadingPreds } = useReadContract({
    address: CONTRACT_ADDRESS, abi: ABI, functionName: "getPredictions",
    args: me ? [0n, me] : undefined, query: { enabled: !!me && !!isRegistered }, chainId: CHAIN.id,
  });

  if (loadingReg || loadingPreds) return <p className="muted">Loading your vote…</p>;
  if (!me) return <p className="muted">Connect wallet to view your vote.</p>;
  if (!isRegistered) return <p className="muted">You haven&apos;t submitted any picks yet.</p>;

  // predsRaw is an array of uint8 where 1=home, 2=draw, 3=away, 0=skip
  const preds = (predsRaw as readonly number[]) || [];
  
  let count = 0;
  const pickedMatches = MATCHES.filter(m => {
    const p = preds[m.id];
    if (p && p > 0) {
      count++;
      return true;
    }
    return false;
  });

  if (count === 0) return <p className="muted">You registered but have no picks.</p>;

  return (
    <div className="slip" style={{ padding: 16, textAlign: "left", margin: "10px 0" }}>
      <div className="eyebrow">Your locked slip</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "4px 0 14px" }}>
        <span style={{ fontFamily: "Anton", fontSize: 56, color: "var(--lime)" }}>{count}</span>
        <span style={{ fontFamily: "Anton", fontSize: 22 }}>PICKS LOCKED</span>
      </div>
      {pickedMatches.map((m) => {
        const val = preds[m.id];
        const o: Pick = val === 1 ? "1" : val === 2 ? "X" : "2";
        return (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <span style={{ fontFamily: "Anton", fontSize: 16, color: "#0a0b0d", background: chipBg[o], borderRadius: 8, padding: "3px 12px", width: 44, textAlign: "center" }}>{o}</span>
            <img className="flag" src={flag(m.home.code)} alt="" style={{ marginLeft: 6 }} />
            <span className="tname" style={{ flex: 1, fontSize: 14 }}>{m.home.name}</span>
            <span className="muted" style={{ fontSize: 11 }}>vs</span>
            <span className="tname" style={{ flex: 1, textAlign: "right", fontSize: 14 }}>{m.away.name}</span>
            <img className="flag" src={flag(m.away.code)} alt="" />
          </div>
        );
      })}
    </div>
  );
}
