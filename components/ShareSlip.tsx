"use client";
import { useComposeCast } from "@coinbase/onchainkit/minikit";

// Native in-app share — opens the Farcaster / Base App cast composer with a
// ready caption and your app embed (which renders your dynamic OG slip image).
export function ShareSlip({ count }: { count: number }) {
  const { composeCast } = useComposeCast();
  const url = process.env.NEXT_PUBLIC_URL ?? "https://golazo.xyz";
  const text =
    `I just locked ${count} World Cup 2026 pick${count > 1 ? "s" : ""} onchain with GOLAZO \u26bd\n` +
    `Think you can beat my slip? Predict free on Base \ud83d\udc47`;

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
