/**
 * 正清の导航页 - Service Worker
 * 
 * 功能：
 * - 缓存静态资源
 * - 支持离线访问
 * - PWA 核心组件
 */

// 缓存版本号（更新时修改此值）
const CACHE_NAME = 'nav-cache-v1';

// 需要缓存的静态资源列表
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/data/searchEngines.json',
    '/data/websitesData.json',
    '/data/wallpapers.json',
    '/manifest.json'
];

/**
 * Service Worker 安装事件
 * 在安装时预缓存所有静态资源
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())  // 跳过等待，立即激活
    );
});

/**
 * Service Worker 激活事件
 * 清理旧版本的缓存
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)  // 保留当前版本缓存
                        .map((name) => caches.delete(name))      // 删除旧版本缓存
                );
            })
            .then(() => self.clients.claim())  // 立即控制所有客户端
    );
});

/**
 * Service Worker 拦截请求事件
 * 实现缓存优先策略
 */
self.addEventListener('fetch', (event) => {
    // 只处理 GET 请求
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // 如果缓存中有，直接返回缓存
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // 否则从网络获取
                return fetch(event.request)
                    .then((response) => {
                        // 检查响应是否有效
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // 克隆响应（因为响应流只能读取一次）
                        const responseToCache = response.clone();
                        
                        // 将响应存入缓存
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // 网络请求失败时，返回首页（离线访问）
                        return caches.match('/index.html');
                    });
            })
    );
});
