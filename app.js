(function () {
  // Theme toggle
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  root.setAttribute('data-theme', theme);

  const applyLabel = () => {
    toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  };

  applyLabel();

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    applyLabel();
  });

  // Calculator
  const calcDisplay = document.getElementById('calcDisplay');
  let calcExpression = '';

  document.querySelectorAll('[data-calc]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.calc;

      if (value === 'clear') {
        calcExpression = '';
        calcDisplay.textContent = '0';
        return;
      }

      if (value === '=') {
        try {
          const safe = calcExpression.replace(/[^0-9+\-*/.()]/g, '');
          const result = Function('return (' + safe + ')')();
          calcExpression = String(result);
          calcDisplay.textContent = calcExpression;
        } catch {
          calcExpression = '';
          calcDisplay.textContent = 'error';
        }
        return;
      }

      calcExpression += value;
      calcDisplay.textContent = calcExpression;
    });
  });

  // Guess the number
  const guessInput = document.getElementById('guessInput');
  const guessButton = document.getElementById('guessButton');
  const guessReset = document.getElementById('guessReset');
  const guessFeedback = document.getElementById('guessFeedback');

  let target = Math.floor(Math.random() * 20) + 1;
  let tries = 0;

  const resetGuess = () => {
    target = Math.floor(Math.random() * 20) + 1;
    tries = 0;
    guessInput.value = '';
    guessFeedback.textContent =
      'New round ready. Pick a number from 1 to 20.';
  };

  guessButton.addEventListener('click', () => {
    const value = Number(guessInput.value);

    if (!value || value < 1 || value > 20) {
      guessFeedback.textContent = 'Use a number from 1 to 20.';
      return;
    }

    tries += 1;

    if (value === target) {
      guessFeedback.textContent = 'Direct hit in ' + tries + ' tries.';
    } else if (value < target) {
      guessFeedback.textContent = 'Too low — go higher.';
    } else {
      guessFeedback.textContent = 'Too high — go lower.';
    }
  });

  guessReset.addEventListener('click', resetGuess);

  // Lane runner
  const runnerPlayer = document.getElementById('runnerPlayer');
  const runnerObstacle = document.getElementById('runnerObstacle');
  const runnerStart = document.getElementById('runnerStart');
  const runnerJump = document.getElementById('runnerJump');
  const runnerFeedback = document.getElementById('runnerFeedback');

  let runnerInterval = null;
  let obstacleX = 100;
  let jumping = false;
  let jumpY = 0;
  let score = 0;

  function setObstacle() {
    runnerObstacle.style.right = -obstacleX + 'px';
  }

  function setPlayer() {
    runnerPlayer.style.transform = 'translateY(' + -jumpY + 'px)';
  }

  function jump() {
    if (jumping) return;
    jumping = true;
    let up = true;

    const jumpTimer = setInterval(() => {
      if (up) {
        jumpY += 8;
        if (jumpY >= 72) {
          up = false;
        }
      } else {
        jumpY -= 8;
        if (jumpY <= 0) {
          jumpY = 0;
          jumping = false;
          clearInterval(jumpTimer);
        }
      }
      setPlayer();
    }, 24);
  }

  function stopRunner(message) {
    clearInterval(runnerInterval);
    runnerInterval = null;
    runnerFeedback.textContent = message + ' Score: ' + score + '.';
    obstacleX = 100;
    setObstacle();
  }

  runnerStart.addEventListener('click', () => {
    if (runnerInterval) return;

    score = 0;
    obstacleX = 100;
    jumpY = 0;
    setObstacle();
    setPlayer();
    runnerFeedback.textContent = 'Running... jump over the block.';

    runnerInterval = setInterval(() => {
      obstacleX -= 2.8;
      setObstacle();

      const overlap = obstacleX <= 32 && obstacleX >= 8;
      const grounded = jumpY < 34;

      if (overlap && grounded) {
        stopRunner('Crash.');
        return;
      }

      if (obstacleX < -24) {
        obstacleX = 100;
        score += 1;
        runnerFeedback.textContent = 'Nice. Score: ' + score + '.';
      }
    }, 18);
  });

  runnerJump.addEventListener('click', jump);

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      jump();
    }
  });
})();
