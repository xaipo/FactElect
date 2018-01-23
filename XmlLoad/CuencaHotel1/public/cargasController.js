/**
 * Created by xaipo on 1/22/2018.
 */
app.controller('CargasController', ['$scope', '$http', 'myProvider', function ($scope, $http, myProvider) {
    $scope.status;
    $scope.logComplete=[];

    $http({

        method: 'POST',
        url: myProvider.getStatus(),

        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function successCallback(response) {

        $scope.status=response.data;
        console.log($scope.status);
    }, function errorCallback(response) {
        console.log('entra');
        //  Console.log(response);
        //$scope.mesaje = response.mensaje;

    });


    $http({

        method: 'GET',
        url: myProvider.getLog(),

        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function successCallback(response) {
        $scope.logComplete=[];
        $scope.log=response.data;
        $scope.log=$scope.log.split('$');
        var n = $scope.log.length;
        for(var i=0; i<n;i++){
            var aux= $scope.log[i].split('_');
            var obj={
                'descripcion':aux[0],
                'fecha':aux[1],
                'hora':aux[2]
            }
            obj.hora=obj.hora.replace(/-/g,':');
            $scope.logComplete.push(obj);
        }
        console.log($scope.log);
    }, function errorCallback(response) {

        //  Console.log(response);
        //$scope.mesaje = response.mensaje;

    });

    $scope.start = function () {
        $http({

            method: 'POST',
            url: myProvider.getStart(),

            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {

            $scope.status=response.data;
            console.log($scope.status);

        }, function errorCallback(response) {
            console.log('entra');
            //  Console.log(response);
            //$scope.mesaje = response.mensaje;

        });
    }

    $scope.stop = function () {

        $http({

            method: 'POST',
            url: myProvider.getStop(),

            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {

            $scope.status=response.data;
            console.log($scope.status);
        }, function errorCallback(response) {
            console.log('entra');
            //  Console.log(response);
            //$scope.mesaje = response.mensaje;

        });
    }

    $scope.update = function (){
        $http({

            method: 'GET',
            url: myProvider.getLog(),

            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {
            $scope.logComplete=[];
            $scope.log=response.data;
            $scope.log=$scope.log.split('$');
            var n = $scope.log.length;
            for(var i=0; i<n;i++){
                var aux= $scope.log[i].split('_');
                var obj={
                    'descripcion':aux[0],
                    'fecha':aux[1],
                    'hora':aux[2]
                }
                obj.hora=obj.hora.replace(/-/g,':');
                $scope.logComplete.push(obj);
            }
            console.log($scope.log);
        }, function errorCallback(response) {

            //  Console.log(response);
            //$scope.mesaje = response.mensaje;

        });
    }


    $scope.clearLo = function (){
        $http({

            method: 'POST',
            url: myProvider.clearLog(),

            headers: {
                'Content-Type': 'application/json'
            }

        }).then(function successCallback(response) {

                $scope.update();
        }, function errorCallback(response) {

            //  Console.log(response);
            //$scope.mesaje = response.mensaje;

        });
    }

}]);