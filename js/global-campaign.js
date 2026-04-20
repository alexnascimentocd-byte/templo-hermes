/**
 * 🌍 GLOBAL CAMPAIGN — Sistema de Campanha Online Mundial
 * Detecta região, configura moeda e método de pagamento
 * Brasil: Pix + Kiwify | Mundo: Cripto
 */

const CAMPAIGN_CONFIG = {
  cryptoWallets: {
    BTC: {
      network: 'Bitcoin',
      address: 'bc1qsr7p9lngmlau2sjnsqwu2n6rzmvjrahfnvvzhh',
      symbol: '₿',
      icon: '₿',
      color: '#F7931A'
    },
    ETH: {
      network: 'Ethereum (ERC20)',
      address: '0x34d1915bc5FE1F3C69289dc799F8209ff5116719',
      symbol: 'Ξ',
      icon: 'Ξ',
      color: '#627EEA'
    },
    USDT: {
      network: 'Tron (TRC20)',
      address: 'TLBabfALehgYSWSYfHhZh1iMiuujhd8v2g4',
      symbol: '₮',
      icon: '₮',
      color: '#26A17B'
    },
    SOL: {
      network: 'Solana',
      address: 'AMEyqLjc2u96Uzkg56vfe6eJevpgKmLorUyACCCFMCrk',
      symbol: '◎',
      icon: '◎',
      color: '#9945FF'
    }
  },
  // Produtos digitais
  products: {
    pack550: {
      name: 'Pack 550+ Scripts e Copies',
      description: '550+ scripts prontos para vendas, anúncios, emails e redes sociais',
      checkoutUrl: 'https://pay.kiwify.com.br/qC8YHzK',
      prices: { BRL: 19.90, USD: 3.99, EUR: 3.69, GBP: 3.19 }
    },
    primeiraVenda: {
      name: 'Primeira Venda em 48h',
      description: 'Método comprovado para fazer sua primeira venda online em até 48 horas',
      checkoutUrl: 'https://pay.kiwify.com.br/xcL4QxC',
      prices: { BRL: 9.90, USD: 1.99, EUR: 1.79, GBP: 1.59 }
    },
    marketing: {
      name: 'Marketing Digital + Mentalidade',
      description: 'O guia completo de marketing digital com mindset de vencedor',
      checkoutUrl: 'https://pay.kiwify.com.br/D4NExoo',
      prices: { BRL: 27.90, USD: 5.49, EUR: 4.99, GBP: 4.29 },
      badge: '🔥 MAIS VENDIDO'
    }
  }
};

// Regiões com configuração de pagamento
const REGIONS = {
  BR: {
    flag: '🇧🇷', name: 'Brasil', currency: 'BRL', symbol: 'R$',
    paymentMethod: 'pix', preferredCrypto: null,
    conversionRate: 1.0
  },
  US: {
    flag: '🇺🇸', name: 'United States', currency: 'USD', symbol: '$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.0
  },
  CA: {
    flag: '🇨🇦', name: 'Canada', currency: 'USD', symbol: 'C$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.37
  },
  UK: {
    flag: '🇬🇧', name: 'United Kingdom', currency: 'GBP', symbol: '£',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 0.79
  },
  EU: {
    flag: '🇪🇺', name: 'European Union', currency: 'EUR', symbol: '€',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 0.92
  },
  LATAM: {
    flag: '🌎', name: 'Latin America', currency: 'USD', symbol: '$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.0
  },
  ASIA: {
    flag: '🌏', name: 'Asia', currency: 'USD', symbol: '$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.0
  },
  AFRICA: {
    flag: '🌍', name: 'Africa', currency: 'USD', symbol: '$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.0
  },
  OCEANIA: {
    flag: '🌏', name: 'Oceania', currency: 'USD', symbol: 'A$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.53
  },
  WORLD: {
    flag: '🌍', name: 'International', currency: 'USD', symbol: '$',
    paymentMethod: 'crypto', preferredCrypto: 'USDT',
    conversionRate: 1.0
  }
};

// Mapeamento de países para regiões
const COUNTRY_MAP = {
  'BR': 'BR', 'US': 'US', 'CA': 'CA',
  'GB': 'UK', 'UK': 'UK',
  'DE': 'EU', 'FR': 'EU', 'IT': 'EU', 'ES': 'EU', 'PT': 'EU',
  'NL': 'EU', 'BE': 'EU', 'AT': 'EU', 'CH': 'EU', 'SE': 'EU',
  'NO': 'EU', 'DK': 'EU', 'FI': 'EU', 'PL': 'EU', 'CZ': 'EU',
  'RO': 'EU', 'HU': 'EU', 'IE': 'EU', 'GR': 'EU',
  'AR': 'LATAM', 'CL': 'LATAM', 'CO': 'LATAM', 'MX': 'LATAM',
  'PE': 'LATAM', 'UY': 'LATAM', 'VE': 'LATAM', 'EC': 'LATAM',
  'BO': 'LATAM', 'PY': 'LATAM', 'PA': 'LATAM', 'CR': 'LATAM',
  'JP': 'ASIA', 'KR': 'ASIA', 'CN': 'ASIA', 'IN': 'ASIA',
  'SG': 'ASIA', 'TW': 'ASIA', 'TH': 'ASIA', 'VN': 'ASIA',
  'AU': 'OCEANIA', 'NZ': 'OCEANIA', 'ZA': 'AFRICA',
  'NG': 'AFRICA', 'KE': 'AFRICA', 'EG': 'AFRICA', 'MA': 'AFRICA'
};

// Detectar região do usuário
function detectUserRegion() {
  try {
    // Método 1: Timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = navigator.language || 'en-US';
    
    // Mapear timezone para país
    const tzToCountry = {
      'America/Sao_Paulo': 'BR', 'America/Bahia': 'BR', 'America/Recife': 'BR',
      'America/Fortaleza': 'BR', 'America/Manaus': 'BR', 'America/Cuiaba': 'BR',
      'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
      'America/Los_Angeles': 'US', 'America/Phoenix': 'US',
      'America/Toronto': 'CA', 'America/Vancouver': 'CA',
      'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
      'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Lisbon': 'PT',
      'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Shanghai': 'CN',
      'Asia/Kolkata': 'IN', 'Asia/Singapore': 'SG',
      'Australia/Sydney': 'AU', 'Pacific/Auckland': 'NZ',
      'America/Argentina/Buenos_Aires': 'AR', 'America/Santiago': 'CL',
      'America/Bogota': 'CO', 'America/Mexico_City': 'MX',
      'America/Lima': 'PE', 'America/Montevideo': 'UY'
    };
    
    let country = tzToCountry[tz];
    
    // Método 2: Fallback por idioma
    if (!country) {
      const langToCountry = {
        'pt-BR': 'BR', 'pt': 'BR',
        'en-US': 'US', 'en-GB': 'GB', 'en-AU': 'AU',
        'es-AR': 'AR', 'es-CL': 'CL', 'es-CO': 'CO', 'es-MX': 'MX', 'es': 'LATAM',
        'de': 'DE', 'fr': 'FR', 'it': 'IT', 'ja': 'JP', 'ko': 'KR', 'zh': 'CN'
      };
      country = langToCountry[lang] || langToCountry[lang.split('-')[0]];
    }
    
    // Se encontrou país, usar região correspondente
    if (country && COUNTRY_MAP[country]) {
      return REGIONS[COUNTRY_MAP[country]];
    }
    
    // Fallback: mundo
    return REGIONS.WORLD;
  } catch (e) {
    return REGIONS.WORLD;
  }
}

// Obter preço formatado por região
function getProductPrice(productId, region) {
  const product = CAMPAIGN_CONFIG.products[productId];
  if (!product) return null;
  
  const price = product.prices[region.currency] || product.prices.USD;
  return `${region.symbol} ${price.toFixed(2)}`;
}

// Obter métodos de pagamento disponíveis
function getPaymentMethods(region) {
  if (region.paymentMethod === 'pix') {
    return {
      primary: {
        type: 'pix',
        label: '💚 Pagar com PIX',
        action: 'checkout_kiwify',
        icon: '💚'
      },
      secondary: Object.entries(CAMPAIGN_CONFIG.cryptoWallets).map(([key, wallet]) => ({
        type: 'crypto',
        currency: key,
        label: `${wallet.icon} ${key}`,
        address: wallet.address,
        network: wallet.network,
        color: wallet.color
      }))
    };
  } else {
    // Internacional: apenas cripto
    const preferred = region.preferredCrypto || 'USDT';
    const wallet = CAMPAIGN_CONFIG.cryptoWallets[preferred];
    return {
      primary: {
        type: 'crypto',
        currency: preferred,
        label: `${wallet.icon} Pay with ${preferred}`,
        address: wallet.address,
        network: wallet.network,
        color: wallet.color
      },
      alternatives: Object.entries(CAMPAIGN_CONFIG.cryptoWallets)
        .filter(([key]) => key !== preferred)
        .map(([key, w]) => ({
          type: 'crypto',
          currency: key,
          label: `${w.icon} ${key}`,
          address: w.address,
          network: w.network,
          color: w.color
        }))
    };
  }
}

// Exportar
window.GlobalCampaign = {
  CAMPAIGN_CONFIG,
  REGIONS,
  detectUserRegion,
  getProductPrice,
  getPaymentMethods,
  COUNTRY_MAP
};

console.log('🌍 Global Campaign System loaded');
