const searchEngines = [
    { name: '百度', icon: 'https://image.songzq.cn/logo/baidu.ico', url: 'https://www.baidu.com/s?wd=' },
    { name: '必应', icon: 'https://image.songzq.cn/logo/bing.ico', url: 'https://www.bing.com/search?q=' },
    { name: '搜狗', icon: 'https://image.songzq.cn/logo/sogou.ico', url: 'https://www.sogou.com/web?query=' },
    { name: 'Google', icon: 'https://image.songzq.cn/logo/google.ico', url: 'https://www.google.com/search?q=' },
    { name: 'Yandex', icon: 'https://image.songzq.cn/logo/yandex.ico', url: 'https://yandex.com/search/?text=' },
    { name: 'Qwant', icon: 'https://image.songzq.cn/logo/qwant.png', url: 'https://www.qwant.com/?q=' },
    { name: 'Brave', icon: 'https://image.songzq.cn/logo/brave.svg', url: 'https://search.brave.com/search?q=' },
    { name: 'GitHub', icon: 'https://image.songzq.cn/logo/github.svg', url: 'https://github.com/search?q=' }
];

const categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '其它'];


const websitesData = [
    {
        name: '珠江委OA系统',
        url: 'http://10.7.1.153/OA/userLogins.do',
        icon: 'https://image.songzq.cn/logo/pearlwater.ico',
        desc: '珠江水利委员会办公自动化系统',
        categoryName: '工作'
    },
    {
        name: '大藤峡治理平台',
        url: 'http://10.7.87.8/universe/ui/projects/2',
        icon: 'https://image.songzq.cn/logo/datengxia.ico',
        desc: '大藤峡水利枢纽工程治理平台',
        categoryName: '工作'
    },
    {
        name: '大藤峡可视化平台',
        url: 'http://10.7.87.17/page/b612d7f7c1def4993981cc06',
        icon: 'https://image.songzq.cn/logo/datengxia.ico',
        desc: '大藤峡工程可视化监控平台',
        categoryName: '工作'
    },
    {
        name: '大藤峡综合管理平台',
        url: 'http://10.7.87.6:8080/#/login?redirect=%2FassetsPortal',
        icon: 'https://image.songzq.cn/logo/datengxia.ico',
        desc: '大藤峡综合管理信息平台',
        categoryName: '工作'
    },
    {
        name: '大藤峡数据中心',
        url: 'http://10.7.87.99/#/login',
        icon: 'https://image.songzq.cn/logo/datengxia.ico',
        desc: '大藤峡工程数据中心',
        categoryName: '工作'
    },
    {
        name: '大藤峡OA系统（旧）',
        url: 'http://10.7.70.9:8888/Portal/homePage/index',
        icon: 'https://image.songzq.cn/logo/datengxia.ico',
        desc: '大藤峡旧版办公系统',
        categoryName: '工作'
    },
    {
        name: '大藤峡OA系统（新）',
        url: 'http://10.7.88.1:8088/seeyon/main.do?method=main',
        icon: 'https://image.songzq.cn/logo/datengxia.ico',
        desc: '大藤峡新版办公系统',
        categoryName: '工作'
    },
    {
        name: '天玥运维安全网关',
        url: 'https://10.7.61.195/client/login/index',
        icon: 'https://image.songzq.cn/logo/yunwei.ico',
        desc: '天玥运维安全访问网关',
        categoryName: '工作'
    },
    {
        name: '中国水利教育培训网',
        url: 'http://cwet.mwr.cn/lms/app/lms/portal/Portal/index.do',
        icon: 'https://image.songzq.cn/logo/cwet.png',
        desc: '水利系统教育培训平台',
        categoryName: '工作'
    },
    {
        name: '腾讯文档',
        url: 'https://docs.qq.com/desktop/',
        icon: 'https://image.songzq.cn/logo/tencentdocs.ico',
        desc: '在线文档协作平台',
        categoryName: '工作'
    },
    {
        name: '爱奇艺',
        url: 'https://www.iqiyi.com',
        icon: 'https://image.songzq.cn/logo/iqiyi.ico',
        desc: '高清视频在线观看平台',
        categoryName: '影音'
    },
    {
        name: '抖音',
        url: 'https://www.douyin.com',
        icon: 'https://image.songzq.cn/logo/douyin.ico',
        desc: '短视频分享平台',
        categoryName: '影音'
    },
    {
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        icon: 'https://image.songzq.cn/logo/bilibili.ico',
        desc: '年轻人喜爱的视频网站',
        categoryName: '影音'
    },
    {
        name: '腾讯视频',
        url: 'https://v.qq.com',
        icon: 'https://image.songzq.cn/logo/txsp.ico',
        desc: '腾讯视频在线观看',
        categoryName: '影音'
    },
    {
        name: '国家开放大学',
        url: 'https://one.ouchn.cn/',
        icon: 'https://image.songzq.cn/logo/ouchn.ico',
        desc: '国家开放大学学习平台',
        categoryName: '学习&考试'
    },
    {
        name: '广西开放大学',
        url: 'https://lms.ouchn.cn/user/index#/',
        icon: 'https://image.songzq.cn/logo/gxouchn.ico',
        desc: '广西开放大学学习平台',
        categoryName: '学习&考试'
    },
    {
        name: '广东省教育考试院',
        url: 'https://eea.gd.gov.cn/',
        icon: 'https://image.songzq.cn/logo/gdeea.ico',
        desc: '广东省教育考试信息发布',
        categoryName: '学习&考试'
    },
    {
        name: '计算机职业资格网',
        url: 'https://www.ruankao.org.cn/',
        icon: 'https://image.songzq.cn/logo/ruankao.ico',
        desc: '计算机技术与软件专业技术资格考试',
        categoryName: '学习&考试'
    },
    {
        name: 'PETS',
        url: 'https://pets.neea.edu.cn/',
        icon: 'https://image.songzq.cn/logo/pets.ico',
        desc: '全国英语等级考试',
        categoryName: '学习&考试'
    },
    {
        name: '广东自考管理系统',
        url: 'https://www.eeagd.edu.cn/zkselfec/',
        icon: 'https://image.songzq.cn/logo/gdzk.ico',
        desc: '广东省自学考试管理系统',
        categoryName: '学习&考试'
    },
    {
        name: '深圳大学计算机继续教育办公室',
        url: 'https://csse.szu.edu.cn/zk/',
        icon: 'https://image.songzq.cn/logo/szu.ico',
        desc: '深圳大学计算机继续教育',
        categoryName: '学习&考试'
    },
    {
        name: '科科过-软考培训',
        url: 'https://www.kekeguo.net/',
        icon: 'https://image.songzq.cn/logo/kekeguo.ico',
        desc: '软考培训专业机构',
        categoryName: '学习&考试'
    },
    {
        name: '笔果',
        url: 'https://www.biguotk.com/',
        icon: 'https://image.songzq.cn/logo/biguotk.ico',
        desc: '考试备考资料平台',
        categoryName: '学习&考试'
    },
    {
        name: '学信网',
        url: 'https://www.chsi.com.cn/',
        icon: 'https://image.songzq.cn/logo/chsi.ico',
        desc: '中国高等教育学生信息网',
        categoryName: '学习&考试'
    },
    {
        name: 'Deepseek',
        url: 'https://chat.deepseek.com/',
        icon: 'https://image.songzq.cn/logo/deepseek.svg',
        desc: '深度求索AI对话',
        categoryName: 'AI'
    },
    {
        name: '元宝',
        url: 'https://yuanbao.tencent.com/',
        icon: 'https://image.songzq.cn/logo/yuanbao.ico',
        desc: '腾讯元宝AI助手',
        categoryName: 'AI'
    },
    {
        name: '秘塔',
        url: 'https://metaso.cn/',
        icon: 'https://image.songzq.cn/logo/metaso.ico',
        desc: '秘塔AI写作助手',
        categoryName: 'AI'
    },
    {
        name: 'Kimi',
        url: 'https://www.kimi.com/',
        icon: 'https://image.songzq.cn/logo/kimi.ico',
        desc: '月之暗面AI助手',
        categoryName: 'AI'
    },
    {
        name: '豆包',
        url: 'https://www.doubao.com/chat/',
        icon: 'https://image.songzq.cn/logo/doubao.ico',
        desc: '字节跳动AI助手',
        categoryName: 'AI'
    },
    {
        name: '文心一言',
        url: 'https://yiyan.baidu.com/',
        icon: 'https://image.songzq.cn/logo/yiyan.ico',
        desc: '百度AI对话助手',
        categoryName: 'AI'
    },
    {
        name: '通义千问',
        url: 'https://www.qianwen.com/',
        icon: 'https://image.songzq.cn/logo/qianwen.ico',
        desc: '阿里巴巴AI助手',
        categoryName: 'AI'
    },
    {
        name: '龙猫',
        url: 'https://longcat.chat/',
        icon: 'https://image.songzq.cn/logo/longcat.svg',
        desc: '美团龙猫AI助手',
        categoryName: 'AI'
    },
    {
        name: 'Gmail',
        url: 'https://mail.google.com/',
        icon: 'https://image.songzq.cn/logo/gmail.ico',
        desc: '谷歌邮箱服务',
        categoryName: '境外网站'
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/',
        icon: 'https://image.songzq.cn/logo/instagram.webp',
        desc: '图片分享社交平台',
        categoryName: '境外网站'
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/',
        icon: 'https://image.songzq.cn/logo/youtube.ico',
        desc: '全球视频分享平台',
        categoryName: '境外网站'
    },
    {
        name: 'Messenger',
        url: 'https://www.messenger.com/',
        icon: 'https://image.songzq.cn/logo/messenger.ico',
        desc: 'Facebook即时通讯',
        categoryName: '境外网站'
    },
    {
        name: 'Telegram',
        url: 'https://web.telegram.org/a/',
        icon: 'https://image.songzq.cn/logo/telegram.ico',
        desc: '加密即时通讯应用',
        categoryName: '境外网站'
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
        icon: 'https://image.songzq.cn/logo/facebook.webp',
        desc: '全球社交网络平台',
        categoryName: '境外网站'
    },
    {
        name: 'Reddit',
        url: 'https://www.reddit.com/',
        icon: 'https://image.songzq.cn/logo/reddit.ico',
        desc: '社交新闻聚合平台',
        categoryName: '境外网站'
    },
    {
        name: 'X',
        url: 'https://x.com/home',
        icon: 'https://image.songzq.cn/logo/x.ico',
        desc: '原Twitter社交平台',
        categoryName: '境外网站'
    },
    {
        name: 'Twitch',
        url: 'https://www.twitch.tv/',
        icon: 'https://image.songzq.cn/logo/twitch.ico',
        desc: '游戏直播平台',
        categoryName: '境外网站'
    },
    {
        name: 'WhatsApp',
        url: 'https://www.whatsapp.com/',
        icon: 'https://image.songzq.cn/logo/whatsapp.ico',
        desc: '跨平台即时通讯',
        categoryName: '境外网站'
    },
    {
        name: 'Pinterest',
        url: 'https://www.pinterest.com/',
        icon: 'https://image.songzq.cn/logo/pinterest.ico',
        desc: '图片分享社交平台',
        categoryName: '境外网站'
    },
    {
        name: 'VS Code',
        url: 'https://code.visualstudio.com/',
        icon: 'https://image.songzq.cn/logo/vscode.ico',
        desc: '微软开发的免费代码编辑器',
        categoryName: '软件'
    },
    {
        name: 'Trae',
        url: 'https://www.trae.cn/',
        icon: 'https://image.songzq.cn/logo/trae.ico',
        desc: 'AI驱动的开发工具',
        categoryName: '软件'
    },
    {
        name: 'Postman',
        url: 'https://www.postman.com/',
        icon: 'https://image.songzq.cn/logo/postman.ico',
        desc: 'API开发和测试工具',
        categoryName: '软件'
    },
    {
        name: 'Navicat',
        url: 'https://www.navicat.com.cn/',
        icon: 'https://image.songzq.cn/logo/navicat.ico',
        desc: '数据库管理工具',
        categoryName: '软件'
    },
    {
        name: 'Typora',
        url: 'https://typora.io/',
        icon: 'https://image.songzq.cn/logo/typora.png',
        desc: 'Markdown编辑器',
        categoryName: '软件'
    },
    {
        name: 'Notepad++',
        url: 'https://notepad-plus-plus.org/',
        icon: 'https://image.songzq.cn/logo/notepad.ico',
        desc: '免费的代码编辑器',
        categoryName: '软件'
    },
    {
        name: '知网',
        url: 'https://www.cnki.net/',
        icon: 'https://image.songzq.cn/logo/cnki.ico',
        desc: '中国知网学术文献平台',
        categoryName: '其它'
    },
    {
        name: '万方',
        url: 'https://www.wanfangdata.com.cn/',
        icon: 'https://image.songzq.cn/logo/wanfangdata.ico',
        desc: '万方数据知识服务平台',
        categoryName: '其它'
    },
    {
        name: '水利部',
        url: 'http://www.mwr.gov.cn/',
        icon: 'https://image.songzq.cn/logo/mwr.ico',
        desc: '中华人民共和国水利部',
        categoryName: '其它'
    },
    {
        name: '珠江委',
        url: 'https://www.pearlwater.gov.cn/',
        icon: 'https://image.songzq.cn/logo/pearlwater.ico',
        desc: '珠江水利委员会',
        categoryName: '其它'
    },
    {
        name: '珠江委技术中心',
        url: 'http://www.zwjszx.com/',
        icon: 'https://image.songzq.cn/logo/zwjszx.ico',
        desc: '珠江委技术咨询中心',
        categoryName: '其它'
    },
    {
        name: 'iconfont',
        url: 'https://www.iconfont.cn/',
        icon: 'https://image.songzq.cn/logo/iconfont.svg',
        desc: 'iconfont-国内功能很强大且图标内容很丰富的矢量图标库，提供矢量图标下载、在线存储、格式转换等功能。阿里巴巴体验团队倾力打造，设计和前端开发的便捷工具',
        categoryName: '其它'
    },
    {
        name: 'CSDN',
        url: 'https://www.csdn.net/',
        icon: 'https://image.songzq.cn/logo/csdn.ico',
        desc: '程序员技术社区',
        categoryName: '其它'
    },
    {
        name: 'Hello算法',
        url: 'https://www.hello-algo.com/',
        icon: 'https://image.songzq.cn/logo/helloalgo.ico',
        desc: '算法学习网站',
        categoryName: '其它'
    },
    {
        name: 'DataTool',
        url: 'https://www.datatool.vip/',
        icon: 'https://image.songzq.cn/logo/datatool.ico',
        desc: '数据处理工具集合',
        categoryName: '其它'
    },
    {
        name: 'GreenVideo',
        url: 'https://greenvideo.cc/video/player',
        icon: 'https://image.songzq.cn/logo/greenvideo.ico',
        desc: '视频在线播放',
        categoryName: '其它'
    },
    {
        name: 'PaywallBuster',
        url: 'https://paywallbuster.com/',
        icon: 'https://image.songzq.cn/logo/paywallbuster.png',
        desc: '付费内容解锁工具',
        categoryName: '其它'
    },
    {
        name: '阿里云',
        url: 'https://www.aliyun.com/',
        icon: 'https://image.songzq.cn/logo/aliyun.webp',
        desc: '阿里云,AI,大模型,千问,云服务器,云数据库,域名注册备案',
        categoryName: '其它'
    }
];

let currentSearchEngine = searchEngines[1];
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

function init() {
    backgroundElement.style.backgroundImage = `url('https://image.songzq.cn/wallpaper/001.jpg')`;

    updateDateTime();
    setInterval(updateDateTime, 1000);

    renderSearchEngines();
    renderCategoryTabs();
    renderWebsites();
    initEventListeners();
}

document.addEventListener('DOMContentLoaded', init);
