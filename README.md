# simple_js_cache
fast and simple persistent (async and sync) dual-layer cache for ES6 browser application data


##  Features
-  can handle integer keys
-  lightweight ( no time or object age tracking )
-  dual layer ( Map() object and indexedDB )
-  generally non-blocking
-  quick sync reads are available, if the item has already been read 

## Caveats
-  Assumes localStorage/IndexedDB capability in browser  ( and assumes ES6 )
-  Should return empty object if doesn't exist in cache (so instead of checking for null, check object length)
-  Scope of resolving function may be different (so be wary of using 'this' identifier, or use arrow functions! )
-  Async operation:  may mutate the item (by set or update) before reading (get) is accomplished
-  May not be production ready -> suggest a fix it if you find something

## Obscure Caveats
-  Does not check for duplicates, if you try to use objects as keys (since the objects may have different memory instances)

## Basic Functions and Possible Usage
-  testCacheStorageP 

`
testCacheStorageP().then( ()=>{ console.log('browser uses indexedDb.');})
  .catch( (err)=>{ alert('This browser is not supporting indexedDb! Please use an ES6 compliant browser. Close tab.')});
`
- setCacheStorageP

`setCacheStorageP(22, {NAME:'my stuff',myID:22}).then(()=> {  });`

- getCacheStorageP

`getCacheStorageP(22).then( (rslt)=> {  console.log('rslt from 22 is '); console.log(rslt); } );`

- upsertCacheStorageP

`upsertCacheStorageP(22, {NAME:'my stuff 2',ID2:122}).then( ()=> {  });`

- deleteCacheStorageP

`delCacheStorageP(22);`

## Synchronous Usage - direct read of Level 1 cache map

- getCacheStorageL1

`var myData = getCacheStorageL1(22)`

## Example
-  a usage example snippet for a Vue JS project is also included here 
-        recommended version is simple_js_cache_idb.js ( uses idb-keyval.JS )


## On Server
This is a frontend module - I believe it could modified for use in Node.js

