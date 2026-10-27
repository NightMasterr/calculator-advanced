document.addEventListener('DOMContentLoaded', () => {
  const expressionLine = document.getElementById('expression-line');
  const resultDisplay = document.getElementById('result-display');
  const historyDrawer = document.getElementById('history-drawer');
  const historyList = document.getElementById('history-list');

  let currentInput = '0';
  let storedExpression = '';
  let isNewEquation = false;

  // Initialize IndexedDB History on Startup
  CalculatorHistory.init().then(() => {
    loadStoredHistory();
  }).catch(err => console.error("Failed to load history DB:", err));

  async function loadStoredHistory() {
    try {
      const entries = await CalculatorHistory.getAllEntries();
      if (entries.length > 0) {
        historyList.innerHTML = '';
        entries.forEach(item => renderHistoryCard(item.expression, item.result, item.tagColor));
      }
    } catch (e) {
      console.error("Error fetching history entries:", e);
    }
  }

  // Update Display Screens
  function updateDisplay() {
    expressionLine.textContent = storedExpression || '0';
    resultDisplay.textContent = currentInput;
  }

  // Handle Number Inputs
  document.querySelectorAll('.btn-num').forEach(button => {
    button.addEventListener('click', () => {
      const val = button.textContent.trim();

      if (isNewEquation) {
        currentInput = '0';
        storedExpression = '';
        isNewEquation = false;
      }

      if (val === '.') {
        if (!currentInput.includes('.')) {
          currentInput += '.';
        }
      } else if (val === '±') {
        currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
      } else {
        if (currentInput === '0') {
          currentInput = val;
        } else {
          currentInput += val;
        }
      }
      updateDisplay();
    });
  });

  // Handle Basic Operations & Actions
  document.querySelectorAll('.btn-op').forEach(button => {
    button.addEventListener('click', () => {
      const op = button.textContent.trim();

      if (op === 'C') {
        currentInput = '0';
        storedExpression = '';
        isNewEquation = false;
        updateDisplay();
        return;
      }

      if (op === 'CE') {
        currentInput = '0';
        updateDisplay();
        return;
      }

      if (op === '⌫') {
        if (currentInput.length > 1) {
          currentInput = currentInput.slice(0, -1);
        } else {
          currentInput = '0';
        }
        updateDisplay();
        return;
      }

      if (op === 'x²') {
        storedExpression = `(${currentInput})²`;
        currentInput = CalculatorEngine.square(currentInput);
        isNewEquation = true;
        updateDisplay();
        saveAndRenderHistory(storedExpression, currentInput, 'mint');
        return;
      }

      if (op === '√') {
        storedExpression = `√(${currentInput})`;
        currentInput = CalculatorEngine.sqrt(currentInput);
        isNewEquation = true;
        updateDisplay();
        saveAndRenderHistory(storedExpression, currentInput, 'sky');
        return;
      }

      if (op === '1/x') {
        storedExpression = `1/(${currentInput})`;
        currentInput = CalculatorEngine.inverse(currentInput);
        isNewEquation = true;
        updateDisplay();
        saveAndRenderHistory(storedExpression, currentInput, 'sage');
        return;
      }

      // Operators (+, -, ×, ÷)
      if (['+', '−', '×', '÷'].includes(op)) {
        storedExpression = `${currentInput} ${op} `;
        currentInput = '0';
        isNewEquation = false;
        updateDisplay();
      }
    });
  });

  // Equals Calculation
  document.getElementById('btn-equals').addEventListener('click', () => {
    if (!storedExpression) return;

    const parts = storedExpression.trim().split(' ');
    const num1 = parts[0];
    const op = parts[1];
    const num2 = currentInput;
    let res = '0';

    if (op === '+') res = CalculatorEngine.add(num1, num2);
    else if (op === '−') res = CalculatorEngine.subtract(num1, num2);
    else if (op === '×') res = CalculatorEngine.multiply(num1, num2);
    else if (op === '÷') res = CalculatorEngine.divide(num1, num2);

    const fullExpr = `${storedExpression} ${currentInput} =`;
    storedExpression = fullExpr;
    currentInput = res;
    isNewEquation = true;
    updateDisplay();

    saveAndRenderHistory(fullExpr, res, 'mint');
  });

  // Save to IndexedDB and Render
  async function saveAndRenderHistory(expression, result, tagColor) {
    try {
      await CalculatorHistory.addEntry(expression, result, tagColor);
      renderHistoryCard(expression, result, tagColor, true);
    } catch (e) {
      console.error("Failed to save history entry:", e);
    }
  }

  // Render History Card in UI Drawer
  function renderHistoryCard(expression, result, tagColor = 'mint', prepend = false) {
    if (historyList.querySelector('p')) {
      historyList.innerHTML = ''; // Clear default "No past calculations" text
    }

    const card = document.createElement('div');
    card.className = 'bg-panel p-3 rounded-card border border-line flex justify-between items-center shadow-sm cursor-pointer active:scale-95 transition-all';
    card.innerHTML = `
      <div>
        <div class="text-xs text-ink-muted">${expression}</div>
        <div class="text-lg font-serif font-bold text-dark-slate">${result}</div>
      </div>
      <span class="w-3 h-3 rounded-full bg-mint-btn inline-block"></span>
    `;

    // Click history item to reuse its result
    card.addEventListener('click', () => {
      currentInput = result;
      updateDisplay();
      historyDrawer.classList.add('translate-y-full');
    });

    if (prepend) {
      historyList.prepend(card);
    } else {
      historyList.appendChild(card);
    }
  }

  // History Drawer Toggles
  document.getElementById('btn-history-toggle').addEventListener('click', () => {
    historyDrawer.classList.remove('translate-y-full');
  });

  document.getElementById('btn-history-close').addEventListener('click', () => {
    historyDrawer.classList.add('translate-y-full');
  });
});