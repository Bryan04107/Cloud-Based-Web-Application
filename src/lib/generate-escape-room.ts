import type { EscapeRoomConfig } from './types';

const GUIDE_SVG = `<svg width="100%" height="100%" viewBox="0 0 390 389" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" overflow="hidden"><g transform="translate(-2005 -1043)"><path d="M2062.1 1092 2307.76 1092C2307.47 1101.45 2325.28 1119.5 2325 1128.95L2307.76 1147 2062.1 1147C2062.1 1138.41 2044 1128.95 2044 1120.36 2049.17 1106.61 2056.07 1101.45 2062.1 1092Z" fill="#FFC000" fill-rule="evenodd"/><path d="M2121 1141 2316.58 1141C2316.29 1159.65 2310.86 1185.17 2302 1194.35 2301.14 1207.12 2312.86 1181.02 2314.86 1214.15 2318.87 1238.39 2320.44 1297.76 2320.01 1327.74 2382.2 1339.64 2346.46 1384.96 2312.29 1394L2121 1394 2121 1141Z" fill="#FFC000" fill-rule="evenodd"/><path d="M101.302 117.51 101.302 220.839C101.303 222.988 102.157 225.049 103.677 226.568L116.177 239.073 101.651 253.604C100.131 255.123 99.2765 257.184 99.2761 259.333L99.2761 314.037C99.3028 337.523 118.336 356.557 141.823 356.583L316.063 356.583C338.441 356.606 356.602 338.482 356.624 316.104 356.643 296.817 343.067 280.19 324.167 276.352L324.167 168.162C324.168 165.516 322.877 163.037 320.71 161.52L307.671 152.395 322.291 134.853C324.496 132.205 324.785 128.452 323.012 125.497L314.097 110.662 321.776 102.963C323.298 101.45 324.158 99.396 324.167 97.25L324.167 79.0157C324.14 55.529 305.107 36.4955 281.62 36.4688L74.9636 36.4688C51.5733 36.397 32.5395 55.2733 32.4167 78.6631 32.4048 91.4932 38.2732 103.622 48.3414 111.574 48.4872 111.692 48.6372 111.805 48.7952 111.91 53.917 115.525 60.0195 117.491 66.2881 117.547ZM91.4556 101.302C92.5877 98.573 93.1797 95.6503 93.198 92.6955 93.2932 79.4541 82.6362 68.6427 69.3948 68.5475 69.225 68.5463 69.0552 68.5467 68.8854 68.5491 64.4095 68.5491 60.7813 72.1774 60.7813 76.6533 60.7813 81.1292 64.4095 84.7575 68.8854 84.7575 73.2179 84.616 76.8445 88.0137 76.986 92.3462 76.9896 92.4625 76.9908 92.5792 76.9896 92.6955 76.7854 95.8351 74.87 98.6071 72.0056 99.9082 67.5462 102.093 62.2445 101.633 58.2285 98.7128 52.1572 93.8281 48.6262 86.4557 48.625 78.6631 48.7223 64.1165 60.5937 52.4036 75.1398 52.5008 89.6864 52.5981 101.399 64.4691 101.302 79.0157L101.302 101.302ZM153.979 275.582C148.878 275.347 143.805 276.456 139.266 278.796 131.059 282.883 125.799 291.19 125.615 300.357 125.519 313.598 136.176 324.41 149.418 324.505 149.588 324.506 149.757 324.506 149.927 324.503 154.403 324.503 158.031 320.875 158.031 316.399 158.031 311.923 154.403 308.295 149.927 308.295 145.595 308.436 141.968 305.039 141.827 300.706 141.823 300.59 141.822 300.473 141.823 300.357 142.027 297.217 143.943 294.445 146.807 293.144 151.27 290.965 156.572 291.433 160.584 294.36 166.65 299.24 170.18 306.604 170.188 314.389 170.074 328.831 158.291 340.456 143.849 340.375L141.823 340.375C127.284 340.357 115.502 328.575 115.484 314.037L115.484 262.693 133.37 244.803C136.534 241.638 136.534 236.508 133.37 233.343L117.51 217.479 117.51 79.0157C117.521 69.4544 114.295 60.171 108.357 52.6771L281.62 52.6771C296.159 52.6949 307.941 64.4768 307.958 79.0157L307.958 93.8909 298.177 103.677C295.549 106.307 295.047 110.388 296.961 113.576L306.155 128.901 289.574 148.793C286.709 152.231 287.174 157.341 290.613 160.206 290.787 160.352 290.968 160.49 291.154 160.621L307.958 172.384 307.958 275.542ZM316.063 340.375 177.299 340.375C188.458 326.367 189.437 306.801 179.73 291.75L316.063 291.75C329.49 291.75 340.375 302.635 340.375 316.063 340.375 329.49 329.49 340.375 316.063 340.375Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M198.552 101.302 267.438 101.302 267.438 117.51 198.552 117.51Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M158.031 101.302 182.344 101.302 182.344 117.51 158.031 117.51Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M198.552 222.865 267.438 222.865 267.438 239.073 198.552 239.073Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M158.031 222.865 182.344 222.865 182.344 239.073 158.031 239.073Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M158.031 141.823 226.917 141.823 226.917 158.031 158.031 158.031Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M243.125 141.823 267.438 141.823 267.438 158.031 243.125 158.031Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M158.031 182.344 267.438 182.344 267.438 198.552 158.031 198.552Z" transform="matrix(1.00257 0 0 1 2005 1043)"/></g></svg>`;
const CODE_SVG = `<svg width="100%" height="100%" viewBox="0 0 390 389" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" overflow="hidden"><g transform="translate(-2005 -1043)"><rect x="2081.5" y="1141.5" width="238" height="151" stroke="#042433" stroke-width="6.875" stroke-miterlimit="8" fill="#83CBEB"/><path d="M307.958 243.125 81.0417 243.125 81.0417 105.354 307.958 105.354 307.958 243.125ZM332.271 97.25C332.271 88.3354 324.977 81.0417 316.063 81.0417L72.9375 81.0417C64.0229 81.0417 56.7292 88.3354 56.7292 97.25L56.7292 267.438 332.271 267.438 332.271 97.25Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M218.813 283.646 218.813 287.698C218.813 290.129 217.192 291.75 214.76 291.75L174.24 291.75C171.808 291.75 170.188 290.129 170.188 287.698L170.188 283.646 8.10417 283.646 8.10417 291.75C8.10417 300.665 15.3979 307.958 24.3125 307.958L364.688 307.958C373.602 307.958 380.896 300.665 380.896 291.75L380.896 283.646 218.813 283.646Z" transform="matrix(1.00257 0 0 1 2005 1043)"/></g></svg>`;
const MCQ_SVG = `<svg width="100%" height="100%" viewBox="0 0 114 114" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" overflow="hidden"><g transform="translate(-583 -303)"><path d="M670.085 338.164C668.141 321.554 653.1 309.664 636.49 311.608 621.271 313.389 609.781 326.258 609.728 341.581L623.978 341.581C623.978 332.73 631.152 325.555 640.003 325.555 648.853 325.554 656.029 332.729 656.029 341.579 656.029 347.098 653.19 352.228 648.514 355.159 638.865 361.063 632.95 371.533 632.875 382.845L647.125 382.845C647.216 376.436 650.61 370.528 656.1 367.221 665.985 361.052 671.43 349.739 670.085 338.164Z"/><path d="M646.388 393.813 646.388 393.813C642.992 390.41 637.481 390.404 634.078 393.8 634.073 393.804 634.069 393.809 634.065 393.813 633.269 394.612 632.635 395.558 632.198 396.599 631.744 397.674 631.512 398.829 631.518 399.996 631.511 401.158 631.744 402.31 632.201 403.378 633.089 405.467 634.757 407.127 636.851 408.004 637.925 408.458 639.08 408.69 640.247 408.688 641.409 408.693 642.56 408.461 643.629 408.005 645.708 407.117 647.364 405.461 648.251 403.382 648.707 402.313 648.94 401.162 648.935 400 648.939 398.833 648.707 397.677 648.253 396.602 647.817 395.561 647.184 394.614 646.388 393.813Z"/></g></svg>`;
const LOCK_SVG = `<svg width="100%" height="100%" viewBox="0 0 390 389" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" overflow="hidden"><g transform="translate(-2005 -1043)"><path d="M2200 1384 2092 1374.14 2092 1230.86 2200 1221Z" fill="#FFC000" fill-rule="evenodd"/><path d="M0 108 9.85718 0 153.143 0 163 108Z" fill="#FFC000" fill-rule="evenodd" transform="matrix(-6.12323e-17 -1 -1 6.12323e-17 2308 1384)"/><path d="M2192.31 1106.81C2226.41 1090.73 2262.41 1120.76 2272.73 1173.88 2275.8 1189.68 2276.33 1206.41 2274.26 1222.6" stroke="#7F7F7F" stroke-width="20.625" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M87.437 41.8346C94.7791 63.0974 97.8532 89.4917 96.0058 115.406" stroke="#7F7F7F" stroke-width="20.625" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-0.997599 0.06926 0.06926 0.997599 2218.9 1102.34)"/><path d="M2129.92 1149.58C2139.57 1121.99 2166.56 1104.33 2195.71 1106.53" stroke="#7F7F7F" stroke-width="20.625" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M279.695 178.353 279.695 129.792C279.695 82.7383 241.55 44.5932 194.496 44.5932 147.442 44.5932 109.297 82.7383 109.297 129.792L109.297 178.348 81.0295 180.375 81.0295 334.39 194.488 342.494 307.946 334.39 307.946 180.366ZM117.401 129.792C117.401 87.2138 151.918 52.6974 194.496 52.6974 237.075 52.6974 271.591 87.2138 271.591 129.792L271.591 177.81 259.333 176.991 259.333 129.691C259.333 93.8844 230.307 64.8577 194.5 64.8577 158.693 64.8577 129.667 93.8844 129.667 129.691L129.667 176.991 117.409 177.801ZM251.229 176.424 194.5 172.262 137.771 176.424 137.771 129.691C137.771 98.3603 163.169 72.9618 194.5 72.9618 225.831 72.9618 251.229 98.3603 251.229 129.691ZM299.854 326.845 194.5 334.374 89.1459 326.845 89.1459 187.915 109.949 186.428 134.314 184.807 194.5 180.387 254.742 184.807 279.018 186.428 299.854 187.915Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M194.5 224.956C178.768 225.02 166.067 237.826 166.131 253.558 166.176 264.493 172.476 274.437 182.344 279.148L182.344 301.965 206.656 301.965 206.656 279.051C216.453 274.192 222.709 264.262 222.865 253.328 222.849 237.668 210.16 224.976 194.5 224.956ZM201.125 272.657 198.552 273.666 198.552 293.861 190.448 293.861 190.448 273.548 187.725 272.604C177.119 268.905 171.521 257.309 175.221 246.703 178.92 236.098 190.516 230.499 201.122 234.199 209.263 237.039 214.73 244.705 214.76 253.328 214.583 261.95 209.185 269.6 201.121 272.657Z" transform="matrix(1.00257 0 0 1 2005 1043)"/><path d="M2174 1297C2174 1282.64 2185.64 1271 2200 1271 2214.36 1271 2226 1282.64 2226 1297 2226 1311.36 2214.36 1323 2200 1323 2185.64 1323 2174 1311.36 2174 1297Z" fill-rule="evenodd"/><rect x="2194" y="1315" width="12.9998" height="26.0001"/></g></svg>`;

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
    
    #hud { position: absolute; top: 1rem; right: 1rem; display: flex; gap: 1rem; z-index: 60; pointer-events: none; opacity: 0; transition: opacity 0.5s; }
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
      display: none; position: fixed; top: 0; width: 100%; height: 100%; 
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
          btn.innerHTML = \`${LOCK_SVG}\`; 
        } else if (isSolved) {
          btn.innerText = '✓';
        } else {
          if (h.type === 'code') {
            btn.innerHTML = \`${CODE_SVG}\`;
          } else if (h.type === 'mcq_single' || h.type === 'mcq_multi') {
            btn.innerHTML = \`${MCQ_SVG}\`;
          } else {
            btn.innerHTML = \`${GUIDE_SVG}\`;
          }
          
          const svg = btn.querySelector('svg');
          if (svg) {
            svg.style.width = '60%';
            svg.style.height = '60%';
          }
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