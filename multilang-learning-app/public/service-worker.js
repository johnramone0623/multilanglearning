const CACHE_NAME = 'learn-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('缓存失败:', err))
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 请求拦截 - 网络优先，失败时使用缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 如果是有效响应，克隆并缓存
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存获取
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // 如果缓存也没有，返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// 后台同步（可选）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-vocabulary') {
    event.waitUntil(syncVocabulary());
  }
});

async function syncVocabulary() {
  // 实现数据同步逻辑
  console.log('后台同步词汇数据');
}
