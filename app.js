// 📱 讀書規劃 V3 – 完整 App Logic
const APP_VERSION = 'v1.00.12';

// ------------------------------------------------------------
// Data (same schedule as before)
const DEFAULT_SCHEDULE = [
    { week: "W01", date: "05/04～05/10", finance: "Ch2、ch5", tax: "", civics: "", chinese: "第一章" },
    { week: "W02", date: "05/11～05/17", finance: "Ch6、Ch7", tax: "", civics: "", chinese: "第二章(壹)" },
    { week: "W03", date: "05/18～05/24", finance: "ch1", tax: "Chapter 1 租稅基本概念", civics: "壹：1 - 2", chinese: "114初考、115初考" },
    { week: "W04", date: "05/25～05/31", finance: "ch3", tax: "Chapter 2 租稅法意義與原則、附錄(2~37)", civics: "壹：3 - 4", chinese: "113初考、112初考" },
    { week: "W05", date: "06/01～06/07", finance: "Ch4", tax: "Chapter 3 綜合所得稅(38~63)", civics: "壹：5 - 6", chinese: "114司法特考五等" },
    { week: "W06", date: "06/08～06/14", finance: "Ch8", tax: "Chapter 3 綜合所得稅(63~116)", civics: "壹：7 - 8", chinese: "113司法特考五等" },
    { week: "W07", date: "06/15～06/21", finance: "Ch9", tax: "Chapter 3 綜合所得稅(117~198)", civics: "壹：9 貳：1", chinese: "112司法特考五等" },
    { week: "W08", date: "06/22～06/28", finance: "Ch10", tax: "Chapter 4 營利事業所得稅(207~256)", civics: "貳：2 - 3", chinese: "112地方特考五等" },
    { week: "W09", date: "06/29～07/05", finance: "Ch11", tax: "Chapter 4 營利事業所得稅(257~306)", civics: "貳：4 - 5", chinese: "112鐵路特考佐級" },
    { week: "W10", date: "07/06～07/12", finance: "Ch12", tax: "Chapter 4 營利事業所得稅(307~326)\nChapter 5 股利所得課稅新制(327~338)\nChapter 6 所得稅的稽徵(339~356)", civics: "貳：6 參：1", chinese: "115身心障礙特考五等" },
    { week: "W11", date: "07/15～07/19", finance: "Ch13", tax: "Chapter 6 所得稅的稽徵(357~384)\nChapter 7 租稅減免(385~406)", civics: "參：2 - 3", chinese: "114身心障礙特考五等" },
    { week: "W12", date: "07/22～07/26", finance: "Ch14", tax: "Chapter 8 所得基本稅額及附錄(407~452)", civics: "參：4 - 5", chinese: "113身心障礙特考五等" },
    { week: "W13", date: "07/27～08/02", finance: "Ch15", tax: "Chapter 9 遺產及贈與稅(455~495)", civics: "參：6 - 7", chinese: "112身心障礙特考五等" },
    { week: "W14", date: "08/03～08/09", finance: "", tax: "Chapter 9 遺產及贈與稅(496~522)\nChapter 10 土地稅(523~537)", civics: "參：8 - 9", chinese: "114原住民族五等" },
    { week: "W15", date: "08/10～08/16", finance: "", tax: "Chapter 10 土地稅(538~588)", civics: "參：10 - 11", chinese: "113原住民族五等" },
    { week: "W16", date: "08/17～08/23", finance: "", tax: "Chapter 11 房屋稅(589~608)\nChapter 12 契稅(609~616)\nChapter 13 營業稅(618~648)", civics: "肆：1 - 2", chinese: "112原住民族五等" },
    { week: "W17", date: "08/24～08/30", finance: "", tax: "Chapter 13 營業稅(649~689)", civics: "肆：3 - 4", chinese: "111 初考(AI改編)" },
    { week: "W18", date: "08/31～09/06", finance: "", tax: "Chapter 13 營業稅(690~734)", civics: "肆：5 - 6", chinese: "111地方特考五等(AI改編)" },
    { week: "W19", date: "09/07～09/13", finance: "", tax: "Chapter 14 關稅(735~746)\nChapter 15 貨物稅(747~760)", civics: "肆：7 - 8", chinese: "111司法特考五等(AI改編)" },
    { week: "W20", date: "09/14～09/20", finance: "", tax: "Chapter 17 奢侈稅及其他各稅(769~793)\nChapter 18 信託稅制(794~813)", civics: "肆：8 - 9", chinese: "111身心障礙特考五等(AI改編)" },
    { week: "W21", date: "09/21～09/27", finance: "", tax: "Chapter 19 稅捐稽徵法(814~859)", civics: "", chinese: "" },
    { week: "W22", date: "09/28～10/04", finance: "", tax: "Chapter 19 稅捐稽徵法(859~904)", civics: "", chinese: "" }
];

// ------------------------------------------------------------
// State (schedule, per‑subject completion, reflections)
let scheduleData = [];
let completionStatus = {}; // { "W01": { finance:true, tax:false, civics:false, chinese:true }, ... }
let activeTab = 'home';
let activeSubject = null; // when inside subject detail view
let activeScheduleSubTab = 'weekly'; // 'weekly' or 'subjects'
let activeExamsSubTab = 'all'; // 'all' or 'subjects'
let activeExamsSubject = null; // when inside exam subject detail view
let targetWeeksSetting = null; // target weeks for progress calculation
let currentWeekIdx = -1;

let subjectsData = [];
const DEFAULT_SUBJECTS = [
    { id: 'finance', name: '財政學', color: '#ebdcd0' },
    { id: 'tax', name: '稅務法規', color: '#c3d6cb' },
    { id: 'civics', name: '公民', color: '#bcd0df' },
    { id: 'chinese', name: '國文', color: '#e0cad3' }
];

let examsData = [];
const EXAM_TARGETS = {
    chinese: 90,
    finance: 85,
    tax: 85,
    civics: 80
};
let editingExamId = null;

// ------------------------------------------------------------
// Init
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    const versionEl = document.getElementById('appVersionDisplay');
    if (versionEl) versionEl.textContent = APP_VERSION;
    initEventListeners();
    initExamYearSelect(); // Populate year select dynamically from 116 to 80
    // set current week index based on today
    currentWeekIdx = getCurrentWeekIndex();
    if (currentWeekIdx === -1) currentWeekIdx = 0; // fallback to first week

    const twInput = document.getElementById('targetWeeksInput');
    if (twInput) twInput.value = targetWeeksSetting || scheduleData.length;

    // initial render
    renderAll();
});

function initExamYearSelect() {
    const yearEl = document.getElementById('examYear');
    if (!yearEl) return;
    let html = '<option value="">無年份</option>';
    for (let y = 116; y >= 80; y--) {
        html += `<option value="${y}年">${y}年</option>`;
    }
    yearEl.innerHTML = html;
}

// ------------------------------------------------------------
// Load / Save (with backward compatibility)
function loadState() {
    try {
        const savedSubjects = localStorage.getItem('studyPlan_subjects');
        subjectsData = savedSubjects ? JSON.parse(savedSubjects) : JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));

        const savedSchedule = localStorage.getItem('studyPlan_schedule');
        scheduleData = savedSchedule ? JSON.parse(savedSchedule) : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));

        const savedExams = localStorage.getItem('studyPlan_exams');
        examsData = savedExams ? JSON.parse(savedExams) : [];

        // Load completion – may be old format (boolean) or new object
        const savedComp = localStorage.getItem('studyPlan_completion');
        if (savedComp) {
            const raw = JSON.parse(savedComp);
            // Detect old format: any value is boolean
            const isOld = Object.values(raw).some(v => typeof v === 'boolean');
            if (isOld) {
                // Convert to new per‑subject format
                completionStatus = {};
                for (const wk of scheduleData) {
                    const flag = raw[wk.week] === true;
                    completionStatus[wk.week] = {};
                    subjectsData.forEach(sub => {
                        completionStatus[wk.week][sub.id] = flag;
                    });
                }
            } else {
                completionStatus = raw;
            }
        } else {
            // initialise empty per‑subject object
            completionStatus = {};
        }
        
        targetWeeksSetting = parseInt(localStorage.getItem('studyPlan_targetWeeks')) || null;
        if (targetWeeksSetting && targetWeeksSetting > scheduleData.length) {
            targetWeeksSetting = scheduleData.length;
            localStorage.setItem('studyPlan_targetWeeks', targetWeeksSetting);
        }

        // Harmonize dynamic structures
        for (const wk of scheduleData) {
            if (!completionStatus[wk.week]) {
                completionStatus[wk.week] = {};
            }
            subjectsData.forEach(sub => {
                if (completionStatus[wk.week][sub.id] === undefined) {
                    completionStatus[wk.week][sub.id] = false;
                }
            });
        }

    } catch (e) {
        console.error('loadState error', e);
        subjectsData = JSON.parse(JSON.stringify(DEFAULT_SUBJECTS));
        scheduleData = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        completionStatus = {};
        for (const wk of scheduleData) {
            completionStatus[wk.week] = {};
            subjectsData.forEach(sub => {
                completionStatus[wk.week][sub.id] = false;
            });
        }
        examsData = [];
    }
}

function saveState() {
    localStorage.setItem('studyPlan_subjects', JSON.stringify(subjectsData));
    localStorage.setItem('studyPlan_schedule', JSON.stringify(scheduleData));
    localStorage.setItem('studyPlan_completion', JSON.stringify(completionStatus));
    localStorage.setItem('studyPlan_exams', JSON.stringify(examsData));
}

// ------------------------------------------------------------
// UI Event Listeners
function initEventListeners() {
    // Tab bar switching
    document.querySelectorAll('.tab-item').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    // Full schedule is now rendered inline, no buttons needed


    // Weekly navigation buttons (home)
    document.getElementById('prevWeekBtn').addEventListener('click', () => changeWeek(-1));
    document.getElementById('nextWeekBtn').addEventListener('click', () => changeWeek(1));
    // Bottom sheet controls
    document.getElementById('editSheetOverlay').addEventListener('click', e => {
        if (e.target.id === 'editSheetOverlay') closeBottomSheet();
    });
    document.getElementById('subjectSheetOverlay').addEventListener('click', e => {
        if (e.target.id === 'subjectSheetOverlay') closeSubjectSheet();
    });
    document.getElementById('examSheetOverlay').addEventListener('click', e => {
        if (e.target.id === 'examSheetOverlay') closeExamSheet();
    });
    document.getElementById('closeSheet').addEventListener('click', saveEditFromSheet);
    document.getElementById('deleteWeekBtn').addEventListener('click', deleteCurrentWeek);
    document.getElementById('addSubjectConfirmBtn').addEventListener('click', addNewSubject);
    // Back button on subject detail
    document.getElementById('backToSubjectsBtn').addEventListener('click', backToSubjectList);
}

// ------------------------------------------------------------
// Core Rendering
function renderAll() {
    // Header week pill reflects current week
    document.getElementById('currentWeekPill').textContent = scheduleData[currentWeekIdx].week;
    // Update page title (depends on active tab)
    const titles = { home: '總覽', schedule: '科目', exams: '成績', settings: '設定' };
    document.getElementById('pageTitle').textContent = titles[activeTab];
    // Render each tab according to activeTab
    if (activeTab === 'schedule') {
        renderScheduleTab();
    } else if (activeTab === 'exams') {
        renderExamsTab();
    }
    // progress bars and full schedule – always update
    updateOverallProgress();
    renderGlobalProgress();
    renderFullSchedule();
    updateHeaderStatus();
}

// --------------------- Schedule Tab (Sub-tab management) ---------------------
function renderScheduleTab() {
    // Show/hide sub-tab content
    document.getElementById('scheduleWeekly').classList.toggle('active', activeScheduleSubTab === 'weekly');
    document.getElementById('scheduleSubjects').classList.toggle('active', activeScheduleSubTab === 'subjects');
    // Update sub-tab button styles
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.subtab === activeScheduleSubTab));
    // Render active sub-tab
    if (activeScheduleSubTab === 'weekly') renderWeeklyView();
    if (activeScheduleSubTab === 'subjects') renderSubjectList();
}

function switchScheduleSubTab(subtab) {
    activeScheduleSubTab = subtab;
    activeSubject = null; // reset subject detail when switching
    renderScheduleTab();
}

// --------------------- Weekly Progress View ---------------------
function renderWeeklyView() {
    const wk = scheduleData[currentWeekIdx];
    if (!wk) {
        document.getElementById('weeklySubjectCards').innerHTML = '<div style="grid-column: span 2; text-align: center; color: var(--text-secondary); padding: 20px;">無此週排程資料</div>';
        return;
    }
    // week label
    document.getElementById('weekNavLabel').textContent = `${wk.week} (${wk.date})`;
    // subject cards
    const container = document.getElementById('weeklySubjectCards');
    container.innerHTML = subjectsData.map(s => {
        const checked = completionStatus[wk.week] ? completionStatus[wk.week][s.id] : false;
        const displayVal = wk[s.id] && wk[s.id].trim() ? escapeHtml(wk[s.id]).replace(/\n/g, '<br>') : '(無安排)';
        return `
            <div class="subject-card" data-key="${s.id}" style="border-left: 4px solid ${s.color};">
                <div class="subject-card-header">
                    <span class="subject-card-title">${s.name}</span>
                    <div class="subject-checkbox ${checked ? 'checked' : ''}" onclick="toggleSubject('${wk.week}','${s.id}')"></div>
                </div>
                <div class="subject-card-content">${displayVal}</div>
            </div>
        `;
    }).join('');
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
    // re-render active schedule sub-tab
    if (activeTab === 'schedule') renderScheduleTab();
    updateOverallProgress();
    renderGlobalProgress();
}

// --------------------- Global Progress Rendering ---------------------
function calcGlobalProgress() {
    const totals = {};
    const dones = {};
    subjectsData.forEach(sub => {
        totals[sub.id] = 0;
        dones[sub.id] = 0;
    });

    scheduleData.forEach(w => {
        subjectsData.forEach(sub => {
            const k = sub.id;
            if (w[k] && w[k].trim()) {
                totals[k]++;
                if (completionStatus[w.week] && completionStatus[w.week][k]) dones[k]++;
            }
        });
    });
    const perc = {};
    subjectsData.forEach(sub => {
        const k = sub.id;
        perc[k] = totals[k] ? dones[k] / totals[k] : 0;
    });
    return { perc, totals, dones };
}

function renderGlobalProgress() {
    const { perc, totals, dones } = calcGlobalProgress();
    const container = document.getElementById('globalProgressGrid');
    const html = subjectsData.map(sub => {
        const k = sub.id;
        const percent = Math.round(perc[k] * 100);
        const countText = `${dones[k] || 0} / ${totals[k] || 0}`;
        return `
        <div class="global-progress-item" data-subject="${k}" style="--subject:${sub.color};">
            <div class="gp-label">${sub.name}</div>
            <div class="gp-bar-container">
                <div class="gp-bar" style="width:${percent}%"></div>
            </div>
            <div class="gp-details"><span class="gp-count">${countText}</span> <span class="gp-percent">${percent}%</span></div>
        </div>`;
    }).join('');
    container.innerHTML = html;
}

// --------------------- Subject List (Main) ---------------------
function renderSubjectList() {
    // hide/show subject list vs detail
    const listContainer = document.getElementById('subjectListContainer');
    const detailContainer = document.getElementById('subjectDetailContainer');
    
    // 永遠在每次 render 時都更新上方的 listContainer DOM，這樣即便它顯示著，也會即時反應最新進度
    listContainer.innerHTML = subjectsData.map(sub => {
        const key = sub.id;
        const total = scheduleData.filter(w => w[key] && w[key].trim()).length;
        const done = scheduleData.filter(w => completionStatus[w.week] && completionStatus[w.week][key]).length;
        const ratio = total === 0 ? 0 : done / total;
        return `
            <div class="subject-list-card" onclick="openSubjectDetail('${key}')" style="border-left: 4px solid ${sub.color};">
                <div class="subject-list-header">
                    <span class="subject-list-title">${sub.name}</span>
                    <span class="subject-list-count">${done}/${total}</span>
                </div>
                <div class="subject-list-progress"><div class="progress-bar" style="width:${ratio * 100}%; background: ${sub.color};"></div></div>
            </div>
        `;
    }).join('');

    if (activeSubject) {
        listContainer.classList.add('hidden');
        detailContainer.classList.remove('hidden');
        renderSubjectDetail(activeSubject);
        return;
    }
    
    listContainer.classList.remove('hidden');
    detailContainer.classList.add('hidden');
}

// --------------------- Full Schedule Subpage ---------------------
function renderFullSchedule() {
    const container = document.getElementById('fullScheduleContainer');
    if (!container) return; // Prevent error if not on home tab and element is missing

    let headerCols = subjectsData.map(sub => `<th>${sub.name}</th>`).join('');
    let html = `<table class="full-schedule-table"><thead><tr><th>週次</th><th>日期</th>${headerCols}</tr></thead><tbody>`;

    scheduleData.forEach((w, i) => {
        let rowCells = subjectsData.map(sub => {
            const isComp = completionStatus[w.week] && completionStatus[w.week][sub.id];
            const compClass = isComp ? ' class="completed-cell"' : '';
            return `<td${compClass}>${w[sub.id] || ''}</td>`;
        }).join('');

        const isCurrentWeek = (i === currentWeekIdx);
        const rowClass = isCurrentWeek ? ' class="current-week-row"' : '';

        html += `<tr${rowClass}>
            <td>${w.week}</td>
            <td>${w.date}</td>
            ${rowCells}
        </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
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
    const subObj = subjectsData.find(s => s.id === subjectKey);
    if (!subObj) return;

    document.getElementById('subjectDetailTitle').textContent = subObj.name;
    // progress bar for this subject
    const total = scheduleData.filter(w => w[subjectKey] && w[subjectKey].trim()).length;
    const done = scheduleData.filter(w => completionStatus[w.week] && completionStatus[w.week][subjectKey]).length;
    const ratio = total === 0 ? 0 : done / total;

    const bar = document.getElementById('subjectDetailBar');
    if (bar) {
        bar.style.width = `${ratio * 100}%`;
        bar.style.backgroundColor = subObj.color;
    }
    const txt = document.getElementById('subjectDetailText');
    if (txt) txt.textContent = `${Math.round(ratio * 100)}%`;

    // list of weeks that have this subject
    const list = document.getElementById('subjectWeekList');
    list.innerHTML = scheduleData.map((wk, i) => {
        if (!wk[subjectKey] || !wk[subjectKey].trim()) return '';
        const checked = completionStatus[wk.week] ? completionStatus[wk.week][subjectKey] : false;
        return `
            <div class="week-item" style="border-left: 4px solid ${subObj.color};">
                <div class="week-info">
                    <span class="week-label">${wk.week}</span>
                    <span class="week-date">${wk.date}</span>
                    <div class="subject-card-content">${escapeHtml(wk[subjectKey]).replace(/\n/g, '<br>')}</div>
                </div>
                <div class="subject-checkbox ${checked ? 'checked' : ''}" onclick="toggleSubject('${wk.week}','${subjectKey}')"></div>
            </div>
        `;
    }).join('');
}

// --------------------- Overall Progress ---------------------
function updateOverallProgress() {
    let total = 0, done = 0;
    
    // 總母體：全部的任務總數 (全排程)
    for (const wk of scheduleData) {
        subjectsData.forEach(sub => {
            if (wk[sub.id] && wk[sub.id].trim()) {
                total++;
                if (completionStatus[wk.week] && completionStatus[wk.week][sub.id]) done++;
            }
        });
    }
    const ratio = total === 0 ? 0 : done / total;
    const percentage = Math.round(ratio * 100);

    const txt = document.getElementById('overallProgressText');
    const digits = {
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰',
        '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    if (txt) {
        const stylizedNum = String(percentage).split('').map(d => digits[d] || d).join('');
        txt.textContent = `⊹˙ 𐙚 ﹝ 𝑶𝒗𝒆𝒓𝒂𝒍𝒍 𝑷𝒓𝒐𝒈𝒓𝒆𝒔𝒔 ﹕ ${stylizedNum}٪ ﹞ ✦ *`;
    }

    // 計算「這週至少要達到的目標」：
    // 以線性時間分配：假設有 targetWeeks，現在是第 (currentWeekIdx + 1) 週
    // 應該要完成總任務的幾分之幾？
    const targetWks = targetWeeksSetting || scheduleData.length;
    const elapsedWks = currentWeekIdx + 1;
    let targetRatio = elapsedWks / targetWks;
    if (targetRatio > 1) targetRatio = 1;

    const targetPercentage = Math.round(targetRatio * 100);

    const targetTxt = document.getElementById('overallTargetText');
    if (targetTxt) {
        const stylizedTargetNum = String(targetPercentage).split('').map(d => digits[d] || d).join('');
        targetTxt.textContent = `✦ 這週至少要到達總目標的 ${stylizedTargetNum}٪ ✦`;
    }
}

function updateHeaderStatus() {
    // show current week pill (already set in renderAll via currentWeekIdx)
}

// ------------------------------------------------------------
// Exams / Scores Management
function renderExamsTab() {
    // Show/hide sub-tab content
    document.getElementById('examsAll').classList.toggle('active', activeExamsSubTab === 'all');
    document.getElementById('examsSubjects').classList.toggle('active', activeExamsSubTab === 'subjects');

    // Update sub-tab button styles inside examsSubTabNav
    const subTabNav = document.getElementById('examsSubTabNav');
    if (subTabNav) {
        subTabNav.querySelectorAll('.sub-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.subtab === activeExamsSubTab);
        });
    }

    // Render active sub-tab content
    if (activeExamsSubTab === 'all') {
        renderAllExamsList();
    } else if (activeExamsSubTab === 'subjects') {
        renderExamsSubjectsView();
    }
}

function switchExamsSubTab(subtab) {
    activeExamsSubTab = subtab;
    activeExamsSubject = null; // reset subject detail view when switching
    renderExamsTab();
}

function renderAllExamsList() {
    const container = document.getElementById('examsListContainer');
    if (!container) return;

    if (examsData.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-secondary); padding: 40px 20px;">尚無測驗紀錄，點擊右下角按鈕新增！</div>';
        return;
    }

    const sortedExams = [...examsData].sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = sortedExams.map(exam => {
        const scoresHtml = subjectsData.map(sub => {
            const scoreStr = exam.scores[sub.id];
            if (!scoreStr || scoreStr.trim() === '') return '';

            const score = parseFloat(scoreStr);
            const target = EXAM_TARGETS[sub.id];

            let statusClass = '';
            let targetHtml = '';

            if (target !== undefined) {
                if (score >= target) {
                    statusClass = 'score-success';
                } else {
                    statusClass = 'score-danger';
                }
                targetHtml = `<div class="exam-score-target" style="display: inline-flex; align-items: center; gap: 2px;"><img src="target-icon.png" alt="target" style="width: 12px; height: 12px; object-fit: contain;"> 目標: ${target}分</div>`;
            }

            return `
                <div class="exam-score-item ${statusClass}" style="border-left-color: ${sub.color}">
                    <div class="exam-score-sub">${sub.name}</div>
                    <div class="exam-score-val">${score} 分</div>
                    ${targetHtml}
                </div>
            `;
        }).join('');

        return `
            <div class="exam-card" onclick="openExamSheet('${exam.id}')">
                <div class="exam-card-header">
                    <span class="exam-card-title" style="display: inline-flex; align-items: center; gap: 6px;">
                        ${exam.year ? `<span style="font-size:0.75rem; background:rgba(142,177,201,0.15); color:var(--primary-dark); padding:2px 8px; border-radius:8px; font-weight:700;">${escapeHtml(exam.year)}</span>` : ''}
                        <span>${escapeHtml(exam.name)}</span>
                    </span>
                    <span class="exam-card-date">${exam.date}</span>
                </div>
                <div class="exam-scores-grid">
                    ${scoresHtml || '<div style="color:var(--text-secondary); font-size: 0.85rem;">未填寫各科分數</div>'}
                </div>
            </div>
        `;
    }).join('');
}

function renderExamsSubjectsView() {
    const listContainer = document.getElementById('examsSubjectListContainer');
    const detailContainer = document.getElementById('examsSubjectDetailContainer');
    if (!listContainer || !detailContainer) return;

    if (activeExamsSubject) {
        listContainer.classList.add('hidden');
        detailContainer.classList.remove('hidden');
        renderExamsSubjectDetail(activeExamsSubject);
        return;
    }

    listContainer.classList.remove('hidden');
    detailContainer.classList.add('hidden');

    listContainer.innerHTML = subjectsData.map(sub => {
        const key = sub.id;

        let totalScore = 0;
        let examCount = 0;

        examsData.forEach(exam => {
            const scoreStr = exam.scores[key];
            if (scoreStr && scoreStr.trim() !== '') {
                const s = parseFloat(scoreStr);
                if (!isNaN(s)) {
                    totalScore += s;
                    examCount++;
                }
            }
        });

        const avgScore = examCount > 0 ? (totalScore / examCount).toFixed(1) : null;
        const target = EXAM_TARGETS[key];

        let avgHtml = '';
        if (examCount > 0) {
            let statusStyle = '';
            if (target !== undefined) {
                statusStyle = parseFloat(avgScore) >= target ? 'color: #5c7a4d; font-weight: 700;' : 'color: #a8564b; font-weight: 700;';
            }
            avgHtml = `<span style="font-size: 0.9rem; ${statusStyle}">平均: ${avgScore}分</span>`;
        } else {
            avgHtml = '<span style="font-size: 0.85rem; color: var(--text-secondary);">尚未有測驗</span>';
        }

        return `
            <div class="subject-list-card" onclick="openExamsSubjectDetail('${key}')" style="border-left: 4px solid ${sub.color}; display: flex; flex-direction: column; gap: 8px;">
                <div class="subject-list-header" style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                    <span class="subject-list-title" style="font-weight: 700;">${sub.name}</span>
                    <span class="subject-list-count" style="font-size: 0.8rem; background: rgba(0,0,0,0.04); padding: 2px 8px; border-radius: 12px;">已測 ${examCount} 次</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    ${avgHtml}
                    ${target !== undefined ? `<span style="font-size: 0.75rem; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 2px;"><img src="target-icon.png" alt="target" style="width: 12px; height: 12px; object-fit: contain;"> 目標: ${target}分</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function openExamsSubjectDetail(key) {
    activeExamsSubject = key;
    renderExamsTab();
}

function backToExamsSubjectList() {
    activeExamsSubject = null;
    renderExamsTab();
}

function renderExamsSubjectDetail(subjectKey) {
    const subObj = subjectsData.find(s => s.id === subjectKey);
    if (!subObj) return;

    document.getElementById('examsSubjectDetailTitle').textContent = `${subObj.name} - 歷史成績`;

    const detailScoresContainer = document.getElementById('examsSubjectDetailScores');
    if (!detailScoresContainer) return;

    const filteredExams = examsData
        .filter(exam => exam.scores[subjectKey] !== undefined && exam.scores[subjectKey].trim() !== '')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredExams.length === 0) {
        detailScoresContainer.innerHTML = '<div style="color:var(--text-secondary); text-align:center; padding: 40px 20px;">此科目尚無成績紀錄</div>';
        return;
    }

    const target = EXAM_TARGETS[subjectKey];

    detailScoresContainer.innerHTML = filteredExams.map(exam => {
        const score = parseFloat(exam.scores[subjectKey]);

        let statusClass = '';
        let targetHtml = '';

        if (target !== undefined) {
            if (score >= target) {
                statusClass = 'score-success';
            } else {
                statusClass = 'score-danger';
            }
            targetHtml = `<div class="exam-score-target" style="display: inline-flex; align-items: center; gap: 2px;"><img src="target-icon.png" alt="target" style="width: 12px; height: 12px; object-fit: contain;"> 目標: ${target}分</div>`;
        }

        return `
            <div class="exam-score-item ${statusClass}" onclick="openExamSheet('${exam.id}')" style="border-left: 4px solid ${subObj.color}; padding: 12px; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.75); border-radius: var(--radius); box-shadow: var(--shadow); cursor: pointer; transition: var(--transition);">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="font-weight: 700; color: var(--text); font-size: 1rem; display: flex; align-items: center; gap: 6px;">
                        ${exam.year ? `<span style="font-size:0.75rem; background:rgba(142,177,201,0.15); color:var(--primary-dark); padding:2px 8px; border-radius:8px; font-weight:700;">${escapeHtml(exam.year)}</span>` : ''}
                        <span>${escapeHtml(exam.name)}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${exam.date}</div>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; gap: 2px;">
                    <div style="font-size: 1.25rem; font-weight: 800; color: var(--text);">${score} 分</div>
                    ${targetHtml}
                </div>
            </div>
        `;
    }).join('');
}

let tempExamScores = {}; // Key: subjectId, Value: string (score)

function openExamSheet(id = null) {
    editingExamId = id;
    const titleEl = document.getElementById('examSheetTitle');
    const dateEl = document.getElementById('examDate');
    const nameEl = document.getElementById('examName');
    const actionsEl = document.getElementById('examSheetActions');

    // Reset temp inputs
    const scoreInput = document.getElementById('examSubjectScore');
    if (scoreInput) scoreInput.value = '';

    const yearEl = document.getElementById('examYear');
    if (id) {
        const exam = examsData.find(e => e.id === id);
        if (!exam) return;
        titleEl.textContent = '編輯測驗成績';
        dateEl.value = exam.date || '';
        nameEl.value = exam.name || '';
        if (yearEl) yearEl.value = exam.year || '';
        actionsEl.style.display = 'block';

        tempExamScores = { ...exam.scores };
    } else {
        titleEl.textContent = '新增測驗成績';
        dateEl.value = new Date().toISOString().slice(0, 10);
        nameEl.value = '';
        if (yearEl) yearEl.value = '';
        actionsEl.style.display = 'none';

        tempExamScores = {};
    }

    renderExamSubjectSelect();
    renderTempScoresList();
    document.getElementById('examSheetOverlay').classList.add('active');
}

function renderExamSubjectSelect() {
    const selectEl = document.getElementById('examSubjectSelect');
    if (!selectEl) return;

    const availableSubjects = subjectsData.filter(sub => tempExamScores[sub.id] === undefined);

    if (availableSubjects.length === 0) {
        selectEl.innerHTML = '<option value="">(無可用科目)</option>';
    } else {
        selectEl.innerHTML = availableSubjects.map(sub => `
            <option value="${sub.id}">${sub.name}</option>
        `).join('');
    }
}

function renderTempScoresList() {
    const container = document.getElementById('addedScoresList');
    if (!container) return;

    const keys = Object.keys(tempExamScores);
    if (keys.length === 0) {
        container.innerHTML = '<div style="color:var(--text-secondary); font-size: 0.85rem; text-align: center; padding: 12px;">尚無填寫科目成績</div>';
        return;
    }

    container.innerHTML = keys.map(subId => {
        const sub = subjectsData.find(s => s.id === subId) || { name: '未知科目', color: '#ccc' };
        const score = tempExamScores[subId];
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.7); padding: 8px 12px; border-radius: 12px; border-left: 4px solid ${sub.color}; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                <span style="font-weight: 600; font-size: 0.95rem; color: var(--text);">${sub.name}</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="number" step="0.1" min="0" max="100" value="${score}" oninput="updateTempScore('${subId}', this.value)" style="width: 80px; padding: 6px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: white; text-align: center; font-family: inherit; font-size: 0.9rem;">
                    <button type="button" onclick="removeTempScore('${subId}')" style="background: none; border: none; cursor: pointer; padding: 4px; display: inline-flex; align-items: center;"><img src="trash-icon.png" alt="delete" style="width: 18px; height: 18px; object-fit: contain;"></button>
                </div>
            </div>
        `;
    }).join('');
}

function addSubjectScoreToTemp() {
    const selectEl = document.getElementById('examSubjectSelect');
    const scoreEl = document.getElementById('examSubjectScore');
    if (!selectEl || !scoreEl) return;

    const subId = selectEl.value;
    const scoreVal = scoreEl.value.trim();

    if (!subId) {
        showToast('請先選擇科目');
        return;
    }
    if (scoreVal === '') {
        showToast('請輸入分數');
        return;
    }

    const floatScore = parseFloat(scoreVal);
    if (isNaN(floatScore) || floatScore < 0 || floatScore > 100) {
        showToast('分數格式錯誤 (0 ~ 100)');
        return;
    }

    const finalScore = parseFloat(floatScore.toFixed(1));
    tempExamScores[subId] = String(finalScore);

    scoreEl.value = '';
    renderExamSubjectSelect();
    renderTempScoresList();
}

function updateTempScore(subId, val) {
    const floatVal = parseFloat(val);
    if (!isNaN(floatVal)) {
        tempExamScores[subId] = String(parseFloat(floatVal.toFixed(1)));
    } else {
        tempExamScores[subId] = '';
    }
}

function removeTempScore(subId) {
    delete tempExamScores[subId];
    renderExamSubjectSelect();
    renderTempScoresList();
}

function closeExamSheet() {
    document.getElementById('examSheetOverlay').classList.remove('active');
    editingExamId = null;
}

function saveExam() {
    const date = document.getElementById('examDate').value;
    const name = document.getElementById('examName').value.trim() || '未命名測驗';
    const yearEl = document.getElementById('examYear');
    const year = yearEl ? yearEl.value : '';

    const finalScores = {};
    for (const subId in tempExamScores) {
        const val = tempExamScores[subId].trim();
        if (val !== '') {
            finalScores[subId] = val;
        }
    }

    if (editingExamId) {
        const exam = examsData.find(e => e.id === editingExamId);
        if (exam) {
            exam.date = date;
            exam.year = year;
            exam.name = name;
            exam.scores = finalScores;
            showToast('已更新成績');
        }
    } else {
        const newExam = {
            id: 'exam_' + Date.now(),
            date: date,
            year: year,
            name: name,
            scores: finalScores
        };
        examsData.push(newExam);
        showToast('已新增成績');
    }

    saveState();
    if (activeTab === 'exams') renderExamsTab();
    closeExamSheet();
}

function deleteExam() {
    if (!editingExamId) return;
    if (!confirm('確定要刪除這筆成績紀錄嗎？')) return;

    examsData = examsData.filter(e => e.id !== editingExamId);
    saveState();
    if (activeTab === 'exams') renderExamsTab();
    closeExamSheet();
    showToast('已刪除成績');
}

// ------------------------------------------------------------
// Bottom Sheet (Edit week)
function openBottomSheet(index) {
    editingRowIndex = index;
    const row = scheduleData[index];
    if (!row) return;

    document.getElementById('sheetTitle').textContent = `編輯 ${row.week}`;
    document.getElementById('editDate').value = row.date || '';

    // Generate dynamic inputs for all subjects
    const container = document.getElementById('dynamicSubjectsEditContainer');
    if (container) {
        container.innerHTML = subjectsData.map(sub => {
            const val = row[sub.id] || '';
            return `
                <div class="input-group">
                    <label>${sub.name}</label>
                    <textarea id="edit_sub_${sub.id}" rows="2">${val}</textarea>
                </div>
            `;
        }).join('');
    }

    document.getElementById('editSheetOverlay').classList.add('active');
}

function closeBottomSheet() {
    document.getElementById('editSheetOverlay').classList.remove('active');
    editingRowIndex = -1;
}

function saveEditFromSheet() {
    if (editingRowIndex < 0) return;
    const row = scheduleData[editingRowIndex];
    if (!row) return;

    row.date = document.getElementById('editDate').value;

    // Dynamically collect values for all subjects
    subjectsData.forEach(sub => {
        const el = document.getElementById(`edit_sub_${sub.id}`);
        if (el) {
            row[sub.id] = el.value;
        }
    });

    saveState();
    renderAll();
    closeBottomSheet();
    showToast('已更新排程');
}

async function forceAppRefresh() {
    try {
        const res = await fetch("./version.json?check=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            if (data.version === APP_VERSION) {
                showToast('目前已是最新版');
                return;
            } else {
                if (!confirm(`發現新版本 (${data.version})！\n\n確定要更新頁面嗎？您的操作紀錄都會保留。`)) return;
            }
        } else {
            if (!confirm('無法取得線上版本資訊。確定要強制更新頁面嗎？\n您的所有操作紀錄都會保留。')) return;
        }
    } catch (e) {
        if (!confirm('網路異常或無法取得版本。確定要強制更新頁面嗎？\n您的所有操作紀錄都會保留。')) return;
    }

    const stamp = Date.now().toString();
    if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
    }
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(r => r.unregister()));
    }
    
    // 強制重新抓取關鍵檔案
    const filesToPreload = ['./index.html', './version.json', './sw.js', './app.js', './style.css'];
    await Promise.allSettled(filesToPreload.map(file => fetch(file, { cache: "reload" })));

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("forceUpdate", stamp);
    window.location.replace(url.toString());
}

function deleteCurrentWeek() {
    if (editingRowIndex < 0) return;
    if (!confirm('確定要刪除這一週的排程嗎？')) return;
    const wk = scheduleData[editingRowIndex].week;
    scheduleData.splice(editingRowIndex, 1);
    delete completionStatus[wk];
    // re‑index currentWeekIdx if needed
    if (currentWeekIdx >= scheduleData.length) currentWeekIdx = scheduleData.length - 1;
    saveState();
    renderAll();
    closeBottomSheet();
    showToast('已刪除週次');
}

// ------------------------------------------------------------
// Adding / Resetting / Import‑Export
function openAddWeek() {
    const last = scheduleData[scheduleData.length - 1];
    const lastNum = last ? parseInt(last.week.replace('W', '')) : 0;
    const nextWeek = 'W' + String(lastNum + 1).padStart(2, '0');

    // Create week item dynamically with empty fields for all subjectsData
    const newWeekItem = { week: nextWeek, date: '' };
    subjectsData.forEach(sub => {
        newWeekItem[sub.id] = '';
    });

    scheduleData.push(newWeekItem);

    // Init completion for the new week dynamically
    completionStatus[nextWeek] = {};
    subjectsData.forEach(sub => {
        completionStatus[nextWeek][sub.id] = false;
    });

    saveState();
    renderAll();
    showToast(`已新增 ${nextWeek}`);
    // automatically switch to schedule tab so user can edit
    switchTab('schedule');
}

function confirmResetSchedule() {
    if (confirm('確定要重置「排程與科目」回預設值嗎？\n您的所有「測驗成績」將會被完整保留。')) {
        localStorage.removeItem('studyPlan_schedule');
        localStorage.removeItem('studyPlan_subjects');
        localStorage.removeItem('studyPlan_completion');
        // Do not remove 'studyPlan_exams'
        loadState();
        currentWeekIdx = getCurrentWeekIndex();
        if (currentWeekIdx === -1) currentWeekIdx = 0;
        renderAll();
        showToast('排程與科目已重置');
    }
}

function confirmReset() {
    if (confirm('確定要重置所有資料嗎？此操作無法復原。')) {
        localStorage.clear();
        loadState();
        currentWeekIdx = getCurrentWeekIndex();
        if (currentWeekIdx === -1) currentWeekIdx = 0;
        renderAll();
        showToast('資料已重置');
    }
}

function exportData() {
    const data = { subjectsData, scheduleData, completionStatus, examsData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `讀書規劃備份_${new Date().toISOString().slice(0, 10)}.json`; a.click();
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
            if (data.subjectsData) subjectsData = data.subjectsData;
            if (data.scheduleData) scheduleData = data.scheduleData;
            if (data.completionStatus) completionStatus = data.completionStatus;
            if (data.examsData) examsData = data.examsData;

            // Harmonize dynamic structures in case imported data has mismatches
            for (const wk of scheduleData) {
                if (!completionStatus[wk.week]) {
                    completionStatus[wk.week] = {};
                }
                subjectsData.forEach(sub => {
                    if (completionStatus[wk.week][sub.id] === undefined) {
                        completionStatus[wk.week][sub.id] = false;
                    }
                });
            }

            saveState();
            renderAll();
            showToast('匯入成功');
        } catch (err) {
            console.error(err);
            showToast('匯入失敗，格式錯誤');
        }
    };
    reader.readAsText(file);
}



// ------------------------------------------------------------
// Tab Switching helper
function switchTab(tabId) {
    activeTab = tabId;

    if (tabId === 'home') {
        currentWeekIdx = getCurrentWeekIndex();
        if (currentWeekIdx === -1) currentWeekIdx = 0;
    }

    // header title
    const titles = { home: '總覽', schedule: '科目', exams: '成績', settings: '設定' };
    document.getElementById('pageTitle').textContent = titles[tabId];
    // hide all tab pages, then show the selected one
    document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    // also ensure full-schedule subpage is hidden when switching away
    const homeFullEl = document.getElementById('tab-home-full');
    if (homeFullEl) homeFullEl.classList.remove('active');
    // activate tab button style
    document.querySelectorAll('.tab-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    // when leaving subject detail, reset activeSubject
    if (tabId !== 'schedule') activeSubject = null;
    if (tabId !== 'exams') activeExamsSubject = null;
    renderAll();
}

// ------------------------------------------------------------
// Dynamic Subject Management Sheet
function openSubjectSheet() {
    const nameInput = document.getElementById('newSubjectName');
    if (nameInput) nameInput.value = '';
    document.getElementById('subjectSheetOverlay').classList.add('active');
}

function closeSubjectSheet() {
    document.getElementById('subjectSheetOverlay').classList.remove('active');
}

const PALETTE = [
    '#bcd0df', '#ebdcd0', '#c3d6cb', '#e0cad3', '#8fb2cf',
    '#d9cfc1', '#a2bdbe', '#7b9ebc', '#d4a39e', '#aebcc8'
];

function addNewSubject() {
    const nameInput = document.getElementById('newSubjectName');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
        showToast('請輸入科目名稱');
        return;
    }

    const newId = 'subject_' + Date.now();
    let color = PALETTE[subjectsData.length % PALETTE.length];

    // Add subject
    subjectsData.push({ id: newId, name: name, color: color });

    // Update schedules and completion
    for (const wk of scheduleData) {
        wk[newId] = '';
        if (!completionStatus[wk.week]) {
            completionStatus[wk.week] = {};
        }
        completionStatus[wk.week][newId] = false;
    }

    saveState();
    renderAll();
    closeSubjectSheet();
    showToast(`已新增科目「${name}」`);
}

// ------------------------------------------------------------
// Utility helpers
function getCurrentWeekIndex() {
    const now = new Date();
    const year = now.getFullYear();
    for (let i = 0; i < scheduleData.length; i++) {
        if (!scheduleData[i] || !scheduleData[i].date) continue;
        const m = scheduleData[i].date.match(/(\d{2})\/(\d{2})～(\d{2})\/(\d{2})/);
        if (!m) continue;
        const start = new Date(year, parseInt(m[1]) - 1, parseInt(m[2]));
        const end = new Date(year, parseInt(m[3]) - 1, parseInt(m[4]), 23, 59, 59);
        if (now >= start && now <= end) return i;
    }
    return -1;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function debounce(fn, wait) {
    let t;
    return function () {
        const args = arguments, ctx = this;
        clearTimeout(t);
        t = setTimeout(() => fn.apply(ctx, args), wait);
    };
}

function showToast(msg) {
    const el = document.getElementById('toast');
    if (el) {
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2500);
    }
}

// ------------------------------------------------------------
// Expose functions to global scope (for inline onclick handlers)
window.toggleSubject = toggleSubject;
window.openBottomSheet = openBottomSheet;
window.openAddWeek = openAddWeek;
window.forceAppRefresh = forceAppRefresh;
window.confirmReset = confirmReset;
window.exportData = exportData;
window.importData = importData;
window.handleImport = handleImport;
window.switchTab = switchTab;
window.openSubjectDetail = openSubjectDetail;
window.backToSubjectList = backToSubjectList;
window.switchScheduleSubTab = switchScheduleSubTab;
window.openSubjectSheet = openSubjectSheet;
window.closeSubjectSheet = closeSubjectSheet;
window.addNewSubject = addNewSubject;

window.openExamSheet = openExamSheet;
window.closeExamSheet = closeExamSheet;
window.saveExam = saveExam;
window.deleteExam = deleteExam;
window.addSubjectScoreToTemp = addSubjectScoreToTemp;
window.updateTempScore = updateTempScore;
window.removeTempScore = removeTempScore;
window.switchExamsSubTab = switchExamsSubTab;
window.openExamsSubjectDetail = openExamsSubjectDetail;
window.backToExamsSubjectList = backToExamsSubjectList;

function resetScheduleOnly() {
    if (confirm('確定要強制更新成「預設排程」嗎？\n您目前的「每週打勾狀態」與「成績」都會原封不動保留。')) {
        scheduleData = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        
        // 防呆：如果目標週數大於最新的預設排程長度，則下修
        if (targetWeeksSetting && targetWeeksSetting > scheduleData.length) {
            targetWeeksSetting = scheduleData.length;
            localStorage.setItem('studyPlan_targetWeeks', targetWeeksSetting);
            const twInput = document.getElementById('targetWeeksInput');
            if (twInput) twInput.value = targetWeeksSetting;
        }

        saveState();
        renderAll();
        showToast('排程已更新為預設版本');
    }
}

function updateTargetWeeks() {
    const val = parseInt(document.getElementById('targetWeeksInput').value);
    if (!isNaN(val) && val > 0) {
        targetWeeksSetting = val;
        localStorage.setItem('studyPlan_targetWeeks', val);
        renderAll();
        showToast('已更新總進度計算基準');
    }
}

window.resetScheduleOnly = resetScheduleOnly;
window.updateTargetWeeks = updateTargetWeeks;
// ------------------------------------------------------------
