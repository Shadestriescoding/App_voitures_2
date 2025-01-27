import { chromium } from 'playwright';
import { CarCreateInput } from '@/types';

interface ScrapedCarData {
  brand: string;
  model: string;
  year?: number;
  mileage?: number;
  price?: number;
  equipment?: string[];
  photos?: string[];
}

export async function scrapeCarData(url: string): Promise<CarCreateInput> {
  console.log('Début du scraping pour l\'URL:', url);
  
  if (!url.includes('autoscout24')) {
    throw new Error('URL non valide : seules les annonces AutoScout24 sont supportées');
  }

  const browser = await chromium.launch({ headless: true });
  console.log('Navigateur lancé');
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigation vers la page...');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page chargée');

    // Gérer les popups de cookies si nécessaire
    try {
      console.log('Recherche du bouton de cookies...');
      const acceptCookiesButton = await page.waitForSelector(
        '[data-testid="gdpr-banner-accept"], button:has-text("Accepter"), button:has-text("Accept")', 
        { timeout: 5000 }
      );
      if (acceptCookiesButton) {
        await acceptCookiesButton.click();
        console.log('Popup de cookies fermé');
      }
    } catch (e) {
      console.log('Pas de popup de cookies détecté');
    }

    // Attendre que le contenu principal soit chargé
    await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

    // Extraire les informations principales
    console.log('Extraction du titre...');
    const title = await page.locator('h1').first().innerText();
    console.log('Titre trouvé:', title);
    
    const [brand, ...modelParts] = title.split(' ');
    const model = modelParts.join(' ');

    // Prix
    console.log('Extraction du prix...');
    const priceText = await page.locator('[data-testid="price"], .PriceInfo_price__JPzpT').first().innerText();
    console.log('Prix trouvé:', priceText);
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));

    // Kilométrage
    console.log('Extraction du kilométrage...');
    const mileageElement = await page.locator('span:has-text("km"), div:has-text("km")').first();
    const mileageText = await mileageElement?.innerText() || '';
    console.log('Kilométrage trouvé:', mileageText);
    const mileage = parseInt(mileageText.replace(/[^0-9]/g, ''));

    // Année
    console.log('Extraction de l\'année...');
    const yearElement = await page.locator('span:has-text("/"), div:has-text("/")').first();
    const yearText = await yearElement?.innerText() || '';
    console.log('Année trouvée:', yearText);
    const year = parseInt(yearText.split('/')[1]) || undefined;

    // Équipements
    console.log('Extraction des équipements...');
    const equipment: string[] = [];
    const equipmentElements = await page.locator('[data-testid="features"] li, .DetailsSection_items__hB6Hy li').all();
    for (const element of equipmentElements) {
      const text = await element.innerText();
      if (text) equipment.push(text.trim());
    }
    console.log(`${equipment.length} équipements trouvés`);

    // Photos
    console.log('Extraction des photos...');
    const photos: string[] = [];
    const imageElements = await page.locator('img[data-src], img[src*="images"]').all();
    for (const img of imageElements) {
      const src = await img.getAttribute('data-src') || await img.getAttribute('src');
      if (src && !src.includes('placeholder') && !src.includes('logo')) {
        photos.push(src);
      }
    }
    console.log(`${photos.length} photos trouvées`);

    const scrapedData: CarCreateInput = {
      url,
      brand,
      model,
      year,
      mileage,
      price,
      equipment,
      photos,
      pros: '',
      cons: '',
      opinion: 'maybe'
    };

    console.log('Données extraites avec succès:', scrapedData);
    return scrapedData;
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('Navigateur fermé');
  }
}

// Fonction utilitaire pour nettoyer le texte
function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
} 