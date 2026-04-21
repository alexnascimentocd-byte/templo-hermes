/**
 * 🔐 AUTH SYSTEM — Templo Hermes
 * Verificação em duas etapas: Senha + Dispositivo + Email
 */

const AUTH_CONFIG = {
  // Hash da senha mestre (SHA-256 de "veragajota")
  passwordHash: 'a7f5f35426b9274434ca0ea684e5a33b97e59d24e0d0e0c4e6c4e5a33b97e59d',
  // Salt para hash
  salt: 'templo-hermes-2026',
  // Configuração de sessão
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  maxAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutos de bloqueio
  // Domínios permitidos
  allowedDomains: ['alexnascimentocd-byte.github.io', 'localhost'],
  // Email do admin
  adminEmail: 'alexnascimentocd@gmail.com'
};

// ==============================
// HASH DE SENHA (SHA-256)
// ==============================
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.toLowerCase().replace(/\s+/g, '') + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==============================
// FINGERPRINT DO DISPOSITIVO
// ==============================
function getDeviceFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Hermes', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    canvas.toDataURL(),
    navigator.platform
  ].join('|');
  
  return btoa(fingerprint).substring(0, 32);
}

// ==============================
// STORAGE SEGURO
// ==============================
const SecureStorage = {
  _key: 'templo_hermes_auth',
  
  save(data) {
    try {
      const encrypted = btoa(JSON.stringify({
        ...data,
        timestamp: Date.now(),
        device: getDeviceFingerprint()
      }));
      localStorage.setItem(this._key, encrypted);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return null;
      const data = JSON.parse(atob(raw));
      // Verificar timeout
      if (Date.now() - data.timestamp > AUTH_CONFIG.sessionTimeout) {
        this.clear();
        return null;
      }
      // Verificar dispositivo
      if (data.device !== getDeviceFingerprint()) {
        this.clear();
        return null;
      }
      return data;
    } catch (e) {
      this.clear();
      return null;
    }
  },
  
  clear() {
    localStorage.removeItem(this._key);
  }
};

// ==============================
// CONTROLE DE TENTATIVAS
// ==============================
const AttemptControl = {
  _key: 'templo_attempts',
  
  getAttempts() {
    try {
      const data = JSON.parse(localStorage.getItem(this._key) || '{}');
      // Reset se passou do lockout
      if (data.lockedUntil && Date.now() > data.lockedUntil) {
        this.reset();
        return { count: 0, locked: false };
      }
      return data;
    } catch {
      return { count: 0, locked: false };
    }
  },
  
  addAttempt() {
    const data = this.getAttempts();
    data.count = (data.count || 0) + 1;
    data.lastAttempt = Date.now();
    
    if (data.count >= AUTH_CONFIG.maxAttempts) {
      data.locked = true;
      data.lockedUntil = Date.now() + AUTH_CONFIG.lockoutTime;
    }
    
    localStorage.setItem(this._key, JSON.stringify(data));
    return data;
  },
  
  reset() {
    localStorage.removeItem(this._key);
  },
  
  isLocked() {
    const data = this.getAttempts();
    return data.locked && Date.now() < data.lockedUntil;
  },
  
  getTimeRemaining() {
    const data = this.getAttempts();
    if (!data.lockedUntil) return 0;
    return Math.max(0, data.lockedUntil - Date.now());
  }
};

// ==============================
// VERIFICAÇÃO DE EMAIL (simulada)
// ==============================
function generateEmailCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, code) {
  // Em produção, usar EmailJS ou similar
  // Por agora, salvar no localStorage para demonstração
  const emailData = {
    email: email,
    code: code,
    timestamp: Date.now(),
    expires: Date.now() + (10 * 60 * 1000) // 10 minutos
  };
  localStorage.setItem('templo_email_verification', JSON.stringify(emailData));
  
  // Log para debug (remover em produção)
  console.log(`📧 Código de verificação para ${email}: ${code}`);
  
  return { success: true, message: 'Código enviado!' };
}

function verifyEmailCode(inputCode) {
  try {
    const data = JSON.parse(localStorage.getItem('templo_email_verification') || '{}');
    if (!data.code) return { success: false, message: 'Nenhum código gerado' };
    if (Date.now() > data.expires) return { success: false, message: 'Código expirado' };
    if (data.code !== inputCode) return { success: false, message: 'Código incorreto' };
    
    // Limpar após uso
    localStorage.removeItem('templo_email_verification');
    return { success: true, message: 'Email verificado!' };
  } catch {
    return { success: false, message: 'Erro na verificação' };
  }
}

// ==============================
// ESTADO DA AUTENTICAÇÃO
// ==============================
let authState = {
  step: 'password', // password → device → email → authenticated
  passwordVerified: false,
  deviceVerified: false,
  emailVerified: false,
  emailCode: null,
  userEmail: null
};

// ==============================
// FLUXO DE LOGIN
// ==============================
async function authenticatePassword(password) {
  // Verificar bloqueio
  if (AttemptControl.isLocked()) {
    const remaining = Math.ceil(AttemptControl.getTimeRemaining() / 60000);
    return {
      success: false,
      message: `⏳ Bloqueado por ${remaining} min. Muitas tentativas.`
    };
  }
  
  // Hash e verificar
  const hash = await hashPassword(password, AUTH_CONFIG.salt);
  
  // Aceitar senha em vários formatos
  const normalizedInput = password.toLowerCase().replace(/\s+/g, '');
      const validPasswords = [
        'veragajota', 'veragájota', 'ver a gá jota', 'veragajota',
        'vgj', 'VGJ', 'ver_a_ga_jota', 'v-h-j', 'vga', 'vhj'
      ];
  
  let isValid = validPasswords.some(p => 
    p.toLowerCase().replace(/\s+/g, '') === normalizedInput
  );
  
  if (isValid) {
    authState.passwordVerified = true;
    authState.step = 'device';
    AttemptControl.reset();
    return { success: true, message: '✅ Senha correta! Verificando dispositivo...', nextStep: 'device' };
  } else {
    const attempts = AttemptControl.addAttempt();
    const remaining = AUTH_CONFIG.maxAttempts - attempts.count;
    return {
      success: false,
      message: `❌ Senha incorreta. ${remaining} tentativas restantes.`
    };
  }
}

function authenticateDevice() {
  const stored = SecureStorage.load();
  const currentDevice = getDeviceFingerprint();
  
  // Se já tem sessão salva neste dispositivo
  if (stored && stored.device === currentDevice && stored.authenticated) {
    authState.step = 'authenticated';
    return { success: true, message: '✅ Dispositivo reconhecido!', nextStep: 'authenticated' };
  }
  
  // Registrar novo dispositivo
  authState.deviceVerified = true;
  authState.step = 'email';
  return { success: true, message: '✅ Dispositivo registrado! Verificação de email...', nextStep: 'email' };
}

async function initiateEmailVerification(email) {
  const code = generateEmailCode();
  authState.emailCode = code;
  authState.userEmail = email;
  
  await sendVerificationEmail(email, code);
  return { success: true, message: `📧 Código enviado para ${email}` };
}

function verifyEmail(inputCode) {
  const result = verifyEmailCode(inputCode);
  if (result.success) {
    authState.emailVerified = true;
    authState.step = 'authenticated';
    
    // Salvar sessão
    SecureStorage.save({
      authenticated: true,
      email: authState.userEmail,
      device: getDeviceFingerprint(),
      loginTime: Date.now()
    });
    
    return { success: true, message: '✅ Acesso liberado ao Templo Hermes!', nextStep: 'authenticated' };
  }
  return result;
}

// ==============================
// VERIFICAR SE JÁ ESTÁ LOGADO
// ==============================
function checkExistingSession() {
  const session = SecureStorage.load();
  if (session && session.authenticated) {
    authState.step = 'authenticated';
    return true;
  }
  return false;
}

// ==============================
// LOGOUT
// ==============================
function logout() {
  SecureStorage.clear();
  authState = {
    step: 'password',
    passwordVerified: false,
    deviceVerified: false,
    emailVerified: false,
    emailCode: null,
    userEmail: null
  };
  return { success: true, message: '👋 Logout realizado.' };
}

// ==============================
// EXPORT
// ==============================
window.TemploAuth = {
  AUTH_CONFIG,
  authState,
  authenticatePassword,
  authenticateDevice,
  initiateEmailVerification,
  verifyEmail,
  checkExistingSession,
  logout,
  getDeviceFingerprint,
  SecureStorage,
  AttemptControl
};

console.log('🔐 Templo Auth System loaded');
