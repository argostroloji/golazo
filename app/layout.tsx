import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

// The fc:frame metadata makes the app launchable as a Mini App / Frame.
export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL!;
  return {
    title: "Worldcup Cards — World Cup 2026 Pick'em",
    description: "Predict every World Cup 2026 match onchain on Base.",
    icons: { icon: "/icon.svg" },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
        button: {
          title: "Make your picks",
          action: {
            type: "launch_frame",
            name: "Worldcup Cards",
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
