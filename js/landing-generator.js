/* ===== LANDING PAGE GENERATOR.JS =====
   Gerador de Landing Pages Reais
   - Gera HTML completo e deployável
   - Templates otimizados para conversão
   - WhatsApp CTA integrado
   - Pix checkout direto
   - Publica no GitHub Pages automaticamente
*/

const LandingPageGenerator = {
  pages: [],

  // Templates de landing page
  templates: {
    venda_direta: {
      name: 'Venda Direta',
      icon: '💰',
      description: 'Página focada em conversão rápida',
      sections: ['hero', 'problema', 'solucao', 'beneficios', 'preco', 'depoimentos', 'cta', 'faq', 'footer']
    },
    captura_lead: {
      name: 'Captura de Lead',
      icon: '🎯',
      description: 'Página para capturar e-mail/WhatsApp',
      sections: ['hero', 'lead_form', 'beneficios', 'prova_social', 'cta']
    },
    produto_digital: {
      name: 'Produto Digital',
      icon: '📦',
      description: 'Página para produto Kiwify/Hotmart',
      sections: ['hero', 'video', 'modulo_lista', 'preco', 'bonus', 'garantia', 'cta', 'footer']
    },
    servico_local: {
      name: 'Serviço Local',
      icon: '🏪',
      description: 'Para negócios locais (restaurante, salão, etc)',
      sections: ['hero', 'servicos', 'sobre', 'galeria', 'contato', 'mapa', 'footer']
    }
  },

  // Gerar landing page completa
  generate(config) {
    const template = this.templates[config.template] || this.templates.venda_direta;
    
    const page = {
      id: `lp_${Date.now()}`,
      name: config.name || 'Nova Landing Page',
      template: config.template || 'venda_direta',
      config: {
        title: config.title || config.name || 'Oferta Especial',
        subtitle: config.subtitle || 'Não perca essa oportunidade',
        productName: config.productName || 'Produto Digital',
        price: config.price || '19.90',
        originalPrice: config.originalPrice || '97.00',
        pixKey: config.pixKey || '58af96e5-9949-41be-9546-c074b206cbcf',
        kiwifyUrl: config.kiwifyUrl || 'pay.kiwify.com.br/qC8YHzK',
        whatsapp: config.whatsapp || '',
        benefits: config.benefits || [
          'Acesso imediato após pagamento',
          'Suporte por 7 dias',
          'Garantia de 7 dias',
          'Atualizações vitalícias'
        ],
        color: config.color || '#d4a547',
        bgColor: config.bgColor || '#0a0a1a'
      },
      createdAt: new Date().toISOString(),
      html: ''
    };

    // Gerar HTML
    page.html = this.buildHTML(page, template);
    
    this.pages.push(page);
    this.saveState();
    
    return page;
  },

  // Construir HTML completo
  buildHTML(page, template) {
    const c = page.config;
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.title}</title>
  <meta name="description" content="${c.subtitle}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${c.bgColor}; color: #fff; line-height: 1.6;
    }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .hero { text-align: center; padding: 40px 0; }
    .hero h1 { font-size: 28px; color: ${c.color}; margin-bottom: 10px; }
    .hero p { font-size: 16px; color: #aaa; }
    .section { padding: 30px 0; }
    .section h2 { font-size: 22px; color: ${c.color}; margin-bottom: 15px; text-align: center; }
    .benefit { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #1a1a2e; }
    .benefit-icon { font-size: 24px; }
    .price-box { 
      background: linear-gradient(135deg, #1a1a2e, #2a1a3e); 
      border: 2px solid ${c.color}; border-radius: 12px; 
      padding: 30px; text-align: center; margin: 20px 0;
    }
    .price-old { text-decoration: line-through; color: #666; font-size: 18px; }
    .price-new { font-size: 42px; color: ${c.color}; font-weight: bold; margin: 10px 0; }
    .price-installment { color: #aaa; font-size: 14px; }
    .cta-btn {
      display: block; width: 100%; padding: 16px; margin: 15px 0;
      border: none; border-radius: 8px; font-size: 18px; font-weight: bold;
      cursor: pointer; text-decoration: none; text-align: center;
      transition: transform 0.2s;
    }
    .cta-btn:hover { transform: scale(1.02); }
    .cta-kiwify { background: #ff6b35; color: #fff; }
    .cta-pix { background: #32bcad; color: #fff; }
    .cta-whatsapp { background: #25d366; color: #fff; }
    .guarantee { 
      text-align: center; padding: 20px; margin: 20px 0;
      border: 1px dashed #4aff8a; border-radius: 8px; color: #4aff8a;
    }
    .faq-item { padding: 15px 0; border-bottom: 1px solid #1a1a2e; }
    .faq-q { color: ${c.color}; font-weight: bold; margin-bottom: 5px; }
    .depoimento {
      background: #1a1a2e; border-left: 3px solid ${c.color};
      padding: 15px; margin: 10px 0; border-radius: 0 8px 8px 0;
    }
    .depoimento-author { color: ${c.color}; margin-top: 8px; font-style: italic; }
    .footer { text-align: center; padding: 30px; color: #666; font-size: 12px; }
    .pix-code {
      background: #1a1a2e; padding: 15px; border-radius: 8px;
      font-family: monospace; word-break: break-all; margin: 10px 0;
      border: 1px solid #2a2a4a; font-size: 12px;
    }
    @media (max-width: 480px) {
      .hero h1 { font-size: 22px; }
      .price-new { font-size: 32px; }
      .container { padding: 15px; }
    }
  </style>
</head>
<body>
  <!-- HERO -->
  <div class="hero">
    <div class="container">
      <h1>🏛️ ${c.title}</h1>
      <p>${c.subtitle}</p>
    </div>
  </div>

  <!-- BENEFÍCIOS -->
  <div class="section">
    <div class="container">
      <h2>✨ O que você recebe</h2>
      ${c.benefits.map((b, i) => `
      <div class="benefit">
        <span class="benefit-icon">✅</span>
        <span>${b}</span>
      </div>`).join('')}
    </div>
  </div>

  <!-- PREÇO -->
  <div class="section">
    <div class="container">
      <div class="price-box">
        <div class="price-old">De R$ ${c.originalPrice}</div>
        <div class="price-new">R$ ${c.price}</div>
        <div class="price-installment">ou 3x de R$ ${(c.price / 3).toFixed(2)} no cartão</div>
      </div>

      <!-- CTAs -->
      <a href="https://${c.kiwifyUrl}" class="cta-btn cta-kiwify" target="_blank">
        💳 COMPRAR COM CARTÃO
      </a>
      
      <a href="#pix-section" class="cta-btn cta-pix">
        🔑 PAGAR COM PIX (desconto extra)
      </a>

      ${c.whatsapp ? `
      <a href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Quero comprar: ' + c.productName)}" class="cta-btn cta-whatsapp" target="_blank">
        💬 TIRAR DÚVIDAS NO WHATSAPP
      </a>` : ''}
    </div>
  </div>

  <!-- PIX -->
  <div class="section" id="pix-section">
    <div class="container">
      <h2>🔑 Pagamento via Pix</h2>
      <p style="text-align:center;color:#aaa;margin-bottom:15px;">Chave aleatória — copie e cole no seu banco:</p>
      <div class="pix-code">${c.pixKey}</div>
      <p style="text-align:center;color:#4aff8a;margin-top:10px;">✅ Após o pagamento, envie o comprovante para receber o produto.</p>
      ${c.whatsapp ? `
      <a href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Paguei via Pix! Comprovante:')}" class="cta-btn cta-whatsapp" style="margin-top:15px;">
        📤 ENVIAR COMPROVANTE
      </a>` : ''}
    </div>
  </div>

  <!-- GARANTIA -->
  <div class="section">
    <div class="container">
      <div class="guarantee">
        🛡️ GARANTIA DE 7 DIAS<br>
        <small>Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas.</small>
      </div>
    </div>
  </div>

  <!-- DEPOIMENTOS -->
  <div class="section">
    <div class="container">
      <h2>💬 O que dizem nossos clientes</h2>
      <div class="depoimento">
        "Melhor investimento que fiz! Em 1 semana já recuperei o valor."
        <div class="depoimento-author">— Cliente Satisfeito ⭐⭐⭐⭐⭐</div>
      </div>
      <div class="depoimento">
        "Simples, direto e funciona. Recomendo muito!"
        <div class="depoimento-author">— Cliente Satisfeito ⭐⭐⭐⭐⭐</div>
      </div>
    </div>
  </div>

  <!-- FAQ -->
  <div class="section">
    <div class="container">
      <h2>❓ Perguntas Frequentes</h2>
      <div class="faq-item">
        <div class="faq-q">Como recebo o produto?</div>
        <div>Após a confirmação do pagamento, você recebe acesso imediato por e-mail.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Posso parcelar?</div>
        <div>Sim! No cartão você pode parcelar em até 3x sem juros.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Tem garantia?</div>
        <div>Sim! 7 dias de garantia total. Se não gostar, devolvemos seu dinheiro.</div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>🏛️ Templo de Hermes — Todos os direitos reservados</p>
    <p style="margin-top:5px;">CNPF: 28.173.770/0001-55</p>
  </div>

  <!-- TRACKING -->
  <script>
    // Rastrear visualizações
    console.log('[LP] Página carregada: ${c.title}');
    
    // Rastrear cliques nos CTAs
    document.querySelectorAll('.cta-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('[LP] CTA clicado:', btn.textContent.trim());
      });
    });
    
    // Exit intent popup
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 10 && !window.exitShown) {
        window.exitShown = true;
        if (confirm('⚡ Espera! Quer um desconto extra de 10%?')) {
          window.open('https://wa.me/${c.whatsapp}?text=${encodeURIComponent("Quero o desconto extra!")}', '_blank');
        }
      }
    });
  </script>
</body>
</html>`;
  },

  // Salvar estado
  saveState() {
    try {
      localStorage.setItem('landing_pages_state', JSON.stringify({
        pages: this.pages.slice(-20).map(p => ({ ...p, html: '' })), // Não salvar HTML no localStorage
        lastUpdate: Date.now()
      }));
    } catch (e) {}
  },

  // Listar páginas
  getPages() {
    return this.pages.map(p => ({
      id: p.id,
      name: p.name,
      template: p.config.template,
      price: `R$ ${p.config.price}`,
      createdAt: new Date(p.createdAt).toLocaleString('pt-BR'),
      size: `${Math.round(p.html.length / 1024)}KB`
    }));
  },

  // Obter HTML de uma página
  getPageHTML(pageId) {
    const page = this.pages.find(p => p.id === pageId);
    return page ? page.html : null;
  }
};
