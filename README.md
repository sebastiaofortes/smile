# 😊 Detector de Sorrisos

Um aplicativo web que detecta sorrisos em tempo real usando MediaPipe e mede por quanto tempo uma pessoa mantém o sorriso.

## 🏗️ Estrutura do Projeto

```
sorrisos/
├── index.html                 # Arquivo HTML principal (renomeado de sorriso4.html)
├── css/
│   ├── styles.css            # Estilos principais
│   └── animations.css        # Animações e transições
├── js/
│   ├── main.js              # Arquivo principal da aplicação
│   ├── modules/             # Módulos organizados por responsabilidade
│   │   ├── CameraManager.js  # Gerenciamento da câmera/webcam
│   │   ├── SmileDetector.js  # Detecção de sorrisos com MediaPipe
│   │   ├── TimerManager.js   # Cronômetro de sorriso
│   │   └── UIManager.js      # Gerenciamento da interface
│   └── utils/               # Utilitários e configurações
│       ├── constants.js      # Constantes e configurações
│       └── helpers.js        # Funções auxiliares
└── README.md                # Este arquivo
```

## 🎯 Funcionalidades

- **Detecção Facial**: Usa MediaPipe para detectar faces em tempo real
- **Detecção de Sorriso**: Identifica quando a pessoa está sorrindo
- **Cronômetro**: Mede o tempo de sorriso com meta de 15 segundos
- **Interface Responsiva**: Adapta-se a diferentes tamanhos de tela
- **Animações**: Efeitos visuais quando a meta é atingida
- **Landmarks Faciais**: Desenha pontos de referência do rosto

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. Clique em "Iniciar" para ativar a câmera
3. Sorria para iniciar o cronômetro
4. Mantenha o sorriso por 15 segundos para completar a meta
5. Clique em "Sair" para parar a câmera

## 🔧 Tecnologias

- **MediaPipe**: Detecção facial e análise de expressões
- **WebRTC**: Acesso à câmera
- **Canvas API**: Desenho dos landmarks faciais
- **Material Design**: Interface dos botões
- **ES6 Modules**: Organização modular do código

## 📱 Compatibilidade

- Chrome/Chromium (recomendado)
- Firefox
- Safari
- Edge

**Nota**: Requer HTTPS para acesso à câmera em produção.

## 🏛️ Arquitetura

O código foi organizado seguindo princípios de Clean Code:

### Módulos Principais

- **CameraManager**: Gerencia operações da webcam
- **SmileDetector**: Processa detecção facial e de sorrisos
- **TimerManager**: Controla o cronômetro de sorriso
- **UIManager**: Gerencia elementos da interface

### Padrões Utilizados

- **Single Responsibility**: Cada módulo tem uma responsabilidade específica
- **Separation of Concerns**: CSS, JS e HTML em arquivos separados
- **Error Handling**: Tratamento adequado de erros
- **Event-Driven**: Comunicação via callbacks entre módulos

## ⚙️ Configurações

As configurações podem ser ajustadas no arquivo `js/utils/constants.js`:

- `SMILE_GOAL_SECONDS`: Meta de tempo de sorriso (padrão: 15s)
- `SMILE_DETECTION_THRESHOLD`: Sensibilidade da detecção (padrão: 0.7)
- `LANDMARK_COLORS`: Cores dos landmarks faciais
- `ANIMATIONS`: Durações das animações

## 🔄 Melhorias Implementadas

1. ✅ **Estrutura Modular**: Código organizado em módulos específicos
2. ✅ **Separação de Responsabilidades**: CSS, JS e HTML separados
3. ✅ **Clean Code**: Nomenclatura clara e funções específicas
4. ✅ **Tratamento de Erros**: Error handling adequado
5. ✅ **Performance**: Debounce em eventos e otimizações
6. ✅ **Documentação**: Comentários e documentação JSDoc
