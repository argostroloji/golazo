"use client";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { encodePicks, type Pick } from "@/lib/worldcup";

// Free registration (non-payable): the player signs and pays only network gas.
// Partial picks are allowed — unpicked matches are sent as 0.
export function RegisterButton({
  picks,
  onConfirmed,
}: {
  picks: Record<number, Pick>;
  onConfirmed?: (hash: `0x${string}`) => void;
}) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const count = Object.keys(picks).length;

  function submit() {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "registerAndPredict",
      args: [encodePicks(picks)], // uint8[72], 0 = unpicked
    });
  }

  if (isSuccess) {
    hash && onConfirmed?.(hash);
    return <p className="ok">Your picks are locked onchain ✓</p>;
  }

  return (
    <div>
      <button
        className="btn lime"
        disabled={count < 1 || isPending || confirming}
        onClick={submit}
      >
        {isPending || confirming
          ? "Confirming…"
          : count < 1
          ? "Make at least one pick"
          : `Lock ${count} pick${count > 1 ? "s" : ""} · gas only`}
      </button>
      {error && <p className="err">{error.message.slice(0, 120)}</p>}
    </div>
  );
}

/*
 GASLESS option: wrap the call in OnchainKit's <Transaction> with a Paymaster
 (NEXT_PUBLIC_PAYMASTER_URL) so users pay zero gas. See README "Gasless".
*/
