
const a = 'sw_chache';

self.addEventListener('install',async event => {
    //!!!
    console.log('install',event);
    const cach = await caches.open(a);
    await cach.addAll([
        '/',
        './index.html',
        './lizhien.png',
        './manifest.json'
    ]);
    await self.skipWaiting();
})
self.addEventListener('activate',event => {
    console.log('activate',event)
    event.waitUntil(self.clients.claim());
})

self.addEventListener('fetch', async event =>  {
    var url = event.request;
    event.respondWith(switchNetLine(url));
})

async function netFirst(url){

    try {
        var fetched = await fetch(url);
        return fetched;
    } catch (e) {
        const cach = await caches.open(a);
        var cached = await cach.match(url);
        return cached;
    }

}

async function cacheFirst(url){

    const cach = await caches.open(a);
    var cached = await cach.match(url);
    if (cached){
        return cached;
    }else {
        try {
            var fetched = await fetch(url);
            return fetched;
        } catch (e) {
            return await netFirst(url);
        }
    }
}

async function switchNetLine(url){
    console.log('离线在线切换');
    if (navigator.onLine){
        console.log('在线请求');
        return await netFirst(url);
    }else {
        console.log('离线缓存');
        return await cacheFirst(url);
    }

}