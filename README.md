# simple_js_cache
simple persistent cache for application data, using JS promises
(probably not production ready, do not use without modifying)

##  Features
-  can use integer keys
-  lightweight ( no time or object age tracking )
-  dual layer ( global Map object and localStorage )
-  generally non-blocking

## Caveats
-  Assumes localStorage capability in browser  ( and assumes ES6 )
-  Async operation:  may mutate the item (by set or update) before reading (get) is accomplished
-  Does not check for duplicates, if you try to use objects as keys (since the objects may have different memory instances)
-  Should return empty object if doesn't exist in cache (so instead of checking for null, check object length)
-  Scope of resolving function may be different (so be wary of using 'this' identifier )

## Example
a usage example snippet for a Vue JS project is also included here 

## On Server
I believe you can replace localStorage by something else on Node.js

