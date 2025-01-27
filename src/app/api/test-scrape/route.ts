import { NextRequest, NextResponse } from 'next/server';
import { scrapeCarData } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL manquante' },
        { status: 400 }
      );
    }

    // Scraper les données sans les sauvegarder
    const scrapedData = await scrapeCarData(url);

    return NextResponse.json(scrapedData, { status: 200 });
  } catch (error: any) {
    console.error('Erreur lors du scraping :', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du scraping de l\'annonce' },
      { status: 500 }
    );
  }
} 