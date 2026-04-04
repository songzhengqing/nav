# 正清の导航页

一个简洁美观的个人导航页面，用于快速访问常用网站和进行网页搜索。

## 项目简介

本项目是一个基于纯前端技术开发的个人导航页面，无需后端支持，可直接部署在静态服务器或本地运行。页面提供了多引擎搜索、网站分类导航、实时时间显示等功能，适合作为浏览器首页或新标签页使用。

## 功能特性

### 1. 多引擎搜索

支持多种搜索引擎快速切换，包括：

| 搜索引擎 | 搜索地址 |
|---------|---------|
| 百度 | https://www.baidu.com/s?wd= |
| 必应 | https://www.bing.com/search?q= |
| 搜狗 | https://www.sogou.com/web?query= |
| Google | https://www.google.com/search?q= |
| Yandex | https://yandex.com/search/?text= |
| Qwant | https://www.qwant.com/?q= |
| Brave | https://search.brave.com/search?q= |
| GitHub | https://github.com/search?q= |

### 2. 搜索建议

输入搜索关键词时，会自动调用必应搜索建议API，提供实时搜索建议，方便快速搜索。

### 3. 网站分类导航

网站按类别进行分组，支持以下分类：

- 工作
- 影音
- 学习&考试
- AI
- 境外网站
- 软件
- 其它

### 4. 实时时间显示

页面顶部显示当前时间和日期，包括：
- 实时时钟（时:分:秒）
- 当前日期（年月日 星期）

### 5. 响应式设计

支持多种屏幕尺寸自适应：
- 大屏幕（>1500px）：5列网站展示
- 中等屏幕（992px-1500px）：4列网站展示
- 平板（768px-992px）：3列网站展示
- 手机（480px-768px）：2列网站展示
- 小屏手机（<480px）：1列网站展示

## 项目结构

```
nav/
├── index.html      # 主页面HTML结构
├── style.css       # 样式文件
├── script.js       # JavaScript逻辑代码
├── logo/           # 网站图标资源目录
│   └── favicon.jpg # 网站favicon
└── README.md       # 项目说明文档
```

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计，包括Flexbox布局、Grid布局、动画效果、响应式媒体查询
- **JavaScript (ES6+)** - 交互逻辑，包括DOM操作、事件处理、JSONP跨域请求

## 快速开始

### 本地运行

1. 克隆项目到本地
```bash
git clone https://github.com/your-username/nav.git
```

2. 直接在浏览器中打开 `index.html` 文件

或者使用本地服务器：
```bash
# 使用Python
python -m http.server 8080

# 使用Node.js
npx serve
```

3. 访问 `http://localhost:8080`

### 部署到静态服务器

将项目文件上传到任意静态文件服务器即可，如：
- GitHub Pages
- Vercel
- Netlify
- 阿里云OSS
- 腾讯云COS

## 配置说明

### 修改搜索引擎

在 `script.js` 文件中修改 `searchEngines` 数组：

```javascript
const searchEngines = [
    { name: '百度', icon: '图标URL', url: 'https://www.baidu.com/s?wd=' },
    // 添加更多搜索引擎...
];
```

### 修改网站分类

在 `script.js` 文件中修改 `categoriesData` 数组：

```javascript
const categoriesData = ['工作', '影音', '学习&考试', 'AI', '境外网站', '软件', '其它'];
```

### 添加/修改网站

在 `script.js` 文件中修改 `websitesData` 数组：

```javascript
const websitesData = [
    {
        name: '网站名称',
        url: 'https://example.com',
        icon: '图标URL',
        desc: '网站描述',
        categoryName: '分类名称'
    },
    // 添加更多网站...
];
```

### 修改背景图片

在 `script.js` 文件的 `init()` 函数中修改背景图片URL：

```javascript
backgroundElement.style.backgroundImage = `url('你的背景图片URL')`;
```

### 修改默认占位图标

在 `script.js` 文件的 `renderWebsites()` 函数中修改 `onerror` 属性：

```javascript
<img src="${website.icon}" alt="${website.name}" onerror="this.src='你的默认图标URL'">
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

## 主要函数说明

| 函数名 | 功能描述 |
|-------|---------|
| `updateDateTime()` | 更新页面时间和日期显示 |
| `renderSearchEngines()` | 渲染搜索引擎选择下拉菜单 |
| `renderCategoryTabs()` | 渲染分类标签页 |
| `renderWebsites()` | 根据当前选中分类渲染网站列表 |
| `performSearch()` | 执行搜索操作 |
| `getSearchSuggestions(query)` | 获取搜索建议（JSONP方式） |
| `renderSearchSuggestions()` | 渲染搜索建议列表 |
| `initEventListeners()` | 初始化所有事件监听器 |
| `init()` | 页面初始化入口函数 |

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
