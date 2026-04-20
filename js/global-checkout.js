/**
 * 🌍 GLOBAL CHECKOUT — Pagamento Internacional com Cripto
 * Auto-detecta região e oferece método de pagamento adequado
 */

const CRYPTO_CONFIG = {
  BTC: {
    network: 'Bitcoin',
    address: 'bc1qsr7p9lngmlau2sjnsqwu2n6rzmvjrahfnvvzhh',
    symbol: 'BTC',
    icon: '₿',
    color: '#F7931A',
    confirmations: 1,
    qrPrefix: 'bitcoin:'
  },
  ETH: {
    network: 'Ethereum (ERC20)',
    address: '0x34d1915bc5FE1F3C69289dc799F8209ff5116719',
    symbol: 'ETH',
    icon: 'Ξ',
    color: '#627EEA',
    confirmations: 12,
    qrPrefix: 'ethereum:'
  },
  USDT: {
    network: 'Tron (TRC20)',
    address: 'TLBabfALehgYSWSYfHhZh1iMiuujhd8v2g4',
    symbol: 'USDT',
    icon: '₮',
    color: '#26A17B',
    confirmations: 20,
    qrPrefix: ''
  },
  SOL: {
    network: 'Solana',
    address: 'AMEyqLjc2u96Uzkg56vfe6eJevpgKmLorUyACCCFMCrk',
    symbol: 'SOL',
    icon: '◎',
    color: '#9945FF',
    confirmations: 32,
    qrPrefix: 'solana:'
  }
};

// Configuração de preços por região
const REGION_CONFIG = {
  BR: {
    flag: '🇧🇷',
    name: 'Brasil',
    currency: 'BRL',
    symbol: 'R$',
    paymentMethods: ['pix', 'kiwify'],
    pixKey: '58af96e5-9949-41be-9546-c074b206cbcf',
    products: {
      pack550: { price: 19.90, checkoutUrl: 'https://pay.kiwify.com.br/qC8YHzK' },
      primeiraVenda: { price: 9.90, checkoutUrl: 'https://pay.kiwify.com.br/xcL4QxC' },
      marketing: { price: 27.90, checkoutUrl: 'https://pay.kiwify.com.br/D4NExoo' }
    }
  },
  US: {
    flag: '🇺🇸',
    name: 'USA',
    currency: 'USD',
    symbol: '$',
    paymentMethods: ['BTC', 'ETH', 'USDT'],
    preferredCrypto: 'USDT',
    products: {
      pack550: { price: 3.99 },
      primeiraVenda: { price: 1.99 },
      marketing: { price: 5.49 }
    }
  },
  EU: {
    flag: '🇪🇺',
    name: 'Europe',
    currency: 'EUR',
    symbol: '€',
    paymentMethods: ['BTC', 'ETH', 'USDT'],
    preferredCrypto: 'USDT',
    products: {
      pack550: { price: 3.69 },
      primeiraVenda: { price: 1.79 },
      marketing: { price: 4.99 }
    }
  },
  UK: {
    flag: '🇬🇧',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    paymentMethods: ['BTC', 'USDT'],
    preferredCrypto: 'USDT',
    products: {
      pack550: { price: 3.19 },
      primeiraVenda: { price: 1.59 },
      marketing: { price: 4.29 }
    }
  },
  LATAM: {
    flag: '🌎',
    name: 'Latin America',
    currency: 'USD',
    symbol: '$',
    paymentMethods: ['BTC', 'USDT'],
    preferredCrypto: 'USDT',
    products: {
      pack550: { price: 3.49 },
      primeiraVenda: { price: 1.69 },
      marketing: { price: 4.79 }
    }
  },
  WORLD: {
    flag: '🌍',
    name: 'International',
    currency: 'USD',
    symbol: '$',
    paymentMethods: ['BTC', 'ETH', 'USDT', 'SOL'],
    preferredCrypto: 'USDT',
    products: {
      pack550: { price: 3.99 },
      primeiraVenda: { price: 1.99 },
      marketing: { price: 5.49 }
    }
  }
};

// Mapa de países para regiões
const COUNTRY_TO_REGION = {
  BR: 'BR', US: 'US', CA: 'US',
  GB: 'UK', UK: 'UK',
  DE: 'EU', FR: 'EU', IT: 'EU', ES: 'EU', PT: 'EU', NL: 'EU', BE: 'EU', AT: 'EU', CH: 'EU',
  SE: 'EU', NO: 'EU', DK: 'EU', FI: 'EU', PL: 'EU', CZ: 'EU', RO: 'EU', HU: 'EU',
  AR: 'LATAM', CL: 'LATAM', CO: 'LATAM', MX: 'LATAM', PE: 'LATAM', UY: 'LATAM',
  VE: 'LATAM', EC: 'LATAM', BO: 'LATAM', PY: 'LATAM', PA: 'LATAM', CR: 'LATAM'
};

// Detectar região do usuário
function detectRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = navigator.language || navigator.userLanguage || '';

    // Detectar por timezone
    if (tz.includes('Sao_Paulo') || tz.includes('Bahia') || tz.includes('Noronha') || tz.includes('Manaus')) {
      return REGION_CONFIG.BR;
    }
    if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Denver') || tz.includes('America/Los_Angeles')) {
      return tz.includes('Toronto') ? REGION_CONFIG.US : REGION_CONFIG.US;
    }
    if (tz.includes('Europe/London')) return REGION_CONFIG.UK;
    if (tz.includes('Europe/')) return REGION_CONFIG.EU;

    // LATAM por timezone
    if (tz.includes('America/Argentina') || tz.includes('America/Santiago') || tz.includes('America/Bogota') ||
        tz.includes('America/Mexico_City') || tz.includes('America/Lima')) {
      return REGION_CONFIG.LATAM;
    }

    // Fallback por idioma
    if (lang.startsWith('pt-BR')) return REGION_CONFIG.BR;
    if (lang.startsWith('pt')) return REGION_CONFIG.EU;
    if (lang.startsWith('en-GB')) return REGION_CONFIG.UK;
    if (lang.startsWith('en')) return REGION_CONFIG.US;
    if (lang.startsWith('es')) return REGION_CONFIG.LATAM;
    if (['de','fr','it','nl','sv','no','da','fi','pl','cs','ro','hu'].some(l => lang.startsWith(l))) {
      return REGION_CONFIG.EU;
    }

    // Default: mundo
    return REGION_CONFIG.WORLD;
  } catch (e) {
    return REGION_CONFIG.WORLD;
  }
}

// Gerar endereço cripto formatado
function getCryptoPayment(cryptoType, amountUSD) {
  const crypto = CRYPTO_CONFIG[cryptoType];
  if (!crypto) return null;

  return {
    network: crypto.network,
    address: crypto.address,
    symbol: crypto.symbol,
    icon: crypto.icon,
    color: crypto.color,
    amountUSD: amountUSD,
    instructions: `Envie ${amountUSD.toFixed(2)} USD em ${crypto.symbol} para o endereço acima na rede ${crypto.network}. Após confirmação (${crypto.confirmations} blocos), o acesso será liberado.`
  };
}

// Renderizar checkout cripto
function renderCryptoCheckout(productId, product, region) {
  const preferred = region.preferredCrypto || 'USDT';
  const crypto = CRYPTO_CONFIG[preferred];
  const payment = getCryptoPayment(preferred, product.price);

  return `
    <div class="crypto-checkout" style="border: 2px solid ${crypto.color}; border-radius: 12px; padding: 20px; margin: 10px 0; background: rgba(0,0,0,0.3);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <span style="font-size: 28px;">${region.flag}</span>
        <span style="font-size: 20px; color: #fff;">${region.name}</span>
        <span style="font-size: 24px; margin-left: auto; color: ${crypto.color};">${crypto.icon} ${crypto.symbol}</span>
      </div>
      <div style="text-align: center; margin-bottom: 15px;">
        <span style="font-size: 28px; color: #FFD700; font-weight: bold;">${region.symbol} ${product.price.toFixed(2)}</span>
        <div style="color: #aaa; font-size: 13px;">≈ ${product.price.toFixed(2)} USD em ${crypto.symbol}</div>
      </div>
      <div style="background: #1a1a2e; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
        <div style="color: #888; font-size: 12px; margin-bottom: 5px;">Rede: ${crypto.network}</div>
        <div style="color: #fff; font-size: 13px; word-break: break-all; font-family: monospace; user-select: all;">${crypto.address}</div>
      </div>
      <button onclick="copyCryptoAddress('${crypto.address}', '${crypto.symbol}')" 
              style="width: 100%; padding: 12px; background: ${crypto.color}; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
        📋 Copiar Endereço ${crypto.symbol}
      </button>
      <div style="color: #888; font-size: 11px; margin-top: 8px; text-align: center;">
        Após pagamento, envie comprovante via Telegram para liberar acesso
      </div>
    </div>
  `;
}

// Copiar endereço cripto
function copyCryptoAddress(address, symbol) {
  navigator.clipboard.writeText(address).then(() => {
    showToast(`✅ Endereço ${symbol} copiado!`);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = address;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`✅ Endereço ${symbol} copiado!`);
  });
}

// Alternar métodos de pagamento
function togglePayment(productId) {
  const region = detectRegion();
  const el = document.getElementById('payment-options-' + productId);
  if (!el) return;

  if (region.paymentMethods.includes('pix')) {
    // Brasil: mostrar Pix + Kiwify
    el.innerHTML = `
      <button onclick="window.open('${region.products[productId].checkoutUrl}', '_blank')" 
              style="width: 100%; padding: 14px; background: linear-gradient(135deg, #00C853, #00E676); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 17px; font-weight: bold; margin-bottom: 8px;">
        💚 Pagar com PIX — ${region.symbol} ${region.products[productId].price.toFixed(2)}
      </button>
      <div style="text-align: center; color: #aaa; font-size: 12px;">ou</div>
    `;
    // Mostrar opções cripto também
    const cryptoOptions = ['BTC', 'ETH', 'USDT'].map(c => {
      const crypto = CRYPTO_CONFIG[c];
      return `<button onclick="showCryptoPayment('${productId}', '${c}')" 
              style="padding: 8px 12px; background: ${crypto.color}; color: #fff; border: none; border-radius: 6px; cursor: pointer; margin: 3px; font-size: 13px;">
        ${crypto.icon} ${c}
      </button>`;
    }).join('');
    el.innerHTML += `<div style="text-align: center; margin-top: 8px;">${cryptoOptions}</div>`;
  } else {
    // Internacional: mostrar cripto
    const cryptoOptions = region.paymentMethods.map(c => {
      const crypto = CRYPTO_CONFIG[c];
      return `<button onclick="showCryptoPayment('${productId}', '${c}')" 
              style="padding: 10px 16px; background: ${crypto.color}; color: #fff; border: none; border-radius: 6px; cursor: pointer; margin: 4px; font-size: 14px; font-weight: bold;">
        ${crypto.icon} Pay with ${c}
      </button>`;
    }).join('');
    el.innerHTML = `<div style="text-align: center;">${cryptoOptions}</div>`;
  }
}

// Mostrar pagamento cripto específico
function showCryptoPayment(productId, cryptoType) {
  const region = detectRegion();
  const product = region.products[productId];
  const modal = document.getElementById('crypto-modal');
  if (!modal) return;

  const crypto = CRYPTO_CONFIG[cryptoType];
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: #16213e; border: 2px solid ${crypto.color}; border-radius: 16px; padding: 30px; max-width: 400px; width: 100%; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">${crypto.icon}</div>
        <h2 style="color: #fff; margin: 0 0 5px 0;">Pagar com ${crypto.symbol}</h2>
        <div style="color: #aaa; font-size: 13px; margin-bottom: 15px;">Rede: ${crypto.network}</div>
        <div style="font-size: 26px; color: #FFD700; font-weight: bold; margin-bottom: 15px;">${region.symbol} ${product.price.toFixed(2)}</div>
        <div style="background: #0f0f23; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
          <div style="color: #888; font-size: 11px; margin-bottom: 8px;">ENVIE PARA ESTE ENDEREÇO:</div>
          <div style="color: #fff; font-size: 12px; word-break: break-all; font-family: monospace; user-select: all; line-height: 1.6;">${crypto.address}</div>
        </div>
        <button onclick="copyCryptoAddress('${crypto.address}', '${crypto.symbol}')" 
                style="width: 100%; padding: 14px; background: ${crypto.color}; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-bottom: 10px;">
          📋 Copiar Endereço
        </button>
        <button onclick="this.closest('div[style*=fixed]').remove()" 
                style="width: 100%; padding: 10px; background: transparent; color: #888; border: 1px solid #444; border-radius: 8px; cursor: pointer; font-size: 14px;">
          ✕ Fechar
        </button>
        <div style="color: #666; font-size: 11px; margin-top: 12px;">
          Após pagamento, envie o comprovante via Telegram para liberar seu acesso
        </div>
      </div>
    </div>
  `;
  modal.style.display = 'block';
}

// Toast notification
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
    background: '#333', color: '#fff', padding: '12px 24px', borderRadius: '8px',
    zIndex: '99999', fontSize: '14px', transition: 'opacity 0.5s'
  });
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 2500);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  const region = detectRegion();
  console.log(`🌍 Região detectada: ${region.flag} ${region.name} | Moeda: ${region.currency} | Pagamento: ${region.paymentMethods.join(', ')}`);
});

// Export
window.GlobalCheckout = {
  CRYPTO_CONFIG,
  REGION_CONFIG,
  detectRegion,
  getCryptoPayment,
  renderCryptoCheckout,
  showCryptoPayment,
  copyCryptoAddress,
  togglePayment
};
