angular.module('starter')
    .service('Params', function () {
        console.log('init service');
        var scope = this;
        var width = null;
        var height = null;
        scope.params = function (widthInit, heightInit) {
            width = widthInit;
            height = heightInit;
        };
        scope.getParams = function () {
            var params = {
                width: width,
                height: height
            };
            console.log(params);
            return params;
        }
    });