angular
.module('controlei')
.factory('HomeService', HomeService);

function HomeService ($q, $window, $http) {
    return {

        buscarQuestoes: function(){
            return $http({
                method : "GET",
                url : barramento + "/generic/questoes?order=id&transform=1"
            })
        },

        apontar : function () {
            var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM-DD HH:m:s");

            return $http({
                method : "POST",
                url : barramento + "/generic/apontamento",
                data: {
                    "created_at": dataFormatada,
                    "ponto": dataFormatada,
                    "descricao": "natural",
                }
            })
        },

        atualizar : function (entidade) {
            var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM-DD HH:m:s");

            return $http({
                method : "PUT",
                url : barramento + "/generic/apontamento/" + entidade.id,
                data: {
                    "updated_at": dataFormatada,
                    "ponto": entidade.ponto
                }
            })
        },

        deletar : function (id) {
            return $http({
                method : "DELETE",
                url : barramento + "/generic/apontamento/"+id
            })
        },

        buscar : function () {
            return $http({
                method : "GET",
                url : barramento + "/generic/apontamento/"+id
            })
        },

        buscarApontamentosDoDia : function () {
            var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM-DD");

            return $http({
                method : "GET",
                url : barramento + "/generic/apontamento?filter[]=ponto,cs,"+dataFormatada+"&transform=1"
            })
        },

        buscarApontamentosDoMesAtual : function () {
        	var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM");

            return $http({
                method : "GET",
                url : barramento + "/generic/apontamento?filter[]=ponto,cs,"+dataFormatada+"&transform=1"
            })
        },

        buscarTodosApontamentos : function () {
            return $http({
                method : "GET",
                url : barramento + "/generic/apontamento?transform=1"
            })
        },

        buscarTodasDescricoes : function () {
            return $http({
                method : "GET",
                url : barramento + "/generic/apontamento_geral?transform=1"
            })
        },

        criarDescricao : function (descricao, data) {
            var novaDescricao = 'definir';
            if(descricao){
                novaDescricao = descricao;
            }

            var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM-DD HH:m:s");
            if(data){
                dataFormatada = data;
            }

            return $http({
                method : "POST",
                url : barramento + "/generic/apontamento_geral",
                data: {
                    "descricao": descricao,
                    "cliente": "---",
                    "projeto": "---",
                    "data": dataFormatada,
                    "created_at": dataFormatada
                }
            })
        },

        buscarDescricaoDoDia : function () {
            var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM-DD");

            return $http({
                method : "GET",
                url : barramento + "/generic/apontamento_geral?filter=data,cs,"+dataFormatada+"&transform=1"
            })
        },

        atualizarDescricao : function (descricao) {
            var dataAtual = new Date();
            var dataFormatada = dataAtual.format("YYYY-MM-DD HH:m:s");

            return $http({
                method : "PUT",
                url : barramento + "/generic/apontamento_geral/" + descricao.id,
                data: {
                    "updated_at": dataFormatada,
                    "ponto": descricao.ponto,
                    "descricao": descricao.descricao
                }
            })
        },
    };
}