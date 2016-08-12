
TemplatesController.$inject = ['$scope', '$timeout', 'MainService'];
export default function TemplatesController($scope, $timeout, MainService) {
  var vm = this;

  MainService.getAllTemplates(function(err,templates){
    console.log(templates);
    vm.templates = templates;
  });

}
