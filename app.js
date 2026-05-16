// 📱 讀書規劃 V3 – 完整 App Logic
// ------------------------------------------------------------
// Data (same schedule as before)
const DEFAULT_SCHEDULE = [
    { week: "W01", date: "05/04～05/10", finance: "Ch2、Ch5", tax: "", civics: "", chinese: "第一章" },
    { week: "W02", date: "05/11～05/17", finance: "Ch6、Ch7", tax: "", civics: "", chinese: "第二章（壹）" },
    { week: "W03", date: "05/18～05/24", finance: "Ch1", tax: "Chapter 1 租稅基本概念、\nChapter 2 租稅法意義與原則、附錄）", civics: "壹：1－2", chinese: "第二章（貳、參、肆）" },
    { week: "W04", date: "05/25～05/31", finance: "Ch3", tax: "Chapter 3 綜合所得稅（主文）", civics: "壹：3－4", chinese: "第二章（伍、陸、柒）" },
    { week: "W05", date: "06/01～06/07", finance: "Ch4", tax: "Chapter 3 綜合所得稅（主文）", civics: "壹：5－6", chinese: "第二章（柒、捌、玖）" },
    { week: "W06", date: "06/08～06/14", finance: "Ch8", tax: "Chapter 3 綜合所得稅（附錄）", civics: "壹：7－8", chinese: "第二章（拾、拾壹）" },
    { week: "W07", date: "06/15～06/21", finance: "Ch9", tax: "Chapter 4 營利事業所得稅（主文）", civics: "壹：9 貳：1", chinese: "第二章（拾貳、拾參）" },
    { week: "W08", date: "06/22～06/28", finance: "Ch10", tax: "Chapter 4 營所稅附錄、\nChapter 5 股利所得課稅新制", civics: "貳：2－3", chinese: "第二章（拾肆、拾伍、拾陸）" },
    { week: "W09", date: "06/29～07/05", finance: "Ch11", tax: "Chapter 6 所得稅的稽徵", civics: "貳：4－5", chinese: "第三章（壹、貳）" },
    { week: "W10", date: "07/06～07/12", finance: "Ch12", tax: "Chapter 7 租稅減免、\nChapter 8 所得基本稅額及附錄", civics: "貳：6 參：1", chinese: "第三章（參、肆）" },
    { week: "W11", date: "07/15～07/19", finance: "Ch13", tax: "Chapter 9 遺產及贈與稅（主文與附錄）", civics: "參：2－3", chinese: "第三章（伍、陸、柒）" },
    { week: "W12", date: "07/22～07/26", finance: "Ch14", tax: "Chapter 10 土地稅", civics: "參：4－5", chinese: "第三章（捌、玖）" },
    { week: "W13", date: "07/27～08/02", finance: "Ch15", tax: "Chapter 11 房屋稅、\nChapter 12 契稅", civics: "參：6－7", chinese: "第三章（拾、拾壹）" },
    { week: "W14", date: "08/03～08/09", finance: "", tax: "Chapter 13 營業稅（主文）", civics: "參：8－9", chinese: "第四章" },
    { week: "W15", date: "08/10～08/16", finance: "", tax: "Chapter 13 營業稅（附錄）", civics: "參：10－11", chinese: "第五章（壹至肆）" },
    { week: "W16", date: "08/17～08/23", finance: "", tax: "Chapter 14 關稅、\nChapter 15 貨物稅", civics: "肆：1－2", chinese: "第五章（伍至捌）" },
    { week: "W17", date: "08/24～08/30", finance: "", tax: "Chapter 16 菸酒稅、\nChapter 17 各稅及其他各稅", civics: "肆：3－4", chinese: "第五章（玖、拾）、第六章" },
    { week: "W18", date: "08/31～09/06", finance: "", tax: "Chapter 18 信託稅制", civics: "肆：5－6", chinese: "第六章" },
    { week: "W19", date: "09/07～09/13", finance: "", tax: "Chapter 19 稅捐稽徵法（主文）", civics: "肆：7－8", chinese: "第七章（壹至柒）" },
    { week: "W20", date: "09/14～09/20", finance: "", tax: "Chapter 19 稅捐稽徵法（附錄）", civics: "肆：8－9", chinese: "第八章、第九章" }
];

// ------------------------------------------------------------
// State (schedule, per‑subject completion, reflections)
let scheduleData = [];
let completionStatus = {}; // { "W01": { finance:true, tax:false, civics:false, chinese:true }, ... }
let reflections = {};
let activeTab = 'home';
let activeSubject = null; // when inside subject detail view
let activeNoteWeek = '';
let editingRowIndex = -1;
let currentWeekIdx = -1;

// ------------------------------------------------------------
// Init
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initEventListeners();
    // set current week index based on today
    currentWeekIdx = getCurrentWeekIndex();
    if (currentWeekIdx === -1) currentWeekIdx = 0; // fallback to first week
    // initial render
    renderAll();
});

// ------------------------------------------------------------
// Load / Save (with backward compatibility)
function loadState() {
    try {
        const savedSchedule = localStorage.getItem('studyPlan_schedule');
        scheduleData = savedSchedule ? JSON.parse(savedSchedule) : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        // Load completion – may be old format (boolean) or new object
        const savedComp = localStorage.getItem('studyPlan_completion');
        if (savedComp) {
            const raw = JSON.parse(savedComp);
            // Detect old format: any value is boolean
            const isOld = Object.values(raw).some(v => typeof v === 'boolean');
            if (isOld) {
                // Convert to new per‑subject format (all true/false depending on old value)
                completionStatus = {};
                for (const wk of scheduleData) {
                    const flag = raw[wk.week] === true;
                    completionStatus[wk.week] = { finance: flag, tax: flag, civics: flag, chinese: flag };
                }
            } else {
                completionStatus = raw;
            }
        } else {
            // initialise empty per‑subject object
            completionStatus = {};
            for (const wk of scheduleData) {
                completionStatus[wk.week] = { finance: false, tax: false, civics: false, chinese: false };
            }
        }
        const savedRefs = localStorage.getItem('studyPlan_reflections');
        reflections = savedRefs ? JSON.parse(savedRefs) : {};
    } catch (e) {
        console.error('loadState error', e);
        scheduleData = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        completionStatus = {};
        for (const wk of scheduleData) {
            completionStatus[wk.week] = { finance: false, tax: false, civics: false, chinese: false };
        }
        reflections = {};
    }
}

function saveState() {
    localStorage.setItem('studyPlan_schedule', JSON.stringify(scheduleData));
    localStorage.setItem('studyPlan_completion', JSON.stringify(completionStatus));
    localStorage.setItem('studyPlan_reflections', JSON.stringify(reflections));
}

// ------------------------------------------------------------
// UI Event Listeners
function initEventListeners() {
    // Tab bar switching
    document.querySelectorAll('.tab-item').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    // Weekly navigation buttons (home)
    document.getElementById('prevWeekBtn').addEventListener('click', () => changeWeek(-1));
    document.getElementById('nextWeekBtn').addEventListener('click', () => changeWeek(1));
    // Bottom sheet controls
    document.getElementById('editSheetOverlay').addEventListener('click', e => {
        if (e.target.id === 'editSheetOverlay') closeBottomSheet();
    });
    document.getElementById('closeSheet').addEventListener('click', saveEditFromSheet);
    document.getElementById('deleteWeekBtn').addEventListener('click', deleteCurrentWeek);
    // Auto‑save for notes
    ['noteGoal','noteHarvest','noteMessage'].forEach(id => {
        document.getElementById(id).addEventListener('input', debounce(saveActiveNote, 800));
    });
    // Back button on subject detail
    document.getElementById('backToSubjectsBtn').addEventListener('click', backToSubjectList);
}

// ------------------------------------------------------------
// Core Rendering
function renderAll() {
    // Header week pill reflects current week
    document.getElementById('currentWeekPill').textContent = scheduleData[currentWeekIdx].week;
    // Update page title (depends on active tab)
    const titles = { home: '總覽', schedule: '科目', notes: '筆記', settings: '設定' };
    document.getElementById('pageTitle').textContent = titles[activeTab];
    // Render each tab according to activeTab
    if (activeTab === 'home') renderHome();
    if (activeTab === 'schedule') renderSubjectList();
    if (activeTab === 'notes') { renderNotePicker(); renderActiveNote(); }
    // progress bars – always update
    updateOverallProgress();
    updateHeaderStatus();
}

// --------------------- Home (Weekly Overview) ---------------------
function renderHome() {
    const wk = scheduleData[currentWeekIdx];
    // week label
    document.getElementById('weekNavLabel').textContent = `${wk.week} (${wk.date})`;
    // subject cards
    const container = document.getElementById('weeklySubjectCards');
    const subjects = [
        { key: 'finance', label: '財政學', value: wk.finance },
        { key: 'tax', label: '稅務法規', value: wk.tax },
        { key: 'civics', label: '公民', value: wk.civics },
        { key: 'chinese', label: '國文', value: wk.chinese }
    ];
    container.innerHTML = subjects.map(s => {
        const checked = completionStatus[wk.week][s.key];
        const displayVal = s.value && s.value.trim() ? escapeHtml(s.value).replace(/\n/g, ' ') : '(無安排)';
        return `
            <div class="subject-card" data-key="${s.key}">
                <div class="subject-card-header">
                    <span class="subject-card-title">${s.label}</span>
                    <div class="subject-checkbox ${checked ? 'checked' : ''}" onclick="toggleSubject('${wk.week}','${s.key}')"></div>
                </div>
                <div class="subject-card-content">${displayVal}</div>
            </div>
        `;
    }).join('');
    // overall progress bar (percentage of all subject‑week combos completed)
    // (computed in updateOverallProgress())
}

function changeWeek(delta) {
    const newIdx = currentWeekIdx + delta;
    if (newIdx < 0 || newIdx >= scheduleData.length) return;
    currentWeekIdx = newIdx;
    renderAll();
}

function toggleSubject(week, subjectKey) {
    const status = completionStatus[week][subjectKey];
    completionStatus[week][subjectKey] = !status;
    saveState();
    // if we are on home (weekly view) re‑render that week's cards
    if (activeTab === 'home' && scheduleData[currentWeekIdx].week === week) renderHome();
    // also refresh subject list progress
    if (activeTab === 'schedule') renderSubjectList();
    updateOverallProgress();
}

// --------------------- Subject List (Main) ---------------------
function renderSubjectList() {
    // hide/show subject list vs detail
    const listContainer = document.getElementById('subjectListContainer');
    const detailContainer = document.getElementById('subjectDetailContainer');
    if (activeSubject) {
        listContainer.classList.add('hidden');
        detailContainer.classList.remove('hidden');
        renderSubjectDetail(activeSubject);
        return;
    }
    listContainer.classList.remove('hidden');
    detailContainer.classList.add('hidden');
    const subjects = ['finance','tax','civics','chinese'];
    const subjectNames = { finance:'財政學', tax:'稅務法規', civics:'公民', chinese:'國文' };
    const subjectColors = { finance:'var(--finance)', tax:'var(--tax)', civics:'var(--civics)', chinese:'var(--chinese)' };
    listContainer.innerHTML = subjects.map(key => {
        const total = scheduleData.filter(w=> w[key] && w[key].trim()).length;
        const done = scheduleData.filter(w=> completionStatus[w.week][key]).length;
        const ratio = total===0?0:done/total;
        return `
            <div class="subject-list-card" onclick="openSubjectDetail('${key}')">
                <div class="subject-list-header">
                    <span class="subject-list-title">${subjectNames[key]}</span>
                    <span class="subject-list-count">${done}/${total}</span>
                </div>
                <div class="subject-list-progress"><div class="progress-bar" style="width:${ratio*100}%"></div></div>
            </div>
        `;
    }).join('');
}

function openSubjectDetail(key) {
    activeSubject = key;
    renderAll();
}

function backToSubjectList() {
    activeSubject = null;
    renderAll();
}

function renderSubjectDetail(subjectKey) {
    const subjectNames = { finance:'財政學', tax:'稅務法規', civics:'公民', chinese:'國文' };
    document.getElementById('subjectDetailTitle').textContent = subjectNames[subjectKey];
    // progress bar for this subject
    const total = scheduleData.filter(w=> w[subjectKey] && w[subjectKey].trim()).length;
    const done = scheduleData.filter(w=> completionStatus[w.week][subjectKey]).length;
    const ratio = total===0?0:done/total;
    document.getElementById('subjectDetailBar').style.width = `${ratio*100}%`;
    document.getElementById('subjectDetailText').textContent = `${Math.round(ratio*100)}%`;
    // list of weeks that have this subject
    const list = document.getElementById('subjectWeekList');
    list.innerHTML = scheduleData.map((wk,i)=>{
        if (!wk[subjectKey] || !wk[subjectKey].trim()) return '';
        const checked = completionStatus[wk.week][subjectKey];
        return `
            <div class="week-item">
                <div class="week-info">
                    <span class="week-label">${wk.week}</span>
                    <span class="week-date">${wk.date}</span>
                    <div class="subject-card-content">${escapeHtml(wk[subjectKey]).replace(/\n/g, ' ')}</div>
                </div>
                <div class="subject-checkbox ${checked?'checked':''}" onclick="toggleSubject('${wk.week}','${subjectKey}')"></div>
            </div>
        `;
    }).join('');
}

// --------------------- Overall Progress ---------------------
function updateOverallProgress() {
    // total subject‑week combos (only where the subject has content)
    let total = 0, done = 0;
    for (const wk of scheduleData) {
        ['finance','tax','civics','chinese'].forEach(k=>{
            if (wk[k] && wk[k].trim()) {
                total++;
                if (completionStatus[wk.week][k]) done++;
            }
        });
    }
    const ratio = total===0?0:done/total;
    const bar = document.getElementById('overallProgressBar');
    if (bar) bar.style.width = `${ratio*100}%`;
    const txt = document.getElementById('overallProgressText');
    if (txt) txt.textContent = `${Math.round(ratio*100)}%`;
}

function updateHeaderStatus() {
    // show current week pill (already set in renderAll via currentWeekIdx)
    // could also highlight if today is inside week – already handled on load
}

// ------------------------------------------------------------
// Bottom Sheet (Edit week – unchanged from previous version)
function openBottomSheet(index) {
    editingRowIndex = index;
    const row = scheduleData[index];
    document.getElementById('sheetTitle').textContent = `編輯 ${row.week}`;
    document.getElementById('editDate').value = row.date;
    document.getElementById('editFinance').value = row.finance;
    document.getElementById('editTax').value = row.tax;
    document.getElementById('editCivics').value = row.civics;
    document.getElementById('editChinese').value = row.chinese;
    document.getElementById('editSheetOverlay').classList.add('active');
}

function closeBottomSheet() {
    document.getElementById('editSheetOverlay').classList.remove('active');
    editingRowIndex = -1;
}

function saveEditFromSheet() {
    if (editingRowIndex < 0) return;
    const row = scheduleData[editingRowIndex];
    row.date = document.getElementById('editDate').value;
    row.finance = document.getElementById('editFinance').value;
    row.tax = document.getElementById('editTax').value;
    row.civics = document.getElementById('editCivics').value;
    row.chinese = document.getElementById('editChinese').value;
    saveState();
    renderAll();
    closeBottomSheet();
    showToast('已更新排程');
}

function deleteCurrentWeek() {
    if (editingRowIndex < 0) return;
    if (!confirm('確定要刪除這一週的排程嗎？')) return;
    const wk = scheduleData[editingRowIndex].week;
    scheduleData.splice(editingRowIndex,1);
    delete completionStatus[wk];
    delete reflections[wk];
    // re‑index currentWeekIdx if needed
    if (currentWeekIdx >= scheduleData.length) currentWeekIdx = scheduleData.length-1;
    saveState();
    renderAll();
    closeBottomSheet();
    showToast('已刪除週次');
}

// ------------------------------------------------------------
// Adding / Resetting / Import‑Export (same as previous version)
function openAddWeek() {
    const last = scheduleData[scheduleData.length-1];
    const lastNum = last ? parseInt(last.week.replace('W','')) : 0;
    const nextWeek = 'W' + String(lastNum+1).padStart(2,'0');
    scheduleData.push({ week:nextWeek, date:'', finance:'', tax:'', civics:'', chinese:'' });
    // init completion for the new week
    completionStatus[nextWeek] = { finance:false, tax:false, civics:false, chinese:false };
    saveState();
    renderAll();
    showToast(`已新增 ${nextWeek}`);
    // automatically switch to schedule tab so user can edit
    switchTab('schedule');
}

function confirmReset() {
    if (confirm('確定要重置所有資料嗎？此操作無法復原。')) {
        localStorage.clear();
        loadState();
        currentWeekIdx = getCurrentWeekIndex();
        if (currentWeekIdx===-1) currentWeekIdx = 0;
        renderAll();
        showToast('資料已重置');
    }
}

function exportData() {
    const data = { scheduleData, completionStatus, reflections };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`讀書規劃備份_${new Date().toISOString().slice(0,10)}.json`; a.click();
    showToast('備份已產生');
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = JSON.parse(ev.target.result);
            if (data.scheduleData) scheduleData = data.scheduleData;
            if (data.completionStatus) completionStatus = data.completionStatus;
            if (data.reflections) reflections = data.reflections;
            saveState();
            renderAll();
            showToast('匯入成功');
        } catch(err) {
            console.error(err);
            showToast('匯入失敗，格式錯�誤');
        }
    };
    reader.readAsText(file);
}

// ------------------------------------------------------------
// Note Tab (unchanged – still per week)
function renderNotePicker() {
    const container = document.getElementById('weekPickerScroll');
    container.innerHTML = scheduleData.map(w=>`<div class="week-pill ${activeNoteWeek===w.week?'active':''}" onclick="switchNoteWeek('${w.week}')">${w.week}</div>`).join('');
    const act = container.querySelector('.active');
    if (act) act.scrollIntoView({behavior:'smooth',inline:'center'});
}

function switchNoteWeek(week) {
    activeNoteWeek = week;
    renderNotePicker();
    renderActiveNote();
}

function renderActiveNote() {
    const data = reflections[activeNoteWeek]||{};
    document.getElementById('noteGoal').value = data.goal||'';
    document.getElementById('noteHarvest').value = data.harvest||'';
    document.getElementById('noteMessage').value = data.message||'';
}

function saveActiveNote() {
    reflections[activeNoteWeek] = {
        goal: document.getElementById('noteGoal').value,
        harvest: document.getElementById('noteHarvest').value,
        message: document.getElementById('noteMessage').value
    };
    saveState();
    showAutoSaveIndicator();
}

function showAutoSaveIndicator(){
    const el=document.getElementById('saveIndicator');
    el.classList.add('show');
    setTimeout(()=>el.classList.remove('show'),1500);
}

// ------------------------------------------------------------
// Tab Switching helper
function switchTab(tabId) {
    activeTab = tabId;
    // header title
    const titles={home:'總覽',schedule:'科目',notes:'筆記',settings:'設定'};
    document.getElementById('pageTitle').textContent = titles[tabId];
    // activate page sections
    document.querySelectorAll('.tab-page').forEach(p=>p.classList.toggle('active', p.id===`tab-${tabId}`));
    // activate tab button style
    document.querySelectorAll('.tab-item').forEach(b=>b.classList.toggle('active', b.dataset.tab===tabId));
    // when leaving subject detail, reset activeSubject
    if (tabId !== 'schedule') activeSubject = null;
    renderAll();
}

// ------------------------------------------------------------
// Utility helpers
function getCurrentWeekIndex(){
    const now = new Date();
    const year = now.getFullYear();
    for(let i=0;i<scheduleData.length;i++){
        const m = scheduleData[i].date.match(/(\d{2})\/(\d{2})～(\d{2})\/(\d{2})/);
        if(!m) continue;
        const start = new Date(year, parseInt(m[1])-1, parseInt(m[2]));
        const end = new Date(year, parseInt(m[3])-1, parseInt(m[4]),23,59,59);
        if(now>=start && now<=end) return i;
    }
    return -1;
}

function escapeHtml(str){
    if(!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function debounce(fn, wait){
    let t;
    return function(){
        const args = arguments, ctx=this;
        clearTimeout(t);
        t = setTimeout(()=>fn.apply(ctx,args), wait);
    };
}

function showToast(msg){
    const el=document.getElementById('toast');
    el.textContent=msg;
    el.classList.add('show');
    setTimeout(()=>el.classList.remove('show'),2500);
}

// ------------------------------------------------------------
// Expose functions to global scope (for inline onclick handlers)
window.toggleSubject = toggleSubject;
window.openBottomSheet = openBottomSheet;
window.openAddWeek = openAddWeek;
window.confirmReset = confirmReset;
window.exportData = exportData;
window.importData = importData;
window.handleImport = handleImport;
window.switchTab = switchTab;
window.switchNoteWeek = switchNoteWeek;
window.openSubjectDetail = openSubjectDetail;
window.backToSubjectList = backToSubjectList;
// ------------------------------------------------------------
