import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
import { CONFIG } from './utils/constants.js';
import { debounce, showUserFriendlyError } from './utils/helpers.js';
import { CameraManager } from './modules/CameraManager.js';
import { SmileDetector } from './modules/SmileDetector.js';
import { TimerManager } from './modules/TimerManager.js';
import { UIManager } from './modules/UIManager.js';
import { ScoreManager } from './modules/ScoreManager.js';
import { FirstTimeGuide } from './modules/FirstTimeGuide.js';

// Elementos DOM principais
const demosSection = document.getElementById("demos");
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// Inicialização dos módulos
const cameraManager = new CameraManager(video, canvasElement);
const smileDetector = new SmileDetector();
const timerManager = new TimerManager();
const uiManager = new UIManager();
const scoreManager = new ScoreManager();
const firstTimeGuide = new FirstTimeGuide();

// Configuração de eventos e callbacks
const debouncedResize = debounce(() => cameraManager.resizeToContainer(), 250);
window.addEventListener('resize', debouncedResize);

// Configuração dos callbacks dos módulos
cameraManager.onStart(() => {
  uiManager.updateWebcamButton(true);
  uiManager.showStartMessage();
  scoreManager.startSession(); // Registra nova sessão
});

cameraManager.onStop(() => {
  uiManager.updateWebcamButton(false);
  uiManager.hideStartMessage();
  timerManager.reset();
});

timerManager.onUpdate((duration) => {
  uiManager.updateTimerDisplay(duration);
});

timerManager.onReset(() => {
  uiManager.hideTimerContainer();
  uiManager.updateTimerDisplay(0);
});

timerManager.onComplete(() => {
  const smileTime = timerManager.getDuration();
  const isNewRecord = scoreManager.isNewRecord(smileTime);
  
  // Registra a conclusão do desafio
  scoreManager.completeChallenge(smileTime);
  
  console.log(`🎉 Desafio completado em ${smileTime.toFixed(1)}s!`);
  
  // Inicia animação e depois mostra modal com estatísticas
  uiManager.startGoalCompletionAnimation();
  
  setTimeout(() => {
    const stats = scoreManager.getStats();
    const message = scoreManager.getMotivationalMessage();
    uiManager.showCelebrationModal(stats, message, isNewRecord);
    
    // Reset será feito após a animação
    timerManager.reset();
  }, CONFIG.ANIMATIONS.SHRINK_DURATION + CONFIG.ANIMATIONS.GROW_DURATION + 100);
});

// Configuração dos callbacks do ScoreManager
scoreManager.onUpdate((stats) => {
  uiManager.updateScorePanel(stats);
});

// Configuração do callback de reset de pontuação
uiManager.onResetScoreClick(() => {
  if (confirm('Tem certeza que deseja resetar toda a pontuação?')) {
    scoreManager.resetScore();
    uiManager.hideModal();
  }
});

// Inicialização
async function initialize() {
  try {
    // Inicializa o detector de sorriso
    await smileDetector.initialize(vision);
    smileDetector.setCanvasContext(canvasCtx);
    
    // Carrega e exibe a pontuação inicial
    const initialStats = scoreManager.getStats();
    console.log('Stats iniciais:', initialStats);
    uiManager.updateScorePanel(initialStats);
    
    // Remove classe invisible da seção
    demosSection.classList.remove("invisible");
    
    // Configura botão da webcam
    if (cameraManager.isSupported()) {
      uiManager.onWebcamButtonClick(toggleCamera);
    } else {
      showUserFriendlyError("getUserMedia() não é suportado neste navegador.");
    }

    // Configura botão de ajuda
    const helpButton = document.getElementById('help-button');
    if (helpButton) {
      helpButton.addEventListener('click', () => {
        firstTimeGuide.forceStart();
      });
    }

    // Inicia o guide se for primeira vez
    setTimeout(() => {
      firstTimeGuide.start();
    }, 1000); // Delay para garantir que a interface esteja pronta
  } catch (error) {
    console.error('Erro na inicialização:', error);
    showUserFriendlyError('Erro ao carregar o modelo. Tente recarregar a página.');
  }
}

// Função de debug para limpar dados (remover em produção)
window.clearGameData = function() {
  localStorage.removeItem('smile-detector-score');
  location.reload();
};

// Função de debug para ver dados atuais
window.showGameData = function() {
  const data = localStorage.getItem('smile-detector-score');
  console.log('Dados salvos:', data ? JSON.parse(data) : 'Nenhum dado salvo');
};

// Funções de debug para o FirstTimeGuide
window.resetGuide = function() {
  firstTimeGuide.reset();
  console.log('Guide resetado - será mostrado na próxima inicialização');
};

window.showGuide = function() {
  firstTimeGuide.forceStart();
  console.log('Guide iniciado manualmente');
};

initialize();

// Função para alternar câmera (ligar/desligar)
async function toggleCamera() {
  if (!smileDetector.isReady()) {
    showUserFriendlyError("Modelo ainda está carregando, tente em instantes.");
    return;
  }

  try {
    if (cameraManager.isRunning) {
      cameraManager.stop();
    } else {
      await cameraManager.start();
      cameraManager.resizeToContainer();
      startVideoProcessing();
    }
  } catch (error) {
    console.error('Erro ao alternar câmera:', error);
    showUserFriendlyError('Erro ao acessar a câmera.');
  }
}

// Inicia o processamento de vídeo
function startVideoProcessing() {
  processVideoFrame();
}

// Processa cada frame do vídeo
async function processVideoFrame() {
  if (!cameraManager.isRunning) {
    return;
  }

  try {
    // Redimensiona se necessário
    cameraManager.resizeToContainer();
    
    // Detecta faces no vídeo
    const results = await smileDetector.detectForVideo(video);
    
    // Desenha landmarks faciais
    smileDetector.drawLandmarks(
      results.faceLandmarks, 
      canvasCtx, 
      canvasElement.width, 
      canvasElement.height
    );
    
    // Processa detecção de sorriso
    processSmileDetection(results.faceBlendshapes);
    
    // Atualiza timer se estiver ativo
    if (timerManager.isRunning()) {
      timerManager.update();
    }
    
    // Continua o loop
    window.requestAnimationFrame(processVideoFrame);
    
  } catch (error) {
    console.error('Erro no processamento do vídeo:', error);
  }
}

// Processa a detecção de sorriso
function processSmileDetection(blendShapes) {
  if (!blendShapes || !blendShapes.length) {
    // Se não há rosto detectado, para o timer
    if (timerManager.isRunning()) {
      timerManager.reset();
    }
    return;
  }

  // Verifica se está sorrindo
  const isSmiling = smileDetector.isSmiling(blendShapes);
  
  if (isSmiling) {
    if (!timerManager.isRunning()) {
      // Inicia o timer e mostra a UI
      timerManager.start();
      uiManager.showTimerContainer();
    }
  } else {
    // Para o timer se não está mais sorrindo
    if (timerManager.isRunning()) {
      timerManager.reset();
    }
  }
}
