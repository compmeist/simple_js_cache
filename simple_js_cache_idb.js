/* 
   N. Frick, 2021
   
   Purpose: a dual-layer cache to see if the data exists in memory (as global var) 
            or browser storage (uses idb-keyval with an added upsert - or extra param update - function )


  Details: if not found in Map "gAppCacheNF", it fetches from browser storage

Usage: This is based on promises, so call using the "consuming code" mode (using .then):
  setCacheStorageP(myKey,myObject).then(function() { console.log('saved');}) 
  getCacheStorageP(myKey).then(function(theObj) { myItem = theObj; }) 
  
 Implementation comments:  Each routine has a synchronous and async part 
   
  Note: this is intended for use as a ES module, so rename extension if you want. 


*/

import { get as idbGet, set as idbSet, getMany as idbGetMany, 
    setMany as idbSetMany, delMany as idbDelMany, update as idbUpdate, 
    entries as idbEntries, keys as idbKeys, values as idbValues,
    upsert as idbUpsert } from 'idb-keyval.js';


  var gAppCacheNF = new Map(); // Large Global var to hold cache

  export function setCacheStorageP (keyName,theObject) { 
    return new Promise( (resolve,reject) => {
      gAppCacheNF.set(keyName,theObject);
      idbSet(keyName,theObject).then( 
        () =>  { resolve(); } )
      .catch((err)=> {reject(err);} );
    });
  }

  export function setManyCacheStorageP (keyValuePairsAry) {  // [[key1,value1],[key2,value2],...]
    return new Promise( (resolve,reject) => {
      let l = keyValuePairsAry.length;
      for (let i=0;i<l;i++) {
        gAppCacheNF.set(keyValuePairsAry[i][0],keyValuePairsAry[i][1]);
      }
      idbSetMany(keyValuePairsAry).then( 
        () =>  { resolve(); } )
      .catch((err)=> {reject(err);} );
    });
  }


  export function getCacheStorageP (keyName) { 
  	return new Promise( (resolve,reject) => {
	    if (gAppCacheNF.has(keyName)) 
	    {  var rs = gAppCacheNF.get(keyName);
         if (Object.keys(rs).length > 0) {
           resolve(rs);
         } 
      }  
        idbGet(keyName).then(
         (rs) => { if (rs == null) rs = {};
             if (Object.keys(rs).length > 0) { 
              //console.log('setting gAppCacheNF using '+ keyName +'...');
               gAppCacheNF.set(keyName,rs); // push to faster (global) var
             }  
            resolve(rs); }
          );
	    
    });
  }

  export function getManyCacheStorageP(keyNameAry) {
    /* in order to not complicate things, we take the philosophical approach that 
       this won't be called, except at the start of the lifecycle of the JS routine, 
       and so we go straight to the idb and get whatever is there and use it 
       (rather than checking the gAppCacheNF map) */
     return new Promise( (resolve,reject) => {
       idbGetMany(keyNameAry).then((valAry) =>
        { let l = keyNameAry.length;
          for (let i=0;i<l;i++) {
            let val2Set = (valAry[i] || {}); // mask undefined values as empty objects
            if (Object.keys(val2Set).length > 0) {
              gAppCacheNF.set(keyNameAry[i],val2Set);
            }
          }
          resolve(valAry); // send it back
        } ).catch((err) => {reject(err);});
    });
  }

  // removes item from cache by keyName
  export function deleteCacheStorageP (keyName,theObject) { 
    return new Promise( (resolve,reject) => {
      gAppCacheNF.delete(keyName);
      var keyAry = []; keyAry.push(keyName);
      idbDelMany(keyAry).then(  
        () =>  { resolve(); } )
      .catch((err)=> {reject(err);} );
    });
  }

  // deletes from existing cache item props that are in specObject
  export function deletePropObjCacheStorageP (keyName,specObject) { 
    return new Promise( (resolve,reject) => {
      if (gAppCacheNF.has(keyName)) 
      {  var rs = gAppCacheNF.get(keyName);
              // delete props given in specObject
         Object.keys(specObject).forEach( (key) => {
                try { delete rs[key] } catch (ex) { }
              });
         gAppCacheNF.set(keyName,rs);  
      }  
      idbUpsert(keyName,(rs)=>{ if (rs == null) rs = {};
           Object.keys(specObject).forEach( (key) => {
                try { delete rs[key] } catch (ex) { }
              }); return rs;},specObject);
       resolve();
    });
  }

  // deletes from existing cache item props that are specified by propNameArray
  export function deletePropNameCacheStorageP (keyName,propNameArray) { 
    return new Promise((resolve,reject) => {
      if (gAppCacheNF.has(keyName)) 
      { var rs = gAppCacheNF.get(keyName);
        // delete
        if (Array.isArray(propNameArray)) {
          var l = propNameArray.length;
          for (var i=0;i<l;i++) {
            try { delete rs[propNameArray[i]] } catch (ex) { }
          }
        }
        gAppCacheNF.set(keyName,rs);  //save
      }
      idbUpsert(keyName,(rs)=>{ if (rs == null) rs = {};
           if (Array.isArray(propNameArray)) {
            var l = propNameArray.length;
            for (var i=0;i<l;i++) {
              try { delete rs[propNameArray[i]] } catch (ex) { }
            }
           }; return rs;},specObject);
      resolve();
   });
  }


function appendCallbackArgs(callback, ...extraArgs) {   
  return (...args) => callback(...args, ...extraArgs);  // suggested by Jake A.
}

  // combines(overwrites) existing cache object props with new object props

  export function upsertCacheStorageP (keyName,theMixObject) { 
    return new Promise( (resolve,reject) => {
      if (gAppCacheNF.has(keyName)) 
      { var rs = gAppCacheNF.get(keyName);
        var rsm = Object.assign(rs,theMixObject);
        gAppCacheNF.set(keyName,rsm);  // combine and save
      } 
      var idbUpdateF = (v,mxObj)=>(Object.assign({},(v || {}),mxObj));
      idbUpdate(keyName,appendCallbackArgs(idbUpdateF,theMixObject) )  // use appendCallbackArgs wrapper
	      .then( ()=>{ resolve(); } ); 
   });
  }

  export function testCacheStorageP () {
    return new Promise( (resolve,reject) => {
    idbSetMany([
        ['testCache', 1]
      ])
        .then(() => {resolve();})
        .catch((err)=>{reject(err);});
        });
  }  



