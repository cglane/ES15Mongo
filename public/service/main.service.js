(function(){
  "use strict"
  angular
    .module('main')
<<<<<<< HEAD
    .factory('MainService',function($http,$rootScope){

      var userName = localStorage.getItem('userName');
=======
    .factory('MainService',function($http){
      var url = '',
          userName = localStorage.getItem('userName');
>>>>>>> 5d7bfeb947a8e2005100f89ca43f7f7ecd677f0b

      var getAllTerms = function(){
        return $http.get('/api/get_all_terms/');
      }

      var getOneTerm = function(key,group){
        return $http.get('/api/get_one_term/'+key+'/'+group)
      }

      var editOneTerm = function(term){
          return $http.put('/api/edit_term/'+term._id, (function (){
            var newTerm = {
              'updatedBy': localStorage.getItem('userName'),
              'group':term.group,
              'updatedAt': new Date(),
              'comments': term.comments
            }
            return newTerm;
          })());

      }

      var getCompanyTerms = function(clientId){
        return $http.get('/api/get_company_terms/'+clientId)
      }

      var editTranslation = function(translation){
        var term_id = localStorage.getItem("termId");
        translation.updatedBy = userName;
        return $http.put('/api/edit_translation/'+term_id+'/'+translation._id,translation)
      }

      var getNeedTranslation = function(){
        return $http.get('/api/get_need_translation/');
      }

      var deleteTerm = function(id){
        return $http.delete( '/api/soft_delete/'+id);
      }

      var deleteTrans = function(transId){
        return $http.delete('/api/delete_translation/'+localStorage.getItem('termId')+'/'+transId);
      }

      var createTerm = function(term){
        term.createdBy = userName;
        return $http.post('/api/create_term',term);
      };

      var createTranslation = function(trans){
        return $http.post('/api/create_translation',trans)
      };

      var getCompanyIds = function(){
        return $http.get( '/api/get_companyids');
      };

      var uploadFile = function(obj){
        return $http.post('/api/uploadFile/', obj);
      };

      var getAllClientIds = function(){
        return $http.get('/api/get_all_clientIds');
      };

      var writeAllSocket = function(){
        return $http.post( "/api/writeAllSocket",null)
      };

      var getCompanyNames = function(idObj){
        return $http.post( '/api/get_company_names',idObj)
      }

      var writeCustom = function(){
        return $http.post('/api/writeCustom',$rootScope.customClients);
      }

    return{
      writeCustom:writeCustom,
      getCompanyNames:getCompanyNames,
      writeAllSocket:writeAllSocket,
      getAllClientIds:getAllClientIds,
      uploadFile:uploadFile,
      getCompanyIds: getCompanyIds,
      createTranslation:createTranslation,
      createTerm:createTerm,
      deleteTrans:deleteTrans,
      deleteTerm:deleteTerm,
      getOneTerm:getOneTerm,
      getAllTerms:getAllTerms,
      editOneTerm:editOneTerm,
      getCompanyTerms:getCompanyTerms,
      editTranslation:editTranslation,
      getNeedTranslation:getNeedTranslation
    };
  });
})();
