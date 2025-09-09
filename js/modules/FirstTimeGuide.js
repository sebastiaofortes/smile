/**
 * Sistema de First-time User Guide para onboarding de novos usuários
 */
export class FirstTimeGuide {
  constructor() {
    this.storageKey = 'sorrisos-first-time-completed';
    this.currentStep = 0;
    this.isActive = false;
    this.overlay = null;
    this.tooltip = null;
    this.spotlight = null;
    
    // Definição dos passos do guide
    this.steps = [
      {
        target: '#score-panel',
        title: '📊 Seu Progresso',
        message: 'Aqui você acompanha seus desafios completados, dias consecutivos e seu melhor tempo de sorriso!',
        position: 'bottom',
        highlight: true
      },
      {
        target: '#webcamButton',
        title: '🚀 Começar é Fácil',
        message: 'Clique neste botão para ativar sua câmera. Não se preocupe, nada é gravado ou enviado!',
        position: 'bottom',
        highlight: true
      },
      {
        target: '#liveView',
        title: '🤖 Detecção Inteligente',
        message: 'Nossa IA detecta seu rosto em tempo real e desenha pontos coloridos. Verde = olho esquerdo, Vermelho = olho direito.',
        position: 'top',
        highlight: true
      },
      {
        target: '#info-container',
        title: '😊 Meta Diária',
        message: 'Quando você sorrir, aparecerá um cronômetro aqui. Mantenha o sorriso por 15 segundos para completar o desafio!',
        position: 'top',
        highlight: false,
        showElement: true // Força mostrar o elemento mesmo se estiver oculto
      },
      {
        target: '#fullscreenModal',
        title: '🎉 Celebração',
        message: 'Ao completar 15 segundos, você verá uma celebração especial com suas estatísticas atualizadas!',
        position: 'center',
        highlight: false,
        isModal: true
      }
    ];
  }

  /**
   * Verifica se é a primeira vez do usuário
   * @returns {boolean}
   */
  isFirstTime() {
    return !localStorage.getItem(this.storageKey);
  }

  /**
   * Inicia o guide se for primeira vez
   */
  start() {
    if (!this.isFirstTime()) {
      return false;
    }

    this.showWelcomeModal();
    return true;
  }

  /**
   * Força o início do guide (para testes ou botão de ajuda)
   */
  forceStart() {
    this.showWelcomeModal();
  }

  /**
   * Mostra o modal de boas-vindas
   */
  showWelcomeModal() {
    const modal = document.createElement('div');
    modal.className = 'guide-welcome-modal';
    modal.innerHTML = `
      <div class="guide-welcome-content">
        <div class="guide-welcome-header">
          <h2>🎉 Bem-vindo ao Sorrisos!</h2>
          <p>Um aplicativo que detecta sorrisos com IA e gamifica a felicidade!</p>
        </div>
        
        <div class="guide-welcome-features">
          <div class="guide-feature">
            <span class="guide-feature-icon">🤖</span>
            <div class="guide-feature-text">
              <strong>IA Avançada</strong>
              <p>Detecção facial em tempo real</p>
            </div>
          </div>
          
          <div class="guide-feature">
            <span class="guide-feature-icon">🎮</span>
            <div class="guide-feature-text">
              <strong>Gamificação</strong>
              <p>Sistema de pontos e conquistas</p>
            </div>
          </div>
          
          <div class="guide-feature">
            <span class="guide-feature-icon">📊</span>
            <div class="guide-feature-text">
              <strong>Progresso</strong>
              <p>Acompanhe seus dias consecutivos</p>
            </div>
          </div>
        </div>
        
        <div class="guide-welcome-actions">
          <button class="guide-btn guide-btn-primary" id="start-tour">
            <span class="guide-btn-icon">🚀</span>
            Fazer Tour Guiado
          </button>
          <button class="guide-btn guide-btn-secondary" id="skip-tour">
            Pular e Começar
          </button>
        </div>
        
        <div class="guide-welcome-note">
          <small>💡 Você pode acessar este tour novamente no menu de ajuda</small>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('start-tour').addEventListener('click', () => {
      document.body.removeChild(modal);
      this.startTour();
    });

    document.getElementById('skip-tour').addEventListener('click', () => {
      document.body.removeChild(modal);
      this.completeTour();
    });

    // Animação de entrada
    setTimeout(() => {
      modal.classList.add('guide-welcome-show');
    }, 100);
  }

  /**
   * Inicia o tour guiado
   */
  startTour() {
    this.isActive = true;
    this.currentStep = 0;
    this.showStep(0);
  }

  /**
   * Mostra um passo específico do tour
   * @param {number} stepIndex - Índice do passo
   */
  showStep(stepIndex) {
    if (stepIndex >= this.steps.length) {
      this.completeTour();
      return;
    }

    const step = this.steps[stepIndex];
    this.currentStep = stepIndex;

    // Remove elementos anteriores
    this.cleanup();

    // Cria overlay
    this.createOverlay();

    // Mostra elemento se necessário
    if (step.showElement) {
      this.showElementTemporarily(step.target);
    }

    // Cria spotlight se necessário
    if (step.highlight) {
      this.createSpotlight(step.target);
    }

    // Cria tooltip
    this.createTooltip(step);
  }

  /**
   * Cria o overlay escuro
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'guide-overlay';
    document.body.appendChild(this.overlay);

    // Permite fechar clicando no overlay
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.skipTour();
      }
    });
  }

  /**
   * Cria o spotlight que destaca um elemento
   * @param {string} selector - Seletor do elemento
   */
  createSpotlight(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    
    this.spotlight = document.createElement('div');
    this.spotlight.className = 'guide-spotlight';
    this.spotlight.style.left = `${rect.left - 10}px`;
    this.spotlight.style.top = `${rect.top - 10}px`;
    this.spotlight.style.width = `${rect.width + 20}px`;
    this.spotlight.style.height = `${rect.height + 20}px`;
    
    document.body.appendChild(this.spotlight);

    // Animação de entrada
    setTimeout(() => {
      this.spotlight.classList.add('guide-spotlight-show');
    }, 100);
  }

  /**
   * Cria o tooltip explicativo
   * @param {Object} step - Dados do passo
   */
  createTooltip(step) {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'guide-tooltip';
    
    const isLastStep = this.currentStep === this.steps.length - 1;
    const progressPercent = ((this.currentStep + 1) / this.steps.length) * 100;
    
    this.tooltip.innerHTML = `
      <div class="guide-tooltip-content">
        <div class="guide-tooltip-header">
          <h3>${step.title}</h3>
          <button class="guide-close-btn" id="guide-close">×</button>
        </div>
        
        <div class="guide-tooltip-body">
          <p>${step.message}</p>
        </div>
        
        <div class="guide-tooltip-progress">
          <div class="guide-progress-bar">
            <div class="guide-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <span class="guide-progress-text">${this.currentStep + 1} de ${this.steps.length}</span>
        </div>
        
        <div class="guide-tooltip-actions">
          ${this.currentStep > 0 ? '<button class="guide-btn guide-btn-secondary" id="guide-prev">← Anterior</button>' : ''}
          <button class="guide-btn guide-btn-secondary" id="guide-skip">Pular Tour</button>
          <button class="guide-btn guide-btn-primary" id="guide-next">
            ${isLastStep ? 'Finalizar 🎉' : 'Próximo →'}
          </button>
        </div>
      </div>
    `;

    // Posicionamento
    this.positionTooltip(step);
    
    document.body.appendChild(this.tooltip);

    // Event listeners
    document.getElementById('guide-close').addEventListener('click', () => this.skipTour());
    document.getElementById('guide-skip').addEventListener('click', () => this.skipTour());
    document.getElementById('guide-next').addEventListener('click', () => this.nextStep());
    
    const prevBtn = document.getElementById('guide-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }

    // Animação de entrada
    setTimeout(() => {
      this.tooltip.classList.add('guide-tooltip-show');
    }, 200);

    // Suporte a teclado
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Posiciona o tooltip baseado no passo
   * @param {Object} step - Dados do passo
   */
  positionTooltip(step) {
    if (step.position === 'center' || step.isModal) {
      this.tooltip.classList.add('guide-tooltip-center');
      return;
    }

    const element = document.querySelector(step.target);
    if (!element) {
      this.tooltip.classList.add('guide-tooltip-center');
      return;
    }

    const rect = element.getBoundingClientRect();
    const tooltipWidth = 350;
    const tooltipHeight = 200;
    
    let left, top;

    switch (step.position) {
      case 'bottom':
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        top = rect.bottom + 20;
        this.tooltip.classList.add('guide-tooltip-bottom');
        break;
      case 'top':
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        top = rect.top - tooltipHeight - 20;
        this.tooltip.classList.add('guide-tooltip-top');
        break;
      case 'left':
        left = rect.left - tooltipWidth - 20;
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        this.tooltip.classList.add('guide-tooltip-left');
        break;
      case 'right':
        left = rect.right + 20;
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        this.tooltip.classList.add('guide-tooltip-right');
        break;
      default:
        this.tooltip.classList.add('guide-tooltip-center');
        return;
    }

    // Ajusta se sair da tela
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  /**
   * Mostra temporariamente um elemento oculto
   * @param {string} selector - Seletor do elemento
   */
  showElementTemporarily(selector) {
    const element = document.querySelector(selector);
    if (element && element.style.display === 'none') {
      element.style.display = 'block';
      element.classList.add('guide-temp-show');
    }
  }

  /**
   * Esconde elementos que foram mostrados temporariamente
   */
  hideTemporaryElements() {
    const tempElements = document.querySelectorAll('.guide-temp-show');
    tempElements.forEach(element => {
      element.style.display = 'none';
      element.classList.remove('guide-temp-show');
    });
  }

  /**
   * Próximo passo
   */
  nextStep() {
    this.showStep(this.currentStep + 1);
  }

  /**
   * Passo anterior
   */
  prevStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  /**
   * Pula o tour
   */
  skipTour() {
    this.completeTour();
  }

  /**
   * Completa o tour
   */
  completeTour() {
    this.cleanup();
    this.hideTemporaryElements();
    this.isActive = false;
    
    // Marca como completado
    localStorage.setItem(this.storageKey, 'true');
    
    // Mostra mensagem de conclusão se completou o tour
    if (this.currentStep >= this.steps.length - 1) {
      this.showCompletionMessage();
    }
  }

  /**
   * Mostra mensagem de conclusão
   */
  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'guide-completion-message';
    message.innerHTML = `
      <div class="guide-completion-content">
        <h3>🎉 Tour Concluído!</h3>
        <p>Agora você está pronto para começar a sorrir e acumular pontos!</p>
        <button class="guide-btn guide-btn-primary" id="start-smiling">
          Começar a Sorrir! 😊
        </button>
      </div>
    `;

    document.body.appendChild(message);

    document.getElementById('start-smiling').addEventListener('click', () => {
      document.body.removeChild(message);
      // Foca no botão de iniciar se existir
      const startBtn = document.getElementById('webcamButton');
      if (startBtn) {
        startBtn.focus();
        startBtn.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 5000);
  }

  /**
   * Manipula eventos de teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleKeydown(e) {
    if (!this.isActive) return;

    switch (e.key) {
      case 'Escape':
        this.skipTour();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        this.nextStep();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prevStep();
        break;
    }
  }

  /**
   * Limpa elementos do DOM
   */
  cleanup() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
    }
    
    if (this.tooltip) {
      document.body.removeChild(this.tooltip);
      this.tooltip = null;
    }
    
    if (this.spotlight) {
      document.body.removeChild(this.spotlight);
      this.spotlight = null;
    }

    // Remove event listeners de teclado
    document.removeEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Reseta o guide (para desenvolvimento/testes)
   */
  reset() {
    localStorage.removeItem(this.storageKey);
    this.cleanup();
    this.hideTemporaryElements();
    this.isActive = false;
    this.currentStep = 0;
  }
}
