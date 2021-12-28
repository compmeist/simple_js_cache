# simple_js_cache
simple persistent (async) cache for application data, using Map Object and localForage.JS


##  Features
-  basic version (simple_js_cache.js) can use integer keys
-  lightweight ( no time or object age tracking )
-  dual layer ( global Map object and localStorage )
-  generally non-blocking

## Caveats
-  Should return empty object if doesn't exist in cache (so instead of checking for null, check object length)
-  Scope of resolving function may be different (so be wary of using 'this' identifier )
-  Assumes localStorage/IndexedDB capability in browser  ( and assumes ES6 )
-  Async operation:  may mutate the item (by set or update) before reading (get) is accomplished
-  May not production ready -> push a fix if you find one

## Obscure Caveats
-  Does not check for duplicates, if you try to use objects as keys (since the objects may have different memory instances)


## Example
-a usage example snippet for a Vue JS project is also included here 
-  NOTE: localForage.JS version is simple_js_cache_lf.JS, recommended


## On Server
I believe you can replace localStorage/localForage by something else on Node.js

