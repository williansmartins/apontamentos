angular.module('controlei')
.controller('HomeController', ['$scope', '$uibModal', '$log', '$document', '$location', '$window', '$filter', 'HomeService', '$rootScope', '$localStorage','$rootScope', 
	function ($scope, $uibModal, $log, $document, $location, $window, $filter, HomeService, $rootScope, $localStorage, $rootScope) {

    $scope.temErro = false;
    $scope.tela = 1;
    $scope.mensagem = "";
    $scope.form = {
    	"name": "",
    	"email": "contato@williansmartins.com", 
    	"password": "martin"
    };
    $scope.$storage = $localStorage;
    $scope.apontamentosDoDia = {};
    $scope.todosApontamentos = {};
    $scope.todasDescricoes = {};
    $scope.sucesso = false;
    $scope.entidadeSelecionada = null;
    $scope.apontamentosOrganizados = null;
    $scope.titulo = "Apontamento de horas";
    $scope.teste = "&#9;&#10;";
    $scope.flagRelatorio = false;


    $scope.apontar = function(){
        //apontar
        HomeService.apontar()
        .success(function(response, status){
            $scope.sucesso = true;
            setTimeout(voltar, 3000);
        })
        .error(function(response){
            alert("Erro!");
        });
    }
 
    $scope.verificarDescricao = function(){
        //se nao tem descricao vamos criar uma
        HomeService.buscarDescricaoDoDia()
        .success(function(response, status){
            if(response.apontamento_geral.length==0){
                
                //criar descricao
                HomeService.criarDescricao()
                .success(function(response, status){
                    console.info("descricao criada");
                    $scope.apontar();
                })
                .error(function(response){
                    alert("Erro!");
                });
                
            }else{
                $scope.apontar();
                console.info("nao criarei descricao");
            }
        })
        .error(function(response){
            alert("Erro!");
        });


    	
    }

    var voltar = function(){
        ////console.info("mudando para false");
        $scope.sucesso = false;
        $scope.$apply();
    }

    var buscarApontamentosDoDia = function(){
    	HomeService.buscarApontamentosDoDia()
        .success(function(response, status){
    		$scope.apontamentosDoDia = response.apontamento;

    		angular.forEach($scope.apontamentosDoDia, function(value, key) {
//                value.ponto = new Date(value.ponto.replace(' ', 'T')+"-03:00");
                value.ponto = new Date(value.ponto.replace(' ', 'T')+"");
			});

            calcularHorasDoDia2();

        })
        .error(function(response){
            alert("Erro!");
        });
    }

    var buscarTodosApontamentos = function(){
        HomeService.buscarTodasDescricoes()
        .success(function(response, status){
            $scope.todasDescricoes = response.apontamento_geral;

            HomeService.buscarTodosApontamentos()
            .success(function(response, status){
                $scope.todosApontamentos = response.apontamento;
                criarNovosCampos(response.apontamento);
            })
            .error(function(response){
                alert("Erro!");
            });
        })
        .error(function(response){
            alert("Erro!");
        });
    }

    var buscarApontamentosDoMesAtual = function(){
        HomeService.buscarTodasDescricoes()
        .success(function(response, status){
            $scope.todasDescricoes = response.apontamento_geral;

            HomeService.buscarApontamentosDoMesAtual()
            .success(function(response, status){
                $scope.todosApontamentos = response.apontamento;
                criarNovosCampos(response.apontamento);
            })
            .error(function(response){
                alert("Erro!");
            });
        })
        .error(function(response){
            alert("Erro!");
        });
    }

    var criarNovosCampos = function(todosApontamentos){
        angular.forEach(todosApontamentos, function(value, key) {
	    value.ponto = new Date(value.ponto.replace(' ', 'T')+"");
            var chave = value.ponto.format("YYYY-MM-DD");
            var valor = value.ponto.format("HH:mm");
            value.chave = chave;
            value.valor = valor;
            ////console.info(">>" + value.ponto);
        });

        organizarPontos($scope.todosApontamentos);
    }

    var organizarPontos = function(entidades){
        //agrupar
        var grouped = _.groupBy(entidades, function(entidade) {
            return entidade.chave;
        });

    
        //transformar objeto
        var mapped = Object.keys(grouped).map(function(key) {
           return [key, grouped[key]];
        });
        
        //ordenar horas
        angular.forEach(mapped, function(value, key){
           value[1] = _.orderBy(value[1], ['ponto'], ['asc']);
        });

        //inverter
        // mapped.slice().reverse();


        $scope.todosApontamentos = mapped;
    	calcularHorasDoDia($scope.todosApontamentos);
    	associarDescricoes($scope.todosApontamentos);
    }

    $scope.reordenar = function(){
        var list = $('.itens');
        var listItems = list.children('li');
        list.append(listItems.get().reverse());

        $('.itens').fadeIn();

    	// list.children()
     //        .each(function(i,li){
     //            list.prepend(li)
     //        })
    }

    var associarDescricoes = function(todosApontamentos){
    	angular.forEach(todosApontamentos, function(apontamento, key){

            angular.forEach($scope.todasDescricoes, function(apontamento_geral, key){
                var chaveComoData = new Date(apontamento_geral.data.replace(' ', 'T')+"");
                var chave = chaveComoData.format("YYYY-MM-DD");

                if(apontamento[0] == chave){
                    apontamento.descricao = {
                        descricao : apontamento_geral.descricao,
                        data: chave,
                        id: apontamento_geral.id
                    }
                }

            });

            //setTimeout($scope.reordenar, 1000);
            
        });
    }
    
    $scope.editarDescricao = function(value){
        if(value.descricao){
            $scope.descricaoSelecionada = value.descricao;
            $scope.dataSelecionada = value.descricao.data;
        }else{
            $scope.dataSelecionada = value[0];
        }
    }

    var calcularHorasDoDia2 = function(){
        var value = $scope.apontamentosDoDia;

        if((value).length == 4){
            var ponto1 = moment(value[0].ponto);
            var ponto2 = moment(value[1].ponto);
            var ponto3 = moment(value[2].ponto);
            var ponto4 = moment(value[3].ponto);
        
            var manha = ponto2.diff(ponto1, "hours", true);
            var tarde = ponto4.diff(ponto3, "hours", true);     
        
            var soma = manha + tarde;
            var arredondado = Math.round( soma * 10) / 10;
        
            //console.error(arredondado);
            value['total'] = arredondado;
        }
        
        if((value).length == 2 || (value).length == 3){
            var ponto1 = moment(value[0].ponto);
            var ponto2 = moment(value[1].ponto);
        
            var manha = ponto2.diff(ponto1, "hours", true); 
        
            var arredondado = Math.round( manha * 10) / 10;
        
            //console.error(arredondado);
            value['total'] = arredondado;
        }
        
        if((value).length == 3){
            value['total'] = value['total']+'+';
        }
    }

    var calcularHorasDoDia = function(todosApontamentos){
    	angular.forEach(todosApontamentos, function(value, key){
            //console.info("dias: " + value);
		
    		value['total'] = '?';
    	   	
    		if((value[1]).length == 4){
    			var ponto1 = moment(value[1][0].ponto);
    			var ponto2 = moment(value[1][1].ponto);
    			var ponto3 = moment(value[1][2].ponto);
    			var ponto4 = moment(value[1][3].ponto);
    		
    			var manha = ponto2.diff(ponto1, "hours", true);
    			var tarde = ponto4.diff(ponto3, "hours", true);		
    		
    			var soma = manha + tarde;
    			var arredondado = Math.round( soma * 10) / 10;
    		
    			//console.error(arredondado);
    			value['total'] = arredondado;
    		}
    		
    		if((value[1]).length == 2 || (value[1]).length == 3){
    			var ponto1 = moment(value[1][0].ponto);
    			var ponto2 = moment(value[1][1].ponto);
    		
    			var manha = ponto2.diff(ponto1, "hours", true);	
    		
    			var arredondado = Math.round( manha * 10) / 10;
    		
    			//console.error(arredondado);
    			value['total'] = arredondado;
    		}
    		
    		if((value[1]).length == 3){
    			value['total'] = value['total']+'+';
    		}
	   
    	   angular.forEach(value[1], function(hora, key){
    	   	//console.info("horas: " + hora);
    		//debugger;
    		
    	   });
        });
    }

    $scope.deletar = function(id){
    	HomeService.deletar(id)
        .success(function(response, status){
        	buscarTodosApontamentos();
        	buscarApontamentosDoDia();
            //$scope.mudarTela(2);
        	//console.info("sucesso");
        })
        .error(function(response){
            alert("Erro!");
        });
    }

    $scope.mudarTela = function(tela){
    	$scope.tela = tela;

        if(tela==1){
            $scope.titulo = "Apontamento de horas";
        }
    	if(tela==2){
    		buscarApontamentosDoDia();
            $scope.titulo = "Apontamento de HOJE";
    	}

        if(tela==3){
            //$('.itens').hide();
            buscarTodosApontamentos();
            $scope.titulo = "Todos os apontamentos";
        }

        if(tela==4){
            $scope.titulo = "Editando um apontamento";
        }

        if(tela==5){
            $scope.titulo = "Editando uma descrição";
        }

        if(tela==6){
            //$('.itens').hide();
            buscarApontamentosDoMesAtual();
            $scope.titulo = "Mês atual";
        }
    }

	$scope.sair = function(){
    	$window.location.href = "#login";
    }

    $scope.editar = function(entidade){
        //qual janela estamos? (mes ou tudo?)
        $scope.entidadeSelecionada = entidade;
        $scope.entidadeSelecionada.ponto = $filter('date')($scope.entidadeSelecionada.ponto, "yyyy-MM-dd HH:m:s"); 
        // $scope.mudarTela(4);
    }

    $scope.modalDimiss = function(){
      buscarApontamentosDoDia();
    }

    $scope.salvar = function(){
        HomeService.atualizar($scope.entidadeSelecionada)
        .success(function(response, status){
            if($scope.tela==6){
                buscarApontamentosDoMesAtual();
            }else if($scope.tela==3){
                buscarTodosApontamentos();
            }else{
                buscarApontamentosDoDia();
            }
        })
        .error(function(response){
            alert("Erro!");
        });
        
    }

    $scope.salvarDescricao = function(){

        if($scope.descricaoSelecionada.id){
            HomeService.atualizarDescricao($scope.descricaoSelecionada)
            .success(function(response, status){
            })
            .error(function(response){
                alert("Erro!");
            });
        }else{
            HomeService.criarDescricao($scope.descricaoSelecionada.descricao, $scope.dataSelecionada)
            .success(function(response, status){
                console.info("sucesso");
            })
            .error(function(response){
                alert("Erro!");
            });          
        }
        
    }

    $scope.exportar = function(){
        var args = [$('.table'), 'export.csv'];
        exportTableToCSV.apply($(".export"), args);
    }

    init = function() {
    	
    };

	init();
}]);

