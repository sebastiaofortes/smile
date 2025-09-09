/**
 * Utilitários e funções auxiliares
 */

/**
 * Verifica se o navegador suporta getUserMedia
 * @returns {boolean} True se suporta getUserMedia
 */
export function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Função de debounce para otimizar eventos que disparam frequentemente
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce aplicado
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Mostra uma mensagem de erro amigável ao usuário
 * @param {string} message - Mensagem de erro
 */
export function showUserFriendlyError(message) {
  // Por enquanto usa alert, mas pode ser substituído por um modal customizado
  alert(message);
}

/**
 * Limpa recursos da webcam
 * @param {HTMLVideoElement} video - Elemento de vídeo
 */
export function cleanupWebcamResources(video) {
  if (video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }
}
