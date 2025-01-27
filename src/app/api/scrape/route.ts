import { NextRequest, NextResponse } from 'next/server';
import { scrapeCarData } from '@/lib/scraper';
import { createCar } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL manquante' },
        { status: 400 }
      );
    }

    // Scraper les données
    const scrapedData = await scrapeCarData(url);

    // Créer la voiture dans la base de données
    const newCar = createCar(scrapedData);

    return NextResponse.json(newCar, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors du scraping :', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors du scraping de l\'annonce' },
      { status: 500 }
    );
  }
} 