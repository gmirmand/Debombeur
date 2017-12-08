angular.module('starter')
    .service('Params', function () {
        var scope = this;
        scope.getWidth = function ($scope) {
            if (!localStorage.getItem("width"))
                $scope.TableauWidth = 9;
            else
                $scope.TableauWidth = localStorage.getItem("width");
            return $scope.TableauWidth;
        };

        scope.getHeight = function ($scope) {
            if (!localStorage.getItem("height"))
                $scope.TableauHeight = 9;
            else
                $scope.TableauHeight = localStorage.getItem("height");
            return $scope.TableauHeight;
        };

        scope.getDifficulte = function ($scope) {
            if (!localStorage.getItem("difficulte"))
                $scope.difficulte = 2;
            else
                $scope.difficulte = localStorage.getItem("difficulte");
            return $scope.difficulte;
        }
    });