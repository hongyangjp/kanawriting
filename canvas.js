// canvas.js
let activeCanvases = []; 
let activeAnimikanas = []; 

// 依據雙切換狀態，精密分配「純手指臨摹」與「A4列印填滿」
function generateWorkspace(textArray, labelText) {
    canvasWorkspace.innerHTML = ''; 
    activeCanvases = []; 
    activeAnimikanas = []; 

    const smallKanas = ['っ', 'ゃ', 'ゅ', 'ょ', 'ッ', 'ャ', 'ュ', 'ョ'];
    const dakuonMarkers = /[\u309B\u309C\u3099\u309A]/; 

    const screenWidth = window.innerWidth || document.documentElement.clientWidth || 360;
    
    if (workspaceViewMode === 'trace') {
        // ==========================================
        // 📱 【畫面臨摹】大格子與手指手寫核心
        // ==========================================
        canvasWorkspace.classList.remove('print-view-mode');

        textArray.forEach((itemText) => {
            const chars = Array.from(itemText);
            const wordLength = chars.length;
            
            let boxSize;
            if (wordLength === 2) {
                boxSize = screenWidth < 600 ? Math.floor((screenWidth - 60) / 2) : 160;
            } else {
                boxSize = screenWidth < 600 ? (screenWidth - 40) : 220;
            }

            let pairWrapper = null;
            if (wordLength === 2) {
                pairWrapper = document.createElement('div');
                pairWrapper.className = 'yoon-pair-block';
                pairWrapper.style.margin = '15px auto'; 
                canvasWorkspace.appendChild(pairWrapper);
            }

            chars.forEach((char) => {
                const container = document.createElement('div');
                container.className = 'canvas-container';
                container.style.width = `${boxSize}px`;
                container.style.height = `${boxSize}px`;
                
                container.style.margin = wordLength === 2 ? '0px' : '10px'; 

                const diag = document.createElement('div');
                diag.className = 'diagonal-lines';
                diag.innerHTML = '<div class="diagonal-line-1"></div><div class="diagonal-line-2"></div>';
                container.appendChild(diag);

                // 筆順アニメーションコンテナ
                const animiContainer = document.createElement('div');
                animiContainer.className = 'animikana-svg';
                container.appendChild(animiContainer);

                // 万が一ライブラリが落ちていた時用の代替テキスト層（空心文字）
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'bg-outline-text fallback-text'; 
                fallbackDiv.textContent = char;
                container.appendChild(fallbackDiv);

                const canvas = document.createElement('canvas');
                canvas.className = 'paintCanvas';
                canvas.width = boxSize; 
                canvas.height = boxSize;
                container.appendChild(canvas);

                if (wordLength === 2 && pairWrapper) {
                    pairWrapper.appendChild(container);
                } else {
                    canvasWorkspace.appendChild(container);
                }

                const ctx = canvas.getContext('2d');
                setupDrawingEvents(canvas, ctx);
                activeCanvases.push({ canvas, ctx });

                // 安全ガード付きアニメーション起動ロジック
                try {
                    if (typeof Animikana !== 'undefined') {
                        fallbackDiv.style.display = 'none';

                        const animiInstance = new Animikana(animiContainer, char, {
                            autoplay: true,
                            loop: true,
                            delay: 1200,       
                            strokeSpeed: 2.2,    
                            showNumbers: true  
                        });
                        activeAnimikanas.push(animiInstance);
                    } else {
                        fallbackDiv.style.fontSize = `${boxSize * 0.82}px`;
                        if (smallKanas.includes(char)) fallbackDiv.classList.add('small-kana');
                    }
                } catch (e) {
                    console.error("Animikana initialization fallback triggered:", e);
                }
            });
        });

    } else {
        // ==========================================
        // 🖨️ 【PDF出力】100% 滿版大格子
        // ==========================================
        canvasWorkspace.classList.add('print-view-mode');

        const boxSize = 56.9; 
        const maxRepetitions = 10; 

        const topSpacer = document.createElement('div');
        topSpacer.style.height = '45px';
        topSpacer.className = 'no-print-spacer'; 
        canvasWorkspace.appendChild(topSpacer);

        textArray.forEach((itemText) => {
            const rowContainer = document.createElement('div');
            rowContainer.className = 'word-row-container';
            canvasWorkspace.appendChild(rowContainer);

            const chars = Array.from(itemText);
            const wordLength = chars.length;

            const isYoonPair = (wordLength === 2);
            if (isYoonPair) {
                rowContainer.classList.add('has-yoon-gap');
            }

            const fullSetsCount = Math.floor(maxRepetitions / wordLength);
            const totalUsedBoxes = fullSetsCount * wordLength;

            let currentPairBlock = null;

            for (let i = 0; i < maxRepetitions; i++) {
                if (isYoonPair && i % 2 === 0) {
                    currentPairBlock = document.createElement('div');
                    currentPairBlock.className = 'yoon-pair-block';
                    rowContainer.appendChild(currentPairBlock);
                }

                const container = document.createElement('div');
                container.className = 'canvas-container';
                container.style.width = `${boxSize}px`;
                container.style.height = `${boxSize}px`;

                const diag = document.createElement('div');
                diag.className = 'diagonal-lines';
                diag.innerHTML = '<div class="diagonal-line-1"></div><div class="diagonal-line-2"></div>';
                container.appendChild(diag);

                if (i >= totalUsedBoxes) {
                    const canvas = document.createElement('canvas');
                    canvas.className = 'paintCanvas';
                    canvas.width = boxSize;
                    canvas.height = boxSize;
                    container.appendChild(canvas);
                    
                    if (isYoonPair && currentPairBlock) {
                        currentPairBlock.appendChild(container);
                    } else {
                        rowContainer.appendChild(container);
                    }
                    continue; 
                }

                const char = chars[i % wordLength]; 
                const outlineDiv = document.createElement('div');
                outlineDiv.className = 'bg-outline-text';
                outlineDiv.textContent = char;

                if (i < wordLength) {
                    outlineDiv.classList.add('solid-text');
                } else {
                    outlineDiv.classList.add('print-outline-style');
                }
                
                if (smallKanas.includes(char)) {
                    outlineDiv.classList.add('small-kana');
                } else if (char.normalize("NFD").match(dakuonMarkers) || ['が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ','だ','ぢ','づ','de','ど','ば','び','ぶ','べ','ぼ','ぱ','ぴ','ぷ','ぺ','ぽ','ガ','ギ','グ','GE','ゴ','ザ','ジ','ズ','ZE','ゾ','野','ヂ','ヅ','單','ド','バ','ビ','布','BE','ボ','パ','Pi','普','ペ','ポ'].includes(char)) {
                    outlineDiv.classList.add('dakuon-text-style'); 
                }
                container.appendChild(outlineDiv);

                const canvas = document.createElement('canvas');
                canvas.className = 'paintCanvas';
                canvas.width = boxSize;
                canvas.height = boxSize;
                container.appendChild(canvas);

                if (isYoonPair && currentPairBlock) {
                    currentPairBlock.appendChild(container);
                } else {
                    rowContainer.appendChild(container);
                }
            }
        });
    }
    
    practiceArea.classList.add('active');
}

function setupDrawingEvents(canvas, ctx) {
    let isDrawing = false;

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function startDraw(e) {
        e.preventDefault(); 
        canvas.setPointerCapture(e.pointerId); 
        isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        
        ctx.lineWidth = 8; 
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#34495e'; 
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    function stopDraw(e) {
        if (!isDrawing) return;
        isDrawing = false;
        try {
            canvas.releasePointerCapture(e.pointerId);
        } catch (err) {}
    }

    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointercancel', stopDraw);
}

function clearAllCanvases() {
    activeCanvases.forEach(item => {
        item.ctx.clearRect(0, 0, item.canvas.width, item.canvas.height);
    });
}

clearBtn.addEventListener('click', clearAllCanvases);
