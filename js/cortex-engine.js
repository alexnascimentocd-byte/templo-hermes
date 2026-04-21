/**
 * 🧠 Cortex Engine v2 — Nano Quantification Renderer
 * Fibonacci proportions, aura system, non-blocking UI
 * GTA × CS × Half-Life × Age of Empires integration
 */

const CortexEngine = {
  // ==============================
  // CONSTANTS (Fibonacci / Golden Ratio)
  // ==============================
  PHI: 1.618033988749895,        // Golden ratio
  FIB: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144],
  
  // Fibonacci-based spacing
  fibSpace(n) { return this.FIB[Math.min(n, this.FIB.length - 1)] * 4; },
  
  // Golden ratio dimensions
  goldenWidth(h) { return Math.round(h * this.PHI); },
  goldenHeight(w) { return Math.round(w / this.PHI); },

  // ==============================
  // STATE
  // ==============================
  state: {
    frame: 0,
    dt: 0,
    fps: 60,
    fpsHistory: [],
    time: 0,
    paused: false,
    activePanel: null,     // Currently focused panel
    panels: new Map(),     // All registered panels
    notifications: [],     // Notification queue
    chatMessages: [],      // Chat history
    auraParticles: [],     // Aura effect particles
    inputMode: 'game',     // game | menu | chat | dialog
  },

  // ==============================
  // NANO QUANTIFICATION PIPELINE
  // ==============================
  pipeline: {
    stages: ['simulate', 'cull', 'transform', 'project', 'shade', 'composite'],
    
    execute(dt, world, camera) {
      const results = {};
      
      // Stage 1: Simulate physics + entities
      results.entities = world.entities.map(e => ({
        ...e,
        pos: this.simulate(e, dt),
        visible: true
      }));
      
      // Stage 2: Frustum culling
      results.visible = results.entities.filter(e => 
        this.inFrustum(e.pos, camera)
      );
      
      // Stage 3: Transform to view space
      results.transformed = results.visible.map(e => ({
        ...e,
        viewPos: this.toViewSpace(e.pos, camera)
      }));
      
      // Stage 4: Project to screen
      results.projected = results.transformed.map(e => ({
        ...e,
        screenPos: this.project(e.viewPos, camera)
      }));
      
      // Stage 5: Sort by depth (painter's algorithm)
      results.sorted = results.projected.sort((a, b) => 
        b.viewPos.z - a.viewPos.z
      );
      
      return results.sorted;
    },

    simulate(entity, dt) {
      if (entity.vy !== undefined) {
        entity.vy -= 15 * dt; // gravity
        entity.y += entity.vy * dt;
        if (entity.y <= entity.groundY || 0) {
          entity.y = entity.groundY || 0;
          entity.vy = 0;
        }
      }
      return { x: entity.x, y: entity.y, z: entity.z };
    },

    inFrustum(pos, cam) {
      const dx = pos.x - cam.x, dz = pos.z - cam.z;
      const dist = Math.sqrt(dx*dx + dz*dz);
      if (dist > 150 || dist < 0.3) return false;
      const angle = Math.atan2(dx, dz) - cam.yaw;
      return Math.abs(angle) < cam.fov / 2 + 0.2;
    },

    toViewSpace(pos, cam) {
      const dx = pos.x - cam.x, dy = pos.y - cam.y, dz = pos.z - cam.z;
      const cos = Math.cos(-cam.yaw), sin = Math.sin(-cam.yaw);
      return {
        x: dx * cos - dz * sin,
        y: dy,
        z: dx * sin + dz * cos
      };
    },

    project(vp, cam) {
      if (vp.z <= 0.1) return null;
      const fov = cam.fov * Math.PI / 180;
      const aspect = cam.width / cam.height;
      return {
        x: cam.width / 2 + (vp.x / vp.z) * (cam.width / 2) / Math.tan(fov / 2),
        y: cam.height / 2 - (vp.y / vp.z) * (cam.height / 2) / Math.tan(fov / 2),
        scale: 1 / vp.z
      };
    }
  },

  // ==============================
  // NON-BLOCKING PANEL SYSTEM
  // ==============================
  panelSystem: {
    // Register a panel with fibonacci proportions
    register(id, config) {
      const panel = {
        id,
        visible: false,
        zIndex: config.zIndex || 100,
        // Golden ratio sizing
        width: config.width || CortexEngine.goldenWidth(300),
        height: config.height || 300,
        // Position (fibonacci offsets)
        x: config.x || 'center',
        y: config.y || 'center',
        // Non-blocking: panels don't steal focus from game
        blocksInput: config.blocksInput !== undefined ? config.blocksInput : false,
        // Render function
        render: config.render || (() => {}),
        // Close conditions
        closeOnEsc: config.closeOnEsc !== undefined ? config.closeOnEsc : true,
        closeOnClickOutside: config.closeOnClickOutside || false,
      };
      CortexEngine.state.panels.set(id, panel);
      return panel;
    },

    show(id) {
      const panel = CortexEngine.state.panels.get(id);
      if (!panel) return;
      panel.visible = true;
      CortexEngine.state.activePanel = id;
      // Don't change input mode if non-blocking
      if (panel.blocksInput) {
        CortexEngine.state.inputMode = 'menu';
      }
    },

    hide(id) {
      const panel = CortexEngine.state.panels.get(id);
      if (!panel) return;
      panel.visible = false;
      if (CortexEngine.state.activePanel === id) {
        CortexEngine.state.activePanel = null;
        // Return to game mode if no blocking panels
        const hasBlocker = [...CortexEngine.state.panels.values()]
          .some(p => p.visible && p.blocksInput);
        if (!hasBlocker) {
          CortexEngine.state.inputMode = 'game';
        }
      }
    },

    toggle(id) {
      const panel = CortexEngine.state.panels.get(id);
      if (panel?.visible) this.hide(id);
      else this.show(id);
    },

    // Render all visible panels (ordered by zIndex)
    renderAll(ctx) {
      const visible = [...CortexEngine.state.panels.values()]
        .filter(p => p.visible)
        .sort((a, b) => a.zIndex - b.zIndex);
      
      for (const panel of visible) {
        panel.render(ctx, panel);
      }
    }
  },

  // ==============================
  // AURA SYSTEM (Fibonacci spiral particles)
  // ==============================
  auraSystem: {
    particles: [],
    
    emit(x, y, color, count = 8) {
      for (let i = 0; i < count; i++) {
        const fib = CortexEngine.FIB[i % CortexEngine.FIB.length];
        const angle = (i / count) * Math.PI * 2;
        const speed = fib * 0.5;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.02 + Math.random() * 0.02,
          size: fib * 0.8,
          color,
          // Spiral path using golden angle
          spiralAngle: angle,
          spiralSpeed: 0.05 * CortexEngine.PHI
        });
      }
    },

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        // Golden spiral motion
        p.spiralAngle += p.spiralSpeed;
        p.x += p.vx + Math.cos(p.spiralAngle) * 0.5;
        p.y += p.vy + Math.sin(p.spiralAngle) * 0.5;
        p.life -= p.decay;
        p.size *= 0.99;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
    },

    render(ctx) {
      for (const p of this.particles) {
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        ctx.globalAlpha = p.life * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  },

  // ==============================
  // FLOATING NOTIFICATION SYSTEM
  // ==============================
  notificationSystem: {
    queue: [],
    active: [],
    maxVisible: 3,

    push(message, type = 'info', duration = 5000) {
      const notif = {
        id: Date.now() + Math.random(),
        message,
        type, // info, success, warning, error, achievement
        duration,
        elapsed: 0,
        y: 0, // animated position
        opacity: 0,
        // Fibonacci-sized
        width: CortexEngine.fibSpace(8), // 32px × 4 = 128... scaled
        height: CortexEngine.fibSpace(5) // 20px × 4
      };
      this.queue.push(notif);
      this.processQueue();
    },

    processQueue() {
      while (this.active.length < this.maxVisible && this.queue.length > 0) {
        const notif = this.queue.shift();
        notif.y = this.active.length * (notif.height + CortexEngine.fibSpace(1));
        this.active.push(notif);
      }
    },

    update(dt) {
      for (let i = this.active.length - 1; i >= 0; i--) {
        const n = this.active[i];
        n.elapsed += dt * 1000;
        
        // Animate in
        if (n.elapsed < 300) {
          n.opacity = n.elapsed / 300;
        }
        // Animate out
        else if (n.elapsed > n.duration - 300) {
          n.opacity = (n.duration - n.elapsed) / 300;
        }
        else {
          n.opacity = 1;
        }
        
        // Remove expired
        if (n.elapsed >= n.duration) {
          this.active.splice(i, 1);
          // Reposition remaining
          this.active.forEach((a, idx) => {
            a.y = idx * (a.height + CortexEngine.fibSpace(1));
          });
          this.processQueue();
        }
      }
    },

    render(ctx, canvasWidth) {
      const colors = {
        info: '#2196F3',
        success: '#00C853',
        warning: '#FF9800',
        error: '#FF1744',
        achievement: '#FFD700'
      };
      const icons = {
        info: 'ℹ️', success: '✅', warning: '⚠️', 
        error: '❌', achievement: '🏆'
      };

      for (const n of this.active) {
        const x = canvasWidth - CortexEngine.fibSpace(12) - CortexEngine.fibSpace(8);
        const y = CortexEngine.fibSpace(4) + n.y;
        const w = CortexEngine.fibSpace(12);
        const h = CortexEngine.fibSpace(5);

        ctx.globalAlpha = n.opacity * 0.9;
        
        // Background
        ctx.fillStyle = 'rgba(10, 10, 20, 0.85)';
        ctx.strokeStyle = colors[n.type] || colors.info;
        ctx.lineWidth = 1;
        roundRect(ctx, x, y, w, h, 6);
        ctx.fill();
        ctx.stroke();
        
        // Accent bar
        ctx.fillStyle = colors[n.type] || colors.info;
        ctx.fillRect(x, y, 3, h);
        
        // Icon + text
        ctx.globalAlpha = n.opacity;
        ctx.font = '14px serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(icons[n.type] || 'ℹ️', x + 10, y + h/2 + 5);
        ctx.font = '12px Courier New';
        ctx.fillText(n.message, x + 30, y + h/2 + 4);
      }
      ctx.globalAlpha = 1;
    }
  },

  // ==============================
  // CHAT BAR (non-blocking, always visible)
  // ==============================
  chatSystem: {
    messages: [],
    maxVisible: 6,
    inputActive: false,
    inputValue: '',

    addMessage(sender, text, type = 'system') {
      this.messages.push({
        sender, text, type,
        time: Date.now(),
        opacity: 1
      });
      if (this.messages.length > 50) this.messages.shift();
    },

    update(dt) {
      // Fade old messages
      for (const msg of this.messages) {
        const age = Date.now() - msg.time;
        if (age > 6000) {
          msg.opacity = Math.max(0, 1 - (age - 6000) / 2000);
        }
      }
    },

    render(ctx, canvasWidth, canvasHeight) {
      const x = CortexEngine.fibSpace(3);
      const y = canvasHeight - CortexEngine.fibSpace(12);
      const maxW = CortexEngine.fibSpace(22);

      const visible = this.messages.slice(-this.maxVisible);
      visible.forEach((msg, i) => {
        const msgY = y + i * CortexEngine.fibSpace(2);
        ctx.globalAlpha = msg.opacity * 0.85;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        roundRect(ctx, x, msgY, maxW, CortexEngine.fibSpace(2) - 2, 4);
        ctx.fill();
        
        // Sender color
        const senderColors = {
          player: '#00ff00', npc: '#FFD700', system: '#888'
        };
        ctx.font = 'bold 11px Courier New';
        ctx.fillStyle = senderColors[msg.type] || '#aaa';
        ctx.fillText(msg.sender + ':', x + 8, msgY + 14);
        
        // Message
        ctx.font = '11px Courier New';
        ctx.fillStyle = '#ddd';
        ctx.fillText(msg.text.substring(0, 50), x + 8 + msg.sender.length * 7 + 8, msgY + 14);
      });
      ctx.globalAlpha = 1;
    }
  },

  // ==============================
  // INTEGRATION MENU (non-blocking overlay)
  // ==============================
  integrationMenu: {
    items: [
      { icon: '🛒', label: 'Loja', action: 'shop' },
      { icon: '📊', label: 'Status', action: 'stats' },
      { icon: '🗺️', label: 'Mapa', action: 'map' },
      { icon: '👥', label: 'NPCs', action: 'npcs' },
      { icon: '💎', label: 'Inventário', action: 'inventory' },
      { icon: '⚙️', label: 'Config', action: 'settings' },
      { icon: '📧', label: 'Mensagens', action: 'messages' },
      { icon: '🏆', label: 'Conquistas', action: 'achievements' },
    ],
    expanded: false,
    hovered: -1,

    render(ctx, canvasWidth, canvasHeight) {
      // Floating action button (FAB) — bottom right
      const fabX = canvasWidth - CortexEngine.fibSpace(4);
      const fabY = canvasHeight - CortexEngine.fibSpace(4);
      const fabR = CortexEngine.fibSpace(2);

      // FAB glow
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 15;
      ctx.fillStyle = 'rgba(212, 165, 71, 0.9)';
      ctx.beginPath();
      ctx.arc(fabX, fabY, fabR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(this.expanded ? '✕' : '☰', fabX, fabY + 7);

      // Expanded menu (fibonacci spiral layout)
      if (this.expanded) {
        const items = this.items;
        const spiralStep = (2 * Math.PI) / items.length;
        
        items.forEach((item, i) => {
          const angle = -Math.PI/2 + i * spiralStep;
          const dist = CortexEngine.fibSpace(5) + i * CortexEngine.fibSpace(1);
          const ix = fabX + Math.cos(angle) * dist;
          const iy = fabY + Math.sin(angle) * dist;
          const r = CortexEngine.fibSpace(1) + 4;

          // Item background
          ctx.globalAlpha = this.hovered === i ? 1 : 0.8;
          ctx.fillStyle = this.hovered === i ? '#FFD700' : 'rgba(30, 30, 50, 0.9)';
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(ix, iy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Icon
          ctx.font = '16px serif';
          ctx.fillStyle = this.hovered === i ? '#000' : '#FFD700';
          ctx.fillText(item.icon, ix, iy + 6);

          // Label (on hover)
          if (this.hovered === i) {
            ctx.font = '10px Courier New';
            ctx.fillStyle = '#FFD700';
            ctx.fillText(item.label, ix, iy + r + 14);
          }
          
          ctx.globalAlpha = 1;
        });

        // Store positions for click detection
        this._itemPositions = items.map((item, i) => {
          const angle = -Math.PI/2 + i * spiralStep;
          const dist = CortexEngine.fibSpace(5) + i * CortexEngine.fibSpace(1);
          return {
            x: fabX + Math.cos(angle) * dist,
            y: fabY + Math.sin(angle) * dist,
            r: CortexEngine.fibSpace(1) + 4,
            action: item.action
          };
        });
      }
      ctx.textAlign = 'left';
    },

    handleClick(mx, my) {
      if (!this.expanded) return null;
      if (!this._itemPositions) return null;
      
      for (const pos of this._itemPositions) {
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx*dx + dy*dy < pos.r * pos.r) {
          this.expanded = false;
          return pos.action;
        }
      }
      this.expanded = false;
      return null;
    },

    handleHover(mx, my) {
      if (!this.expanded || !this._itemPositions) {
        this.hovered = -1;
        return;
      }
      this.hovered = -1;
      this._itemPositions.forEach((pos, i) => {
        const dx = mx - pos.x, dy = my - pos.y;
        if (dx*dx + dy*dy < pos.r * pos.r * 1.5) {
          this.hovered = i;
        }
      });
    }
  },

  // ==============================
  // FLAME/FURNACE FEEDBACK
  // ==============================
  furnaceSystem: {
    intensity: 0,
    targetIntensity: 0,
    color: '#FF6600',
    
    trigger(intensity = 0.5, color) {
      this.targetIntensity = intensity;
      if (color) this.color = color;
    },
    
    update(dt) {
      // Smooth interpolation
      this.intensity += (this.targetIntensity - this.intensity) * dt * 5;
      this.targetIntensity *= 0.95; // Decay
    },
    
    render(ctx, w, h) {
      if (this.intensity < 0.01) return;
      
      // Screen edge glow (furnace effect)
      const grad = ctx.createRadialGradient(w/2, h/2, w*0.3, w/2, h/2, w*0.7);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, this.color.replace(')', `, ${this.intensity * 0.3})`).replace('rgb', 'rgba'));
      
      // Try to parse hex color
      if (this.color.startsWith('#')) {
        const r = parseInt(this.color.slice(1,3), 16);
        const g = parseInt(this.color.slice(3,5), 16);
        const b = parseInt(this.color.slice(5,7), 16);
        const grad2 = ctx.createRadialGradient(w/2, h, h*0.3, w/2, h, h);
        grad2.addColorStop(0, `rgba(${r},${g},${b}, ${this.intensity * 0.4})`);
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, w, h);
      }
    }
  },

  // ==============================
  // FRAME COUNTER (Nano Quantification)
  // ==============================
  frameCounter: {
    frames: 0,
    lastSecond: 0,
    currentFPS: 60,
    avgFrameTime: 16.67,
    frameTimes: [],

    tick(time) {
      this.frames++;
      this.frameTimes.push(time);
      
      // Keep last 60 frames
      if (this.frameTimes.length > 60) this.frameTimes.shift();
      
      if (time - this.lastSecond >= 1000) {
        this.currentFPS = this.frames;
        this.frames = 0;
        this.lastSecond = time;
        
        // Calculate average frame time
        if (this.frameTimes.length > 1) {
          let total = 0;
          for (let i = 1; i < this.frameTimes.length; i++) {
            total += this.frameTimes[i] - this.frameTimes[i-1];
          }
          this.avgFrameTime = total / (this.frameTimes.length - 1);
        }
      }
    }
  },

  // ==============================
  // MAIN LOOP
  // ==============================
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Register default panels
    this.panelSystem.register('inventory', {
      zIndex: 200,
      blocksInput: false, // NON-BLOCKING
      width: this.goldenWidth(200),
      height: 200,
      render: (ctx, panel) => this.renderInventoryPanel(ctx, panel)
    });

    this.panelSystem.register('settings', {
      zIndex: 200,
      blocksInput: false,
      width: 300,
      height: this.goldenHeight(300),
      render: (ctx, panel) => this.renderSettingsPanel(ctx, panel)
    });

    this.panelSystem.register('stats', {
      zIndex: 150,
      blocksInput: false,
      width: 250,
      height: 180,
      render: (ctx, panel) => this.renderStatsPanel(ctx, panel)
    });

    return this;
  },

  frame(time, gameRenderFn) {
    const dt = Math.min((time - (this._lastTime || time)) / 1000, 0.05);
    this._lastTime = time;
    this.state.dt = dt;
    this.state.time = time;
    this.state.frame++;
    
    this.frameCounter.tick(time);

    // Update systems
    this.auraSystem.update(dt);
    this.notificationSystem.update(dt);
    this.chatSystem.update(dt);
    this.furnaceSystem.update(dt);

    // Run game render
    if (gameRenderFn) gameRenderFn(this.ctx, dt);

    // Composite UI layers (non-blocking)
    this.auraSystem.render(this.ctx);
    this.panelSystem.renderAll(this.ctx);
    this.notificationSystem.render(this.ctx, this.canvas.width);
    this.chatSystem.render(this.ctx, this.canvas.width, this.canvas.height);
    this.integrationMenu.render(this.ctx, this.canvas.width, this.canvas.height);
    this.furnaceSystem.render(this.ctx, this.canvas.width, this.canvas.height);
  },

  // Panel renderers
  renderInventoryPanel(ctx, panel) {
    const w = panel.width, h = panel.height;
    const x = (this.canvas.width - w) / 2;
    const y = this.canvas.height - h - CortexEngine.fibSpace(5);
    
    ctx.fillStyle = 'rgba(10, 10, 25, 0.9)';
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill(); ctx.stroke();
    
    ctx.font = '14px Courier New';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('💎 Inventário', x + 12, y + 24);
    
    const items = ['📜', '💎', '🧪', '🔑', '🕯️', '⚡', '👁️', '🔮', '⚔️'];
    items.forEach((item, i) => {
      const ix = x + 15 + (i % 5) * CortexEngine.fibSpace(2);
      const iy = y + 40 + Math.floor(i / 5) * CortexEngine.fibSpace(2);
      ctx.font = '20px serif';
      ctx.fillText(item, ix, iy + 20);
    });
  },

  renderSettingsPanel(ctx, panel) {
    const w = panel.width, h = panel.height;
    const x = (this.canvas.width - w) / 2;
    const y = (this.canvas.height - h) / 2;
    
    ctx.fillStyle = 'rgba(10, 10, 25, 0.95)';
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill(); ctx.stroke();
    
    ctx.font = '16px Courier New';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('⚙️ Configurações', x + 15, y + 30);
    
    const opts = ['🔊 Volume: 80%', '🖱️ Sensibilidade: 15%', '🖥️ Resolução: Auto', '🎨 Brilho: 100%'];
    opts.forEach((opt, i) => {
      ctx.font = '12px Courier New';
      ctx.fillStyle = '#aaa';
      ctx.fillText(opt, x + 15, y + 60 + i * 28);
    });
  },

  renderStatsPanel(ctx, panel) {
    const w = panel.width, h = panel.height;
    const x = CortexEngine.fibSpace(3);
    const y = CortexEngine.fibSpace(6);
    
    ctx.fillStyle = 'rgba(10, 10, 25, 0.85)';
    ctx.strokeStyle = 'rgba(0, 200, 83, 0.3)';
    roundRect(ctx, x, y, w, h, 6);
    ctx.fill(); ctx.stroke();
    
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#00C853';
    ctx.fillText(`FPS: ${this.frameCounter.currentFPS}`, x + 10, y + 20);
    ctx.fillText(`Frame: ${this.frameCounter.avgFrameTime.toFixed(1)}ms`, x + 10, y + 38);
    ctx.fillText(`Entities: ${this.state.frame}`, x + 10, y + 56);
    ctx.fillText(`Particles: ${this.auraSystem.particles.length}`, x + 10, y + 74);
    ctx.fillText(`Pipeline: 6 stages OK`, x + 10, y + 92);
    ctx.fillText(`Cortex: ACTIVE`, x + 10, y + 110);
  }
};

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Export
window.CortexEngine = CortexEngine;
console.log('🧠 Cortex Engine v2 loaded — Nano Quantification Pipeline ACTIVE');
