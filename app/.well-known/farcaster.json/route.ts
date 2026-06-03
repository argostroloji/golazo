import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://worldcup.cards';

  const config = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || 'eyJmaWQiOjQ1NzQxNiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweEIzZTM3YTZGOENDNzIyRjlCQzk2MDA0NUUyNTNkODkyODVEMjkzMDYifQ',
      payload: process.env.FARCASTER_PAYLOAD || 'eyJkb21haW4iOiJnb2xhem8tYWxwaGEudmVyY2VsLmFwcCJ9',
      signature: process.env.FARCASTER_SIGNATURE || 'WUwEzn5nxvjeUIyD+8dFKRBfJB4n7ON/jTIR9B3+6ZxSE0YmR7Dh6Cgsjvg5J/JIvi5JID5G7T2XJL2rmMexdBw=',
    },
    frame: {
      version: '1',
      name: 'Worldcup Cards',
      iconUrl: process.env.NEXT_PUBLIC_ICON_URL || `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${appUrl}/icon.png`,
      buttonTitle: 'Make your picks',
      splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE || `${appUrl}/icon.png`,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || '#0a0b0d',
    },
  };

  return NextResponse.json(config, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
