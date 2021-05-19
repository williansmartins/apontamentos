angular.module('controlei')
.controller('ModalDefaultController', function ($uibModalInstance, items, SessionService) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.response = $ctrl.items.data;

    $ctrl.ok = function () {
        SessionService.setData("apresentandoErro", "nao");
        $uibModalInstance.close($ctrl.response);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss($ctrl.response);
    };

    $ctrl.print = function(selector, classe) {
        printPage(selector, classe);
    };
});