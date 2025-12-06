import type { EscapeRoomConfig } from './types';

export function generateEscapeRoomHtml(config: EscapeRoomConfig): string {
  const configJson = JSON.stringify(config);

  const totalPoints = config.hotspots.reduce((sum, h) => sum + (h.points || 0), 0);
  const bonusPoints = config.hotspots
    .filter(h => h.isBonus)
    .reduce((sum, h) => sum + (h.points || 0), 0);
  const puzzleCount = config.hotspots.length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  <style>
    :root {
      --primary: #ffffff;
      --primary-dark: #D3D3D3;
      --bg-dark: #000000;
      --panel-bg: rgba(0, 0, 0, 0.7);
      --border-color: rgba(255, 255, 255, 0.2);
      --success: #22c55e;
      --error: #ef4444;
      --warning: #eab308;
    }

    body { margin: 0; padding: 0; background: var(--bg-dark); font-family: ui-sans-serif, system-ui, sans-serif; color: white; overflow: hidden; height: 100vh; display: flex; justify-content: center; align-items: center; }
    
    #game-container { position: relative; width: auto; height: auto; max-width: 100%; max-height: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 2px solid #374151; }
    #background-img { display: block; max-height: 90vh; max-width: 100%; object-fit: contain; pointer-events: none; user-select: none; }
    
    #start-screen {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: #000; z-index: 100;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 2rem; box-sizing: border-box;
    }
    
    .hotspot { 
      position: absolute; width: 32px; height: 32px; border-radius: 50%; 
      border: 2px solid rgba(255,255,255,0.8); 
      transform: translate(-50%, -50%); transition: all 0.2s ease-out; 
      display: flex; justify-content: center; align-items: center; 
      font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5); z-index: 10; font-size: 14px;
      cursor: default; 
    }

    .hotspot.interactive { cursor: pointer; }
    .hotspot.interactive:hover { transform: translate(-50%, -50%) scale(1.15); z-index: 20; }
    
    .hotspot.bonus { background: var(--warning); border-color: #fef08a; color: black; }
    .hotspot.normal { background: #2563eb; border-color: #93c5fd; color: white; }
    .hotspot.locked { background: #f6e05e; border-color: #fdc700; color: #d1d5db; } 
    .hotspot.solved { background: var(--success); border-color: #86efac; color: white; opacity: 0.6; }
    .hotspot.solved.guide { opacity: 1; }
    
    #hud { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 1rem; z-index: 30; pointer-events: none; opacity: 0; transition: opacity 0.5s; }
    .hud-box { 
      background: var(--panel-bg); 
      backdrop-filter: blur(12px); 
      -webkit-backdrop-filter: blur(12px);
      padding: 0.5rem 1rem; 
      border-radius: 0.5rem; 
      border: 2px solid var(--border-color); 
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      min-width: 80px; text-align: center;
    }
    .hud-label { font-size: 0.75rem; text-transform: uppercase; color: #9ca3af; font-weight: 800; letter-spacing: 0.05em; }
    .hud-value { font-size: 1.5rem; font-family: monospace; font-weight: 700; color: white; line-height: 1.2; }
    #timer.low { color: var(--error); animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    
    @keyframes fadeInScaleUp { 
      0% { opacity: 0; transform: scale(0.95); } 
      100% { opacity: 1; transform: scale(1); } 
    }
    @keyframes fadeInScaleUpCentered { 
      0% { opacity: 0; transform: translateX(-50%) scale(0.95); } 
      100% { opacity: 1; transform: translateX(-50%) scale(1); } 
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes shake { 
      0%, 100% { transform: translateX(0); } 
      25% { transform: translateX(-5px); } 
      75% { transform: translateX(5px); } 
    }
    
    #modal-overlay { 
      display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      z-index: 50; justify-content: center; align-items: center; padding: 1rem;
      animation: fadeIn 0.2s ease-out forwards;
    }
    
    #modal-box { 
      background: #09090b; 
      border: 4px solid white;
      padding: 1.5rem; 
      border-radius: 0.75rem; 
      max-width: 32rem; 
      width: 100%; 
      text-align: center; 
      position: relative; 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: fadeInScaleUp 0.3s ease-out forwards;
      display: flex; flex-direction: column; max-height: 90vh;
    }

    #modal-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
    #modal-type { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; }
    #modal-close { color: #ef4444; font-weight: 800; cursor: pointer; border: none; background: none; font-size: 1.25rem; transition: color 0.2s; }
    #modal-close:hover { color: #b91c1c; }

    #modal-content { text-align: left; flex-grow: 1; overflow-y: auto; margin-bottom: 1.5rem; }
    #modal-question { font-size: 1.25rem; font-weight: 700; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }

    textarea { width: 100%; height: 8rem; padding: 0.75rem; background: #111827; color: #4ade80; border: 2px solid #374151; border-radius: 0.375rem; font-family: monospace; font-size: 0.875rem; resize: none; outline: none; margin-bottom: 1rem; box-sizing: border-box; }
    textarea:focus { border-color: var(--primary); }

    .btn { display: block; width: 100%; padding: 0.75rem; border: none; border-radius: 0.375rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 1rem; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-primary { background: var(--primary); color: var(--bg-dark); }
    .btn-primary:hover { background: var(--primary-dark); }
    
    .btn-success { background: #15803d; color: white; }
    .btn-success:hover { background: #14532d; }

    .option-btn { 
      background: transparent; color: white; border: 2px solid #e5e7eb; 
      margin-bottom: 0.5rem; text-align: left; display: flex; justify-content: space-between; align-items: center;
    }
    .option-btn:hover { border-color: #93c5fd; background: rgba(59, 130, 246, 0.1); }
    .option-btn.selected { border-color: var(--primary); background: #eff6ff; color: #1e40af; }

    #modal-box.success-state { background: #dcfce7; border-color: #22c55e; cursor: pointer; }
    .success-content { color: #15803d; text-align: center; padding: 2rem 0; }
    .success-content h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .success-content p { font-weight: 600; }

    #modal-error { color: #dc2626; font-weight: 700; margin-top: 0.75rem; display: none; text-align: center; animation: pulse 0.5s; }
    
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #1f2937; }
    ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #6b7280; }
  </style>
</head>
<body>

  <div id="start-screen">
    <h1 style="font-size: 3rem; margin-bottom: 2rem; color: var(--primary); text-align: center;">${config.title}</h1>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; width: 100%; max-width: 600px; margin-bottom: 3rem;">
      <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid var(--border-color);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏱️</div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.25rem;">${config.timerMinutes} Minutes</div>
        <div style="font-size: 0.7rem; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Time Limit</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid var(--border-color);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">❌</div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.25rem;">${config.penaltySeconds} Second</div>
        <div style="font-size: 0.7rem; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Penalties</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid var(--border-color);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🧩</div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.25rem;">${puzzleCount} Puzzle</div>
        <div style="font-size: 0.7rem; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Challenges</div>
      </div>
      <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; text-align: center; border: 1px solid var(--border-color);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">💎</div>
        <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.25rem;">${totalPoints} Points</div>
        ${bonusPoints > 0 
          ? `<div style="font-size: 0.7rem; color: var(--success); font-weight: bold;">(${bonusPoints} Bonus)</div>` 
          : `<div style="font-size: 0.7rem; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px;">Total Score</div>`
        }
      </div>
    </div>

    <button class="btn btn-primary" style="width: auto; padding: 1rem 4rem; font-size: 1.2rem; box-shadow: 0 0 20px rgba(255,255,255,0.2);" onclick="startGame()">Start the Escape</button>
  </div>

  <div id="game-container">
    <img id="background-img" src="${config.backgroundImage}" alt="Room">
    <div id="hotspots-layer"></div>
  </div>

  <div id="hud">
    <div class="hud-box">
      <div class="hud-label">Time Left</div>
      <div id="timer" class="hud-value">00:00</div>
    </div>
    <div class="hud-box">
      <div class="hud-label">Score</div>
      <div id="score" class="hud-value">0</div>
    </div>
  </div>

  <div id="modal-overlay">
    <div id="modal-box">
      <div id="default-view">
        <div id="modal-header">
          <span id="modal-type">PUZZLE</span>
          <button id="modal-close">✕</button>
        </div>
        <div id="modal-content">
          <p id="modal-question"></p>
          <div id="modal-interaction-area" style="margin-top: 1.5rem;"></div>
        </div>
        <div id="modal-footer"></div>
        <p id="modal-error"></p>
      </div>
      
      <div id="success-view" style="display: none;" onclick="closeSuccessNow()">
        <div class="success-content">
          <h2>✅ Correct!</h2>
          <p id="success-points" style="margin-top: 1rem; font-size: 1.2rem;">+0 Points</p>
        </div>
      </div>
    </div>
  </div>

  <script>
    const config = ${configJson};
    const penaltySeconds = config.penaltySeconds; 

    let state = {
      solvedIds: [],
      score: 0,
      timeLeft: config.timerMinutes * 60,
      timerRunning: false,
      activeHotspot: null,
      selectedOptions: [],
      successTimer: null,
      lockedTimer: null
    };

    function startGame() {
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('hud').style.opacity = '1';
      renderHotspots();
      state.timerRunning = true;
      startTimer();
    }

    function startTimer() {
      const timerEl = document.getElementById('timer');
      const initM = Math.floor(state.timeLeft / 60);
      const initS = state.timeLeft % 60;
      timerEl.textContent = \`\${initM}:\${initS < 10 ? '0' : ''}\${initS}\`;

      const interval = setInterval(() => {
        if (!state.timerRunning) { clearInterval(interval); return; }
        
        state.timeLeft--;
        const m = Math.floor(state.timeLeft / 60);
        const s = state.timeLeft % 60;
        timerEl.textContent = \`\${m}:\${s < 10 ? '0' : ''}\${s}\`;
        
        if (state.timeLeft < 60) timerEl.classList.add('low');
        
        if (state.timeLeft <= 0) {
          state.timerRunning = false;
          showGameOver();
        }
      }, 1000);
    }

    function renderHotspots() {
      const layer = document.getElementById('hotspots-layer');
      layer.innerHTML = '';
      
      config.hotspots.forEach(h => {
        const isLocked = h.lockedBy && !state.solvedIds.includes(h.lockedBy);
        const isSolved = state.solvedIds.includes(h.id);
        
        if (isLocked && h.lockBehavior === 'hidden') return;

        const isGuide = h.type === 'guide' || h.type === 'clue';
        const isInteractive = !isSolved || isGuide || isLocked;

        const btn = document.createElement('div');
        let classList = 'hotspot';
        if (h.isBonus) classList += ' bonus';
        else classList += ' normal';
        
        if (isInteractive) classList += ' interactive';
        
        if (isSolved) {
          classList += ' solved';
          if (isGuide) classList += ' guide';
        } else if (isLocked) {
          classList += ' locked';
        }
        
        btn.className = classList;
        btn.style.left = h.x + '%';
        btn.style.top = h.y + '%';
        
        if (isLocked) {
          btn.innerText = '🔒';
        } else if (isSolved) {
          btn.innerText = isGuide ? '📜' : '✓';
        } else {
          if (h.type === 'code') btn.innerText = '💻';
          else if (h.type === 'mcq_single') btn.innerText = '❓';
          else if (h.type === 'mcq_multi') btn.innerText = '❓';
          else btn.innerText = '📜';
        }
        
        if (isInteractive) {
          btn.onclick = () => handleHotspotClick(h, isLocked, isSolved);
        }
        
        layer.appendChild(btn);
      });
    }

    function handleHotspotClick(h, isLocked, isSolved) {
      const isGuide = h.type === 'guide' || h.type === 'clue';
      if (isSolved && !isGuide) return;
      
      const existingAlert = document.getElementById('locked-alert');
      if (existingAlert) existingAlert.remove();

      if (isLocked) {
        showLockedAlert();
        return;
      }
      openPuzzle(h);
    }

    function showLockedAlert() {
      const alert = document.createElement('div');
      alert.id = 'locked-alert';
      alert.style.cssText = 'position: absolute; top: 5rem; left: 50%; transform: translateX(-50%); background: #dc2626; color: white; padding: 0.75rem 1.5rem; border-radius: 999px; font-weight: 700; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); z-index: 40; animation: fadeInScaleUpCentered 0.2s ease-out forwards;';
      alert.innerText = "🔒 Locked! Solve previous puzzles first.";
      document.body.appendChild(alert);
      setTimeout(() => {
        if(alert) alert.remove();
      }, 2000);
    }

    function openPuzzle(h) {
      state.activeHotspot = h;
      state.selectedOptions = [];
      
      const modalBox = document.getElementById('modal-box');
      modalBox.classList.remove('success-state');
      modalBox.style.animation = 'none';
      void modalBox.offsetWidth;
      modalBox.style.animation = 'fadeInScaleUp 0.3s ease-out forwards';

      document.getElementById('default-view').style.display = 'block';
      document.getElementById('success-view').style.display = 'none';
      document.getElementById('modal-error').style.display = 'none';
      
      let typeTitle = 'PUZZLE';
      if (h.type === 'code') typeTitle = '💻 CODE CHALLENGE';
      else if (h.type === 'guide') typeTitle = '📜 GUIDE';
      else if (h.type === 'mcq_single' || h.type === 'mcq_multi') typeTitle = '❓ MULTIPLE CHOICE';

      document.getElementById('modal-type').innerText = typeTitle;
      document.getElementById('modal-question').innerText = h.content.question;
      
      const interactionArea = document.getElementById('modal-interaction-area');
      const footer = document.getElementById('modal-footer');
      interactionArea.innerHTML = '';
      footer.innerHTML = '';

      if (h.type === 'guide') {
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.innerText = 'Got it';
        btn.onclick = () => acknowledgeGuide();
        footer.appendChild(btn);
      } 
      else if (h.type === 'code') {
        const textarea = document.createElement('textarea');
        textarea.id = 'code-input';
        textarea.placeholder = 'Type your answer here...';
        interactionArea.appendChild(textarea);
        
        const btn = document.createElement('button');
        btn.className = 'btn btn-success';
        btn.innerText = 'Run Code';
        btn.disabled = true;
        btn.onclick = checkCode;
        footer.appendChild(btn);

        textarea.addEventListener('input', (e) => {
          btn.disabled = e.target.value.trim().length === 0;
        });
      }
      else if (h.type === 'mcq_single') { 
        const container = document.createElement('div');
        const submitBtn = document.createElement('button');
        
        h.content.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'btn option-btn';
          btn.innerHTML = \`<span>\${opt}</span>\`;
          btn.onclick = () => {
             Array.from(container.children).forEach(c => c.classList.remove('selected'));
             btn.classList.add('selected');
             state.selectedOptions = [opt];
             submitBtn.disabled = false;
          };
          container.appendChild(btn);
        });
        interactionArea.appendChild(container);
        
        submitBtn.className = 'btn btn-primary';
        submitBtn.innerText = 'Submit Answer';
        submitBtn.style.marginTop = '1rem';
        submitBtn.disabled = true;
        submitBtn.onclick = checkQuiz;
        footer.appendChild(submitBtn);
      }
      else if (h.type === 'mcq_multi') {
        const container = document.createElement('div');
        const instruction = document.createElement('p');
        instruction.innerText = "Select all that apply:";
        instruction.style.cssText = "font-size: 0.8rem; color: #9ca3af; margin-bottom: 0.5rem; font-style: italic;";
        interactionArea.appendChild(instruction);

        const submitBtn = document.createElement('button');

        h.content.options.forEach((opt, idx) => {
           const btn = document.createElement('button');
           btn.id = \`opt-btn-\${idx}\`;
           btn.className = 'btn option-btn';
           btn.innerHTML = \`<span>\${opt}</span><span class="check">✓</span>\`;
           btn.querySelector('.check').style.display = 'none';
           
           btn.onclick = () => {
             if (state.selectedOptions.includes(opt)) {
               state.selectedOptions = state.selectedOptions.filter(o => o !== opt);
               btn.classList.remove('selected');
               btn.querySelector('.check').style.display = 'none';
             } else {
               state.selectedOptions.push(opt);
               btn.classList.add('selected');
               btn.querySelector('.check').style.display = 'inline';
             }
             submitBtn.disabled = state.selectedOptions.length === 0;
           };
           container.appendChild(btn);
        });
        interactionArea.appendChild(container);
        
        submitBtn.className = 'btn btn-primary';
        submitBtn.innerText = 'Submit Answer';
        submitBtn.style.marginTop = '1rem';
        submitBtn.disabled = true;
        submitBtn.onclick = checkMulti;
        footer.appendChild(submitBtn);
      }

      document.getElementById('modal-overlay').style.display = 'flex';
    }

    function applyPenalty() {
      state.timeLeft = Math.max(0, state.timeLeft - penaltySeconds);
      
      const timerEl = document.getElementById('timer');
      timerEl.classList.add('low');
      setTimeout(() => timerEl.classList.remove('low'), 500);
      
      const modalBox = document.getElementById('modal-box');
      modalBox.style.animation = 'none';
      modalBox.offsetHeight; 
      modalBox.style.animation = 'shake 0.3s ease-in-out';
      
      const errorEl = document.getElementById('modal-error');
      errorEl.innerText = \`❌ Incorrect! -\${penaltySeconds} Seconds\`;
      errorEl.style.display = 'block';
    }

    function acknowledgeGuide() {
      completePuzzle(state.activeHotspot);
    }

    function showSuccessState() {
      const h = state.activeHotspot;
      const modalBox = document.getElementById('modal-box');
      modalBox.classList.add('success-state');
      document.getElementById('default-view').style.display = 'none';
      document.getElementById('success-view').style.display = 'block';
      document.getElementById('success-points').innerText = \`+\${h.points} Points\`;

      state.successTimer = setTimeout(() => {
        completePuzzle(h);
      }, 1500);
    }

    function closeSuccessNow() {
      if (state.successTimer) {
        clearTimeout(state.successTimer);
        state.successTimer = null;
        completePuzzle(state.activeHotspot);
      }
    }

    function checkCode() {
      const input = document.getElementById('code-input').value.trim();
      if (input === state.activeHotspot.content.solution.trim()) showSuccessState();
      else applyPenalty();
    }

    function checkQuiz() {
      if (state.selectedOptions.length === 0) return;
      const ans = state.selectedOptions[0];
      if (ans === state.activeHotspot.content.solution) showSuccessState();
      else applyPenalty();
    }

    function checkMulti() {
      try {
        const solutions = JSON.parse(state.activeHotspot.content.solution);
        const correct = state.selectedOptions.length === solutions.length && 
                        state.selectedOptions.every(val => solutions.includes(val));
        if (correct) showSuccessState();
        else applyPenalty();
      } catch(e) { console.error(e); }
    }

    function completePuzzle(h) {
      if (!h) return;
      if (!state.solvedIds.includes(h.id)) {
        state.solvedIds.push(h.id);
        state.score += h.points;
      }
      document.getElementById('score').innerText = state.score;
      document.getElementById('modal-overlay').style.display = 'none';
      renderHotspots();
      checkVictory();
    }

    function checkVictory() {
      const mandatory = config.hotspots.filter(h => !h.isBonus);
      const allSolved = mandatory.every(h => state.solvedIds.includes(h.id));
      
      if (allSolved) {
        state.timerRunning = false;
        setTimeout(() => {
          showGameOver(true);
        }, 500);
      }
    }

    function showGameOver(victory = false) {
      document.getElementById('modal-overlay').style.display = 'flex';
      const modalBox = document.getElementById('modal-box');
      modalBox.classList.remove('success-state'); 
      modalBox.style.maxWidth = '400px';
      modalBox.style.animation = 'none';
      void modalBox.offsetWidth;
      modalBox.style.animation = 'fadeInScaleUp 0.3s ease-out forwards';
      
      const title = victory ? '<h1 style="color:#22c55e; margin:0;">VICTORY!</h1>' : '<h1 style="color:#ef4444; margin:0;">GAME OVER</h1>';
      const msg = victory ? 'You escaped the room.' : 'You ran out of time.';
      
      modalBox.innerHTML = \`
        <div style="padding: 2rem 0; text-align: center;">
          \${title}
          <p style="font-size: 1.25rem; margin: 1rem 0;">\${msg}</p>
          
          <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
            <p style="font-size: 0.75rem; text-transform: uppercase; color: #9ca3af; font-weight: bold;">Final Score</p>
            <p style="font-size: 3rem; font-family: monospace; font-weight: bold; margin: 0;">\${state.score}</p>
          </div>

          <button class="btn \${victory ? 'btn-primary' : 'btn-success'}" onclick="location.reload()">
            \${victory ? 'Play Again' : 'Try Again'}
          </button>
        </div>
      \`;
    }

    document.getElementById('modal-close').onclick = () => {
      document.getElementById('modal-overlay').style.display = 'none';
    };
  </script>
</body>
</html>`;
}