export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
          Voor mensen &amp; merken
        </p>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Vind jouw beeldmaker
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          De beste fotografen en videografen in Nederland. Bekijk portfolio&apos;s
          en neem direct contact op.
        </p>
        <a
          href="/beeldmakers"
          className="inline-block bg-gray-900 text-white text-sm px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
        >
          Bekijk alle beeldmakers
        </a>
      </div>
    </main>
  );
}
