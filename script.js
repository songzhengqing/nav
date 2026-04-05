let searchEngines = [];
let websitesData = [];
let wallpapersData = [];
let categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '壁纸', '其它'];

let currentSearchEngine = null;
let activeCategory = '全部';
let showSearchEngines = false;
let searchSuggestions = [];
let searchHistory = [];
let isDarkMode = false;
let pinnedSites = [];
let customSites = [];
let visitStats = {};
let currentWallpaperIndex = 0;

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

const STORAGE_KEYS = {
    SEARCH_ENGINE: 'nav_search_engine',
    DARK_MODE: 'nav_dark_mode',
    SEARCH_HISTORY: 'nav_search_history',
    PINNED_SITES: 'nav_pinned_sites',
    CUSTOM_SITES: 'nav_custom_sites',
    VISIT_STATS: 'nav_visit_stats',
    WEATHER_CACHE: 'nav_weather_cache'
};

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

function loadUserPreferences() {
    const savedEngine = localStorage.getItem(STORAGE_KEYS.SEARCH_ENGINE);
    if (savedEngine) {
        const engine = searchEngines.find(e => e.name === savedEngine);
        if (engine) currentSearchEngine = engine;
    }
    
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (savedDarkMode === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
    
    const savedHistory = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    if (savedHistory) {
        searchHistory = JSON.parse(savedHistory);
    }
    
    const savedPinned = localStorage.getItem(STORAGE_KEYS.PINNED_SITES);
    if (savedPinned) {
        pinnedSites = JSON.parse(savedPinned);
    }
    
    const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_SITES);
    if (savedCustom) {
        customSites = JSON.parse(savedCustom);
    }
    
    const savedStats = localStorage.getItem(STORAGE_KEYS.VISIT_STATS);
    if (savedStats) {
        visitStats = JSON.parse(savedStats);
    }
}

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

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
    updateThemeIcon();
}

function updateThemeIcon() {
    if (themeToggleBtn) {
        themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

async function loadData() {
    try {
        showLoading(true);
        const [searchEnginesRes, websitesRes, wallpapersRes] = await Promise.all([
            fetch('./data/searchEngines.json'),
            fetch('./data/websitesData.json'),
            fetch('./data/wallpapers.json')
        ]);
        
        if (!searchEnginesRes.ok || !websitesRes.ok) {
            throw new Error('数据加载失败');
        }
        
        searchEngines = await searchEnginesRes.json();
        websitesData = await websitesRes.json();
        
        if (wallpapersRes.ok) {
            wallpapersData = await wallpapersRes.json();
        }
        
        currentSearchEngine = searchEngines[1] || searchEngines[0];
        
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

function showLoading(show) {
    if (loadingElement) {
        loadingElement.style.display = show ? 'flex' : 'none';
    }
}

function showError(message, isSuccess = false) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast' + (isSuccess ? ' success-toast' : '');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    currentDateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
}

async function loadWeather() {
    if (!weatherElement) return;
    
    const cached = localStorage.getItem(STORAGE_KEYS.WEATHER_CACHE);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const hour = 3600000;
        if (Date.now() - timestamp < hour) {
            weatherElement.textContent = data;
            return;
        }
    }
    
    try {
        const response = await fetch('https://api.vvhan.com/api/weather');
        const data = await response.json();
        if (data && data.info) {
            weatherElement.textContent = data.info;
            localStorage.setItem(STORAGE_KEYS.WEATHER_CACHE, JSON.stringify({
                data: data.info,
                timestamp: Date.now()
            }));
        }
    } catch (error) {
        weatherElement.textContent = '';
    }
}

function renderSearchEngines() {
    if (!currentSearchEngine) return;
    
    searchIconElement.src = currentSearchEngine.icon;
    searchEnginesDropdown.innerHTML = searchEngines.map(engine => `
        <div class="search-engine-option" data-name="${engine.name}">
            <img src="${engine.icon}" alt="${engine.name}" loading="lazy">
            <span>${engine.name}</span>
        </div>
    `).join('');
}

function renderCategoryTabs() {
    const categories = ['全部', ...categoriesData];
    categoryTabsElement.innerHTML = categories.map((category, index) => `
        <button class="category-tab ${category === activeCategory ? 'active' : ''}" data-category="${category}" data-index="${index}">
            ${category}
        </button>
    `).join('');
}

function renderWebsites(filterText = '') {
    const defaultIcon = 'https://image.songzq.cn/other/02cb165d016fa0c02e01fe2321325df9.jpg';
    
    let allSites = [...websitesData, ...customSites];
    
    let filteredWebsites = activeCategory === '全部'
        ? allSites
        : allSites.filter(website => website.categoryName === activeCategory);
    
    if (filterText) {
        const lowerFilter = filterText.toLowerCase();
        filteredWebsites = filteredWebsites.filter(website => 
            website.name.toLowerCase().includes(lowerFilter) ||
            website.desc.toLowerCase().includes(lowerFilter)
        );
    }

    filteredWebsites.sort((a, b) => {
        const aPinned = pinnedSites.includes(a.url);
        const bPinned = pinnedSites.includes(b.url);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        
        const aVisits = visitStats[a.url] || 0;
        const bVisits = visitStats[b.url] || 0;
        return bVisits - aVisits;
    });

    if (filteredWebsites.length === 0) {
        websitesGridElement.innerHTML = `
            <div class="no-results">
                <p>暂无匹配的网站</p>
            </div>
        `;
        return;
    }

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

function performSearch() {
    if (!currentSearchEngine) return;
    
    const query = searchInput.value.trim();
    if (query) {
        if (!searchHistory.includes(query)) {
            searchHistory.unshift(query);
            if (searchHistory.length > 10) searchHistory.pop();
            saveUserPreferences();
        }
        
        window.open(currentSearchEngine.url + encodeURIComponent(query), '_blank');
        searchInput.value = '';
        searchSuggestionsElement.classList.remove('show');
    }
}

const debouncedHandleSearchInput = debounce(handleSearchInput, 300);

function handleSearchInput() {
    const query = searchInput.value.trim();
    if (query) {
        getSearchSuggestions(query);
    } else {
        renderSearchHistory();
    }
}

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

function getSearchSuggestions(query) {
    const callbackName = 'handleSuggestions_' + Date.now();
    const apiUrl = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=${callbackName}`;

    window[callbackName] = function (data) {
        if (data && data.s && Array.isArray(data.s)) {
            searchSuggestions = data.s.slice(0, 8).map(text => ({ text, desc: '', icon: '' }));
            renderSearchSuggestions();
        }
        delete window[callbackName];
        const scriptEl = document.getElementById('suggestion_script');
        if (scriptEl && scriptEl.parentNode) {
            scriptEl.parentNode.removeChild(scriptEl);
        }
    };

    let script = document.getElementById('suggestion_script');
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
    
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

function setRandomBackground() {
    if (!wallpapersData.wallpapers || wallpapersData.wallpapers.length === 0) {
        setGradientBackground();
        return;
    }
    
    currentWallpaperIndex = Math.floor(Math.random() * wallpapersData.wallpapers.length);
    loadWallpaper(currentWallpaperIndex);
}

function loadWallpaper(index) {
    const selectedWallpaper = wallpapersData.wallpapers[index];
    
    const img = new Image();
    img.onload = function() {
        backgroundElement.style.backgroundImage = `url('${selectedWallpaper}')`;
    };
    img.onerror = function() {
        setGradientBackground();
    };
    img.src = selectedWallpaper;
}

function setGradientBackground() {
    const gradients = wallpapersData.gradients || [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    backgroundElement.style.background = randomGradient;
}

function changeWallpaper() {
    if (!wallpapersData.wallpapers || wallpapersData.wallpapers.length === 0) {
        setGradientBackground();
        return;
    }
    
    currentWallpaperIndex = (currentWallpaperIndex + 1) % wallpapersData.wallpapers.length;
    loadWallpaper(currentWallpaperIndex);
}

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

function recordVisit(url) {
    visitStats[url] = (visitStats[url] || 0) + 1;
    saveUserPreferences();
}

function openSettings() {
    settingsModal.classList.add('show');
    updateStatsInfo();
}

function closeSettings() {
    settingsModal.classList.remove('show');
}

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

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
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

function clearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
        localStorage.clear();
        location.reload();
    }
}

function openAddWebsite() {
    const categorySelect = document.getElementById('newSiteCategory');
    categorySelect.innerHTML = categoriesData.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    addWebsiteModal.classList.add('show');
}

function closeAddWebsite() {
    addWebsiteModal.classList.remove('show');
    document.getElementById('newSiteName').value = '';
    document.getElementById('newSiteUrl').value = '';
    document.getElementById('newSiteDesc').value = '';
}

function saveNewSite() {
    const name = document.getElementById('newSiteName').value.trim();
    const url = document.getElementById('newSiteUrl').value.trim();
    const desc = document.getElementById('newSiteDesc').value.trim();
    const category = document.getElementById('newSiteCategory').value;
    
    if (!name || !url) {
        showError('请填写网站名称和地址');
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        showError('网站地址必须以 http:// 或 https:// 开头');
        return;
    }
    
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

function handleKeyboardShortcuts(e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
    
    if (e.key === 'Escape') {
        searchInput.blur();
        searchSuggestionsElement.classList.remove('show');
        searchEnginesDropdown.classList.remove('show');
        showSearchEngines = false;
        settingsModal.classList.remove('show');
        addWebsiteModal.classList.remove('show');
    }
    
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

function initEventListeners() {
    searchEngineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSearchEngines = !showSearchEngines;
        searchEnginesDropdown.classList.toggle('show', showSearchEngines);
    });

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

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('input', debouncedHandleSearchInput);
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '' && searchHistory.length > 0) {
            renderSearchHistory();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchEngineBtn.contains(e.target)) {
            searchEnginesDropdown.classList.remove('show');
            showSearchEngines = false;
        }

        if (!searchInput.contains(e.target) && !searchSuggestionsElement.contains(e.target)) {
            searchSuggestionsElement.classList.remove('show');
        }
    });
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleDarkMode);
    }
    
    if (websiteSearchInput) {
        websiteSearchInput.addEventListener('input', debounce((e) => {
            renderWebsites(e.target.value);
        }, 200));
    }
    
    searchSuggestionsElement.addEventListener('click', (e) => {
        const item = e.target.closest('.search-suggestion-item');
        if (item) {
            searchInput.value = item.dataset.text;
            searchSuggestionsElement.classList.remove('show');
            performSearch();
        }
        
        if (e.target.id === 'clearHistory') {
            searchHistory = [];
            saveUserPreferences();
            searchSuggestionsElement.classList.remove('show');
        }
    });
    
    categoryTabsElement.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (tab) {
            activeCategory = tab.dataset.category;
            renderCategoryTabs();
            renderWebsites(websiteSearchInput?.value || '');
        }
    });
    
    websitesGridElement.addEventListener('click', (e) => {
        const pinBtn = e.target.closest('.pin-btn');
        if (pinBtn) {
            e.stopPropagation();
            togglePin(pinBtn.dataset.url);
            return;
        }
        
        const item = e.target.closest('.website-item');
        if (item) {
            recordVisit(item.dataset.url);
            window.open(item.dataset.url, '_blank');
        }
    });
    
    if (changeWallpaperBtn) {
        changeWallpaperBtn.addEventListener('click', changeWallpaper);
    }
    
    if (addWebsiteBtn) {
        addWebsiteBtn.addEventListener('click', openAddWebsite);
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }
    
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
    
    settingsModal?.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });
    addWebsiteModal?.addEventListener('click', (e) => {
        if (e.target === addWebsiteModal) closeAddWebsite();
    });
}

async function init() {
    setRandomBackground();

    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    loadWeather();

    const loaded = await loadData();
    if (loaded) {
        updateThemeIcon();
        renderSearchEngines();
        renderCategoryTabs();
        renderWebsites();
        initEventListeners();
        
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
