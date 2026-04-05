let searchEngines = [];
let websitesData = [];

const categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '壁纸', '其它'];

let currentSearchEngine = null;
let activeCategory = '全部';
let showSearchEngines = false;
let searchQuery = '';
let searchSuggestions = [];
let searchHistory = [];
let isDarkMode = false;

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

const STORAGE_KEYS = {
    SEARCH_ENGINE: 'nav_search_engine',
    DARK_MODE: 'nav_dark_mode',
    SEARCH_HISTORY: 'nav_search_history',
    CUSTOM_SITES: 'nav_custom_sites'
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
}

function saveUserPreferences() {
    if (currentSearchEngine) {
        localStorage.setItem(STORAGE_KEYS.SEARCH_ENGINE, currentSearchEngine.name);
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searchHistory));
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
        const [searchEnginesRes, websitesRes] = await Promise.all([
            fetch('./data/searchEngines.json'),
            fetch('./data/websitesData.json')
        ]);
        
        if (!searchEnginesRes.ok || !websitesRes.ok) {
            throw new Error('数据加载失败');
        }
        
        searchEngines = await searchEnginesRes.json();
        websitesData = await websitesRes.json();
        
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

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
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
    
    try {
        const response = await fetch('https://api.vvhan.com/api/weather');
        const data = await response.json();
        if (data && data.info) {
            weatherElement.textContent = data.info;
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
    
    let filteredWebsites = activeCategory === '全部'
        ? websitesData
        : websitesData.filter(website => website.categoryName === activeCategory);
    
    if (filterText) {
        const lowerFilter = filterText.toLowerCase();
        filteredWebsites = filteredWebsites.filter(website => 
            website.name.toLowerCase().includes(lowerFilter) ||
            website.desc.toLowerCase().includes(lowerFilter)
        );
    }

    if (filteredWebsites.length === 0) {
        websitesGridElement.innerHTML = `
            <div class="no-results">
                <p>暂无匹配的网站</p>
            </div>
        `;
        return;
    }

    websitesGridElement.innerHTML = filteredWebsites.map(website => `
        <div class="website-item" data-url="${website.url}">
            <div class="website-icon">
                <img src="${website.icon || defaultIcon}" alt="${website.name}" loading="lazy" onerror="this.src='${defaultIcon}'">
            </div>
            <div class="website-info">
                <div class="website-name">${website.name}</div>
                <div class="website-desc">${website.desc}</div>
            </div>
        </div>
    `).join('');
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
    const wallpapers = [
        'https://image.songzq.cn/wallpaper/001.jpg',
        'https://image.songzq.cn/wallpaper/002.jpg',
        'https://image.songzq.cn/wallpaper/003.jpg',
        'https://image.songzq.cn/wallpaper/004.jpg',
        'https://image.songzq.cn/wallpaper/005.jpg',
        'https://image.songzq.cn/wallpaper/006.jpg',
        'https://image.songzq.cn/wallpaper/007.jpg',
        'https://image.songzq.cn/wallpaper/008.jpg',
        'https://image.songzq.cn/wallpaper/009.jpg',
        'https://image.songzq.cn/wallpaper/010.jpg',
        'https://image.songzq.cn/wallpaper/011.jpg',
        'https://image.songzq.cn/wallpaper/012.jpg',
        'https://image.songzq.cn/wallpaper/013.jpg'
    ];
    
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    ];
    
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    const selectedWallpaper = wallpapers[randomIndex];
    
    const img = new Image();
    img.onload = function() {
        backgroundElement.style.backgroundImage = `url('${selectedWallpaper}')`;
    };
    img.onerror = function() {
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        backgroundElement.style.background = randomGradient;
    };
    img.src = selectedWallpaper;
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
        const item = e.target.closest('.website-item');
        if (item) {
            window.open(item.dataset.url, '_blank');
        }
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
    }
}

document.addEventListener('DOMContentLoaded', init);
