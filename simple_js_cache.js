/*  
   2021, N. Frick

 
  Purpose: a dual-layer cache to see if the data exists in memory (as global var) 
            or browser localStorage (as JSON string)

  Details: if not found in Map "gAppCacheNF", it fetches from localStorage 

Usage. This is based on promises, so call using the "consuming code" mode (using .then):
  setCacheStorageP(myKey,myObject).then(function() { console.log('saved');}); 
  getCacheStorageP(myKey).then(function(theObj) { myItem = theObj; }); 
  
  Note - since this is async: set,upsert, and delete may happen before you expect.

 */


  function getLocalStorage4P(keyName) { var rs = {};
     var objStr = localStorage.getItem(keyName);
      if ((objStr != null) && (objStr.length > 0))
      { try { 
          rs = JSON.parse(objStr);
        } catch (ex_var) {
          rs = {};
        } 
      }  
      return rs;
  } 

  var gAppCacheNF = new Map(); // Large Global var to hold cache

  /*  SET  */

  var setCacheStorageP = function(keyName,theObject) { 
  	return new Promise(function(resolve,reject) {
      gAppCacheNF.set(keyName,theObject);
      localStorage.setItem(keyName, JSON.stringify(theObject));
      resolve(keyName); 
   });
  }

  /*  GET  */
  
  var getCacheStorageP = function(keyName) { 
  	return new Promise(function(resolve,reject) {
	    let rs = {}; 
	    if (gAppCacheNF.has(keyName)) 
	      rs = gAppCacheNF.get(keyName);
	    else
	    { rs = getLocalStorage4P(keyName);
	      if (Object.keys(rs).length > 0) {  
	        gAppCacheNF.set(keyName,rs); // push to faster (global) var
	      }
	    }
    resolve(rs,keyName);
  });
 }

 /* UPSERT (UPDATE) */
  
  // combines(overwrites) existing cache object props with new object props
  //   --> may be used in lieu of setCacheStorageP()
  var upsertCacheStorageP = function(keyName,theMixObject) {
    return new Promise(function(resolve,reject) {
      var rs = {};
      if (gAppCacheNF.has(keyName))
        rs = gAppCacheNF.get(keyName);
      else
        rs = getLocalStorage4P(keyName);
      var theObject = Object.assign(rs,theMixObject); // combine
      gAppCacheNF.set(keyName,theObject);  //save
      localStorage.setItem(keyName, JSON.stringify(theObject));
      resolve(keyName);
   });
  }

  
  /* DELETE */
  
  // removes item from cache by keyName
  var deleteCacheStorageP = function(keyName,theObject) {
    return new Promise(function(resolve,reject) {
      gAppCacheNF.delete(keyName);
      localStorage.removeItem(keyName);
      resolve(keyName);
    });
  }
  
  /* DELETE PROPS BY OBJ CONTENTS */
  
  // deletes from existing cache item props that are in specObject
  var deletePropObjCacheStorageP = function(keyName,specObject) {
    return new Promise(function(resolve,reject) {
      var rs = {};
      if (gAppCacheNF.has(keyName))
        rs = gAppCacheNF.get(keyName);
      else
        rs = getLocalStorage4P(keyName);
      // delete props given in specObject
      Object.keys(specObject).forEach(function(key) {
        try { delete rs[key] } catch (ex) { }
      });
      gAppCacheNF.set(keyName,rs);  //save
      localStorage.setItem(keyName, JSON.stringify(rs));
      resolve(keyName);
   });
  }
  
  /* DELETE PROPS BY NAME (OR ARRAY OF NAMES) */
  
  // deletes from existing cache item props that are specified by propNameArray
  var deletePropNameCacheStorageP = function(keyName,propNameArray) {
    return new Promise(function(resolve,reject) {
      var rs = {};
      if (gAppCacheNF.has(keyName))
        rs = gAppCacheNF.get(keyName);
      else
        rs = getLocalStorage4P(keyName);
      // delete
      if (Array.isArray(propNameArray)) {
        var l = propNameArray.length;
        for (var i=0;i<l;i++) {
          try { delete rs[propNameArray[i]] } catch (ex) { }
        }
      }
      else
      {
        var l = propNameArray.length;
        for (var i=0;i<l;i++) {
          try { delete rs[propNameArray] } catch (ex) { }
        }
      }
      gAppCacheNF.set(keyName,rs);  //save
      localStorage.setItem(keyName, JSON.stringify(rs));
      resolve(keyName);
   });
  }
  
  
  
