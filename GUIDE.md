# 🎯 First-Time User Guide - Documentação

## 📋 Visão Geral

O **First-Time User Guide** é um sistema completo de onboarding que guia novos usuários através da primeira experiência no aplicativo "Sorrisos". Ele inclui:

- ✅ Modal de boas-vindas interativo
- ✅ Tour guiado passo-a-passo
- ✅ Spotlight visual nos elementos
- ✅ Tooltips explicativos
- ✅ Sistema de progresso
- ✅ Suporte a teclado e acessibilidade
- ✅ Design responsivo

## 🚀 Como Funciona

### 1. **Detecção Automática**
- Detecta automaticamente se é a primeira visita do usuário
- Usa `localStorage` para persistir o estado
- Inicia automaticamente após 1 segundo da inicialização

### 2. **Modal de Boas-vindas**
```javascript
// Mostra features principais do app
- 🤖 IA Avançada: Detecção facial em tempo real
- 🎮 Gamificação: Sistema de pontos e conquistas  
- 📊 Progresso: Acompanhe seus dias consecutivos
```

### 3. **Tour Guiado (5 Passos)**
```javascript
Passo 1: Score Panel - Explica sistema de pontuação
Passo 2: Botão Iniciar - Como ativar a câmera
Passo 3: Área de Vídeo - Detecção com IA
Passo 4: Timer/Progresso - Meta de 15 segundos
Passo 5: Modal Celebração - Sistema de recompensas
```

## 🎨 Componentes Visuais

### **Modal de Boas-vindas**
- Background com gradiente elegante
- Cards de features com ícones
- Botões de ação primário/secundário
- Animação de entrada suave

### **Overlay e Spotlight**
- Overlay escuro semi-transparente
- Spotlight verde com borda pulsante
- Efeito de glow animado
- Máscara que destaca elementos

### **Tooltips Explicativos**
- Design clean com setas direcionais
- Barra de progresso visual
- Botões de navegação
- Posicionamento inteligente

## 🛠️ Implementação Técnica

### **Arquivos Criados:**
```
js/modules/FirstTimeGuide.js  # Classe principal
css/guide.css                 # Estilos completos
GUIDE.md                      # Esta documentação
```

### **Integração:**
```javascript
// main.js
import { FirstTimeGuide } from './modules/FirstTimeGuide.js';
const firstTimeGuide = new FirstTimeGuide();

// Inicia automaticamente se primeira vez
firstTimeGuide.start();

// Botão de ajuda para repetir
helpButton.addEventListener('click', () => {
  firstTimeGuide.forceStart();
});
```

### **HTML Modificado:**
```html
<!-- Novo CSS -->
<link rel="stylesheet" href="css/guide.css">

<!-- Botão de ajuda -->
<button id="help-button" class="help-btn" title="Ver tutorial novamente">
  <span>?</span>
</button>
```

## 🎮 Controles e Interação

### **Navegação por Teclado:**
- `→` ou `Espaço`: Próximo passo
- `←`: Passo anterior  
- `Esc`: Fechar/pular tour

### **Navegação por Mouse/Touch:**
- Clique nos botões de navegação
- Clique no overlay para fechar
- Botão "×" para fechar

### **Botões Disponíveis:**
- **Fazer Tour Guiado**: Inicia o tour completo
- **Pular e Começar**: Pula direto para o app
- **Anterior/Próximo**: Navegação entre passos
- **Pular Tour**: Sai do tour a qualquer momento
- **Finalizar**: Completa o tour

## 🔧 Funções de Debug

### **Console Commands:**
```javascript
// Reseta o guide (mostra novamente)
resetGuide()

// Força mostrar o guide
showGuide()

// Ver dados salvos do jogo
showGameData()

// Limpar todos os dados
clearGameData()
```

## 📱 Responsividade

### **Desktop (> 768px):**
- Layout horizontal otimizado
- Tooltips posicionados dinamicamente
- Animações completas

### **Mobile (< 768px):**
- Layout vertical adaptado
- Tooltips centralizados
- Touch targets adequados
- Texto redimensionado

### **Acessibilidade:**
- Suporte a `prefers-reduced-motion`
- Focus indicators visíveis
- Contraste adequado
- Navegação por teclado

## 🎯 Personalização

### **Modificar Passos:**
```javascript
// Em FirstTimeGuide.js
this.steps = [
  {
    target: '#elemento',
    title: 'Título',
    message: 'Descrição...',
    position: 'bottom', // top, left, right, center
    highlight: true,    // spotlight sim/não
    showElement: false  // forçar mostrar elemento oculto
  }
];
```

### **Customizar Cores:**
```css
/* Em guide.css */
:root {
  --guide-primary: #4CAF50;
  --guide-secondary: #667eea;
  --guide-overlay: rgba(0, 0, 0, 0.8);
}
```

## 📊 Métricas e Analytics

### **Eventos Trackáveis:**
- Guide iniciado (primeira vez vs manual)
- Passos completados vs pulados
- Tempo gasto no tour
- Taxa de conclusão

### **LocalStorage Keys:**
```javascript
'sorrisos-first-time-completed' // Status do guide
'smile-detector-score'          // Dados do jogo
```

## 🚀 Próximas Melhorias

### **Funcionalidades Futuras:**
- [ ] Tooltips contextuais permanentes
- [ ] Hints animados em elementos
- [ ] Tour avançado para features novas
- [ ] Personalização de velocidade
- [ ] Integração com analytics
- [ ] Suporte a múltiplos idiomas

### **Otimizações:**
- [ ] Lazy loading dos estilos
- [ ] Preload de animações
- [ ] Otimização para performance
- [ ] Testes automatizados

## 🎉 Resultado Final

O **First-Time User Guide** transforma a experiência inicial do usuário, proporcionando:

✅ **Onboarding suave** e intuitivo  
✅ **Redução da curva de aprendizado**  
✅ **Aumento do engajamento inicial**  
✅ **Melhor compreensão das funcionalidades**  
✅ **Design profissional** e moderno  
✅ **Experiência acessível** para todos  

O sistema está completamente integrado e pronto para uso, oferecendo uma experiência de primeira classe para novos usuários do aplicativo "Sorrisos"! 🎊
