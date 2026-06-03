"use client";
import { useComposeCast } from "@coinbase/onchainkit/minikit";

// Native in-app share — opens the Farcaster / Base App cast composer with a
// ready caption and your app embed (which renders your dynamic OG slip image).
export function ShareSlip({ count }: { count: number }) {
  const { composeCast } = useComposeCast();
  const url = process.env.NEXT_PUBLIC_URL ?? "https://worldcup.cards";
  const text =
    `I just locked in ${count} pick${count === 1 ? "" : "s"} for the World Cup 2026 onchain! 🏆⚽\n\n` +
    `Think you know football better than me? Show your skills, challenge my slip, and climb the leaderboard! 🥇\n\n` +
    `Play for FREE on Base now! 👇 $GOLAZO`;

  return (
    <button className="sbtn fc" onClick={() => composeCast({ text, embeds: [url] })}>
      Cast my slip
    </button>
  );
}

/*
 X / Twitter (outside Farcaster): open a web intent instead —
 https://twitter.com/intent/tweet?text=<enc(text)>&url=<enc(url)>
*/
