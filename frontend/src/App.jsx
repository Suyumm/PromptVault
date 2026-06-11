import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  // Sol ve Sağ paneller için bağımsız prompt ve model state'leri
  const [promptV1, setPromptV1] = useState("");
  const [modelV1, setModelV1] = useState("gpt-4");
  
  const [promptV2, setPromptV2] = useState("");
  const [modelV2, setModelV2] = useState("gpt-4-turbo");

  // Ekranda gösterilecek anlık metrik sonuçları için state'ler
  const [metricsV1, setMetricsV1] = useState(null);
  const [metricsV2, setMetricsV2] = useState(null);

  // SADECE VERİ OKUMA (GET) İŞLEMİ
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5078/api/prompts');
      const result = await response.json();
      if (result.length > 0) {
        const currentProject = result[0];
        setData(currentProject);
        
        const versions = currentProject.versions || [];
        if (versions.length > 0) {
          const lastVersion = versions[versions.length - 1];
          const prevVersion = versions[versions.length - 2] || lastVersion;
          
          setPromptV1(prevVersion.content);
          setModelV1(prevVersion.modelUsed);
          setMetricsV1(prevVersion);

          setPromptV2(lastVersion.content);
          setModelV2(lastVersion.modelUsed);
          setMetricsV2(lastVersion);
        }
      }
    } catch (error) {
      console.error("API Bağlantı Hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DÜELLOYU BAŞLATAN VE VERİ KAYDEDEN (POST) İŞLEM
  const handleDuelTest = async () => {
    if (!promptV1.trim() || !promptV2.trim()) return;
    setIsTesting(true);

    // Havalı yapay zeka düşünme simülasyonu (1.5 saniye)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Sol panel için rastgele metrik üretimi
    const tokens1 = Math.floor(Math.random() * 40) + 90;
    const latency1 = Math.floor(Math.random() * 200) + 500;
    const cost1 = parseFloat((tokens1 * 0.00003).toFixed(4));

    // Sağ panel için rastgele metrik üretimi
    const tokens2 = Math.floor(Math.random() * 40) + 80;
    const latency2 = Math.floor(Math.random() * 200) + 400;
    const cost2 = parseFloat((tokens2 * 0.00002).toFixed(4));

    const v1Data = {
      content: promptV1,
      modelUsed: modelV1,
      tokenUsage: tokens1,
      latencyMs: latency1,
      costUsd: cost1
    };

    const v2Data = {
      content: promptV2,
      modelUsed: modelV2,
      tokenUsage: tokens2,
      latencyMs: latency2,
      costUsd: cost2
    };

    try {
      // İki versiyonu tek bir dizi olarak [v1Data, v2Data] yeni 'duel' endpoint'ine atıyoruz
      await fetch(`http://localhost:5078/api/prompts/${data.id}/duel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([v1Data, v2Data])
      });

      // Ekranda anlık olarak yeni metrikleri göster
      setMetricsV1(v1Data);
      setMetricsV2(v2Data);
      
      // Veritabanını arkada güncelle
      await fetchData();
    } catch (error) {
      console.error("Düello kayıt hatası:", error);
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        Arena Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 flex flex-col font-sans max-w-7xl mx-auto">
      
      <header className="mb-6 border-b border-neutral-700 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">PromptVault Arena 🛡️</h1>
          <p className="text-neutral-400">Proje: <span className="text-blue-400 font-medium">{data?.projectName || "Müşteri Hizmetleri Botu"}</span></p>
        </div>
        <div className="text-xs bg-blue-950 text-blue-400 px-4 py-1.5 rounded-full border border-blue-800 font-medium">
          Çift Yönlü Canlı Mod aktif
        </div>
      </header>

      {/* Merkezi Düello Kontrolü */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleDuelTest}
          disabled={isTesting || !promptV1.trim() || !promptV2.trim()}
          className={`w-full max-w-md py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 ${
            isTesting 
            ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700 animate-pulse" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-950/50 transform hover:-translate-y-0.5"
          }`}
        >
          {isTesting ? "⚡ Modeller Yarıştırılıyor..." : "🔥 DÜELLOYU BAŞLAT"}
        </button>
      </div>

      {/* İkili Düello Alanı */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SOL ARENA - SÜRÜM A */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-400">Varyasyon A</h2>
            <select
              value={modelV1}
              onChange={(e) => setModelV1(e.target.value)}
              disabled={isTesting}
              className="bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
          
          <div className="flex-1 mb-6">
            <textarea 
              className="w-full h-48 bg-neutral-900 border border-neutral-600 rounded-lg p-4 text-neutral-100 resize-none focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="İlk prompt varyasyonunu buraya yaz..."
              value={promptV1}
              onChange={(e) => setPromptV1(e.target.value)}
              disabled={isTesting}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Token</span>
              <span className="font-mono text-white text-lg">{metricsV1?.tokenUsage || "—"}</span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Süre</span>
              <span className="font-mono text-white text-lg">{metricsV1?.latencyMs ? `${metricsV1.latencyMs} ms` : "—"}</span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Maliyet</span>
              <span className="font-mono text-white text-lg">{metricsV1?.costUsd ? `$${metricsV1.costUsd}` : "—"}</span>
            </div>
          </div>
        </div>

        {/* SAĞ ARENA - SÜRÜM B */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-emerald-400">Varyasyon B</h2>
            <select
              value={modelV2}
              onChange={(e) => setModelV2(e.target.value)}
              disabled={isTesting}
              className="bg-neutral-900 border border-neutral-600 rounded-lg px-3 py-1.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
          
          <div className="flex-1 mb-6">
            <textarea 
              className="w-full h-48 bg-neutral-900 border border-neutral-600 rounded-lg p-4 text-neutral-100 resize-none focus:outline-none focus:border-emerald-500 transition-colors" 
              placeholder="Kıyaslamak istediğin ikinci prompt varyasyonunu buraya yaz..."
              value={promptV2}
              onChange={(e) => setPromptV2(e.target.value)}
              disabled={isTesting}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Token</span>
              <span className="font-mono text-white text-lg">{metricsV2?.tokenUsage || "—"}</span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Süre</span>
              <span className="font-mono text-white text-lg">{metricsV2?.latencyMs ? `${metricsV2.latencyMs} ms` : "—"}</span>
            </div>
            <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
              <span className="block text-neutral-500 text-xs mb-1 uppercase tracking-wider">Maliyet</span>
              <span className="font-mono text-white text-lg">{metricsV2?.costUsd ? `$${metricsV2.costUsd}` : "—"}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;