  MainService.$inject = ['$http'];
  export default function  MainService($http){
    var MainService = {};
    var userName = localStorage.getItem('userName');

    MainService.getAllTerms = function(){
      return $http.get('/api/get_all_terms/');
    }

    MainService.getOneTerm = function(key,group){
      return $http.get('/api/get_one_term/'+key+'/'+group)
    }

    MainService.editOneTerm = function(term){
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

    MainService.getCompanyTerms = function(clientId){
      return $http.get('/api/get_company_terms/'+clientId)
    }

    MainService.editTranslation = function(translation){
      var term_id = localStorage.getItem("termId");
      translation.updatedBy = userName;
      return $http.put('/api/edit_translation/'+term_id+'/'+translation._id,translation)
    }

    MainService.getNeedTranslation = function(){
      return $http.get('/api/get_need_translation/');
    }

    MainService.deleteTerm = function(id){
      return $http.delete( '/api/soft_delete/'+id);
    }

    MainService.deleteTrans = function(transId){
      return $http.delete('/api/delete_translation/'+localStorage.getItem('termId')+'/'+transId);
    }

    MainService.createTerm = function(term){
      term.createdBy = userName;
      return $http.post('/api/create_term',term);
    };

    MainService.createTranslation = function(trans){
      return $http.post('/api/create_translation',trans)
    };

    MainService.getCompanyIds = function(){
      return $http.get( '/api/get_companyids');
    };

    MainService.uploadFile = function(obj){
      return $http.post('/api/uploadFile/', obj);
    };

    MainService.getAllClientIds = function(){
      return $http.get('/api/get_all_clientIds');
    };

    MainService.writeAllSocket = function(){
      return $http.post( "/api/writeAllSocket",null)
    };

    MainService.getCompanyNames = function(idObj){
      return $http.post( '/api/get_company_names',idObj)
    }

    MainService.writeCustom = function(){
      return $http.post('/api/writeCustom',$rootScope.customClients);
    }
    MainService.getAllTemplates = function(){
      return $http.get('/api/get_all_templates');
    }
    return MainService;
  }
