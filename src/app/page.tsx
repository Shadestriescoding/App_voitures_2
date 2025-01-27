export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">
        App Voitures - Test de déploiement
      </h1>
      <p className="text-lg mb-4">
        Cette page est un test de déploiement sur GitHub Pages.
      </p>
      <div className="p-4 bg-blue-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">État du déploiement :</h2>
        <ul className="list-disc list-inside">
          <li>Page d&apos;accueil : ✅</li>
          <li>Configuration Next.js : ✅</li>
          <li>GitHub Actions : ✅</li>
          <li>GitHub Pages : En attente de déploiement</li>
        </ul>
      </div>
    </main>
  );
}
