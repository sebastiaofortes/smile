/**
 * Gerencia o sistema de pontuação do jogo
 */
export class ScoreManager {
  constructor() {
    this.storageKey = 'smile-detector-score';
    this.data = this.loadScore();
    this.onScoreUpdate = null;
  }

  /**
   * Carrega a pontuação do localStorage
   * @returns {Object} Dados da pontuação
   */
  loadScore() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        // Migra dados antigos para o novo formato
        return this.migrateOldData(data);
      }
    } catch (error) {
      console.warn('Erro ao carregar pontuação:', error);
    }

    // Dados padrão se não houver salvamento
    return this.getDefaultData();
  }

  /**
   * Retorna dados padrão
   * @returns {Object} Dados padrão
   */
  getDefaultData() {
    return {
      challengesCompleted: 0,
      totalSmileTime: 0,
      longestSmile: 0,
      currentDayStreak: 0,        // Dias consecutivos atual
      bestDayStreak: 0,           // Melhor sequência de dias
      lastPlayDate: null,
      lastCompletionDate: null,   // Último dia que completou um desafio
      totalSessions: 0,
      todayCompleted: false       // Se já completou hoje
    };
  }

  /**
   * Migra dados antigos para o novo formato
   * @param {Object} oldData - Dados antigos
   * @returns {Object} Dados migrados
   */
  migrateOldData(oldData) {
    const defaultData = this.getDefaultData();
    
    // Copia dados existentes e adiciona novos campos se não existirem
    const migratedData = {
      ...defaultData,
      ...oldData
    };

    // Migra campos antigos para novos
    if (oldData.currentStreak !== undefined && migratedData.currentDayStreak === 0) {
      // Se tinha sequência antiga, converte para 1 dia se > 0
      migratedData.currentDayStreak = oldData.currentStreak > 0 ? 1 : 0;
    }

    if (oldData.bestStreak !== undefined && migratedData.bestDayStreak === 0) {
      // Se tinha melhor sequência antiga, converte para dias
      migratedData.bestDayStreak = oldData.bestStreak > 0 ? Math.min(oldData.bestStreak, 30) : 0;
    }

    // Garante que todos os campos numéricos são números
    migratedData.challengesCompleted = Number(migratedData.challengesCompleted) || 0;
    migratedData.totalSmileTime = Number(migratedData.totalSmileTime) || 0;
    migratedData.longestSmile = Number(migratedData.longestSmile) || 0;
    migratedData.currentDayStreak = Number(migratedData.currentDayStreak) || 0;
    migratedData.bestDayStreak = Number(migratedData.bestDayStreak) || 0;
    migratedData.totalSessions = Number(migratedData.totalSessions) || 0;
    migratedData.todayCompleted = Boolean(migratedData.todayCompleted);

    return migratedData;
  }

  /**
   * Salva a pontuação no localStorage
   */
  saveScore() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.warn('Erro ao salvar pontuação:', error);
    }
  }

  /**
   * Obtém a data atual no formato YYYY-MM-DD
   * @returns {string} Data no formato YYYY-MM-DD
   */
  getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Verifica se duas datas são consecutivas
   * @param {string} date1 - Data anterior (YYYY-MM-DD)
   * @param {string} date2 - Data posterior (YYYY-MM-DD)
   * @returns {boolean} True se são dias consecutivos
   */
  areConsecutiveDays(date1, date2) {
    if (!date1 || !date2) return false;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1;
  }

  /**
   * Verifica se uma data é hoje
   * @param {string} dateString - Data no formato YYYY-MM-DD
   * @returns {boolean} True se é hoje
   */
  isToday(dateString) {
    console.log('Verificando se o dia é hoje...');
    return dateString === this.getTodayString();
  }

  /**
   * Atualiza o status de hoje completado baseado na última data de conclusão
   */
  updateTodayCompletedStatus() {
    this.data.todayCompleted = this.isToday(this.data.lastCompletionDate);
  }

  /**
   * Verifica e atualiza a sequência de dias baseada na última data de conclusão
   */
  updateDayStreak() {
    console.log('🎉  updateDayStreak');
    const today = this.getTodayString();
    const lastCompletion = this.data.lastCompletionDate;
    
    if (!lastCompletion) {
      console.log('🎉  Primeiro desafio ever');
      // Primeiro desafio ever
      this.data.currentDayStreak = 1;
    } else if (this.isToday(lastCompletion)) {
      console.log('🎉  Já completou hoje, mantém a sequência', lastCompletion);
      // Já completou hoje, mantém a sequência
      return;
    } else if (this.areConsecutiveDays(lastCompletion, today)) {
      console.log('🎉  Dia consecutivo, aumenta a sequência');
      // Dia consecutivo, aumenta a sequência
      this.data.currentDayStreak++;
    } else {
      console.log('🎉  Pulou um ou mais dias, quebra a sequência');
      // Pulou um ou mais dias, quebra a sequência
      this.data.currentDayStreak = 1;
    }
    
    // Atualiza melhor sequência se necessário
    if (this.data.currentDayStreak > this.data.bestDayStreak) {
      this.data.bestDayStreak = this.data.currentDayStreak;
    }

    console.log('🎉  this.data:', this.data);
  }

  /**
   * Registra uma nova sessão de jogo
   */
  startSession() {
    console.log('Iniciando sessão');
    const today = this.getTodayString();
    
    // Verifica se precisa quebrar a sequência por inatividade
    this.checkAndBreakStreakForInactivity();
    
    this.data.totalSessions++;
    this.data.lastPlayDate = today;
    this.updateTodayCompletedStatus();
    
    this.saveScore();
    this.notifyUpdate();
  }

  /**
   * Verifica se deve quebrar a sequência por inatividade
   */
  checkAndBreakStreakForInactivity() {
    const today = this.getTodayString();
    const lastCompletion = this.data.lastCompletionDate;
    
    if (lastCompletion && !this.isToday(lastCompletion) && !this.areConsecutiveDays(lastCompletion, today)) {
      // Pulou um ou mais dias, quebra a sequência
      this.data.currentDayStreak = 0;
    }
  }

  /**
   * Registra a conclusão de um desafio
   * @param {number} smileTime - Tempo que sorriu em segundos
   */
  completeChallenge(smileTime) {
    const today = this.getTodayString();
    const wasFirstCompletionToday = !this.data.todayCompleted;

    this.data.challengesCompleted++;
    this.data.totalSmileTime += smileTime;
    
    // Atualiza o maior tempo de sorriso
    if (smileTime > this.data.longestSmile) {
      this.data.longestSmile = smileTime;
    }
    
    // Só atualiza a sequência de dias se for a primeira conclusão do dia
    if (wasFirstCompletionToday) {
      this.data.todayCompleted = true;
      this.updateDayStreak();
      this.data.lastCompletionDate = today;
      
      console.log(`🎉 Primeiro desafio do dia completado! Sequência de dias: ${this.data.currentDayStreak}`);
    } else {
      console.log(`🎉 Mais um desafio completado hoje! Total: ${this.data.challengesCompleted}`);
    }
    
    this.saveScore();
    this.notifyUpdate();
  }

  /**
   * Verifica se já completou o desafio hoje
   * @returns {boolean} True se já completou hoje
   */
  hasCompletedToday() {
    return this.data.todayCompleted;
  }

  /**
   * Obtém a pontuação atual
   * @returns {Object} Dados da pontuação
   */
  getScore() {
    return { ...this.data };
  }

  /**
   * Obtém estatísticas calculadas
   * @returns {Object} Estatísticas
   */
  getStats() {
    // Atualiza o status de hoje completado
    this.updateTodayCompletedStatus();

    const avgSmileTime = this.data.challengesCompleted > 0 
      ? (this.data.totalSmileTime / this.data.challengesCompleted).toFixed(1)
      : 0;

    return {
      challengesCompleted: this.data.challengesCompleted || 0,
      totalSessions: this.data.totalSessions || 0,
      averageSmileTime: avgSmileTime,
      longestSmile: (this.data.longestSmile || 0).toFixed(1),
      currentDayStreak: this.data.currentDayStreak || 0,
      bestDayStreak: this.data.bestDayStreak || 0,
      totalSmileTime: (this.data.totalSmileTime || 0).toFixed(1),
      todayCompleted: this.data.todayCompleted || false,
      lastCompletionDate: this.data.lastCompletionDate || null
    };
  }

  /**
   * Reseta toda a pontuação
   */
  resetScore() {
    this.data = this.getDefaultData();
    this.saveScore();
    this.notifyUpdate();
  }

  /**
   * Define callback para quando a pontuação for atualizada
   * @param {Function} callback
   */
  onUpdate(callback) {
    this.onScoreUpdate = callback;
  }

  /**
   * Notifica sobre atualização da pontuação
   */
  notifyUpdate() {
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.getStats());
    }
  }

  /**
   * Verifica se é um novo recorde
   * @param {number} smileTime - Tempo do sorriso
   * @returns {boolean} True se é novo recorde
   */
  isNewRecord(smileTime) {
    return smileTime > this.data.longestSmile;
  }

  /**
   * Obtém mensagem motivacional baseada na sequência de dias
   * @returns {string} Mensagem motivacional
   */
  getMotivationalMessage() {
    const dayStreak = this.data.currentDayStreak;
    const wasFirstToday = !this.data.todayCompleted;
    
    if (dayStreak === 0) {
      return "Comece sua jornada de sorrisos diários! 😊";
    } else if (dayStreak === 1) {
      return wasFirstToday ? 
        "Primeiro dia da sua sequência! Continue amanhã! 🌟" :
        "Parabéns! Você completou o desafio de hoje! 🎉";
    } else if (dayStreak < 7) {
      return `${dayStreak} dias consecutivos! Você está criando um hábito! 💪`;
    } else if (dayStreak < 14) {
      return `Uma semana completa! ${dayStreak} dias seguidos! Incrível! 🏆`;
    } else if (dayStreak < 30) {
      return `${dayStreak} dias! Você é um verdadeiro guerreiro da felicidade! 👑`;
    } else if (dayStreak < 100) {
      return `${dayStreak} dias consecutivos! LENDÁRIO! Mestre do Sorriso! 🎭✨`;
    } else {
      return `${dayStreak} DIAS! Você transcendeu! Guru da Felicidade! 🌟👑✨`;
    }
  }
}
