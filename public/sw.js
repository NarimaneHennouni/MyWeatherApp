const cacheName = 'v2';


//Call install Event

self.addEventListener('install', (e)=>{
    console.log('Service Worker installed');

})

//Call Acitvate Event

self.addEventListener('activate', (e)=>{
    console.log('Service Worker activated');
    //Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache =>{
                    if(cache !== cacheName){
                        console.log('cleaning cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )

});

//Call fetch Event
self.addEventListener('fetch',(e)=>{
   // console.log("SW Fetching");
    e.respondWith(
        fetch(e.request)
        .then(res =>{
            //Make a copy of the response
            const resCopy= res.clone();
            caches
            .open(cacheName)
            .then(cache =>{
                // add response to cache
                cache.put(e.request,resCopy);
            });
           return res;

        })
        .catch(()=>{
            caches.match(e.request)
            .then( res=> res);
        })
    )

})