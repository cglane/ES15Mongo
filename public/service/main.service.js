(function(){
  "use strict"
  angular
    .module('main')
    .factory('MainService',function($http){
      var url = 'http://localhost:3000';

      var getAllTerms = function(){
        return $http.get(url+'/api/get_all_terms/');
      }

      var getOneTerm = function(key,group){
        return $http.get(url+'/api/get_one_term/'+key+'/'+group)
      }

      var editOneTerm = function(term){
        return $http.put(url+'/api/edit_term/'+term._id, term)
      }

      var getCompanyTerms = function(clientId){
        return $http.get(url+'/api/get_company_terms/'+clientId)
      }

      var editTranslation = function(translation){
        var term_id = localStorage.getItem("termId");
        return $http.put(url+'/api/edit_translation/'+term_id+'/'+translation._id,translation)
      }

      var getNeedTranslation = function(){
        return $http.get(url+'/api/get_need_translation/');
      }

    return{
      getOneTerm:getOneTerm,
      getAllTerms:getAllTerms,
      editOneTerm:editOneTerm,
      getCompanyTerms:getCompanyTerms,
      editTranslation:editTranslation,
      getNeedTranslation:getNeedTranslation
    };
  });
})();
