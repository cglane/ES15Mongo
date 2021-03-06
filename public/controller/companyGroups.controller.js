
CompanyGroupsController.$inject = ['$stateParams','$location','$scope','MainService','$filter']
  export default function CompanyGroupsController($stateParams,$location,$scope,MainService,$filter){
    var cg = this;
    cg.clientId = $stateParams.clientId;
    cg.clientName = $stateParams.clientName;
    cg.init = function(){
      MainService.getCompanyTerms(cg.clientId).then(function(terms){
        cg.groups = terms.data;
        console.log(terms.data,'terms');
      })
    }

    cg.downloadLocally = function(){

    }

    cg.hideEmpty = function(key){
      var rtnVal = false;
      _.each(cg.groups[key],function(subGroups){
        for(key in subGroups){
          if(subGroups[key] !== undefined){
            rtnVal =  true;
          }
        }
      })
      return rtnVal;
    }

    cg.showSubGroup = function(subVal){
      return (Object.keys(subVal).length > 0)? true: false;
    }

}
