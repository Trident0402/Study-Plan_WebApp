// ===== Schedule Data =====
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
    { week: "W20", date: "09/14～09/20", finance: "", tax: "Chapter 19 稅捐稽徵法（附錄）", civics: "肆：8－9", chinese: "第八章、第九章" },
];

// ===== State Management =====
let scheduleData = [];
let completionStatus = {};
let reflections = {};
let editingRowIndex = -1;

function loadState() {
    try {
        const saved = localStorage.getItem('studyPlan_schedule');
        scheduleData = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        
        const savedCompletion = localStorage.getItem('studyPlan_completion');
        completionStatus = savedCompletion ? JSON.parse(savedCompletion) : {};
        
        const savedReflections = localStorage.getItem('studyPlan_reflections');
        reflections = savedReflections ? JSON.parse(savedReflections) : {};
    } catch (e) {
        scheduleData = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        completionStatus = {};
        reflections = {};
    }
}

function saveState() {
    localStorage.setItem('studyPlan_schedule', JSON.stringify(scheduleData));
    localStorage.setItem('studyPlan_completion', JSON.stringify(completionStatus));
    localStorage.setItem('studyPlan_reflections', JSON.stringify(reflections));
}

// ===== Particles =====
function createParticles() {
    const container = document.getElementById('particles');
    const icons = ['🌿', '📖', '✨', '🌱', '📚', '💫', '🍀', '⭐'];
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.textContent = icons[Math.floor(Math.random() * icons.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (15 + Math.random() * 20) + 's';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
        container.appendChild(p);
    }
}

// ===== Current Week Detection =====
function getCurrentWeekIndex() {
    const now = new Date();
    const year = now.getFullYear();
    for (let i = 0; i < scheduleData.length; i++) {
        const dateStr = scheduleData[i].date;
        const match = dateStr.match(/(\d{2})\/(\d{2})～(\d{2})\/(\d{2})/);
        if (!match) continue;
        const startMonth = parseInt(match[1]) - 1;
        const startDay = parseInt(match[2]);
        const endMonth = parseInt(match[3]) - 1;
        const endDay = parseInt(match[4]);
        const start = new Date(year, startMonth, startDay);
        const end = new Date(year, endMonth, endDay, 23, 59, 59);
        if (now >= start && now <= end) return i;
    }
    return -1;
}

function updateCurrentWeekBanner() {
    const idx = getCurrentWeekIndex();
    const el = document.getElementById('currentWeekText');
    if (idx >= 0) {
        const w = scheduleData[idx];
        el.textContent = `目前是 ${w.week}（${w.date}）— 加油！`;
    } else {
        el.textContent = '目前不在排程期間內，提前準備更好！';
    }
}

// ===== Render Table =====
function renderTable() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';
    const currentIdx = getCurrentWeekIndex();

    scheduleData.forEach((row, i) => {
        const tr = document.createElement('tr');
        const isCompleted = completionStatus[row.week] === true;
        if (i === currentIdx) tr.classList.add('current-week-row');
        if (isCompleted) tr.classList.add('completed-row');

        tr.innerHTML = `
            <td class="td-week">${row.week}</td>
            <td class="td-date">${row.date}</td>
            <td class="td-finance">${escapeHtml(row.finance || '')}<button class="edit-btn" onclick="openEditRow(${i}, event)" title="編輯">✏️</button></td>
            <td class="td-tax">${escapeHtml(row.tax || '').replace(/\n/g, '<br>')}</td>
            <td class="td-civics">${escapeHtml(row.civics || '')}</td>
            <td class="td-chinese">${escapeHtml(row.chinese || '')}</td>
            <td>
                <div class="check-wrapper">
                    <input type="checkbox" class="check-input" id="chk-${i}" 
                        ${isCompleted ? 'checked' : ''} onchange="toggleCompletion(${i})">
                    <label class="check-label" for="chk-${i}">✓</label>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Completion =====
function toggleCompletion(index) {
    const week = scheduleData[index].week;
    completionStatus[week] = !completionStatus[week];
    saveState();
    renderTable();
    updateProgress();
    showToast(completionStatus[week] ? `${week} 完成！🎉` : `${week} 取消完成`);
}

// ===== Progress Rings =====
function updateProgress() {
    const total = scheduleData.length;
    const completed = scheduleData.filter(r => completionStatus[r.week]).length;
    setRing('overallRingFill', 'overallPercent', completed / total);

    // Subject-specific: count rows with content
    const subjects = [
        { key: 'finance', ringId: 'financeRingFill', textId: 'financePercent' },
        { key: 'tax', ringId: 'taxRingFill', textId: 'taxPercent' },
        { key: 'civics', ringId: 'civicsRingFill', textId: 'civicsPercent' },
        { key: 'chinese', ringId: 'chineseRingFill', textId: 'chinesePercent' },
    ];
    subjects.forEach(sub => {
        const rows = scheduleData.filter(r => r[sub.key] && r[sub.key].trim());
        const done = rows.filter(r => completionStatus[r.week]).length;
        const ratio = rows.length > 0 ? done / rows.length : 0;
        setRing(sub.ringId, sub.textId, ratio);
    });
}

function setRing(ringId, textId, ratio) {
    const circumference = 2 * Math.PI * 42; // ~264
    const offset = circumference * (1 - ratio);
    const el = document.getElementById(ringId);
    const txt = document.getElementById(textId);
    if (el) el.style.strokeDashoffset = offset;
    if (txt) txt.textContent = Math.round(ratio * 100) + '%';
}

// ===== Reflections =====
function populateReflectionSelect() {
    const sel = document.getElementById('reflectionWeekSelect');
    sel.innerHTML = '';
    const currentIdx = getCurrentWeekIndex();
    scheduleData.forEach((row, i) => {
        const opt = document.createElement('option');
        opt.value = row.week;
        opt.textContent = `${row.week}（${row.date}）`;
        if (i === currentIdx) opt.selected = true;
        sel.appendChild(opt);
    });
    sel.addEventListener('change', loadReflection);
    loadReflection();
}

function loadReflection() {
    const week = document.getElementById('reflectionWeekSelect').value;
    const data = reflections[week] || {};
    document.getElementById('weeklyGoal').value = data.goal || '';
    document.getElementById('weeklyHarvest').value = data.harvest || '';
    document.getElementById('selfMessage').value = data.message || '';
}

function saveReflection() {
    const week = document.getElementById('reflectionWeekSelect').value;
    reflections[week] = {
        goal: document.getElementById('weeklyGoal').value,
        harvest: document.getElementById('weeklyHarvest').value,
        message: document.getElementById('selfMessage').value,
    };
    saveState();
    showToast(`${week} 的紀錄已儲存！✨`);
}

// ===== Edit Row =====
function openEditRow(index, event) {
    event.stopPropagation();
    editingRowIndex = index;
    const row = scheduleData[index];
    document.getElementById('editRowTitle').textContent = `✏️ 編輯 ${row.week}`;
    document.getElementById('editRowBody').innerHTML = `
        <div class="modal-field">
            <label>日期</label>
            <input id="editDate" value="${row.date}">
        </div>
        <div class="modal-field">
            <label>財政學</label>
            <input id="editFinance" value="${row.finance || ''}">
        </div>
        <div class="modal-field">
            <label>稅務法規</label>
            <textarea id="editTax" rows="3">${row.tax || ''}</textarea>
        </div>
        <div class="modal-field">
            <label>公民</label>
            <input id="editCivics" value="${row.civics || ''}">
        </div>
        <div class="modal-field">
            <label>國文</label>
            <input id="editChinese" value="${row.chinese || ''}">
        </div>
    `;
    document.getElementById('editRowModal').classList.add('active');
}

function closeEditRow() {
    document.getElementById('editRowModal').classList.remove('active');
    editingRowIndex = -1;
}

function saveEditRow() {
    if (editingRowIndex < 0) return;
    scheduleData[editingRowIndex].date = document.getElementById('editDate').value;
    scheduleData[editingRowIndex].finance = document.getElementById('editFinance').value;
    scheduleData[editingRowIndex].tax = document.getElementById('editTax').value;
    scheduleData[editingRowIndex].civics = document.getElementById('editCivics').value;
    scheduleData[editingRowIndex].chinese = document.getElementById('editChinese').value;
    saveState();
    renderTable();
    closeEditRow();
    showToast('已更新！📝');
}

// ===== Settings =====
function openSettings() {
    const body = document.getElementById('settingsBody');
    body.innerHTML = `
        <p style="margin-bottom:16px;color:var(--color-text-light);font-size:0.88rem;">
            你可以新增或刪除週次行。修改各週內容請直接在表格中點擊 ✏️ 編輯。
        </p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn-confirm" onclick="addWeekRow()" style="font-size:0.85rem;">
                ➕ 新增一週
            </button>
            <button class="btn-cancel" onclick="removeLastWeek()" style="font-size:0.85rem;color:#c44;">
                ➖ 刪除最後一週
            </button>
        </div>
        <div style="margin-top:16px;font-size:0.85rem;color:var(--color-text-light);">
            目前共 <strong>${scheduleData.length}</strong> 週
        </div>
    `;
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

function saveSettings() {
    closeSettings();
}

function addWeekRow() {
    const nextNum = scheduleData.length + 1;
    const weekLabel = 'W' + String(nextNum).padStart(2, '0');
    scheduleData.push({ week: weekLabel, date: '', finance: '', tax: '', civics: '', chinese: '' });
    saveState();
    renderTable();
    updateProgress();
    populateReflectionSelect();
    openSettings(); // refresh modal
    showToast(`已新增 ${weekLabel}`);
}

function removeLastWeek() {
    if (scheduleData.length <= 1) return;
    const removed = scheduleData.pop();
    delete completionStatus[removed.week];
    delete reflections[removed.week];
    saveState();
    renderTable();
    updateProgress();
    populateReflectionSelect();
    openSettings();
    showToast(`已刪除 ${removed.week}`);
}

// ===== Export / Import =====
function exportData() {
    const data = { scheduleData, completionStatus, reflections };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `讀書規劃_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已匯出資料！📤');
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.scheduleData) scheduleData = data.scheduleData;
            if (data.completionStatus) completionStatus = data.completionStatus;
            if (data.reflections) reflections = data.reflections;
            saveState();
            renderTable();
            updateProgress();
            populateReflectionSelect();
            showToast('已匯入資料！📥');
        } catch (err) {
            showToast('匯入失敗，檔案格式不正確 ❌');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetData() {
    if (!confirm('確定要重置所有資料嗎？這會清除所有進度和紀錄。')) return;
    scheduleData = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
    completionStatus = {};
    reflections = {};
    saveState();
    renderTable();
    updateProgress();
    populateReflectionSelect();
    showToast('已重置為預設資料 🔄');
}

// ===== Toast =====
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    createParticles();
    renderTable();
    updateProgress();
    updateCurrentWeekBanner();
    populateReflectionSelect();
});
