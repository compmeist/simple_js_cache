/*  
   2021, N. Frick

 
  Purpose: a dual-layer cache to see if the data exists in memory (as global var) 
            or browser localStorage (as JSON string)

  Details: if not found in Map "gAppCacheNF", it fetches from localStorage 

Usage. This is based on promises, so call using the "consuming code" mode (using .then):
  setCacheStorageP(myKey,myObject).then(function() { console.log('saved');}); 
  getCacheStorageP(myKey).then(function(theObj) { myItem = theObj; }); 

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

