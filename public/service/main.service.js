(function(){
  "use strict"
  angular
    .module('main')
    .factory('MainService',function($http){
      var url = 'http://localhost:3000',
          userName = localStorage.getItem('userName');

      var getAllTerms = function(){
        return $http.get(url+'/api/get_all_terms/');
      }

      var getOneTerm = function(key,group){
        return $http.get(url+'/api/get_one_term/'+key+'/'+group)
      }

      var editOneTerm = function(term){
          return $http.put(url+'/api/edit_term/'+term._id, (function (){
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
        return $http.get(url+'/api/get_company_terms/'+clientId)
      }

      var editTranslation = function(translation){
        var term_id = localStorage.getItem("termId");
        translation.updatedBy = userName;
        return $http.put(url+'/api/edit_translation/'+term_id+'/'+translation._id,translation)
      }

      var getNeedTranslation = function(){
        return $http.get(url+'/api/get_need_translation/');
      }

      var deleteTerm = function(id){
        return $http.delete(url + '/api/soft_delete/'+id);
      }

      var getCompanies = function(){
        return $http.get(url + '/api/get_companies/');
      }

      var deleteTrans = function(transId){
        return $http.delete(url+'/api/delete_translation/'+localStorage.getItem('termId')+'/'+transId);
      }

      var getFullCompanyTerms = function(clientId){
        return $http.get(url+'/api/get_full_company_terms/'+clientId);
      }

      var createTerm = function(term){
        term.createdBy = userName;
        return $http.post(url+'/api/create_term',term);
      };

      var createTranslation = function(trans){
        return $http.post(url+'/api/create_translation',trans)
      };

      var getCompanyIds = function(){
        return $http.get(url + '/api/get_companyids');
      };

      var uploadFile = function(obj){
        return $http.post(url+'/api/uploadFile/', obj);
      };

      var getAllClientIds = function(){
        return $http.get(url+'/api/get_all_clientIds');
      };

      var writeAllSocket = function(){
        return $http.get(url + "/api/writeAllSocket")
      };

      var getCompanyNames = function(idObj){
        return $http.post(url + '/api/get_company_names',idObj)
      }

    return{
      getCompanyNames:getCompanyNames,
      writeAllSocket:writeAllSocket,
      getAllClientIds:getAllClientIds,
      uploadFile:uploadFile,
      getCompanyIds: getCompanyIds,
      createTranslation:createTranslation,
      createTerm:createTerm,
      getFullCompanyTerms:getFullCompanyTerms,
      deleteTrans:deleteTrans,
      getCompanies:getCompanies,
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
