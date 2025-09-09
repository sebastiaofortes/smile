// Configurações da aplicação
export const CONFIG = {
  // Botões
  BUTTON_START: "Iniciar",
  BUTTON_STOP: "Sair",
  
  // Timer de sorriso
  SMILE_GOAL_SECONDS: 15,
  SMILE_DETECTION_THRESHOLD: 0.7,
  
  // Categorias de detecção facial (MediaPipe)
  SMILE_CATEGORIES: {
    LEFT_MOUTH_CORNER_UP: 44,
    RIGHT_MOUTH_CORNER_UP: 45
  },
  
  // URLs do MediaPipe
  MEDIAPIPE: {
    CDN_URL: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3",
    WASM_URL: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
    MODEL_URL: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
  },
  
  // Animações
  ANIMATIONS: {
    SHRINK_DURATION: 1000, // 1 segundo
    GROW_DURATION: 900     // 0.9 segundos
  },
  
  // Cores para desenho dos landmarks
  LANDMARK_COLORS: {
    TESSELATION: "#C0C0C070",
    RIGHT_EYE: "#FF3030",
    RIGHT_EYEBROW: "#FF3030",
    LEFT_EYE: "#30FF30",
    LEFT_EYEBROW: "#30FF30",
    FACE_OVAL: "#E0E0E0",
    LIPS: "#E0E0E0",
    RIGHT_IRIS: "#FF3030",
    LEFT_IRIS: "#30FF30"
  }
};
