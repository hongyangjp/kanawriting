// ui-core.js
let currentMode = 'hiragana';
let selectedElements = []; 
let workspaceViewMode = 'trace'; 

// 各種DOM要素の取得
const chartEl = document.getElementById('chart');
const wordListSection = document.getElementById('wordListSection');
const defaultWordListEl = document.getElementById('defaultWordList');
const customWordListEl = document.getElementById('customWordList');
const practiceArea = document.getElementById('practiceArea');
const practiceLabel = document.getElementById('practiceLabel');
const canvasWorkspace = document.getElementById('canvasWorkspace');

const tabHiragana = document.getElementById('tabHiragana');
const tabKatakana = document.getElementById('tabKatakana');
const tabDakuon = document.getElementById('tabDakuon');
const tabYoon = document.getElementById('tabYoon'); 
const tabWords = document.getElementById('tabWords');
const clearBtn = document.getElementById('clearBtn');
const printActionBtn = document.getElementById('printActionBtn');

const viewTraceBtn = document.getElementById('viewTraceBtn');
const viewPrintBtn = document.getElementById('viewPrintBtn');

const newWordTextInput = document.getElementById('newWordText');
const newWordMeaningInput = document.getElementById('newWordMeaning');
const addWordBtn = document.getElementById('addWordBtn');

// スマホメニュー用DOMの取得
const selectionContainer = document.getElementById('selectionContainer');
const mobileOpenMenuBtn = document.getElementById('mobileOpenMenuBtn');
const mobileCloseMenuBtn = document.getElementById('mobileCloseMenuBtn');

// 練習ボードのタイトルテキストの日本語化
function updateWorkspaceVisibility() {
    if (selectedElements.length > 0) {
        if (workspaceViewMode === 'trace') {
            practiceLabel.textContent = `📱 画面なぞり書きボード (${selectedElements.length}文字選択中)`;
            clearBtn.classList.remove('hidden');
            printActionBtn.classList.add('hidden');
        } else {
            practiceLabel.textContent = `🖨️ PDF習字帖印刷プレビュー (A4満版10マス)`;
            clearBtn.classList.add('hidden');
            printActionBtn.classList.remove('hidden');
        }
        generateWorkspace(selectedElements, practiceLabel.textContent);
    } else {
        practiceArea.classList.remove('active');
    }
}

function saveLastState(stateObj) {
    localStorage.setItem('last_practice_state', JSON.stringify(stateObj));
}

function loadLastState() {
    const savedState = localStorage.getItem('last_practice_state');
    if (!savedState) {
        switchMode('hiragana', tabHiragana);
        return;
    }

    const state = JSON.parse(savedState);
    currentMode = state.mode;
    selectedElements = state.selectedItems || [];
    workspaceViewMode = state.viewMode || 'trace';

    viewTraceBtn.classList.remove('active');
    viewPrintBtn.classList.remove('active');
    if (workspaceViewMode === 'trace') viewTraceBtn.classList.add('active');
    else viewPrintBtn.classList.add('active');

    [tabHiragana, tabKatakana, tabDakuon, tabYoon, tabWords].forEach(btn => btn.classList.remove('active'));
    if (currentMode === 'hiragana') tabHiragana.classList.add('active');
    else if (currentMode === 'katakana') tabKatakana.classList.add('active');
    else if (currentMode === 'dakuon') tabDakuon.classList.add('active');
    else if (currentMode === 'yoon') tabYoon.classList.add('active'); 
    else if (currentMode === 'words') tabWords.classList.add('active');

    if (currentMode === 'words') {
        chartEl.classList.add('hidden');
        wordListSection.classList.remove('hidden');
        initWordLists(); 
    } else {
        wordListSection.classList.add('hidden');
        chartEl.classList.remove('hidden');
        initChart(); 
    }

    updateWorkspaceVisibility();
}

function switchMode(mode, targetBtn) {
    currentMode = mode;
    selectedElements = []; 
    [tabHiragana, tabKatakana, tabDakuon, tabYoon, tabWords].forEach(btn => btn.classList.remove('active'));
    targetBtn.classList.add('active');
    practiceArea.classList.remove('active');

    const currentState = { mode: currentMode, selectedItems: [], viewMode: workspaceViewMode };
    saveLastState(currentState);

    if (mode === 'words') {
        chartEl.classList.add('hidden');
        wordListSection.classList.remove('hidden');
        initWordLists(); 
    } else {
        wordListSection.classList.add('hidden');
        chartEl.classList.remove('hidden');
        initChart();
    }
}

function handleToggleViewMode(mode) {
    workspaceViewMode = mode;
    selectedElements = []; 
    
    viewTraceBtn.classList.remove('active');
    viewPrintBtn.classList.remove('active');
    
    if (mode === 'trace') viewTraceBtn.classList.add('active');
    else viewPrintBtn.classList.add('active');

    const lastState = { mode: currentMode, selectedItems: selectedElements, viewMode: workspaceViewMode };
    saveLastState(lastState);
    
    if (currentMode === 'words') initWordLists(); else initChart();
    
    updateWorkspaceVisibility();
}

// 💡 スマホ用：メニュー開閉時のCSSクラス操作を強制適用
mobileOpenMenuBtn.addEventListener('click', () => {
    selectionContainer.classList.add('mobile-show-drawer'); 
});

mobileCloseMenuBtn.addEventListener('click', () => {
    selectionContainer.classList.remove('mobile-show-drawer'); 
});

tabHiragana.addEventListener('click', (e) => switchMode('hiragana', e.target));
tabKatakana.addEventListener('click', (e) => switchMode('katakana', e.target));
tabDakuon.addEventListener('click', (e) => switchMode('dakuon', e.target));
tabYoon.addEventListener('click', (e) => switchMode('yoon', e.target)); 
tabWords.addEventListener('click', (e) => switchMode('words', e.target));

viewTraceBtn.addEventListener('click', () => handleToggleViewMode('trace'));
viewPrintBtn.addEventListener('click', () => handleToggleViewMode('print'));

printActionBtn.addEventListener('click', () => {
    window.print();
});
