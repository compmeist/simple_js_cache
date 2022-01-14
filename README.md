# simple_js_cache
simple persistent (async) dual-layer cache for browser application data


##  Features
-  can handle integer keys
-  lightweight ( no time or object age tracking )
-  dual layer ( global Map object and indexedDB )
-  generally non-blocking

## Caveats
-  Assumes localStorage/IndexedDB capability in browser  ( and assumes ES6 )
-  Should return empty object if doesn't exist in cache (so instead of checking for null, check object length)
-  Scope of resolving function may be different (so be wary of using 'this' identifier, or use arrow functions! )
-  Async operation:  may mutate the item (by set or update) before reading (get) is accomplished
-  May not be production ready -> suggest a fix it if you find something

## Obscure Caveats
-  Does not check for duplicates, if you try to use objects as keys (since the objects may have different memory instances)

## Basic Functions
-  testCacheStorageP 

`
testCacheStorageP().then(()=>{console.log('browser uses indexedDb.');})
  .catch((err)=>{alert('This browser is not supporting indexedDb! Please use an ES6 compliant browser. Close tab.')});
`
- setCacheStorageP
- getCacheStorageP
- upsertCacheStorageP
- deleteCacheStorageP
  

## Example
-  a usage example snippet for a Vue JS project is also included here 
-        recommended version is simple_js_cache_idb.js ( uses idb-keyval.JS )


## On Server
I believe you can modify for use in Node.js

