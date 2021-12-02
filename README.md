# simple_js_cache
simple persistent cache for application data, using JS promises

##  Features
-  lightweight
-  dual layer ( global Map object and localStorage )
-  generally non-blocking
-  can handle integer keys

## Caveats
-  Assumes localStorage capability in browser
-  Does not check for duplicates, if you try to use objects as keys (since the objects may have different memory instances)

