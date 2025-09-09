import { CONFIG } from '../utils/constants.js';

/**
 * Detecta sorrisos usando MediaPipe Face Landmarker
 */
export class SmileDetector {
  constructor() {
    this.faceLandmarker = null;
    this.runningMode = "IMAGE";
    this.lastVideoTime = -1;
    this.results = undefined;
    this.drawingUtils = null;
  }

  /**
   * Inicializa o detector facial
   * @param {Object} vision - Objeto vision do MediaPipe
   * @returns {Promise<void>}
   */
  async initialize(vision) {
    const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
    
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(CONFIG.MEDIAPIPE.WASM_URL);
      
      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: CONFIG.MEDIAPIPE.MODEL_URL,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: this.runningMode,
        numFaces: 1
      });

      // Inicializa DrawingUtils (será definido quando o canvas for fornecido)
      this.DrawingUtils = DrawingUtils;
      
    } catch (error) {
      console.error('Erro ao inicializar detector facial:', error);
      throw error;
    }
  }

  /**
   * Define o contexto do canvas para desenho
   * @param {CanvasRenderingContext2D} canvasContext
   */
  setCanvasContext(canvasContext) {
    this.drawingUtils = new this.DrawingUtils(canvasContext);
  }

  /**
   * Detecta faces e sorrisos no vídeo
   * @param {HTMLVideoElement} video
   * @returns {Object} Resultado da detecção
   */
  async detectForVideo(video) {
    if (!this.faceLandmarker) {
      throw new Error('Detector não foi inicializado');
    }

    // Muda para modo VIDEO se necessário
    if (this.runningMode === "IMAGE") {
      this.runningMode = "VIDEO";
      await this.faceLandmarker.setOptions({ runningMode: this.runningMode });
    }

    const startTimeMs = performance.now();
    
    // Só processa se o frame mudou
    if (this.lastVideoTime !== video.currentTime) {
      this.lastVideoTime = video.currentTime;
      this.results = this.faceLandmarker.detectForVideo(video, startTimeMs);
    }

    return this.results;
  }

  /**
   * Verifica se há um sorriso nos blendshapes
   * @param {Array} blendShapes - Array de blendshapes do MediaPipe
   * @returns {boolean} True se detectou sorriso
   */
  isSmiling(blendShapes) {
    if (!blendShapes || !blendShapes.length) {
      return false;
    }

    const leftMouthCornerUp = blendShapes[0].categories[CONFIG.SMILE_CATEGORIES.LEFT_MOUTH_CORNER_UP];
    const rightMouthCornerUp = blendShapes[0].categories[CONFIG.SMILE_CATEGORIES.RIGHT_MOUTH_CORNER_UP];
    
    return (leftMouthCornerUp.score > CONFIG.SMILE_DETECTION_THRESHOLD || 
            rightMouthCornerUp.score > CONFIG.SMILE_DETECTION_THRESHOLD);
  }

  /**
   * Desenha os landmarks faciais no canvas
   * @param {Array} faceLandmarks - Landmarks faciais
   * @param {CanvasRenderingContext2D} canvasCtx - Contexto do canvas
   * @param {number} canvasWidth - Largura do canvas
   * @param {number} canvasHeight - Altura do canvas
   */
  drawLandmarks(faceLandmarks, canvasCtx, canvasWidth, canvasHeight) {
    if (!this.drawingUtils || !faceLandmarks) {
      return;
    }

    // Limpa o canvas
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Desenha os landmarks para cada face detectada
    // Desenha uma máscara sobre o rosto
    /*
    for (const landmarks of faceLandmarks) {
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_TESSELATION, 
        { color: CONFIG.LANDMARK_COLORS.TESSELATION, lineWidth: 1 }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_RIGHT_EYE, 
        { color: CONFIG.LANDMARK_COLORS.RIGHT_EYE }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_RIGHT_EYEBROW, 
        { color: CONFIG.LANDMARK_COLORS.RIGHT_EYEBROW }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_LEFT_EYE, 
        { color: CONFIG.LANDMARK_COLORS.LEFT_EYE }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_LEFT_EYEBROW, 
        { color: CONFIG.LANDMARK_COLORS.LEFT_EYEBROW }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_FACE_OVAL, 
        { color: CONFIG.LANDMARK_COLORS.FACE_OVAL }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_LIPS, 
        { color: CONFIG.LANDMARK_COLORS.LIPS }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_RIGHT_IRIS, 
        { color: CONFIG.LANDMARK_COLORS.RIGHT_IRIS }
      );
      
      this.drawingUtils.drawConnectors(
        landmarks, 
        this.faceLandmarker.constructor.FACE_LANDMARKS_LEFT_IRIS, 
        { color: CONFIG.LANDMARK_COLORS.LEFT_IRIS }
      );
    }
    */
  }

  /**
   * Verifica se o detector está pronto
   * @returns {boolean}
   */
  isReady() {
    return !!this.faceLandmarker;
  }
}
