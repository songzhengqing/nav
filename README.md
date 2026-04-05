# 正清の导航页

一个简洁美观的个人导航页面，用于快速访问常用网站和进行网页搜索。

## 项目简介

本项目是一个基于纯前端技术开发的个人导航页面，无需后端支持，可直接部署在静态服务器或本地运行。页面提供了多引擎搜索、网站分类导航、实时时间显示、PWA支持等功能，适合作为浏览器首页或新标签页使用。

## 功能特性

### 1. 多引擎搜索

支持多种搜索引擎快速切换，包括：

| 搜索引擎   | 搜索地址                                 |
| ------ | ------------------------------------ |
| 百度     | <https://www.baidu.com/s?wd=>        |
| 必应     | <https://www.bing.com/search?q=>     |
| 搜狗     | <https://www.sogou.com/web?query=>   |
| 360    | <https://www.so.com/s?q=>            |
| Google | <https://www.google.com/search?q=>   |
| Yahoo  | <https://search.yahoo.com/search?p=> |
| Yandex | <https://yandex.com/search/?text=>   |
| Qwant  | <https://www.qwant.com/?q=>          |
| Brave  | <https://search.brave.com/search?q=> |
| GitHub | <https://github.com/search?q=>       |

### 2. 搜索建议

输入搜索关键词时，会自动调用百度搜索建议API，提供实时搜索建议，方便快速搜索。同时支持搜索历史记录。

### 3. 网站分类导航

网站按类别进行分组，支持以下分类：

- 工作
- 影音
- 学习&考试
- AI
- 境外网站
- 软件
- 壁纸
- 其它

### 4. 实时时间与天气

页面顶部显示当前时间和日期，包括：

- 实时时钟（时:分:秒）
- 当前日期（年月日 星期）
- 天气信息（自动获取）

### 5. 个性化功能

- **暗黑模式**：支持明暗主题切换，自动保存偏好
- **网站置顶**：可将常用网站置顶显示
- **访问统计**：记录网站访问次数，按热度排序
- **自定义网站**：用户可添加自己的网站
- **壁纸切换**：支持随机壁纸和手动切换

### 6. 数据管理

- **导出配置**：将所有设置导出为 JSON 文件
- **导入配置**：从备份文件恢复设置
- **本地存储**：数据保存在浏览器 localStorage

### 7. PWA支持

- 支持安装到桌面
- 支持离线访问
- Service Worker 缓存

### 8. 快捷键支持

| 快捷键         | 功能    |
| ----------- | ----- |
| `/`         | 聚焦搜索框 |
| `Alt + 0-8` | 切换分类  |
| `Esc`       | 关闭弹窗  |

### 9. 响应式设计

支持多种屏幕尺寸自适应：

- 大屏幕（>1500px）：5列网站展示
- 中等屏幕（992px-1500px）：4列网站展示
- 平板（768px-992px）：3列网站展示
- 手机（480px-768px）：2列网站展示
- 小屏手机（<480px）：1列网站展示

## 项目结构

```
nav/
├── css/
│   └── style.css           # 样式文件
├── js/
│   └── script.js           # JavaScript逻辑代码
├── data/
│   ├── searchEngines.json  # 搜索引擎配置
│   ├── websitesData.json   # 网站数据配置
│   └── wallpapers.json     # 壁纸配置
├── .gitignore              # Git忽略文件
├── index.html              # 主页面HTML结构
├── manifest.json           # PWA配置文件
├── sw.js                   # Service Worker
└── README.md               # 项目说明文档
```

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计，包括Flexbox布局、Grid布局、动画效果、响应式媒体查询、暗黑模式
- **JavaScript (ES6+)** - 交互逻辑，包括DOM操作、事件处理、JSONP跨域请求、localStorage
- **PWA** - Service Worker、Web App Manifest

## 快速开始

### 本地运行

1. 克隆项目到本地

```bash
git clone https://github.com/your-username/nav.git
```

1. 使用本地服务器运行（推荐）：

```bash
# 使用Python
python -m http.server 8080

# 使用Node.js
npx serve
```

1. 访问 `http://localhost:8080`

> 注意：由于使用了 fetch API 加载本地 JSON 文件，需要通过本地服务器运行，直接打开 index.html 会因跨域限制无法加载数据。

### 部署到静态服务器

将项目文件上传到任意静态文件服务器即可，如：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages
- 阿里云OSS
- 腾讯云COS

## 配置说明

### 修改搜索引擎

在 `data/searchEngines.json` 文件中修改搜索引擎配置：

```json
[
    { "name": "百度", "icon": "图标URL", "url": "https://www.baidu.com/s?wd=" },
    { "name": "必应", "icon": "图标URL", "url": "https://www.bing.com/search?q=" }
]
```

### 修改网站分类

在 `js/script.js` 文件中修改 `categoriesData` 数组：

```javascript
const categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '壁纸', '其它'];
```

### 添加/修改网站

在 `data/websitesData.json` 文件中修改网站数据：

```json
[
    {
        "name": "网站名称",
        "url": "https://example.com",
        "icon": "图标URL",
        "desc": "网站描述",
        "categoryName": "分类名称"
    }
]
```

### 修改壁纸

在 `data/wallpapers.json` 文件中修改壁纸配置：

```json
{
    "wallpapers": [
        "https://example.com/wallpaper1.jpg",
        "https://example.com/wallpaper2.jpg"
    ],
    "gradients": [
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    ]
}
```

## 数据结构

### 搜索引擎对象

```javascript
{
    name: String,   // 搜索引擎名称
    icon: String,   // 图标URL
    url: String     // 搜索URL模板（关键词拼接在末尾）
}
```

### 网站对象

```javascript
{
    name: String,         // 网站名称
    url: String,          // 网站地址
    icon: String,         // 网站图标URL
    desc: String,         // 网站描述
    categoryName: String  // 所属分类名称
}
```

### 壁纸配置对象

```javascript
{
    wallpapers: Array,    // 壁纸URL数组
    gradients: Array      // 渐变背景数组（壁纸加载失败时使用）
}
```

## 主要函数说明

| 函数名                           | 功能描述            |
| ----------------------------- | --------------- |
| `loadData()`                  | 加载JSON数据文件      |
| `loadUserPreferences()`       | 加载用户偏好设置        |
| `saveUserPreferences()`       | 保存用户偏好设置        |
| `updateDateTime()`            | 更新页面时间和日期显示     |
| `loadWeather()`               | 加载天气信息（带缓存）     |
| `renderSearchEngines()`       | 渲染搜索引擎选择下拉菜单    |
| `renderCategoryTabs()`        | 渲染分类标签页         |
| `renderWebsites()`            | 根据当前选中分类渲染网站列表  |
| `performSearch()`             | 执行搜索操作          |
| `getSearchSuggestions(query)` | 获取搜索建议（JSONP方式） |
| `toggleDarkMode()`            | 切换暗黑模式          |
| `togglePin(url)`              | 切换网站置顶状态        |
| `recordVisit(url)`            | 记录网站访问次数        |
| `exportData()`                | 导出用户配置          |
| `importData(file)`            | 导入用户配置          |
| `setRandomBackground()`       | 设置随机壁纸          |
| `changeWallpaper()`           | 切换壁纸            |
| `init()`                      | 页面初始化入口函数       |

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 其他现代浏览器

不支持 IE 浏览器。

## 注意事项

1. 部分内网网站（如大藤峡相关系统）仅在内网环境下可访问
2. 境外网站需要网络环境支持
3. 网站图标加载失败时会显示默认占位图标
4. 用户数据保存在浏览器 localStorage 中，清除浏览器数据会导致丢失
5. 建议定期使用"导出配置"功能备份数据

## 作者

宋伟华

## 开发工具

本项目使用 [Trae](https://trae.io/) 开发

## 许可证

MIT License

## 更新日志

### v1.0.0

- 初始版本发布
- 支持多引擎搜索
- 支持网站分类导航
- 支持搜索建议
- 响应式设计

### v1.0.1

- 新增暗黑模式支持
- 新增网站置顶功能
- 新增访问统计功能
- 新增自定义添加网站
- 新增壁纸切换功能
- 新增数据导出/导入功能
- 新增 PWA 支持（可安装到桌面、离线访问）
- 新增快捷键支持
- 新增天气显示
- 新增搜索历史记录
- 优化代码结构，文件按类型分类
- 优化性能，添加防抖、图片懒加载
- 优化天气API，添加缓存机制
- 添加 .gitignore 文件

