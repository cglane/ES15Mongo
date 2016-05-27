(function(){
  "use strict"
  angular
    .module('main')
    .factory('MainService',function($http){
      var url = 'http://localhost:3000';

      var getAllTerms = function(){
        return $http.get(url+'/api/get_all_terms/');
      }

      var getOneTerm = function(key){
        return $http.get(url+'/api/get_one_term/'+key)
      }

      var editOneTerm = function(term){
        return $http.put(url+'/api/edit_term/'+term._id, term)
      }

      var getCompanyTerms = function(clientId){
        return $http.get(url+'/api/get_company_terms/'+clientId)
      }

    return{
      getOneTerm:getOneTerm,
      getAllTerms:getAllTerms,
      editOneTerm:editOneTerm,
      getCompanyTerms:getCompanyTerms,
    };
  });
})();
