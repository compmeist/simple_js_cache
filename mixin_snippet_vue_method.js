/* 

   N. Frick
   Usage example for simple_js_cache

   this is an entry in the methods section of a VueJS2 viewmodel (global var "vm" here) 
      (uses vue-resource for $http.post)


*/

      ,getRecCacheOrPost: function(recObjL) {  
        // promise will resolve an object to mixin
        return new Promise(function(resolve1,reject1) {
          if (!('ID' in recObjL)) reject1({}); // safety check
          getCacheStorageP(recObjL.ID).then(function(rObj,kN) { // query the cache using record ID
            if (Object.keys(rObj).length > 0) {
              resolve1(rObj);  // found in cache!
            } else { // not in cache, so get from server 
              let daPostData = { requestID: recObjL.ID };
              // must use vm.$http here, not this.$http
              vm.$http.post('/requestAPIs/qj_sel_request.cfm',daPostData).then(
                function (response) { 
                  var recObjAry = response.body;
                  if (recObjAry.length > 0)
                  { var retObj = recObjAry[0];
                    if ('ID' in retObj) // save to cache using record ID
                    { setCacheStorageP(retObj.ID,retObj).then(function() { }); }
                    resolve1(retObj); 
                  } 
                  else { resolve1({}); }; // don't return null, but empty object
               }
               ,function (err) {
                 reject1(err); // (there was a POST error)
               });            
            }
           }); 
        });  
      }

/*
   ( NOTE: getRecCacheOrPost doesn't work to create a Vue computed, 
     so populate your Vue data object 
      using vm.$data.myProperty within the .then resolving function )
*/


