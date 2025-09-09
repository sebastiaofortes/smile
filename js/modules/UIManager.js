import { CONFIG } from '../utils/constants.js';

/**
 * Gerencia a interface do usuário
 */
export class UIManager {
  constructor() {
    this.elements = {
      webcamButton: document.getElementById("webcamButton"),
      infoStart: document.getElementById("info-start"),
      infoContainer: document.getElementById("info-container"),
      todayStatus: document.getElementById("today-status"),
      smileTimer: document.getElementById("smile-timer"),
      smileProgress: document.getElementById("smile-progress"),
      fullscreenModal: document.getElementById("fullscreenModal"),
      closeModalBtn: document.querySelector("#close-modal-btn"),
      resetScoreBtn: document.querySelector("#reset-score-btn"),
      // Elementos de pontuação
      challengesCount: document.getElementById("challenges-count"),
      currentStreak: document.getElementById("current-streak"),
      bestTime: document.getElementById("best-time"),
      // Elementos do modal de celebração
      celebrationTitle: document.getElementById("celebration-title"),
      celebrationMessage: document.getElementById("celebration-message"),
      modalChallenges: document.getElementById("modal-challenges"),
      modalStreak: document.getElementById("modal-streak")
    };

    this.setupEventListeners();
  }

  /**
   * Configura os event listeners da UI
   */
  setupEventListeners() {
    if (this.elements.closeModalBtn) {
      this.elements.closeModalBtn.addEventListener("click", () => {
        this.hideModal();
      });
    }
    
    if (this.elements.resetScoreBtn) {
      this.elements.resetScoreBtn.addEventListener("click", () => {
        if (this.onResetScore) {
          this.onResetScore();
        }
      });
    }
  }

  /**
   * Atualiza o texto do botão da webcam
   * @param {boolean} isRunning - Se a webcam está rodando
   */
  updateWebcamButton(isRunning) {
    const buttonLabel = this.elements.webcamButton?.querySelector('.mdc-button__label');
    if (buttonLabel) {
      buttonLabel.textContent = isRunning ? CONFIG.BUTTON_STOP : CONFIG.BUTTON_START;
    }
    
    // Adiciona/remove classe para estilo diferente quando ativo
    if (this.elements.webcamButton) {
      if (isRunning) {
        this.elements.webcamButton.classList.add('webcam-active');
      } else {
        this.elements.webcamButton.classList.remove('webcam-active');
      }
    }
  }

  /**
   * Mostra a mensagem inicial "Sorria!"
   */
  showStartMessage() {
    if (this.elements.infoStart) {
      this.elements.infoStart.textContent = 'Sorria!';
    }
  }

  /**
   * Esconde a mensagem inicial
   */
  hideStartMessage() {
    if (this.elements.infoStart) {
      this.elements.infoStart.textContent = '';
    }
  }

  /**
   * Mostra o container de informações do timer
   */
  showTimerContainer() {
    if (this.elements.infoContainer) {
      this.elements.infoContainer.style.display = 'block';
    }
    this.hideAllInfoMessages();
  }

  /**
   * Esconde o container de informações do timer
   */
  hideTimerContainer() {
    if (this.elements.infoContainer) {
      this.elements.infoContainer.style.display = 'none';
    }
    this.showAppropriateInfoMessage();
  }

  /**
   * Mostra o status de "hoje completado"
   */
  showTodayCompletedStatus() {
    if (this.elements.todayStatus) {
      this.elements.todayStatus.style.display = 'block';
    }
    this.hideOtherInfoMessages();
  }

  /**
   * Esconde todos os elementos de informação
   */
  hideAllInfoMessages() {
    if (this.elements.infoStart) {
      this.elements.infoStart.style.display = 'none';
    }
    if (this.elements.todayStatus) {
      this.elements.todayStatus.style.display = 'none';
    }
  }

  /**
   * Esconde outras mensagens de info (exceto today status)
   */
  hideOtherInfoMessages() {
    if (this.elements.infoStart) {
      this.elements.infoStart.style.display = 'none';
    }
  }

  /**
   * Mostra a mensagem de info apropriada baseada no estado
   */
  showAppropriateInfoMessage() {
    // Esta função será chamada com o estado atual
    // Por padrão, mostra a mensagem de início
    if (this.elements.infoStart) {
      this.elements.infoStart.style.display = 'block';
    }
  }

  /**
   * Atualiza o display do timer
   * @param {number} seconds - Segundos para exibir
   */
  updateTimer(seconds) {
    if (this.elements.smileTimer) {
      this.elements.smileTimer.textContent = `${seconds.toFixed(1)}s`;
    }
  }

  /**
   * Atualiza a barra de progresso
   * @param {number} seconds - Progresso em segundos
   */
  updateProgressBar(seconds) {
    if (this.elements.smileProgress) {
      this.elements.smileProgress.value = Math.min(seconds, CONFIG.SMILE_GOAL_SECONDS);
    }
  }

  /**
   * Atualiza tanto o timer quanto a barra de progresso
   * @param {number} seconds - Segundos para exibir
   */
  updateTimerDisplay(seconds) {
    this.updateTimer(seconds);
    this.updateProgressBar(seconds);
  }

  /**
   * Inicia a animação de conclusão da meta
   */
  startGoalCompletionAnimation() {
    const progress = this.elements.smileProgress;
    if (!progress) return;

    // Primeira animação: encolher
    progress.classList.add('shrink-on-complete');
    
    setTimeout(() => {
      // Segunda animação: crescer para tela cheia
      progress.classList.add('grow-fullscreen');
      
      setTimeout(() => {
        this.showModal();
        this.resetGoalCompletionAnimation();
      }, CONFIG.ANIMATIONS.GROW_DURATION);
      
    }, CONFIG.ANIMATIONS.SHRINK_DURATION);
  }

  /**
   * Reseta a animação de conclusão da meta
   */
  resetGoalCompletionAnimation() {
    const progress = this.elements.smileProgress;
    if (progress) {
      progress.classList.remove('shrink-on-complete');
      progress.classList.remove('grow-fullscreen');
    }
  }

  /**
   * Mostra o modal de parabéns
   */
  showModal() {
    if (this.elements.fullscreenModal) {
      this.elements.fullscreenModal.style.display = "flex";
    }
  }

  /**
   * Esconde o modal de parabéns
   */
  hideModal() {
    if (this.elements.fullscreenModal) {
      this.elements.fullscreenModal.style.display = "none";
    }
  }

  /**
   * Define callback para clique no botão da webcam
   * @param {Function} callback
   */
  onWebcamButtonClick(callback) {
    if (this.elements.webcamButton) {
      this.elements.webcamButton.addEventListener("click", callback);
    }
  }

  /**
   * Obtém referência para um elemento específico
   * @param {string} elementName - Nome do elemento
   * @returns {HTMLElement|null}
   */
  getElement(elementName) {
    return this.elements[elementName] || null;
  }

  /**
   * Atualiza o painel de pontuação
   * @param {Object} stats - Estatísticas do jogo
   */
  updateScorePanel(stats) {
    if (this.elements.challengesCount) {
      this.updateValueWithAnimation(this.elements.challengesCount, stats.challengesCompleted);
    }
    
    if (this.elements.currentStreak) {
      this.updateValueWithAnimation(this.elements.currentStreak, stats.currentDayStreak);
    }
    
    if (this.elements.bestTime) {
      this.updateValueWithAnimation(this.elements.bestTime, stats.longestSmile + 's');
    }
    
    // Atualiza o status de hoje completado
    this.updateTodayStatus(stats.todayCompleted);
  }

  /**
   * Atualiza o status de hoje completado
   * @param {boolean} todayCompleted - Se já completou hoje
   */
  updateTodayStatus(todayCompleted) {
    if (todayCompleted) {
      this.showTodayCompletedStatus();
    } else {
      // Se não completou hoje, esconde o status e mostra mensagem padrão
      if (this.elements.todayStatus) {
        this.elements.todayStatus.style.display = 'none';
      }
    }
  }

  /**
   * Atualiza um valor com animação
   * @param {HTMLElement} element - Elemento a ser atualizado
   * @param {string|number} newValue - Novo valor
   */
  updateValueWithAnimation(element, newValue) {
    if (!element || newValue == null) {
      return;
    }
    
    const newValueStr = newValue.toString();
    if (element.textContent !== newValueStr) {
      element.textContent = newValueStr;
      element.classList.add('updated');
      setTimeout(() => {
        element.classList.remove('updated');
      }, 600);
    }
  }

  /**
   * Mostra o modal de celebração com estatísticas
   * @param {Object} stats - Estatísticas do jogo
   * @param {string} message - Mensagem motivacional
   * @param {boolean} isNewRecord - Se é um novo recorde
   */
  showCelebrationModal(stats, message, isNewRecord = false) {
    // Atualiza o título baseado se é novo recorde
    if (this.elements.celebrationTitle) {
      this.elements.celebrationTitle.textContent = isNewRecord ? 
        "🏆 NOVO RECORDE! 🏆" : "🎉 Parabéns! 🎉";
    }
    
    // Atualiza a mensagem motivacional
    if (this.elements.celebrationMessage) {
      this.elements.celebrationMessage.textContent = message;
    }
    
    // Atualiza as estatísticas do modal
    if (this.elements.modalChallenges) {
      this.elements.modalChallenges.textContent = stats.challengesCompleted;
    }
    
    if (this.elements.modalStreak) {
      this.elements.modalStreak.textContent = stats.currentDayStreak;
    }
    
    // Mostra o modal
    this.showModal();
  }

  /**
   * Define callback para reset de pontuação
   * @param {Function} callback
   */
  onResetScoreClick(callback) {
    this.onResetScore = callback;
  }
}
