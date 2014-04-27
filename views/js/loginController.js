function LoginController($scope) {
    $scope.salvar = function() {
        alert("Seu nome de usuário é:" + $scope.nmUsuario);
    };
}