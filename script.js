let searchEngines = [];
let websitesData = [];

const categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '其它'];

let currentSearchEngine = null;
let activeCategory = '全部';
let showSearchEngines = false;
let searchQuery = '';
let searchSuggestions = [];

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

async function loadData() {
    try {
        const [searchEnginesRes, websitesRes] = await Promise.all([
            fetch('./data/searchEngines.json'),
            fetch('./data/websitesData.json')
        ]);
        
        searchEngines = await searchEnginesRes.json();
        websitesData = await websitesRes.json();
        
        currentSearchEngine = searchEngines[1] || searchEngines[0];
        
        return true;
    } catch (error) {
        console.error('加载数据失败:', error);
        return false;
    }
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

function renderSearchEngines() {
    if (!currentSearchEngine) return;
    
    searchIconElement.src = currentSearchEngine.icon;
    searchEnginesDropdown.innerHTML = searchEngines.map(engine => `
        <div class="search-engine-option" data-name="${engine.name}">
            <img src="${engine.icon}" alt="${engine.name}">
            <span>${engine.name}</span>
        </div>
    `).join('');

    searchEnginesDropdown.querySelectorAll('.search-engine-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const name = option.dataset.name;
            const engine = searchEngines.find(e => e.name === name);
            if (engine) {
                currentSearchEngine = engine;
                searchIconElement.src = engine.icon;
                searchEnginesDropdown.classList.remove('show');
                showSearchEngines = false;
            }
        });
    });
}

function renderCategoryTabs() {
    const categories = ['全部', ...categoriesData];
    categoryTabsElement.innerHTML = categories.map(category => `
        <button class="category-tab ${category === activeCategory ? 'active' : ''}" data-category="${category}">
            ${category}
        </button>
    `).join('');

    categoryTabsElement.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activeCategory = tab.dataset.category;
            renderCategoryTabs();
            renderWebsites();
        });
    });
}

function renderWebsites() {
    const defaultIcon = 'https://image.songzq.cn/other/02cb165d016fa0c02e01fe2321325df9.jpg';
    const filteredWebsites = activeCategory === '全部'
        ? websitesData
        : websitesData.filter(website => website.categoryName === activeCategory);

    websitesGridElement.innerHTML = filteredWebsites.map(website => `
        <div class="website-item" data-url="${website.url}">
            <div class="website-icon">
                <img src="${website.icon || defaultIcon}" alt="${website.name}" onerror="this.src='${defaultIcon}'">
            </div>
            <div class="website-info">
                <div class="website-name">${website.name}</div>
                <div class="website-desc">${website.desc}</div>
            </div>
        </div>
    `).join('');

    websitesGridElement.querySelectorAll('.website-item').forEach(item => {
        item.addEventListener('click', () => {
            window.open(item.dataset.url, '_blank');
        });
    });
}

function performSearch() {
    if (!currentSearchEngine) return;
    
    const query = searchInput.value.trim();
    if (query) {
        window.open(currentSearchEngine.url + encodeURIComponent(query), '_blank');
        searchInput.value = '';
        searchSuggestionsElement.classList.remove('show');
    }
}

function handleSearchInput() {
    const query = searchInput.value.trim();
    if (query) {
        getSearchSuggestions(query);
    } else {
        searchSuggestionsElement.classList.remove('show');
    }
}

function getSearchSuggestions(query) {
    const callbackName = 'handleSuggestions_' + Date.now();
    const apiUrl = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}&jsonp=${callbackName}`;

    window[callbackName] = function (data) {
        if (data && data[1] && Array.isArray(data[1])) {
            searchSuggestions = data[1].map(text => ({ text, desc: '', icon: '' }));
            renderSearchSuggestions();
        }
        delete window[callbackName];
        document.head.removeChild(script);
    };

    const script = document.createElement('script');
    script.src = apiUrl;
    script.onerror = function () {
        delete window[callbackName];
        document.head.removeChild(script);
    };
    document.head.appendChild(script);
}

function renderSearchSuggestions() {
    if (searchSuggestions.length > 0) {
        searchSuggestionsElement.innerHTML = searchSuggestions.map(suggestion => `
            <div class="search-suggestion-item" data-text="${suggestion.text}">
                <div class="suggestion-text">${suggestion.text}</div>
            </div>
        `).join('');
        searchSuggestionsElement.classList.add('show');

        searchSuggestionsElement.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                searchInput.value = item.dataset.text;
                searchSuggestionsElement.classList.remove('show');
                performSearch();
            });
        });
    } else {
        searchSuggestionsElement.classList.remove('show');
    }
}

function initEventListeners() {
    searchEngineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSearchEngines = !showSearchEngines;
        searchEnginesDropdown.classList.toggle('show', showSearchEngines);
    });

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('input', handleSearchInput);

    document.addEventListener('click', (e) => {
        if (!searchEngineBtn.contains(e.target)) {
            searchEnginesDropdown.classList.remove('show');
            showSearchEngines = false;
        }

        if (!searchInput.contains(e.target) && !searchSuggestionsElement.contains(e.target)) {
            searchSuggestionsElement.classList.remove('show');
        }
    });
}

async function init() {
    backgroundElement.style.backgroundImage = `url('https://image.songzq.cn/wallpaper/001.jpg')`;

    updateDateTime();
    setInterval(updateDateTime, 1000);

    const loaded = await loadData();
    if (loaded) {
        renderSearchEngines();
        renderCategoryTabs();
        renderWebsites();
        initEventListeners();
    }
}

document.addEventListener('DOMContentLoaded', init);
