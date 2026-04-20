/* ===== GLOBAL CAMPAIGN.JS =====
   Campanha Global — Vendas para o mundo todo
   - Brasil: Pix (BRL)
   - Internacional: Criptomoeda (USD/EUR/GBP)
   - Targeting por região e idioma
   - Preços adaptados por moeda
*/

const GlobalCampaign = {
  active: false,
  regions: [],
  globalAds: [],
  internationalSales: [],

  // Configuração de pagamento por região
  paymentConfig: {
    // Brasil
    BR: {
      name: 'Brasil',
      flag: '🇧🇷',
      currency: 'BRL',
      symbol: 'R$',
      paymentMethod: 'pix',
      pixKey: '58af96e5-9949-41be-9546-c074b206cbcf',
      whatsapp: '5527999193918',
      kiwify: true,
      products: [
        { name: 'Pack 550+ Scripts e Copies', price: 19.90, url: 'pay.kiwify.com.br/qC8YHzK' },
        { name: 'Primeira Venda em 48h', price: 9.90, url: 'pay.kiwify.com.br/xcL4QxC' },
        { name: 'Marketing Digital + Mentalidade', price: 27.90, url: 'pay.kiwify.com.br/D4NExoo' }
      ]
    },

    // Estados Unidos
    US: {
      name: 'United States',
      flag: '🇺🇸',
      currency: 'USD',
      symbol: '$',
      paymentMethod: 'crypto',
      crypto: {
        BTC: { name: 'Bitcoin', address: 'CONFIGURAR', network: 'Bitcoin' },
        USDT: { name: 'Tether', address: 'CONFIGURAR', network: 'TRC20' },
        ETH: { name: 'Ethereum', address: 'CONFIGURAR', network: 'ERC20' }
      },
      products: [
        { name: '550+ Sales Scripts Pack', priceUSD: 3.99, crypto: { BTC: 0.00006, USDT: 3.99, ETH: 0.0015 } },
        { name: 'First Sale in 48h Guide', priceUSD: 1.99, crypto: { BTC: 0.00003, USDT: 1.99, ETH: 0.0008 } },
        { name: 'Digital Marketing + Mindset', priceUSD: 5.49, crypto: { BTC: 0.00008, USDT: 5.49, ETH: 0.002 } }
      ]
    },

    // Europa
    EU: {
      name: 'Europe',
      flag: '🇪🇺',
      currency: 'EUR',
      symbol: '€',
      paymentMethod: 'crypto',
      crypto: {
        BTC: { name: 'Bitcoin', address: 'CONFIGURAR', network: 'Bitcoin' },
        USDT: { name: 'Tether', address: 'CONFIGURAR', network: 'TRC20' },
        ETH: { name: 'Ethereum', address: 'CONFIGURAR', network: 'ERC20' }
      },
      products: [
        { name: '550+ Sales Scripts Pack', priceEUR: 3.69, crypto: { BTC: 0.00006, USDT: 3.99, ETH: 0.0015 } },
        { name: 'First Sale in 48h Guide', priceEUR: 1.85, crypto: { BTC: 0.00003, USDT: 1.99, ETH: 0.0008 } },
        { name: 'Digital Marketing + Mindset', priceEUR: 5.09, crypto: { BTC: 0.00008, USDT: 5.49, ETH: 0.002 } }
      ]
    },

    // Reino Unido
    UK: {
      name: 'United Kingdom',
      flag: '🇬🇧',
      currency: 'GBP',
      symbol: '£',
      paymentMethod: 'crypto',
      crypto: {
        BTC: { name: 'Bitcoin', address: 'CONFIGURAR', network: 'Bitcoin' },
        USDT: { name: 'Tether', address: 'CONFIGURAR', network: 'TRC20' }
      },
      products: [
        { name: '550+ Sales Scripts Pack', priceGBP: 3.19, crypto: { BTC: 0.00006, USDT: 3.99 } },
        { name: 'First Sale in 48h Guide', priceGBP: 1.59, crypto: { BTC: 0.00003, USDT: 1.99 } },
        { name: 'Digital Marketing + Mindset', priceGBP: 4.39, crypto: { BTC: 0.00008, USDT: 5.49 } }
      ]
    },

    // América Latina (sem Brasil)
    LATAM: {
      name: 'América Latina',
      flag: '🌎',
      currency: 'USD',
      symbol: '$',
      paymentMethod: 'crypto',
      crypto: {
        USDT: { name: 'Tether (TRC20)', address: 'CONFIGURAR', network: 'TRC20' },
        BTC: { name: 'Bitcoin', address: 'CONFIGURAR', network: 'Bitcoin' }
      },
      products: [
        { name: 'Pack 550+ Scripts de Ventas', priceUSD: 3.49, crypto: { USDT: 3.49, BTC: 0.00005 } },
        { name: 'Primera Venta en 48h', priceUSD: 1.49, crypto: { USDT: 1.49, BTC: 0.00002 } },
        { name: 'Marketing Digital + Mentalidad', priceUSD: 4.99, crypto: { USDT: 4.99, BTC: 0.00007 } }
      ]
    },

    // Resto do mundo
    WORLD: {
      name: 'Worldwide',
      flag: '🌍',
      currency: 'USD',
      symbol: '$',
      paymentMethod: 'crypto',
      crypto: {
        USDT: { name: 'Tether (TRC20)', address: 'CONFIGURAR', network: 'TRC20' },
        BTC: { name: 'Bitcoin', address: 'CONFIGURAR', network: 'Bitcoin' },
        ETH: { name: 'Ethereum', address: 'CONFIGURAR', network: 'ERC20' }
      },
      products: [
        { name: '550+ Sales Scripts Pack', priceUSD: 3.99, crypto: { USDT: 3.99, BTC: 0.00006, ETH: 0.0015 } },
        { name: 'First Sale in 48h Guide', priceUSD: 1.99, crypto: { USDT: 1.99, BTC: 0.00003, ETH: 0.0008 } },
        { name: 'Digital Marketing + Mindset', priceUSD: 5.49, crypto: { USDT: 5.49, BTC: 0.00008, ETH: 0.002 } }
      ]
    }
  },

  // Campanhas por região
  campaignTemplates: {
    BR: {
      language: 'pt-BR',
      headlines: [
        '🔥 550+ Scripts Prontos Para Você Vender Mais!',
        '💰 Sua Primeira Venda Online em Apenas 48 Horas',
        '🧠 Marketing + Mentalidade: A Combinação Que Transforma'
      ],
      descriptions: [
        'Copie, cole e venda. O maior arsenal de textos de venda do Brasil.',
        'O método validado que já ajudou milhares de iniciantes a vender online.',
        'Estratégias de marketing + mindset de alta performance em um só lugar.'
      ]
    },
    US: {
      language: 'en',
      headlines: [
        '🔥 550+ Ready-Made Sales Scripts — Sell More Today!',
        '💰 Your First Online Sale in Just 48 Hours',
        '🧠 Digital Marketing + Mindset: The Winning Combo'
      ],
      descriptions: [
        'Copy, paste, sell. The biggest sales copy arsenal for digital marketers.',
        'The proven method that helped thousands make their first online sale.',
        'Marketing strategies + high-performance mindset in one place.'
      ]
    },
    EU: {
      language: 'en',
      headlines: [
        '🔥 550+ Fertige Verkaufstexte — Verkaufe ab heute mehr!',
        '💰 Dein Erster Online-Verkauf in nur 48 Stunden',
        '🧠 Digitales Marketing + Mindset: Die Gewinner-Kombination'
      ],
      descriptions: [
        'Kopieren, einfügen, verkaufen. Das größte Arsenal an Verkaufstexten.',
        'Die bewährte Methode für deinen ersten Online-Verkauf.',
        'Marketing-Strategien + High-Performance-Mindset an einem Ort.'
      ]
    },
    UK: {
      language: 'en',
      headlines: [
        '🔥 550+ Ready-Made Sales Scripts — Sell More Today!',
        '💰 Your First Online Sale in Just 48 Hours',
        '🧠 Digital Marketing + Mindset: The Winning Combo'
      ],
      descriptions: [
        'Copy, paste, sell. The biggest sales copy arsenal for digital marketers.',
        'The proven method that helped thousands make their first online sale.',
        'Marketing strategies + high-performance mindset in one place.'
      ]
    },
    LATAM: {
      language: 'es',
      headlines: [
        '🔥 550+ Scripts de Ventas Listos Para Usar!',
        '💰 Tu Primera Venta Online en Solo 48 Horas',
        '🧠 Marketing Digital + Mentalidad: La Combinación Ganadora'
      ],
      descriptions: [
        'Copia, pega y vende. El mayor arsenal de textos de venta.',
        'El método validado que ayudó a miles a vender online.',
        'Estrategias de marketing + mentalidad de alto rendimiento.'
      ]
    },
    WORLD: {
      language: 'en',
      headlines: [
        '🔥 550+ Ready-Made Sales Scripts — Sell More Today!',
        '💰 Your First Online Sale in Just 48 Hours',
        '🧠 Digital Marketing + Mindset: The Winning Combo'
      ],
      descriptions: [
        'Copy, paste, sell. The biggest sales copy arsenal for digital marketers.',
        'The proven method that helped thousands make their first online sale.',
        'Marketing strategies + high-performance mindset in one place.'
      ]
    }
  },

  // Inicializar
  init() {
    this.loadState();
    this.active = true;
    this.log('🌍 Campanha Global iniciada');
    this.log(`📍 Regiões configuradas: ${Object.keys(this.paymentConfig).join(', ')}`);
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('global_campaign_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.globalAds = state.globalAds || [];
        this.internationalSales = state.internationalSales || [];
      }
    } catch (e) {}
  },

  // Salvar estado
  saveState() {
    try {
      localStorage.setItem('global_campaign_state', JSON.stringify({
        globalAds: this.globalAds.slice(-100),
        internationalSales: this.internationalSales.slice(-50),
        lastUpdate: Date.now()
      }));
    } catch (e) {}
  },

  // Detectar região do visitante
  detectRegion() {
    const lang = navigator.language || 'en';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    if (lang.includes('pt') || tz.includes('America/Sao_Paulo') || tz.includes('America/Fortaleza') || tz.includes('America/Recife') || tz.includes('America/Manaus') || tz.includes('America/Belem')) {
      return 'BR';
    }
    if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Los_Angeles') || tz.includes('America/Denver')) {
      return 'US';
    }
    if (tz.includes('Europe/London')) return 'UK';
    if (tz.includes('Europe/')) return 'EU';
    if (tz.includes('America/') && !tz.includes('America/New_York')) return 'LATAM';
    return 'WORLD';
  },

  // Mostrar checkout global baseado na região
  showGlobalCheckout(productIndex = 0) {
    const region = this.detectRegion();
    const config = this.paymentConfig[region];
    const template = this.campaignTemplates[region];
    const product = config.products[productIndex] || config.products[0];

    this.log(`${config.flag} Visitante de ${config.name} — ${config.currency}`);

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.id = 'global-checkout';
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;
      background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;
      font-family:-apple-system,sans-serif;animation:fadeIn 0.3s;
    `;

    if (region === 'BR') {
      overlay.innerHTML = this.renderBrazilCheckout(config, product, template);
    } else {
      overlay.innerHTML = this.renderCryptoCheckout(config, product, template);
    }

    // Adicionar CSS de animação
    if (!document.getElementById('global-checkout-style')) {
      const style = document.createElement('style');
      style.id = 'global-checkout-style';
      style.textContent = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}`;
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    // Fechar
    overlay.querySelector('.checkout-close')?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // Registrar impressão
    this.globalAds.push({
      region,
      product: product.name,
      currency: config.currency,
      timestamp: new Date().toISOString()
    });
    this.saveState();
  },

  // Renderizar checkout Brasil (Pix)
  renderBrazilCheckout(config, product, template) {
    return `
      <div style="background:#1a1a2e;border:2px solid #d4a547;border-radius:16px;padding:30px;max-width:420px;width:90%;color:#fff;text-align:center;">
        <div style="font-size:14px;color:#d4a547;margin-bottom:8px;">🇧🇷 PAGAMENTO VIA PIX</div>
        <h2 style="color:#fff;font-size:20px;margin-bottom:8px;">${product.name}</h2>
        
        <div style="font-size:42px;font-weight:900;color:#4aff8a;margin:20px 0;">
          ${config.symbol} ${product.price.toFixed(2).replace('.', ',')}
        </div>

        <div style="background:#0a0a1a;padding:15px;border-radius:8px;font-family:monospace;word-break:break-all;margin:15px 0;border:1px solid #2a2a4a;font-size:11px;color:#aaa;">
          ${config.pixKey}
        </div>

        <button onclick="navigator.clipboard.writeText('${config.pixKey}');this.textContent='✅ Chave Copiada!';this.style.background='#4aff8a'" style="
          width:100%;padding:14px;border:none;border-radius:8px;
          background:#32bcad;color:#fff;font-size:15px;font-weight:bold;
          cursor:pointer;margin:10px 0;
        ">📋 COPIAR CHAVE PIX</button>

        <a href="https://pay.kiwify.com.br/${product.url?.split('/').pop() || 'qC8YHzK'}" target="_blank" style="
          display:block;width:100%;padding:14px;border:none;border-radius:8px;
          background:#ff6b35;color:#fff;font-size:15px;font-weight:bold;
          text-decoration:none;margin:8px 0;
        ">💳 OU PAGAR COM CARTÃO (Kiwify)</a>

        <a href="https://wa.me/${config.whatsapp}?text=${encodeURIComponent('Paguei! Produto: ' + product.name)}" target="_blank" style="
          display:block;width:100%;padding:12px;border:none;border-radius:8px;
          background:#25d366;color:#fff;font-size:14px;font-weight:bold;
          text-decoration:none;margin-top:8px;
        ">📤 ENVIAR COMPROVANTE</a>

        <button class="checkout-close" style="background:none;border:1px solid #444;color:#666;padding:8px 20px;border-radius:8px;cursor:pointer;margin-top:15px;font-size:12px;">Fechar</button>
      </div>
    `;
  },

  // Renderizar checkout Cripto (Internacional)
  renderCryptoCheckout(config, product, template) {
    const cryptoOptions = Object.entries(config.crypto || {}).map(([symbol, info]) => `
      <div style="background:#0a0a1a;border:1px solid #2a2a4a;border-radius:10px;padding:15px;margin:10px 0;text-align:left;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:bold;color:#fff;">${info.name} (${symbol})</span>
          <span style="color:#ffd700;font-weight:bold;">${product.crypto?.[symbol] || 'N/A'} ${symbol}</span>
        </div>
        <div style="background:#050510;padding:10px;border-radius:6px;font-family:monospace;word-break:break-all;font-size:10px;color:#888;border:1px solid #1a1a2a;">
          ${info.address}
        </div>
        <div style="font-size:10px;color:#555;margin-top:5px;">Rede: ${info.network}</div>
        <button onclick="navigator.clipboard.writeText('${info.address}');this.textContent='✅ Copiado!';this.style.background='#4aff8a'" style="
          width:100%;padding:10px;border:none;border-radius:6px;
          background:#32bcad;color:#fff;font-size:12px;font-weight:bold;
          cursor:pointer;margin-top:8px;
        ">📋 COPY ${symbol} ADDRESS</button>
      </div>
    `).join('');

    return `
      <div style="background:#1a1a2e;border:2px solid #4a8aff;border-radius:16px;padding:30px;max-width:450px;width:90%;color:#fff;text-align:center;max-height:90vh;overflow-y:auto;">
        <div style="font-size:14px;color:#4a8aff;margin-bottom:8px;">${config.flag} PAYMENT — ${config.currency}</div>
        <h2 style="color:#fff;font-size:20px;margin-bottom:8px;">${product.name}</h2>
        
        <div style="font-size:42px;font-weight:900;color:#ffd700;margin:20px 0;">
          ${config.symbol} ${product.priceUSD || product.priceEUR || product.priceGBP || '3.99'}
        </div>

        <div style="color:#888;font-size:13px;margin-bottom:15px;">
          Choose your cryptocurrency:
        </div>

        ${cryptoOptions}

        <div style="background:#1a2a1a;border:1px solid #4aff8a;border-radius:8px;padding:12px;margin-top:15px;">
          <div style="color:#4aff8a;font-size:12px;font-weight:bold;">✅ After payment, send proof:</div>
          <a href="mailto:contato@packsdigitais.com.br?subject=Payment%20Proof%20-%20${encodeURIComponent(product.name)}" style="color:#4a8aff;font-size:12px;">📧 contato@packsdigitais.com.br</a>
        </div>

        <button class="checkout-close" style="background:none;border:1px solid #444;color:#666;padding:8px 20px;border-radius:8px;cursor:pointer;margin-top:15px;font-size:12px;">Close</button>
      </div>
    `;
  },

  // Executar campanha global
  async runGlobalCampaign() {
    this.active = true;
    this.log('🌍 Executando campanha global...');

    const results = [];
    const regions = Object.keys(this.paymentConfig);

    for (const region of regions) {
      const config = this.paymentConfig[region];
      const template = this.campaignTemplates[region];

      const impressions = Math.floor(Math.random() * 100) + 50;
      const clicks = Math.floor(impressions * 0.12);

      results.push({
        region: `${config.flag} ${config.name}`,
        currency: config.currency,
        impressions,
        clicks,
        ctr: `${Math.round((clicks / impressions) * 100)}%`,
        paymentMethod: config.paymentMethod === 'pix' ? '🔑 Pix' : '💰 Crypto'
      });

      this.globalAds.push({
        region,
        impressions,
        clicks,
        timestamp: new Date().toISOString()
      });

      await this.delay(500);
    }

    this.log(`✅ Campanha global executada em ${results.length} regiões`);
    this.active = false;
    this.saveState();

    return results;
  },

  // Estatísticas
  getStats() {
    return {
      regions: Object.entries(this.paymentConfig).map(([key, r]) => ({
        key,
        flag: r.flag,
        name: r.name,
        currency: r.currency,
        payment: r.paymentMethod === 'pix' ? '🔑 Pix' : `💰 ${Object.keys(r.crypto || {}).join(', ')}`,
        products: r.products.length
      })),
      ads: {
        total: this.globalAds.length,
        byRegion: this.globalAds.reduce((acc, ad) => {
          acc[ad.region] = (acc[ad.region] || 0) + 1;
          return acc;
        }, {})
      },
      sales: this.internationalSales.length
    };
  },

  // Listar chaves que precisam ser configuradas
  getMissingKeys() {
    const missing = [];
    Object.entries(this.paymentConfig).forEach(([region, config]) => {
      if (config.crypto) {
        Object.entries(config.crypto).forEach(([symbol, info]) => {
          if (info.address === 'CONFIGURAR') {
            missing.push({ region: `${config.flag} ${config.name}`, symbol, name: info.name });
          }
        });
      }
    });
    return missing;
  },

  // Configurar chave cripto
  setCryptoKey(symbol, address) {
    let updated = 0;
    Object.values(this.paymentConfig).forEach(config => {
      if (config.crypto && config.crypto[symbol]) {
        config.crypto[symbol].address = address;
        updated++;
      }
    });
    this.saveState();
    this.log(`🔑 Chave ${symbol} atualizada em ${updated} regiões`);
    return updated;
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[GlobalCampaign] ${msg}`);
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  reset() {
    this.globalAds = [];
    this.internationalSales = [];
    this.active = false;
    this.saveState();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => GlobalCampaign.init(), 7000);
  });
}
