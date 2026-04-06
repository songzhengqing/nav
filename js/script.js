/**
 * 正清の导航页 - 主脚本文件
 * 
 * 功能包括：
 * - 多引擎搜索
 * - 网站分类导航
 * - 暗黑模式
 * - 网站置顶
 * - 访问统计
 * - 数据导入导出
 * - PWA支持
 */

// ==================== 数据变量 ====================

// 从JSON文件加载的数据
let searchEngines = [];      // 搜索引擎列表
let websitesData = [];       // 网站数据列表
let wallpapersData = [];     // 壁纸配置数据

// 网站分类列表
const categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '壁纸', '其它'];

// ==================== 状态变量 ====================

let currentSearchEngine = null;    // 当前选中的搜索引擎
let activeCategory = '全部';        // 当前选中的分类
let showSearchEngines = false;      // 搜索引擎下拉菜单是否显示
let searchSuggestions = [];         // 搜索建议列表
let searchHistory = [];             // 搜索历史记录
let isDarkMode = false;             // 是否为暗黑模式
let pinnedSites = [];               // 置顶网站URL列表
let customSites = [];               // 用户自定义网站列表
let visitStats = {};                // 网站访问统计 { url: count }
let currentWallpaperIndex = 0;      // 当前壁纸索引

// ==================== DOM 元素引用 ====================

const backgroundElement = document.getElementById('background');
const currentTimeElement = document.getElementById('currentTime');
const currentDateElement = document.getElementById('currentDate');
const searchIconElement = document.getElementById('searchIcon');
const searchEnginesDropdown = document.getElementById('searchEnginesDropdown');
const searchInput = document.getElementById('searchInput');
const searchSuggestionsElement = document.getElementById('searchSuggestions');
const searchButton = document.getElementById('searchButton');
const searchEngineBtn = document.getElementById('searchEngineBtn');
const categoryTabsElement = document.getElementById('categoryTabs');
const websitesGridElement = document.getElementById('websitesGrid');
const loadingElement = document.getElementById('loading');
const themeToggleBtn = document.getElementById('themeToggle');
const websiteSearchInput = document.getElementById('websiteSearch');
const weatherElement = document.getElementById('weather');
const settingsModal = document.getElementById('settingsModal');
const addWebsiteModal = document.getElementById('addWebsiteModal');
const changeWallpaperBtn = document.getElementById('changeWallpaper');
const addWebsiteBtn = document.getElementById('addWebsite');
const settingsBtn = document.getElementById('settingsBtn');

// ==================== 常量定义 ====================

// localStorage 存储键名
const STORAGE_KEYS = {
    SEARCH_ENGINE: 'nav_search_engine',     // 搜索引擎偏好
    DARK_MODE: 'nav_dark_mode',             // 暗黑模式状态
    SEARCH_HISTORY: 'nav_search_history',   // 搜索历史
    PINNED_SITES: 'nav_pinned_sites',       // 置顶网站
    CUSTOM_SITES: 'nav_custom_sites',       // 自定义网站
    VISIT_STATS: 'nav_visit_stats',         // 访问统计
    WEATHER_CACHE: 'nav_weather_cache'      // 天气缓存
};

// ==================== 工具函数 ====================

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 用户偏好管理 ====================

/**
 * 从 localStorage 加载用户偏好设置
 */
function loadUserPreferences() {
    // 加载搜索引擎偏好
    const savedEngine = localStorage.getItem(STORAGE_KEYS.SEARCH_ENGINE);
    if (savedEngine) {
        const engine = searchEngines.find(e => e.name === savedEngine);
        if (engine) currentSearchEngine = engine;
    }
    
    // 加载暗黑模式状态
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
    
    // 加载搜索历史
    const savedHistory = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (savedHistory) {
        searchHistory = JSON.parse(savedHistory);
    }
    
    // 加载置顶网站
    const savedPinned = localStorage.getItem(STORAGE_KEYS.PINNED_SITES);
    if (savedPinned) {
        pinnedSites = JSON.parse(savedPinned);
    }
    
    // 加载自定义网站
    const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_SITES);
    if (savedCustom) {
        customSites = JSON.parse(savedCustom);
    }
    
    // 加载访问统计
    const savedStats = localStorage.getItem(STORAGE_KEYS.VISIT_STATS);
    if (savedStats) {
        visitStats = JSON.parse(savedStats);
    }
}

/**
 * 保存用户偏好设置到 localStorage
 */
function saveUserPreferences() {
    if (currentSearchEngine) {
        localStorage.setItem(STORAGE_KEYS.SEARCH_ENGINE, currentSearchEngine.name);
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searchHistory));
    localStorage.setItem(STORAGE_KEYS.PINNED_SITES, JSON.stringify(pinnedSites));
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SITES, JSON.stringify(customSites));
    localStorage.setItem(STORAGE_KEYS.VISIT_STATS, JSON.stringify(visitStats));
}

// ==================== 主题管理 ====================

/**
 * 切换暗黑模式
 */
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
    updateThemeIcon();
}

/**
 * 更新主题切换按钮图标
 */
function updateThemeIcon() {
    if (themeToggleBtn) {
        themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// ==================== 数据加载 ====================

/**
 * 加载JSON数据文件
 * @returns {Promise<boolean>} - 是否加载成功
 */
async function loadData() {
    try {
        showLoading(true);
        
        // 并行加载所有数据文件
        const [searchEnginesRes, websitesRes, wallpapersRes] = await Promise.all([
            fetch('./data/searchEngines.json'),
            fetch('./data/websitesData.json'),
            fetch('./data/wallpapers.json')
        ]);
        
        // 检查必要文件是否加载成功
        if (!searchEnginesRes.ok || !websitesRes.ok) {
            throw new Error('数据加载失败');
        }
        
        // 解析JSON数据
        searchEngines = await searchEnginesRes.json();
        websitesData = await websitesRes.json();
        
        // 壁纸数据可选
        if (wallpapersRes.ok) {
            wallpapersData = await wallpapersRes.json();
        }
        
        // 设置默认搜索引擎
        currentSearchEngine = searchEngines[1] || searchEngines[0];
        
        // 加载用户偏好
        loadUserPreferences();
        
        return true;
    } catch (error) {
        console.error('加载数据失败:', error);
        showError('数据加载失败，请刷新页面重试');
        return false;
    } finally {
        showLoading(false);
    }
}

/**
 * 显示/隐藏加载动画
 * @param {boolean} show - 是否显示
 */
function showLoading(show) {
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {boolean} isSuccess - 是否为成功消息
 */
function showError(message, isSuccess = false) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast' + (isSuccess ? ' success-toast' : '');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// ==================== 时间与天气 ====================

/**
 * 更新页面时间和日期显示
 */
function updateDateTime() {
    const now = new Date();
    
    // 格式化时间 HH:MM:SS
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;

    // 格式化日期 YYYY年MM月DD日 星期X
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    currentDateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
}

/**
 * 加载天气信息（带缓存）
 */
async function loadWeather() {
    if (!weatherElement) return;
    
    // 检查缓存（1小时有效期）
    const cached = localStorage.getItem(STORAGE_KEYS.WEATHER_CACHE);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const hour = 3600000; // 1小时的毫秒数
        if (Date.now() - timestamp < hour) {
            weatherElement.textContent = data;
            return;
        }
    }
    
    // 请求天气API
    try {
        const response = await fetch('https://api.vvhan.com/api/weather');
        const data = await response.json();
        if (data && data.success) {
            const weatherText = `${data.city} ${data.weather.day.type} ${data.weather.day.low}~${data.weather.day.high}`;
            weatherElement.textContent = weatherText;
            // 缓存天气数据
            localStorage.setItem(STORAGE_KEYS.WEATHER_CACHE, JSON.stringify({
                data: weatherText,
                timestamp: Date.now()
            }));
        }
    } catch (error) {
        weatherElement.textContent = '';
    }
}

// ==================== 搜索引擎渲染 ====================

/**
 * 渲染搜索引擎选择下拉菜单
 */
function renderSearchEngines() {
    if (!currentSearchEngine) return;
    
    // 设置当前搜索引擎图标
    searchIconElement.src = currentSearchEngine.icon;
    
    // 渲染下拉选项
    searchEnginesDropdown.innerHTML = searchEngines.map(engine => `
        <div class="search-engine-option" data-name="${engine.name}">
            <img src="${engine.icon}" alt="${engine.name}" loading="lazy">
            <span>${engine.name}</span>
        </div>
    `).join('');
}

// ==================== 分类标签渲染 ====================

/**
 * 渲染分类标签页
 */
function renderCategoryTabs() {
    const categories = ['全部', ...categoriesData];
    categoryTabsElement.innerHTML = categories.map((category, index) => `
        <button class="category-tab ${category === activeCategory ? 'active' : ''}" data-category="${category}" data-index="${index}">
            ${category}
        </button>
    `).join('');
}

// ==================== 网站列表渲染 ====================

/**
 * 渲染网站列表
 * @param {string} filterText - 筛选文本
 */
function renderWebsites(filterText = '') {
    const defaultIcon = 'https://image.songzq.cn/other/02cb165d016fa0c02e01fe2321325df9.jpg';
    
    // 合并预设网站和自定义网站
    let allSites = [...websitesData, ...customSites];
    
    // 按分类筛选
    let filteredWebsites = activeCategory === '全部'
        ? allSites
        : allSites.filter(website => website.categoryName === activeCategory);
    
    // 按文本筛选
    if (filterText) {
        const lowerFilter = filterText.toLowerCase();
        filteredWebsites = filteredWebsites.filter(website => 
            website.name.toLowerCase().includes(lowerFilter) ||
            website.desc.toLowerCase().includes(lowerFilter)
        );
    }

    // 排序：置顶优先，然后按访问次数
    filteredWebsites.sort((a, b) => {
        const aPinned = pinnedSites.includes(a.url);
        const bPinned = pinnedSites.includes(b.url);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        
        const aVisits = visitStats[a.url] || 0;
        const bVisits = visitStats[b.url] || 0;
        return bVisits - aVisits;
    });

    // 无结果时显示提示
    if (filteredWebsites.length === 0) {
        websitesGridElement.innerHTML = `
            <div class="no-results">
                <p>暂无匹配的网站</p>
            </div>
        `;
        return;
    }

    // 渲染网站卡片
    websitesGridElement.innerHTML = filteredWebsites.map(website => {
        const isPinned = pinnedSites.includes(website.url);
        const visits = visitStats[website.url] || 0;
        return `
            <div class="website-item ${isPinned ? 'pinned' : ''}" data-url="${website.url}">
                <button class="pin-btn" data-url="${website.url}" title="${isPinned ? '取消置顶' : '置顶'}">${isPinned ? '📌' : '📍'}</button>
                <div class="website-icon">
                    <img src="${website.icon || defaultIcon}" alt="${website.name}" loading="lazy" onerror="this.src='${defaultIcon}'">
                </div>
                <div class="website-info">
                    <div class="website-name">${website.name}</div>
                    <div class="website-desc">${website.desc}</div>
                    ${visits > 0 ? `<div class="website-stats">访问 ${visits} 次</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ==================== 搜索功能 ====================

/**
 * 执行搜索操作
 */
function performSearch() {
    if (!currentSearchEngine) return;
    
    const query = searchInput.value.trim();
    if (query) {
        // 添加到搜索历史
        if (!searchHistory.includes(query)) {
            searchHistory.unshift(query);
            if (searchHistory.length > 10) searchHistory.pop();
            saveUserPreferences();
        }
        
        // 打开搜索结果页
        window.open(currentSearchEngine.url + encodeURIComponent(query), '_blank');
        searchInput.value = '';
        searchSuggestionsElement.classList.remove('show');
    }
}

// 防抖处理的搜索输入处理函数
const debouncedHandleSearchInput = debounce(handleSearchInput, 300);

/**
 * 处理搜索输入
 */
function handleSearchInput() {
    const query = searchInput.value.trim();
    if (query) {
        getSearchSuggestions(query);
    } else {
        renderSearchHistory();
    }
}

/**
 * 渲染搜索历史
 */
function renderSearchHistory() {
    if (searchHistory.length > 0) {
        searchSuggestionsElement.innerHTML = `
            <div class="search-history-header">
                <span>搜索历史</span>
                <button class="clear-history" id="clearHistory">清除</button>
            </div>
            ${searchHistory.map(text => `
                <div class="search-suggestion-item history-item" data-text="${text}">
                    <span class="history-icon">🕐</span>
                    <div class="suggestion-text">${text}</div>
                </div>
            `).join('')}
        `;
        searchSuggestionsElement.classList.add('show');
    } else {
        searchSuggestionsElement.classList.remove('show');
    }
}

/**
 * 获取搜索建议（JSONP方式调用百度API）
 * @param {string} query - 搜索关键词
 */
function getSearchSuggestions(query) {
    const callbackName = 'handleSuggestions_' + Date.now();
    const apiUrl = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=${callbackName}`;

    // JSONP回调函数
    window[callbackName] = function (data) {
        if (data && data.s && Array.isArray(data.s)) {
            searchSuggestions = data.s.slice(0, 8).map(text => ({ text, desc: '', icon: '' }));
            renderSearchSuggestions();
        }
        // 清理
        delete window[callbackName];
        const scriptEl = document.getElementById('suggestion_script');
        if (scriptEl && scriptEl.parentNode) {
            scriptEl.parentNode.removeChild(scriptEl);
        }
    };

    // 移除旧的script标签
    let script = document.getElementById('suggestion_script');
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
    
    // 创建新的script标签
    script = document.createElement('script');
    script.id = 'suggestion_script';
    script.src = apiUrl;
    script.onerror = function () {
        delete window[callbackName];
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };
    document.body.appendChild(script);
}

/**
 * 渲染搜索建议列表
 */
function renderSearchSuggestions() {
    if (searchSuggestions.length > 0) {
        searchSuggestionsElement.innerHTML = searchSuggestions.map(suggestion => `
            <div class="search-suggestion-item" data-text="${suggestion.text}">
                <div class="suggestion-text">${suggestion.text}</div>
            </div>
        `).join('');
        searchSuggestionsElement.classList.add('show');
    } else {
        searchSuggestionsElement.classList.remove('show');
    }
}

// ==================== 壁纸管理 ====================

/**
 * 设置随机壁纸背景
 */
function setRandomBackground() {
    if (!wallpapersData.wallpapers || wallpapersData.wallpapers.length === 0) {
        setGradientBackground();
        return;
    }
    
    currentWallpaperIndex = Math.floor(Math.random() * wallpapersData.wallpapers.length);
    loadWallpaper(currentWallpaperIndex);
}

/**
 * 加载指定索引的壁纸
 * @param {number} index - 壁纸索引
 */
function loadWallpaper(index) {
    const selectedWallpaper = wallpapersData.wallpapers[index];
    
    const img = new Image();
    img.onload = function() {
        backgroundElement.style.backgroundImage = `url('${selectedWallpaper}')`;
    };
    img.onerror = function() {
        // 壁纸加载失败时使用渐变背景
        setGradientBackground();
    };
    img.src = selectedWallpaper;
}

/**
 * 设置渐变背景（壁纸加载失败时的后备方案）
 */
function setGradientBackground() {
    const gradients = wallpapersData.gradients || [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    backgroundElement.style.background = randomGradient;
}

/**
 * 切换到下一张壁纸
 */
function changeWallpaper() {
    if (!wallpapersData.wallpapers || wallpapersData.wallpapers.length === 0) {
        setGradientBackground();
        return;
    }
    
    currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapersData.wallpapers.length;
    loadWallpaper(currentWallpaperIndex);
}

// ==================== 网站置顶与统计 ====================

/**
 * 切换网站置顶状态
 * @param {string} url - 网站URL
 */
function togglePin(url) {
    const index = pinnedSites.indexOf(url);
    if (index > -1) {
        pinnedSites.splice(index, 1);
    } else {
        pinnedSites.push(url);
    }
    saveUserPreferences();
    renderWebsites(websiteSearchInput?.value || '');
}

/**
 * 记录网站访问次数
 * @param {string} url - 网站URL
 */
function recordVisit(url) {
    visitStats[url] = (visitStats[url] || 0) + 1;
    saveUserPreferences();
}

// ==================== 设置弹窗 ====================

/**
 * 打开设置弹窗
 */
function openSettings() {
    settingsModal.classList.add('show');
    updateStatsInfo();
}

/**
 * 关闭设置弹窗
 */
function closeSettings() {
    settingsModal.classList.remove('show');
}

/**
 * 更新统计信息显示
 */
function updateStatsInfo() {
    const statsInfo = document.getElementById('statsInfo');
    if (!statsInfo) return;
    
    const totalVisits = Object.values(visitStats).reduce((a, b) => a + b, 0);
    const topSites = Object.entries(visitStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    statsInfo.innerHTML = `
        <p>总访问次数: ${totalVisits}</p>
        <p>置顶网站: ${pinnedSites.length} 个</p>
        <p>自定义网站: ${customSites.length} 个</p>
        ${topSites.length > 0 ? `
            <p style="margin-top: 10px;">最常访问:</p>
            ${topSites.map(([url, count]) => {
                const site = [...websitesData, ...customSites].find(s => s.url === url);
                return `<p>• ${site ? site.name : url}: ${count} 次</p>`;
            }).join('')}
        ` : ''}
    `;
}

// ==================== 数据导入导出 ====================

/**
 * 导出用户配置为JSON文件
 */
function exportData() {
    const data = {
        searchEngine: currentSearchEngine?.name,
        darkMode: isDarkMode,
        searchHistory: searchHistory,
        pinnedSites: pinnedSites,
        customSites: customSites,
        visitStats: visitStats,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nav-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showError('配置已导出', true);
}

/**
 * 从文件导入用户配置
 * @param {File} file - JSON配置文件
 */
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 恢复各项配置
            if (data.searchEngine) {
                const engine = searchEngines.find(e => e.name === data.searchEngine);
                if (engine) currentSearchEngine = engine;
            }
            if (data.darkMode !== undefined) {
                isDarkMode = data.darkMode;
                document.body.classList.toggle('dark-mode', isDarkMode);
            }
            if (data.searchHistory) searchHistory = data.searchHistory;
            if (data.pinnedSites) pinnedSites = data.pinnedSites;
            if (data.customSites) customSites = data.customSites;
            if (data.visitStats) visitStats = data.visitStats;
            
            saveUserPreferences();
            updateThemeIcon();
            renderWebsites();
            showError('配置已导入', true);
        } catch (error) {
            showError('导入失败，文件格式错误');
        }
    };
    reader.readAsText(file);
}

/**
 * 清除所有数据
 */
function clearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
        localStorage.clear();
        location.reload();
    }
}

// ==================== 添加网站弹窗 ====================

/**
 * 打开添加网站弹窗
 */
function openAddWebsite() {
    const categorySelect = document.getElementById('newSiteCategory');
    categorySelect.innerHTML = categoriesData.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    addWebsiteModal.classList.add('show');
}

/**
 * 关闭添加网站弹窗
 */
function closeAddWebsite() {
    addWebsiteModal.classList.remove('show');
    document.getElementById('newSiteName').value = '';
    document.getElementById('newSiteUrl').value = '';
    document.getElementById('newSiteDesc').value = '';
}

/**
 * 保存新添加的网站
 */
function saveNewSite() {
    const name = document.getElementById('newSiteName').value.trim();
    const url = document.getElementById('newSiteUrl').value.trim();
    const desc = document.getElementById('newSiteDesc').value.trim();
    const category = document.getElementById('newSiteCategory').value;
    
    // 验证必填字段
    if (!name || !url) {
        showError('请填写网站名称和地址');
        return;
    }
    
    // 验证URL格式
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        showError('网站地址必须以 http:// 或 https:// 开头');
        return;
    }
    
    // 添加到自定义网站列表
    customSites.push({
        name,
        url,
        icon: '',
        desc: desc || name,
        categoryName: category
    });
    
    saveUserPreferences();
    renderWebsites();
    closeAddWebsite();
    showError('网站已添加', true);
}

// ==================== 快捷键处理 ====================

/**
 * 处理键盘快捷键
 * @param {KeyboardEvent} e - 键盘事件
 */
function handleKeyboardShortcuts(e) {
    // '/' 键聚焦搜索框
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Esc 键关闭所有弹窗
    if (e.key === 'Escape') {
        searchInput.blur();
        searchSuggestionsElement.classList.remove('show');
        searchEnginesDropdown.classList.remove('show');
        showSearchEngines = false;
        settingsModal.classList.remove('show');
        addWebsiteModal.classList.remove('show');
    }
    
    // Alt + 数字键切换分类
    if (e.altKey && e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        const index = parseInt(e.key);
        const categories = ['全部', ...categoriesData];
        if (index < categories.length) {
            activeCategory = categories[index];
            renderCategoryTabs();
            renderWebsites(websiteSearchInput?.value || '');
        }
    }
}

// ==================== 事件监听初始化 ====================

/**
 * 初始化所有事件监听器
 */
function initEventListeners() {
    // 搜索引擎按钮点击
    searchEngineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSearchEngines = !showSearchEngines;
        searchEnginesDropdown.classList.toggle('show', showSearchEngines);
    });

    // 搜索引擎下拉选项点击
    searchEnginesDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const option = e.target.closest('.search-engine-option');
        if (option) {
            const name = option.dataset.name;
            const engine = searchEngines.find(eng => eng.name === name);
            if (engine) {
                currentSearchEngine = engine;
                searchIconElement.src = engine.icon;
                searchEnginesDropdown.classList.remove('show');
                showSearchEngines = false;
                saveUserPreferences();
            }
        }
    });

    // 搜索按钮点击
    searchButton.addEventListener('click', performSearch);

    // 搜索输入框回车
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 搜索输入框输入事件（防抖）
    searchInput.addEventListener('input', debouncedHandleSearchInput);
    
    // 搜索输入框聚焦时显示历史
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '' && searchHistory.length > 0) {
            renderSearchHistory();
        }
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!searchEngineBtn.contains(e.target)) {
            searchEnginesDropdown.classList.remove('show');
            showSearchEngines = false;
        }

        if (!searchInput.contains(e.target) && !searchSuggestionsElement.contains(e.target)) {
            searchSuggestionsElement.classList.remove('show');
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 主题切换按钮
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }
    
    // 网站筛选输入框
    if (websiteSearchInput) {
        websiteSearchInput.addEventListener('input', debounce((e) => {
            renderWebsites(e.target.value);
        }, 200));
    }
    
    // 搜索建议点击
    searchSuggestionsElement.addEventListener('click', (e) => {
        const item = e.target.closest('.search-suggestion-item');
        if (item) {
            searchInput.value = item.dataset.text;
            searchSuggestionsElement.classList.remove('show');
            performSearch();
        }
        
        // 清除历史按钮
        if (e.target.id === 'clearHistory') {
            searchHistory = [];
            saveUserPreferences();
            searchSuggestionsElement.classList.remove('show');
        }
    });
    
    // 分类标签点击
    categoryTabsElement.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (tab) {
            activeCategory = tab.dataset.category;
            renderCategoryTabs();
            renderWebsites(websiteSearchInput?.value || '');
        }
    });
    
    // 网站卡片点击
    websitesGridElement.addEventListener('click', (e) => {
        // 置顶按钮点击
        const pinBtn = e.target.closest('.pin-btn');
        if (pinBtn) {
            e.stopPropagation();
            togglePin(pinBtn.dataset.url);
            return;
        }
        
        // 网站卡片点击
        const item = e.target.closest('.website-item');
        if (item) {
            recordVisit(item.dataset.url);
            window.open(item.dataset.url, '_blank');
        }
    });
    
    // 壁纸切换按钮
    if (changeWallpaperBtn) {
        changeWallpaperBtn.addEventListener('click', changeWallpaper);
    }
    
    // 添加网站按钮
    if (addWebsiteBtn) {
        addWebsiteBtn.addEventListener('click', openAddWebsite);
    }
    
    // 设置按钮
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }
    
    // 设置弹窗相关按钮
    document.getElementById('closeSettings')?.addEventListener('click', closeSettings);
    document.getElementById('closeAddWebsite')?.addEventListener('click', closeAddWebsite);
    document.getElementById('exportData')?.addEventListener('click', exportData);
    document.getElementById('importData')?.addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile')?.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            importData(e.target.files[0]);
        }
    });
    document.getElementById('clearAllData')?.addEventListener('click', clearAllData);
    document.getElementById('saveNewSite')?.addEventListener('click', saveNewSite);
    document.getElementById('cancelNewSite')?.addEventListener('click', closeAddWebsite);
    
    // 点击弹窗背景关闭
    settingsModal?.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });
    addWebsiteModal?.addEventListener('click', (e) => {
        if (e.target === addWebsiteModal) closeAddWebsite();
    });
}

// ==================== 初始化 ====================

/**
 * 页面初始化入口函数
 */
async function init() {
    // 设置随机背景
    setRandomBackground();

    // 启动时间更新
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 加载天气
    loadWeather();

    // 加载数据
    const loaded = await loadData();
    if (loaded) {
        // 更新主题图标
        updateThemeIcon();
        // 渲染页面
        renderSearchEngines();
        renderCategoryTabs();
        renderWebsites();
        // 初始化事件监听
        initEventListeners();
        
        // 注册 Service Worker（PWA支持）
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
