angular.module('controlei')
.factory('ComponentModal', [ '$document',
    function ComponentModal($document) {
        var pathModais = 'views/modais/';

        ComponentModal.getModalWindow = function($uibModal, config) {
            var animationParam = config.animation || true;
            var ariaLabelledByParam = config.ariaLabelledBy || 'modal-title';
            var ariaDescribedByParam = config.ariaDescribedBy || 'modal-body';
            var templateUrlParam = config.templateUrl || 'default-modal.html';
            var controllerParam = config.controller || 'ModalDefaultController';
            var controllerAsParam = config.controllerAs || '$ctrl';
            var windowClassParam = config.windowClass || 'modal-default';
            var sizeParam = config.size || ''; //sm, lg...
            var appendToParam = config.appendTo ? $document.find(config.appendTo).eq(0) : $document.find('.view').eq(0);
            var titleParam = config.title || 'Modal Window';
            var labelOkButtonParam = config.labelOkButton || 'OK';
            var titleParam = config.title || 'Aviso';
            var backdropParam = config.backdropParam || 'static';

            var modalInstance = $uibModal.open({
                animation: animationParam,
                ariaLabelledBy: ariaLabelledByParam,
                ariaDescribedBy: ariaDescribedByParam,
                templateUrl: pathModais + templateUrlParam,
                controller: controllerParam,
                controllerAs: controllerAsParam,
                windowClass: windowClassParam,
                size: sizeParam,
                appendTo: appendToParam,
                backdrop: backdropParam,
                resolve: {
                    items: function () {
                        return {title: titleParam, subTitle: config.subTitle, data: config.data, document: $document, 
                            content: config.content, btnText: config.btnText};
                    }
                }
            });

           return modalInstance;
        }

        return ComponentModal;
    }
]);