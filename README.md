# simple_js_cache
simple persistent (async) dual-layer cache for browser application data


##  Features
-  can use integer keys
-  lightweight ( no time or object age tracking )
-  dual layer ( global Map object and localStorage/indexedDB )
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
-  NOTE: indexedDB version is simple_js_cache_LF.JS -> recommended ( uses localForage.JS )


## On Server
I believe you can replace localStorage/localForage by something else on Node.js

