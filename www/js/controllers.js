angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $stateParams) {
    })

    .controller('MinesweeperCtrl', function ($scope, $window, Params) {
        // $scope.params= params.getParams();
        $scope.TableauWidth = 5;
        $scope.TableauHeight = 5;
        var Casenb = $scope.TableauHeight * $scope.TableauWidth;
        $scope.mineNumber = parseInt(Casenb * 0.15);

        $scope.Tableau = creerTableau();
        $scope.DecouvertCase = function (Case) {
            Case.Couvert = false;
            if (gagne($scope.Tableau)) {
                $scope.messageGagne = true;
            }
        };

        //Generer le tableau des mines
        function creerTableau() {
            var Tableau = {};
            Tableau.Lignes = [];
            for (var i = 0; i < $scope.TableauHeight; i++) {
                var Ligne = {};
                Ligne.Cases = [];

                for (var j = 0; j < $scope.TableauWidth; j++) {
                    var Case = {};
                    Case.Couvert = true;
                    Case.drapeau = false;
                    Case.content = "vide"; // new
                    Ligne.Cases.push(Case);
                }
                Tableau.Lignes.push(Ligne);
            }
            placeManyRandomMines(Tableau);
            calculateAllNumbers(Tableau);
            return Tableau;
        }

        //Selec
        function getCase(Tableau, Ligne, column) {
            return Tableau.Lignes[Ligne].Cases[column];
        }

        //Place randomly mines
        function placeRandomMine(Tableau) {
            var Ligne = Math.round(Math.random() * ($scope.TableauHeight - 1));
            var column = Math.round(Math.random() * ($scope.TableauWidth - 1));
            var Case = getCase(Tableau, Ligne, column);
            Case.content = "mine";
        }

        //duplicate placeRamdomMine for get many mines
        function placeManyRandomMines(Tableau) {
            for (var i = 0; i < $scope.mineNumber; i++) {
                placeRandomMine(Tableau);
            }
        }

        //calculate Case number
        function calculateNumber(Tableau, Ligne, column) {
            var thisCase = getCase(Tableau, Ligne, column);
            if (thisCase.content === "mine") {
                return;
            }

            var mineCount = 0;
            var Case;

            if (Ligne > 0) {
                if (column > 0) {
                    Case = getCase(Tableau, Ligne - 1, column - 1);
                    CaseCheck(Case);
                }
                Case = getCase(Tableau, Ligne - 1, column);
                CaseCheck(Case);
                if (column < ($scope.TableauWidth - 1)) {
                    Case = getCase(Tableau, Ligne - 1, column + 1);
                    CaseCheck(Case);
                }
            }
            if (column > 0) {
                Case = getCase(Tableau, Ligne, column - 1);
                CaseCheck(Case);
            }
            if (column < ($scope.TableauWidth - 1)) {
                Case = getCase(Tableau, Ligne, column + 1);
                CaseCheck(Case);
            }
            if (Ligne < ($scope.TableauHeight - 1)) {
                if (column > 0) {
                    Case = getCase(Tableau, Ligne + 1, column - 1);
                    CaseCheck(Case);
                }
                Case = getCase(Tableau, Ligne + 1, column);
                CaseCheck(Case);

                // right
                if (column < ($scope.TableauWidth - 1)) {
                    Case = getCase(Tableau, Ligne + 1, column + 1);
                    CaseCheck(Case);
                }
            }

            function CaseCheck(Case) {
                if (Case.content === "mine") {
                    mineCount++;
                }
            }

            if (mineCount > 0) {
                thisCase.content = mineCount;
            }
        }

        //Duplicate calculateNumber for get number of all Case
        function calculateAllNumbers(Tableau) {
            for (var y = 0; y < $scope.TableauWidth; y++) {
                for (var x = 0; x < $scope.TableauHeight; x++) {
                    calculateNumber(Tableau, x, y);
                }
            }
        }

        // Determine if Have Win
        function gagne(Tableau) {
            for (var y = 0; y < $scope.TableauWidth; y++) {
                for (var x = 0; x < $scope.TableauHeight; x++) {
                    var Case = getCase(Tableau, y, x);
                    if (Case.Couvert && Case.content !== "mine") {
                        return false;
                    }
                }
            }
            return true;
        }

        //Check if case is vide and check Case around
        function CaseCheckvide(Tableau, column, Ligne) {
            var Case = getCase(Tableau, Ligne, column);
            if (!Case.drapeau) {
                Case.Couvert = false;
                Case.drapeau = false;
                if (Ligne > 0) {
                    if (column > 0) {
                        Case = getCase(Tableau, Ligne - 1, column - 1);
                        if (!Case.drapeau) {
                            if (Case.content === 'vide' && Case.Couvert) {
                                CaseCheckvide(Tableau, column - 1, Ligne - 1);
                            }
                            Case.Couvert = false;
                        }
                    }
                    Case = getCase(Tableau, Ligne - 1, column);
                    if (!Case.drapeau) {
                        if (Case.content === 'vide' && Case.Couvert) {
                            CaseCheckvide(Tableau, column, Ligne - 1);
                        }
                        Case.Couvert = false;
                    }
                    if (column < ($scope.TableauWidth - 1)) {
                        Case = getCase(Tableau, Ligne - 1, column + 1);
                        if (!Case.drapeau) {
                            if (Case.content === 'vide' && Case.Couvert) {
                                CaseCheckvide(Tableau, column + 1, Ligne - 1);
                            }
                            Case.Couvert = false;
                        }
                    }
                }
                if (column > 0) {
                    Case = getCase(Tableau, Ligne, column - 1);
                    if (!Case.drapeau) {
                        if (Case.content === 'vide' && Case.Couvert) {
                            CaseCheckvide(Tableau, column - 1, Ligne);
                        }
                        Case.Couvert = false;
                    }
                }
                if (column < ($scope.TableauWidth - 1)) {
                    Case = getCase(Tableau, Ligne, column + 1);
                    if (!Case.drapeau) {
                        if (Case.content === 'vide' && Case.Couvert) {
                            CaseCheckvide(Tableau, column + 1, Ligne);
                        }
                        Case.Couvert = false;
                    }
                }
                if (Ligne < ($scope.TableauHeight - 1)) {
                    if (column > 0) {
                        Case = getCase(Tableau, Ligne + 1, column - 1);
                        if (!Case.drapeau) {
                            if (Case.content === 'vide' && Case.Couvert) {
                                CaseCheckvide(Tableau, column - 1, Ligne + 1);
                            }
                            Case.Couvert = false;
                        }
                    }
                    Case = getCase(Tableau, Ligne + 1, column);
                    if (!Case.drapeau) {
                        if (Case.content === 'vide' && Case.Couvert) {
                            CaseCheckvide(Tableau, column, Ligne + 1);
                        }
                        Case.Couvert = false;
                    }
                    if (column < ($scope.TableauWidth - 1)) {
                        Case = getCase(Tableau, Ligne + 1, column + 1);
                        if (!Case.drapeau) {
                            if (Case.content === 'vide' && Case.Couvert) {
                                CaseCheckvide(Tableau, column + 1, Ligne + 1);
                            }
                            Case.Couvert = false;
                        }
                    }
                }
            }
        }

        $scope.loadData = function () {
            $window.location.reload();
        };

        //Main click
        $scope.DecouvertCase = function (Case, $event) {
            switch ($event.which) {
                //left click
                case 1:
                    var x = parseInt($event.target.parentElement.getAttribute('x'));
                    var y = parseInt($event.target.parentElement.parentElement.getAttribute('y'));
                    if (Case.content === 'vide' && Case.Couvert && !Case.drapeau)
                        CaseCheckvide($scope.Tableau, x, y);
                    if (!Case.drapeau) {
                        Case.Couvert = false;
                        if (Case.content === "mine") {
                            $scope.hasLostMessageVisible = true;
                        } else {
                            if (gagne($scope.Tableau)) {
                                $scope.messageGagne = true;
                            }
                        }
                    }
                    break;
                //middle
                case 2:
                    break;
                //right click
                case 3:
                    if (Case.Couvert) {
                        if (Case.drapeau)
                            Case.drapeau = false;
                        else
                            Case.drapeau = true;
                    }
                    break;
                default:
                    alert("you have a strange mouse!");
                    break;
            }
        };

        if (gagne($scope.Tableau)) {
            $scope.messageGagne = true;
            if (gagne($scope.Tableau)) {
                $scope.messageGagne = true;
            }
        }
    })

    .controller('ParamsCtrl', function ($scope, $stateParams, Params) {
        $scope.params = Params.getParams();
    });
