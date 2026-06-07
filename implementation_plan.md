# 版本管理與有效更新機制計畫 (Version Control & Effective Update)

## 1. 參考架構與目標
根據您提供的 `charge_app` 實作計畫，手機的 PWA 應用程式（尤其在 iOS 系統）往往有非常強烈的快取機制。一般的重新整理或單純解除 Service Worker，有時還是會因為 HTTP Cache 的關係而拿到舊的檔案。
為了確保未來每次改版使用者都能「確實」載入最新功能，本計畫將結合 `charge_app` 最新的突破快取方法，整理出最穩定且有用的更新架構。

## 2. 核心機制 (最新最有效的更新方法)

### A. 線上版本比對 (Online Version Checking)
- **新增線上版本對照檔**：建立獨立的 `version.json`。
- **本地版號宣告**：在專案中明確定義當前本地端的版本（例如 `const APP_VERSION = "v1.0.3";`）。
- **檢查邏輯**：點擊檢查更新時，系統透過 `fetch("./version.json?check=時間戳", { cache: "no-store" })` 到遠端取得最新版本號。如果發現本地版號與線上不一致，才會提示使用者有新版可以更新。

### B. 強制更新流程強化 (Advanced Force Refresh)
當確認要更新時，將執行以下一系列動作確保完全突破快取：
1. 清空所有 `Cache Storage`。
2. 呼叫 `unregister()` 解除所有 Service Worker。
3. **(關鍵新技術)**：在背景透過 `fetch(url, { cache: "reload" })` 強制重新下載入口的 `index.html`、`service-worker.js` 與主要的 `JS/CSS` 模組，確保瀏覽器不會使用記憶體快取。
4. 使用 `window.location.replace()`，並加上帶有時間戳的參數（如 `?forceUpdate=123456789`）重新載入當前網頁。

### C. 靜態資源防快取標籤 (Cache Busting)
- 在 `index.html` 中引入的核心檔案，必須帶有版本號參數，例如：
  `<script src="app.js?v=v1.0.3"></script>`
  `<link rel="stylesheet" href="style.css?v=v1.0.3">`
- 透過改變 URL 參數，直接讓瀏覽器判定為新資源。

### D. Service Worker 網路優先策略 (Network-First)
- `service-worker.js` 應採用 **network-first (網路優先)** 策略：有網路時，優先向伺服器拿新檔並寫入快取；沒有網路時，才回退 (fallback) 使用舊快取。
- 每次 App 啟動並註冊 Service Worker 成功後，主動呼叫 `registration.update()` 在背景確認 SW 本身是否有更新。

## 3. 開發與維護守則 (固定維護規則)
根據這套機制，**往後每一次進行任何功能修改或發布新版**，都必須「強制同步更新」以下 4 個地方的版本號，才能確保發布成功：
1. **`version.json`**：修改裡面的線上版本號碼。
2. **`app.js` 或 `version.js`**：修改本地端的 App 版本號。
3. **`service-worker.js`**：修改 `SERVICE_WORKER_VERSION` 的常數名稱（這會改變快取庫的名稱，強迫更新）。
4. **`index.html`**：修改所有 `<script>` 與 `<link>` 網址後方的 `?v=版本號` 參數。

---

## 4. 版本更新紀錄 (Version Update Log)
> [!IMPORTANT]
> 依據開發守則，**每一次做的任何改動都必須更新版本號，並在此處留下紀錄**。
> 每次更新版本時，必須確保已同步修改 `version.json`、`app.js`、`sw.js`、`index.html` 裡面的版號。

### [v1.00.03] - 2026-06-07
- **純版本號升級測試**
- 為了驗證最新的有效更新機制，單純將版號從 `v1.00.02` 升級至 `v1.00.03`。
- 不更動任何其他功能與畫面邏輯。
- 確認設定頁面版本號顯示、強制更新按鈕能正確判斷 `version.json`，並跳出「發現新版本 (v1.00.03)」之提示。
