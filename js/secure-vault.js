/**
 * 🔐 SecureVault — Criptografia de dados sensíveis
 * AES-256-GCM via Web Crypto API (nativo do browser)
 */

const SecureVault = {
  _algo: 'AES-GCM',
  _keyLength: 256,

  // Gerar chave de criptografia a partir de senha
  async deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: this._algo, length: this._keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  },

  // Criptografar dados
  async encrypt(data, password) {
    const enc = new TextEncoder();
    const salt = 'dp-salt-2026';
    const key = await this.deriveKey(password, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: this._algo, iv },
      key,
      enc.encode(JSON.stringify(data))
    );
    return {
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
      data: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('')
    };
  },

  // Descriptografar dados
  async decrypt(encryptedObj, password) {
    const dec = new TextDecoder();
    const salt = 'dp-salt-2026';
    const key = await this.deriveKey(password, salt);
    const iv = new Uint8Array(encryptedObj.iv.match(/.{2}/g).map(h => parseInt(h, 16)));
    const data = new Uint8Array(encryptedObj.data.match(/.{2}/g).map(h => parseInt(h, 16)));
    const decrypted = await crypto.subtle.decrypt(
      { name: this._algo, iv },
      key,
      data
    );
    return JSON.parse(dec.decode(decrypted));
  },

  // Salvar dados criptografados no localStorage
  async saveEncrypted(key, data, password) {
    const encrypted = await this.encrypt(data, password);
    localStorage.setItem('dp_enc_' + key, JSON.stringify(encrypted));
    return true;
  },

  // Carregar dados criptografados do localStorage
  async loadEncrypted(key, password) {
    const raw = localStorage.getItem('dp_enc_' + key);
    if (!raw) return null;
    try {
      return await this.decrypt(JSON.parse(raw), password);
    } catch {
      return null;
    }
  },

  // Hash de senha (para verificação, não para armazenar)
  async hashPassword(password) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(password + 'dp-verify'));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
};

// Export
window.SecureVault = SecureVault;
console.log('🔐 SecureVault loaded — AES-256-GCM encryption');
