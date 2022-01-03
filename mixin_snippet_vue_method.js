/* 

   N. Frick
   Usage example for simple_js_cache

   this is an entry in the methods section of a VueJS2 viewmodel (global var "vm" here) 
      (uses vue-resource for $http.post)

   the scenario here is recObjL is a partially "populated" record (some fields or columns are missing) and you want to 
     mix in some other fields (or columns) that were previously saved in the cache
     
*/

      ,getRecCacheOrPost: function(recObjL) {  
        // promise will resolve an object to mixin
        return new Promise(function(resolve1,reject1) {
          if (!('ID' in recObjL)) reject1({}); // safety check
          getCacheStorageP(recObjL.ID).then((rObj) => { // query the cache using record ID
            if (Object.keys(rObj).length > 0) { // ( more than zero props in object)
              resolve1(rObj);  // found in cache!
            } else { // not in cache, so get from server 
              let daPostData = { requestID: recObjL.ID };
              this.$http.post('/requestAPIs/qj_sel_request.cfm',daPostData).then(
                 (response) => { 
                  var recObjAry = response.body;
                  if (recObjAry.length > 0)
                  { var retObj = recObjAry[0];
                    if ('ID' in retObj) // save to cache using record ID
                    { setCacheStorageP(retObj.ID,retObj).then(() => { }); }
                    resolve1(retObj); 
                  } 
                  else { resolve1({}); }; // don't return null, but empty object
               }
               ,(err) => {
                 reject1(err); // (there was a POST error)
               });            
            }
           }); 
        });  
      }

/*
   ( NOTE: getRecCacheOrPost doesn't work to create a Vue computed, 
     so populate your Vue data object   (using Object.assign or Vue.set() )
      by assigning vue data within the .then resolving function )
*/


