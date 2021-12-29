/*  
   2021, N. Frick

 Version that uses localForage JS

  Purpose: a dual-layer cache to see if the data exists in memory (as global var) 
            or browser storage (uses localforage)


  Details: if not found in Map "gAppCacheNF", it fetches from browser storage

Usage. This is based on promises, so call using the "consuming code" mode (using .then):
  setCacheStorageP(myKey,myObject).then(function() { console.log('saved');}) 
  getCacheStorageP(myKey).then(function(theObj) { myItem = theObj; }) 

  Implementation comments:  Each routine has a synchronous and async part

    Note: values are intended to be JS objects, e.g. { id: 23, uFld:'uFld23' }

 */

/* be sure to include <script src="/js/localforage.min.js"></script>, or use as module */

  var gAppCacheNF = new Map(); // Large Global var to hold cache
  var lfAppCacheNF = localforage.createInstance({
     name: "simple_js_cache"
  });
  lfAppCacheNF.setDriver([localforage.INDEXEDDB,localforage.LOCALSTORAGE]);


   
  var setCacheStorageP = function(keyName,theObject) { 
    return new Promise(function(resolve,reject) {
      gAppCacheNF.set(keyName,theObject);
      lfAppCacheNF.setItem(keyName,theObject).then(function(rs) { resolve(keyName) });
    });
  }


  var getCacheStorageP = function(keyName) { 
  	return new Promise(function(resolve,reject) {
	    if (gAppCacheNF.has(keyName)) 
	    {  var rs = gAppCacheNF.get(keyName);
         if (Object.keys(rs).length > 0) {
           resolve(rs);
         }
      }  
        lfAppCacheNF.getItem(keyName).then(
         function(rs) { if (rs == null) rs = {};
             if (Object.keys(rs).length > 0) { 
               gAppCacheNF.set(keyName,rs); // push to faster (global) var
             }  
            resolve(rs); }
          );
	    
    });
  }

  // removes item from cache by keyName
  var deleteCacheStorageP = function(keyName,theObject) { 
    return new Promise(function(resolve,reject) {
      gAppCacheNF.delete(keyName);
      lfAppCacheNF.removeItem(keyName).then(function() {resolve(keyName); });
    });
  }

  // deletes from existing cache item props that are in specObject
  var deletePropObjCacheStorageP = function(keyName,specObject) { 
    return new Promise(function(resolve,reject) {
      if (gAppCacheNF.has(keyName)) 
      {  rs = gAppCacheNF.get(keyName);
              // delete props given in specObject
         Object.keys(specObject).forEach(function(key) {
                try { delete rs[key] } catch (ex) { }
              });
         gAppCacheNF.set(keyName,rs);  //save
      }  
      lfAppCacheNF.getItem(keyName).then(
         function(rs) { if (rs == null) rs = {};
           Object.keys(specObject).forEach(function(key) {
                try { delete rs[key] } catch (ex) { }
              });
           lfAppCacheNF.setItem(keyName,rs).then(function() {resolve(keyName);});
          }
          );
    });
  }

  // deletes from existing cache item props that are specified by propNameArray
  var deletePropNameCacheStorageP = function(keyName,propNameArray) { 
    return new Promise(function(resolve,reject) {
      if (gAppCacheNF.has(keyName)) 
      {  rs = gAppCacheNF.get(keyName);
        // delete
        if (Array.isArray(propNameArray)) {
          var l = propNameArray.length;
          for (var i=0;i<l;i++) {
            try { delete rs[propNameArray[i]] } catch (ex) { }
          }
        }
        gAppCacheNF.set(keyName,rs);  //save
      }
      lfAppCacheNF.getItem(keyName).then(
         function(rs) { if (rs == null) rs = {};
           if (Array.isArray(propNameArray)) {
            var l = propNameArray.length;
            for (var i=0;i<l;i++) {
              try { delete rs[propNameArray[i]] } catch (ex) { }
            }
           }
           lfAppCacheNF.setItem(keyName,rs).then(function() {resolve(keyName);});
          }
          );
 
   });
  }

  // combines(overwrites) existing cache object props with new object props

  var upsertCacheStorageP = function(keyName,theMixObject) { 
    return new Promise(function(resolve,reject) {
      if (gAppCacheNF.has(keyName)) 
      { var rs = gAppCacheNF.get(keyName);
        var rsm = Object.assign(rs,theMixObject);
        gAppCacheNF.set(keyName,rsm);  // combine and save
        // assume consistency here
        lfAppCacheNF.setItem(keyName,rsm).then(function() {resolve(keyName);});
      }  
      else
      { 
        lfAppCacheNF.getItem(keyName).then(
         function(rs1) { if (rs1 == null) rs1 = {};
           var rsm = Object.assign(rs1,theMixObject);
           lfAppCacheNF.setItem(keyName,rsm).then(
            function() { 
              gAppCacheNF.set(keyName,rsm);
              resolve(keyName);});
          });
      }
   });
  }
  
