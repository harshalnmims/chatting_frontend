let encryptedData = '';
let decryptedData = '';

async function encryptData() {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(originalData);
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) },
        key,
        new Uint8Array(data) // Convert to Uint8Array
      );
      encryptedData = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedBuffer)));
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  }
  
async function decryptData() {
  try {
    const decoder = new TextDecoder();
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) },
      key,
      encryptedBuffer
    );
    decryptedData = decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
  }
}
