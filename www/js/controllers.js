angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $stateParams) {
    })

    .controller('DebombeurCtrl', function ($scope, $window, Params, $interval) {
        //Récupérer les params (localStorage)
        $scope.TableauHeight = Params.getHeight($scope);
        $scope.TableauWidth = Params.getWidth($scope);
        $scope.Difficulte = Params.getDifficulte($scope);
        //Chrono not yet use
        var chronometre = [];
        chronometre.seconde = 0;
        chronometre.minute = 0;

        // Déterminer la difficulté
        var Casenb = $scope.TableauHeight * $scope.TableauWidth;
        $scope.mineNumber = parseInt(Casenb * 0.10) * $scope.difficulte;
        $scope.Tableau = creerTableau();
        $scope.DecouvertCase = function (Case) {
            Case.Couvert = false;
            if (gagne($scope.Tableau)) {
                $scope.messageGagne = true;
            }
        };

        // Generer le tableau des mines
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
            placerPlusieursMines(Tableau);
            calculerAllNumeros(Tableau);
            return Tableau;
        }

        // Récupérer une case
        function getCase(Tableau, Ligne, column) {
            return Tableau.Lignes[Ligne].Cases[column];
        }

        // Placer aléatoirement une mine
        function placerMine(Tableau) {
            var Ligne = Math.round(Math.random() * ($scope.TableauHeight - 1));
            var column = Math.round(Math.random() * ($scope.TableauWidth - 1));
            var Case = getCase(Tableau, Ligne, column);
            if (Case.content === "mine")
                placerMine(Tableau);
            else
                Case.content = "mine";
        }

        // Placer plusieurs mines (via placerMine())
        function placerPlusieursMines(Tableau) {
            for (var i = 0; i < $scope.mineNumber; i++) {
                placerMine(Tableau);
            }
        }

        // Calculer le numéro d'une case
        function calculerNumero(Tableau, Ligne, column) {
            var mineCount = 0;
            var Case;
            var thisCase = getCase(Tableau, Ligne, column);
            if (thisCase.content === "mine") {
                return;
            }
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

        // Calculer le numéro de toutes les cases (via calculerNumero())
        function calculerAllNumeros(Tableau) {
            for (var y = 0; y < $scope.TableauWidth; y++) {
                for (var x = 0; x < $scope.TableauHeight; x++) {
                    calculerNumero(Tableau, x, y);
                }
            }
        }

        // Determiner si le joueur a gagné
        function gagne(Tableau) {
            var Case;
            for (var y = 0; y < $scope.TableauWidth; y++) {
                for (var x = 0; x < $scope.TableauHeight; x++) {
                    Case = getCase(Tableau, x, y);
                    if (Case.Couvert && Case.content !== "mine") {
                        return false;
                    }
                }
            }
            return true;
        }

        //Check si la case est vide est exécuter la fonction sur les cases autour qui sont vide et couverte.
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

        // $scope.ChronoInterval = setInterval(function () {
        //     StartChronometre();
        // }, 1000);

        function StartChronometre() {
            chronometre.seconde++;
            if (chronometre.seconde > 59) {
                chronometre.seconde = 0;
                chronometre.minute++;
            }
            chronometre.seconde = ("0" + chronometre.seconde).slice(-2);
            if (document.querySelector('.chronometre'))
                document.querySelector('.chronometre').innerHTML = chronometre.minute + ":" + chronometre.seconde;
        }

        // $scope.StopChronometre = function () {
        //     $window.location.href = '/#/app/debombeur';
        // };

        //Outil pour ajouter drapeau
        $scope.toolDrapeauSwitch = function () {
            if ($scope.toolDrapeau)
                $scope.toolDrapeau = false;
            else
                $scope.toolDrapeau = true;
        };
        $scope.toolDrapeau = false;

        $scope.addDrapeau = function (Case) {
            if (Case.Couvert) {
                if (Case.drapeau)
                    Case.drapeau = false;
                else
                    Case.drapeau = true;
            }
        };

        function decouvrir() {
            for (var y = 0; y < $scope.TableauWidth; y++) {
                for (var x = 0; x < $scope.TableauHeight; x++) {
                    var Case = getCase($scope.Tableau, x, y);
                    if (Case.content === 'mine')
                        Case.Couvert = false;
                }
            }
        }

        $scope.rejouer = function ($state) {
            $window.location.reload();
        };

        //Main click
        $scope.DecouvertCase = function (Case, $event) {
            switch ($event.which) {
                //left click
                case 1:
                    if (!$scope.toolDrapeau) {
                        var x = parseInt($event.target.parentElement.getAttribute('x'));
                        var y = parseInt($event.target.parentElement.parentElement.getAttribute('y'));
                        if (Case.content === 'vide' && Case.Couvert && !Case.drapeau)
                            CaseCheckvide($scope.Tableau, x, y);
                        if (!Case.drapeau) {
                            Case.Couvert = false;
                            if (Case.content === "mine") {
                                $scope.messagePerdu = true;
                                decouvrir();
                            } else {
                                if (gagne($scope.Tableau)) {
                                    $scope.messageGagne = true;
                                }
                            }
                        }
                    } else {
                        $scope.addDrapeau(Case);
                    }
                    break;
                //middle
                case 2:
                    break;
                //right click
                case 3:
                    $scope.addDrapeau(Case);
                    break;
                default:
                    alert("you have a strange mouse!");
                    break;
            }
        };
    })

    .controller('ParamsCtrl', function ($scope, Params, $window, $ionicPopup) {
        //Récupérer les params (localStorage)
        $scope.TableauHeight = Params.getHeight($scope);
        $scope.TableauWidth = Params.getWidth($scope);
        $scope.Difficulte = Params.getDifficulte($scope);
        $scope.showPopup = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Paramètres enregistrés !',
                template: 'Bonne chance pour ta nouvelle partie...'
            });
            alertPopup.then(function (res) {
                $window.location.reload();
            });
        };

        $scope.params = {};
        $scope.submit = function () {
            if ($scope.params.width)
                localStorage.setItem("width", JSON.stringify($scope.params.width));
            if ($scope.params.height)
                localStorage.setItem("height", JSON.stringify($scope.params.height));
            if ($scope.params.difficulte)
                localStorage.setItem("difficulte", JSON.stringify($scope.params.difficulte).replace(/\"/g, ""));
            $scope.showPopup();
        }
    });
