import { CONFIG } from '../utils/constants.js';
import { hasGetUserMedia, showUserFriendlyError, cleanupWebcamResources } from '../utils/helpers.js';

/**
 * Gerencia as operações da câmera/webcam
 */
export class CameraManager {
  constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.isRunning = false;
    this.onCameraStart = null;
    this.onCameraStop = null;
  }

  /**
   * Verifica se o navegador suporta câmera
   * @returns {boolean}
   */
  isSupported() {
    return hasGetUserMedia();
  }

  /**
   * Inicia a câmera
   * @returns {Promise<void>}
   */
  async start() {
    if (this.isRunning) {
      return;
    }

    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.video.srcObject = stream;
      this.isRunning = true;
      
      if (this.onCameraStart) {
        this.onCameraStart();
      }
      
      return new Promise((resolve) => {
        this.video.addEventListener("loadeddata", resolve, { once: true });
      });
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      showUserFriendlyError('Não foi possível acessar a câmera. Verifique as permissões.');
      throw error;
    }
  }

  /**
   * Para a câmera
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    cleanupWebcamResources(this.video);
    this.isRunning = false;
    
    // Limpa o canvas
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.onCameraStop) {
      this.onCameraStop();
    }
  }

  /**
   * Redimensiona o vídeo e canvas para ocupar o container
   */
  resizeToContainer() {
    const container = document.getElementById('liveView');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Redimensiona vídeo
    this.video.style.width = width + 'px';
    this.video.style.height = height + 'px';
    
    // Redimensiona canvas
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Define callback para quando a câmera iniciar
   * @param {Function} callback
   */
  onStart(callback) {
    this.onCameraStart = callback;
  }

  /**
   * Define callback para quando a câmera parar
   * @param {Function} callback
   */
  onStop(callback) {
    this.onCameraStop = callback;
  }
}
