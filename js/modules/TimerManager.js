import { CONFIG } from '../utils/constants.js';

/**
 * Gerencia o cronômetro de sorriso
 */
export class TimerManager {
  constructor() {
    this.isActive = false;
    this.startTime = null;
    this.duration = 0;
    this.isGoalCompleted = false;
    this.onGoalComplete = null;
    this.onTimerUpdate = null;
    this.onTimerReset = null;
  }

  /**
   * Inicia o cronômetro
   */
  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.startTime = performance.now();
    this.duration = 0;
    this.isGoalCompleted = false;
  }

  /**
   * Atualiza o cronômetro
   * @returns {number} Duração atual em segundos
   */
  update() {
    if (!this.isActive || !this.startTime) {
      return 0;
    }

    this.duration = (performance.now() - this.startTime) / 1000;
    
    if (this.onTimerUpdate) {
      this.onTimerUpdate(this.duration);
    }

    // Verifica se atingiu a meta
    if (!this.isGoalCompleted && this.duration >= CONFIG.SMILE_GOAL_SECONDS) {
      this.isGoalCompleted = true;
      if (this.onGoalComplete) {
        this.onGoalComplete();
      }
    }

    return this.duration;
  }

  /**
   * Para e reseta o cronômetro
   */
  reset() {
    this.isActive = false;
    this.startTime = null;
    this.duration = 0;
    this.isGoalCompleted = false;
    
    if (this.onTimerReset) {
      this.onTimerReset();
    }
  }

  /**
   * Obtém a duração atual em segundos
   * @returns {number}
   */
  getDuration() {
    return this.duration;
  }

  /**
   * Verifica se o cronômetro está ativo
   * @returns {boolean}
   */
  isRunning() {
    return this.isActive;
  }

  /**
   * Verifica se a meta foi completada
   * @returns {boolean}
   */
  hasCompletedGoal() {
    return this.isGoalCompleted;
  }

  /**
   * Define callback para quando a meta for completada
   * @param {Function} callback
   */
  onComplete(callback) {
    this.onGoalComplete = callback;
  }

  /**
   * Define callback para atualização do timer
   * @param {Function} callback
   */
  onUpdate(callback) {
    this.onTimerUpdate = callback;
  }

  /**
   * Define callback para reset do timer
   * @param {Function} callback
   */
  onReset(callback) {
    this.onTimerReset = callback;
  }
}
