import { useState } from 'react';
import mockData from './mockData.json';

function App() {
  // Sahte veritabanımızı (JSON) state içine alıyoruz
  const [data] = useState(mockData);
  const v1 = data.versions[0];
  const v2 = data.versions[1];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 flex flex-col font-sans">
      
      {/* Üst Kısım - Başlık */}
      <header className="mb-8 border-b border-neutral-700 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">PromptVault 🛡️</h1>
        <p className="text-neutral-400">Aktif Proje: <span className="text-blue-400 font-medium">{data.project_name}</span></p>
      </header>

      {/* İkiye Bölünmüş Ekran (Split-pane) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SOL PANEL - Versiyon 1 */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Versiyon 1 <span className="text-sm text-neutral-500 font-normal">({v1.version_id})</span></h2>
          
          <div className="flex-1 mb-6">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Prompt Metni</label>
            <textarea
              readOnly
              className="w-full h-40 bg-neutral-900 border border-neutral-600 rounded-lg p-4 text-neutral-200 resize-none focus:outline-none focus:border-blue-500 transition-colors"
              value={v1.content}
            />
          </div>

          {/* Metrikler (Rozetler) */}
          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Token</span>
              <span className="font-mono text-white text-lg">{v1.metrics.token_usage}</span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Süre</span>
              <span className="font-mono text-white text-lg">{v1.metrics.latency_ms} <span className="text-xs text-neutral-500">ms</span></span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Maliyet</span>
              <span className="font-mono text-white text-lg"><span className="text-neutral-500">$</span>{v1.metrics.cost_usd}</span>
            </div>
          </div>
        </div>

        {/* SAĞ PANEL - Versiyon 2 */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Versiyon 2 <span className="text-sm text-neutral-500 font-normal">({v2.version_id})</span></h2>
          
          <div className="flex-1 mb-6">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Prompt Metni</label>
            <textarea
              readOnly
              className="w-full h-40 bg-neutral-900 border border-neutral-600 rounded-lg p-4 text-neutral-200 resize-none focus:outline-none focus:border-emerald-500 transition-colors"
              value={v2.content}
            />
          </div>

          {/* Metrikler (Rozetler) */}
          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Token</span>
              <span className="font-mono text-white text-lg">{v2.metrics.token_usage}</span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Süre</span>
              <span className="font-mono text-white text-lg">{v2.metrics.latency_ms} <span className="text-xs text-neutral-500">ms</span></span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Maliyet</span>
              <span className="font-mono text-white text-lg"><span className="text-neutral-500">$</span>{v2.metrics.cost_usd}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;