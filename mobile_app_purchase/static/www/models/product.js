// Copyright (C) 2015-Today GRAP (http://www.grap.coop)
// @author: Sylvain LE GAL (https://twitter.com/legalsylvain)
//  License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

"use strict";

angular.module('mobile_app_purchase').factory(
        'ProductModel', [
        '$q', 'jsonRpc',
        function ($q, jsonRpc) {

    var product_promise = null;
    var products_by_barcode = {};

    return {
        reset_list: function() {
            products = {};
        },

        get_list: function(purchase_order) {
            product_promise = product_promise || jsonRpc.call(
                'mobile.app.purchase', 'get_products', 
                [{purchase_order: purchase_order}]).then(function (products) {
                    products.forEach(function(product) {
                        products_by_barcode[product.barcode] = product;
                    });
                    return products_by_barcode;
            });
            return product_promise;
        },

        search_product: function(ean13, purchase_order) {
            return $q(function (success, error) {
                if (products_by_barcode[ean13]) {//search in cache
                    return success(products_by_barcode[ean13]);
                }
                var vals = {'barcode': ean13, 'purchase_order': purchase_order}

                jsonRpc.call('mobile.app.purchase', 'search_barcode', [vals]
                ).then(function (res) {
                    if (!res){
                        return success({'id': 0});
                    } else {
                        products_by_barcode[ean13] = res; //set cache
                        return success(products_by_barcode[ean13]);
                    }
                });
            });
        },

        get_product: function(id) {
            var found = false;
            Object.values(products).some(function (product) {
                if (product.id == id)
                    return found = product;
            });
            return found;
        }    
    };
}]);
