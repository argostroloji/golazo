import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || 'https://golazo-alpha.vercel.app';

  const config = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || '',
      payload: process.env.FARCASTER_PAYLOAD || '',
      signature: process.env.FARCASTER_SIGNATURE || '',
    },
    frame: {
      version: '1',
      name: 'GOLAZO',
      iconUrl: process.env.NEXT_PUBLIC_ICON_URL || `${appUrl}/icon.svg`,
      homeUrl: appUrl,
      imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${appUrl}/icon.svg`,
      buttonTitle: 'Make your picks',
      splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE || `${appUrl}/icon.svg`,
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
