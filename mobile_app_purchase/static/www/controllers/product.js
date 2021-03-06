// Copyright (C) 2015-Today GRAP (http://www.grap.coop)
// @author: Sylvain LE GAL (https://twitter.com/legalsylvain)
//  License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

"use strict";

angular.module('mobile_app_purchase').controller(
        'ProductCtrl', [
        '$scope', '$rootScope', '$state', '$translate', 'PurchaseOrderModel', 'ProductModel',
        function ($scope, $rootScope, $state, $translate, PurchaseOrderModel, ProductModel) {

    $scope.data = { };

    $scope.$on(
            '$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
        if ($state.current.name === 'product') {
            // Set Focus
            angular.element(document.querySelector('#input_ean13'))[0].focus();
            //Initialize default data
            $scope.data.ean13 = '';
            $rootScope.errorMessage = "";
            // Get Purchase order Data
            PurchaseOrderModel.get_purchase_order(toParams.purchase_order_id).then(function (purchase_order) {
                $scope.purchase_order = purchase_order;
            }, function(reason) {
                angular.element(document.querySelector('#sound_error'))[0].play();
                $rootScope.errorMessage = $translate.instant("Loading Purchase Order failed");
            });
        }
    });

    $scope.submit = function () {
        // Reset Focus, in case the barcode is not correct
        angular.element(document.querySelector('#input_ean13'))[0].focus();
        if ($scope.data.ean13) {
            ProductModel.search_product($scope.data.ean13, $scope.purchase_order).then(function (product) {
                if (!product.id){
                    angular.element(document.querySelector('#sound_error'))[0].play();
                    $rootScope.errorMessage = $translate.instant("Unknown Barcode");
                } else {
                    $state.go('quantity', {
                        purchase_order_id: $scope.purchase_order.id,
                        ean13: product.barcode,
                    });
                }
            });
        } else {
            angular.element(document.querySelector('#sound_error'))[0].play();
            $rootScope.errorMessage = $translate.instant("Barcode : Required field");
       }
    };

}]);
