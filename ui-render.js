// ui-render.js

function initChart() {
    chartEl.innerHTML = '';
    
    if (currentMode === 'dakuon') {
        chartEl.classList.add('dakuon-grid');
        for (let v = 0; v < 5; v++) { 
            dakuonRows.forEach(row => {
                const hiraChar = row.hira[v];
                const kataChar = row.kata[v];
                
                if (hiraChar) {
                    const btn = document.createElement('button');
                    btn.className = 'kana-btn';
                    btn.textContent = `${hiraChar} ${kataChar}`;
                    btn.style.fontSize = '0.95rem';
                    
                    if (selectedElements.includes(hiraChar)) btn.classList.add('selected');

                    btn.addEventListener('click', () => {
                        handleDakuonSelection(hiraChar, kataChar, btn);
                    });
                    chartEl.appendChild(btn);
                }
            });
        }
    } else if (currentMode === 'yoon') {
        chartEl.classList.add('dakuon-grid'); 
        const allYoonRows = [...yoonRows, ...yoonDakuonRows];
        
        allYoonRows.forEach(row => {
            for (let v = 0; v < 3; v++) { 
                const hiraPair = row.hira[v]; 
                const kataPair = row.kata[v]; 
                
                if (hiraPair) {
                    const btn = document.createElement('button');
                    btn.className = 'kana-btn';
                    btn.textContent = `${hiraPair} ${kataPair}`;
                    btn.style.fontSize = '0.9rem';
                    
                    if (selectedElements.includes(hiraPair)) {
                        btn.classList.add('selected');
                    }

                    btn.addEventListener('click', () => {
                        handleDakuonSelection(hiraPair, kataPair, btn);
                    });
                    chartEl.appendChild(btn);
                }
            }
        });
    } else {
        chartEl.classList.remove('dakuon-grid');
        for (let v = 0; v < 5; v++) { 
            rows.forEach(row => {
                const char = currentMode === 'hiragana' ? row.hira[v] : row.kata[v];
                const btn = document.createElement('button');
                if (char) {
                    btn.className = 'kana-btn';
                    btn.textContent = char;
                    
                    if (selectedElements.includes(char)) btn.classList.add('selected');

                    btn.addEventListener('click', () => {
                        toggleSelection(char, btn);
                    });
                } else {
                    btn.className = 'kana-btn empty';
                }
                chartEl.appendChild(btn);
            });
        }
    }
}

function handleDakuonSelection(hira, kata, buttonEl) {
    if (buttonEl.classList.contains('selected')) {
        selectedElements = selectedElements.filter(item => item !== hira && item !== kata);
        buttonEl.classList.remove('selected');
    } else {
        selectedElements.push(hira, kata);
        buttonEl.classList.add('selected');
    }

    const lastState = { mode: currentMode, selectedItems: selectedElements, viewMode: workspaceViewMode };
    saveLastState(lastState);

    updateWorkspaceVisibility(); 
}

function toggleSelection(value, buttonEl) {
    const index = selectedElements.indexOf(value);
    if (index > -1) {
        selectedElements.splice(index, 1);
        buttonEl.classList.remove('selected');
    } else {
        selectedElements.push(value);
        buttonEl.classList.add('selected');
    }

    const lastState = { mode: currentMode, selectedItems: selectedElements, viewMode: workspaceViewMode };
    localStorage.setItem('last_practice_state', JSON.stringify(lastState));

    updateWorkspaceVisibility();
}

function initWordLists() {
    defaultWordListEl.innerHTML = '';
    defaultVocabulary.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'word-btn';
        btn.textContent = `${item.text} (${item.meaning})`;
        if (selectedElements.includes(item.text)) btn.classList.add('selected');
        
        btn.addEventListener('click', () => {
            toggleSelection(item.text, btn);
        });
        defaultWordListEl.appendChild(btn);
    });

    customWordListEl.innerHTML = '';
    const customVocabulary = JSON.parse(localStorage.getItem('custom_kana_words')) || [];
    
    if (customVocabulary.length === 0) {
        // 💡 警告メッセージの日本語化
        customWordListEl.innerHTML = '<p style="font-size:0.9rem; color:#94a3b8; margin:5px 0;">まだ追加された単語はありません</p>';
    } else {
        customVocabulary.forEach((item) => {
            const btn = document.createElement('button');
            btn.className = 'word-btn';
            btn.style.borderColor = '#2ecc71'; 
            btn.textContent = `${item.text} (${item.meaning})`;
            if (selectedElements.includes(item.text)) btn.classList.add('selected');

            btn.addEventListener('click', () => {
                toggleSelection(item.text, btn);
            });
            customWordListEl.appendChild(btn);
        });
    }
}

function handleAddCustomWord() {
    const text = newWordTextInput.value.trim();
    const meaning = newWordMeaningInput.value.trim();

    if (!text || !meaning) {
        // 💡 警告ダイアログの日本語化
        alert("単語と意味の両方を入力してください");
        return;
    }

    const customVocabulary = JSON.parse(localStorage.getItem('custom_kana_words')) || [];
    customVocabulary.push({ text, meaning });
    localStorage.setItem('custom_kana_words', JSON.stringify(customVocabulary));

    newWordTextInput.value = '';
    newWordMeaningInput.value = '';
    initWordLists();
}

addWordBtn.addEventListener('click', handleAddCustomWord);
newWordMeaningInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddCustomWord();
});

loadLastState();
