angular.module('starter.controllers', [])

.controller('TurmasCtrl', function($scope, Turmas,$ionicPopover,$ionicModal,ionicDatePicker,$ionicPopup,connectionService) {
    //$scope.turmas = Turmas.all();
    $scope.turmas = [];
    $scope.editando = false;
    
    $scope.deletando = false;
    
    var turmasAvatar = ['img/turma1.jpg','img/turma2.jpg','img/turma3.jpg','img/turma4.jpg'];
    
    $scope.actionAdd="turma";
    $scope.actionList = "turmas";
    
/***********Configuração popover******/
    $ionicPopover.fromTemplateUrl('templates/popovers/popover-turma.html',{
        scope: $scope
    }).then(function(popover){
        $scope.popover = popover;
    });
    
    $scope.openPopover = function($event){
        $scope.popover.show($event);
    };
    
    $scope.closePopover =  function(){
        $scope.popover.hide();
    };
/*************Fim configuração popover*/
/***********Configuração Modal**********/
    
    $ionicModal.fromTemplateUrl('templates/modals/addturma-modal.html',{
        scope:$scope
    }).then(function(modal){
        $scope.modal = modal;
    });
    
    $scope.openModal = function(){
        $scope.modal.show();
    }
    
    $scope.closeModal = function(){
        $scope.editando = false;
        $scope.modal.hide();
        $scope.turma = criarTurma();
    }
    
    $scope.$on('modal.hidden',function(){
        $scope.closePopover();
    })
    
/*************Fim configuração Modal*****/
/*************Funções Locais***************/ 
    var criarTurma =  function(){
        return {
            id:'',
            nome:'',
            dataInicio:'',
            dataTermino:'',
            cargaHTotal:'',
            cargaHDiaria:'',
            turno:'Manhã',
            situacao:1,
            avatar:''
        }
    }
    
    //Gera posição aleatória
    var geraPosicao =  function(min, max){
        return Math.floor(Math.random()*(max - min + 1)) + min;
    }
    
    var formatarData =  function(val){
        var data = new Date(val);
        var month = data.getMonth()+1;
        var dia = data.getDate();
        
        if(parseInt(month)<10){
            month = '0'+month;
        }
        if(parseInt(dia)<10){
            dia = '0'+dia;
        }
        
        return dia + '/' +month+'/'+data.getFullYear();
    }
    
    $scope.turma = criarTurma();
    
    var openDatePicker = function(idpObj){
        ionicDatePicker.openDatePicker(idpObj);
    }
    
    var validarTurma = function(turma){
        var existeErro = false;
        var textoErro = '';
        
        if(turma.cargaHDiaria>24){
            existeErro=true;
            textoErro += '<p>O dia só tem 24 horas.</p>'
        }
        
        
        var dataInicio = new Date();
        var month = parseInt(turma.dataInicio.substring(3,5)) -1;
        dataInicio.setFullYear(turma.dataInicio.substring(6,10),month,turma.dataInicio.substring(0,2));
        
        var dataFinal = new Date();
        month = parseInt(turma.dataTermino.substring(3,5)) -1;
        dataFinal.setFullYear(turma.dataTermino.substring(6,10),month,turma.dataTermino.substring(0,2));
        //debugger;
        if(dataInicio > dataFinal){
            existeErro = true;
            textoErro += "<p> Curso termina antes de começar.</p>";
        }
    
        if(!(turma.cargaHTotal%turma.cargaHDiaria==0)){
            existeErro = true;
            textoErro += "<p>Erro na carga horária</p>";
        }
        
        if(existeErro){
            $ionicPopup.alert({
                title:"Corrija os seguintes erros.",
                template:textoErro
            });
            return false;
        }
        
        return true;
    }
/*************Fim Funções Locais***************/
    $scope.openDatePickerDI =  function(){
        var idpObj = {
            callback:function(val){
                $scope.turma.dataInicio = formatarData(val);
            }
        }
        
        openDatePicker(idpObj);
    }
    $scope.openDatePickerDF =  function(){
        var idpObj = {
            callback:function(val){
                $scope.turma.dataTermino = formatarData(val);
            }
        }
        
        openDatePicker(idpObj);
    }
    
    $scope.addTurma = function(turma){
        if(!validarTurma(turma)){
            return;
        }
        //turma.avatar = 'img/ionic.png';
        turma.avatar = turmasAvatar[geraPosicao(0,3)];
        
        var jsonObj =JSON.stringify(turma);
        
        connectionService.getConnection(
            $scope.actionAdd,
            jsonObj,
            null,
            ''
        ).success(function(data){
            turma.id = data.insertId;
            $scope.turmas.push(turma);
        }).error(function(){
            console.log("Problema ao adicionar turma");
        });
        $scope.turma = criarTurma();
        $scope.closeModal();
    }
    
    $scope.getTurmas =  function(){
        connectionService
            .getConnection(
            $scope.actionList,
            '',
            'GET',
            '')
            .success(function(data){
                $scope.turmas = data;
            }).error(function(){
                console.log("Erro ao listar turmas.")
            })
    }
    
    $scope.actionDelete = 'turma';
    
    $scope.excluirTurma = function(turma){
        var params = {
            one:turma.id,
            two:''
        }
        
        connectionService
            .getConnection(
            $scope.actionDelete,
            '',
            'GET',
            params
            ).success(function(data){
            if(data.affectedRows>0){
            $scope.turmas.splice(
                $scope.turmas.indexOf(turma),
                1
            )
            console.log("Turma removida");
            }
            }).error(function(){
                console.log("Erro ao deletar turma");
            })
    }
    
    $scope.deletar =  function(){
        $scope.deletando = !$scope.deletando;
        $scope.closePopover();
    }
    
    var turmaAux;
    $scope.editarTurma =  function(turma){
        $scope.editando = true;
        $scope.turma.nome = turma.nome;
        $scope.turma.dataInicio = turma.dataInicio;
        $scope.turma.dataTermino = turma.dataTermino;
        $scope.turma.cargaHTotal = turma.cargaHTotal;
        $scope.turma.cargaHDiaria = turma.cargaHDiaria;
        $scope.turma.turno = turma.turno;
        turmaAux = turma;
        $scope.openModal();
    }
    /*Atualiza turma local e depois no banco de dados*/
    $scope.actionUpdate = "turma";
    $scope.atualizarTurma = function(turma){
        if(!validarTurma(turma)){
            return;
        }
        turmaAux.nome = turma.nome;
        turmaAux.dataInicio = turma.dataInicio;
        turmaAux.dataTermino = turma.dataTermino;
        turmaAux.cargaHTotal = turma.cargaHTotal;
        turmaAux.cargaHDiaria = turma.cargaHDiaria;
        turmaAux.turno = turma.turno;
        $scope.closeModal();
        
        var jsonObj = JSON.stringify(turmaAux);
        
        connectionService
            .getConnection(
            $scope.actionUpdate,
            jsonObj,
            null,
            ''
        ).success(function(data){
            //console.log(data);
            if(data.affectedRows>0){
                console.log("Turma atualizada.");
            }
        }).error(function(){
            console.log("Falha ao atualizar turma.");
        })
        
    }
    $scope.actionFecharTurma="fecharturma";
    $scope.mudaStatusTurma = function(turma,situacao){
        var params = {
            one:turma.id,
            two:situacao
        }
        
        connectionService
        .getConnection(
            $scope.actionFecharTurma,
            '',
            'GET',
            params
        ).success(function(data){
            if(data.affectedRows>0){
                turma.situacao = parseInt(situacao);
                if(situacao==1){
                    console.log("Turma reaberta");
                }else{
                    console.log("Turma fechada");
                }
            }
        }).error(function(){
            console.log("Erro ao alterar situação da turma");
        })
        
        
    }
    
    $scope.getTurmas();
    
})


.controller('AlunosCtrl', function($scope,Turmas,$stateParams,$ionicPopover,$ionicModal,connectionService){
    
    $scope.turmaId = $stateParams.turmaId;
    $scope.alunos =[];
    $scope.deletando = false;
    
    $scope.deletar =  function(){
        $scope.deletando = !$scope.deletando;
        $scope.closePopover();
    }
    var criarAluno = function(){
        return{
            id:'',
            nome:'',
            avatar:'',
            nota1:'',
            nota2:'',
            nota3:''
        }
    }
    
    
    $scope.aluno = criarAluno();
    
  /*COnfiguracao popover*/  $ionicPopover.fromTemplateUrl("templates/popovers/popover-alunos.html",{
        scope: $scope
    }).then(function(popover){
        $scope.popover = popover;
    });
    
    $scope.openPopover = function($event){
        $scope.popover.show($event);
    }
    
    $scope.closePopover = function(){
        $scope.popover.hide();
    }
    $scope.$on('modal.hidden',function(){
        $scope.closePopover();
    })
    
    /*configuracao modal*/
    $ionicModal.fromTemplateUrl("templates/modals/addaluno-modal.html",{
        scope: $scope
    }).then(function(modal){
        $scope.modal = modal;
    });
    
    $scope.openModal = function(){
        $scope.modal.show();
    }
    
    $scope.closeModal = function(){
        $scope.modal.hide();
    }
    $scope.actionAdd = "aluno";
    $scope.addAluno = function(aluno){
        aluno.avatar = "img/ionic.png";
        
        var params = {
            one:$scope.turmaId,
            two:''
        }
        
        var jsonObj = JSON.stringify(aluno);
        
        connectionService
            .getConnection(
                $scope.actionAdd,
                jsonObj,
                null,
                params
            ).success(function(data){
                aluno.id= data.insertId;
                $scope.alunos.push(aluno);
            }).error(function(){
                console.log("Erro ao adicionar aluno");
            });
        $scope.aluno = criarAluno();
        $scope.closeModal();
    }
    
    $scope.actionList = "alunos";
    $scope.getAlunos = function(){
        var params = {
            one:$scope.turmaId,
            two:''
        }
        
        connectionService
            .getConnection(
            $scope.actionList,
            '',
            'GET',
            params
        ).success(function(data){
            $scope.alunos =data;
        }).error(function(){
            console.log("Erro ao listar alunos.")
        })
    }
    
    $scope.actionDelete = "delete";
    $scope.excluirAluno = function(aluno){
        var params = {
            one:$scope.turmaId,
            two:aluno.id
        }
        
        connectionService
            .getConnection(
                $scope.actionDelete,
                '',
                'GET',
                params
        
            ).success(function(data){
                if(data.affectedRows>0){
                    $scope.alunos.splice(
                        $scope.alunos.indexOf(aluno),1);

                    console.log("Aluno removido.");
                }
            }).error(function(){
                console.log("Erro ao excluir aluno.")
            });
    }
    
    $scope.getAlunos();
    
})

.controller('AlunoDetailCtrl',function($scope,Turmas,$stateParams,connectionService){
    
    $scope.aluno = {};
    $scope.turmaId = $stateParams.turmaId;
    $scope.alunoId = $stateParams.alunoId;
    
    $scope.bloqueado = true;
    $scope.icone = 'ion-locked';
    
    $scope.alteraBloqueio = function(){
        $scope.bloqueado = !$scope.bloqueado;
        
        if($scope.bloqueado){
            $scope.icone='ion-locked';
        }else{
            $scope.icone = 'ion-unlocked';
        }
    }
    $scope.actionGet= "aluno";
    $scope.getAluno = function(){
        var params={
            one:$scope.turmaId,
            two:$scope.alunoId
        }
        
        connectionService
            .getConnection(
            $scope.actionGet,
            '',
            'GET',
            params
        ).success(function(data){
            $scope.aluno = data[0];
        }).error(function(){
            console.log("Erro ao pegar aluno.");
        })
        
    }
    
    $scope.actionUpdate = "aluno";
    $scope.updateAluno =  function(aluno){
        var jsonObj = JSON.stringify(aluno);
        
        connectionService
            .getConnection(
            $scope.actionUpdate,
            jsonObj,
            null,
            ''
        ).success(function(data){
            if(data.affectedRows>0){
                console.log("Informações do aluno "+aluno.nome+" atualizadas.");
            }
        }).error(function(){
            console.log("Problema ao atualizar aluno.");
        });
    }
    
    $scope.getAluno();
})

.controller('DesempenhoCtrl', function($scope,connectionService) {
    $scope.actionList="turmas";
    $scope.actionTurmaInfo = "turmasinfo";
    $scope.turmas =[]
    $scope.getTurmas =  function(){
        connectionService
            .getConnection(
            $scope.actionList,
            '',
            'GET',
            '')
            .success(function(data){
                $scope.turmas = data;
            }).error(function(){
                console.log("Erro ao listar turmas.");
            });
    }
    
    $scope.getTurmasInfo = function(){
        connectionService.getConnection($scope.actionTurmaInfo,
                                       '',
                                       'GET',
                                       '').success(function(data){
            $scope.turmasinfo = data;
        }).error(function(){
            console.log("Error ao baixar turmasinfo");
        })
    }
    
    $scope.getAprovados = function(idTurma){
        for (index in $scope.turmasinfo){
            if ($scope.turmasinfo[index].turmaId == idTurma){
                return $scope.turmasinfo[index].aprovados;
            }
        }    
    }

    $scope.getReprovados = function(idTurma){
        for (index in $scope.turmasinfo){
            if ($scope.turmasinfo[index].turmaId == idTurma){
                return $scope.turmasinfo[index].reprovados;
            }
        }    
    }
    
    $scope.getTurmas();
    $scope.getTurmasInfo();
})

.controller('FrequenciaCtrl', function($scope, connectionService) {
    $scope.turmas = [];
    $scope.actionList = 'turmas';
    $scope.getTurmas =  function(){
        connectionService
            .getConnection(
            $scope.actionList,
            '',
            'GET',
            '')
            .success(function(data){
                $scope.turmas = data;
            }).error(function(){
                console.log("Erro ao listar turmas.")
            })
    }
    
    $scope.getTurmas();
})

.controller('FrequenciaAlunosCtrl', function($scope, connectionService, $stateParams, ionicDatePicker){
    $scope.alunos = [];
    $scope.turmaId = $stateParams.turmaId;
    $scope.actionList = "alunos";
    $scope.actionGetFrequencias = "frequencias";
    $scope.actionSendFrequencias = "frequencia";
    
    var formatarData = function(val, full){
        var data = new Date(val);
        var month = data.getMonth() + 1;
        var dia = data.getDate();
        
        if (parseInt(month) < 10){
            month = '0' + month;
        }
        if (parseInt(dia) < 10){
            dia = '0' + dia;
        }
        
        if(full){
            return data.getFullYear() + '-' + month + '-' + dia;
        }
        return dia + '/' + month;
    }
    
    var abrirDatePicker = function(idpObj){
        ionicDatePicker.openDatePicker(idpObj);
    }
    
    var data = new Date();
    $scope.dataDeHoje = formatarData(data.getTime());
    $scope.dataFull = formatarData(data.getTime(), 'full');
    
    $scope.openDatePicker = function(){
        var idpObj = {
            callback: function(val){
                $scope.dataDeHoje = formatarData(val);
                $scope.dataFull = formatarData(val, 'full');
                $scope.getFrequencias();
                //console.log("data selecionada: " + formatarData(val));
            },
            to: new Date()
        }
        
        abrirDatePicker(idpObj);
    }
    
    $scope.salvar = function(){
        $scope.habilitarSalvar = true;
        
        var jsonObj = JSON.stringify($scope.frequencias);
        
        connectionService.getConnection($scope.actionSendFrequencias,
                                       jsonObj,
                                       null,
                                       '').success(function(data){
            $scope.habilitarSalvar = false;
        }).error(function(){
            $scope.habilitarSalvar = false;
            console.log("Problema ao salvar frequencias!");
        })
    }
    
    $scope.getFrequencias = function(){
        var params= {
            one:$scope.turmaId,
            two: $scope.dataFull
        }
        
        connectionService.getConnection($scope.actionGetFrequencias,
                                       '',
                                       'GET',
                                       params).success(function(data){
            $scope.frequencias = data;
        }).error(function(){
            console.log("problema ao baixar frequencias")
        })
    }
    
    $scope.getFrequencias();
    $scope.getAlunos = function(){
        var params = {
            one:$scope.turmaId,
            two:''
        }
        
        connectionService
            .getConnection(
            $scope.actionList,
            '',
            'GET',
            params
        ).success(function(data){
            $scope.alunos =data;
        }).error(function(){
            console.log("Erro ao listar alunos.");
        })
    }
    
    $scope.getAlunos();
})

.controller('DesempenhoTurmaCtrl', function($scope,$stateParams, connectionService, $state){
  $scope.turmaId = $stateParams.turmaId;  
  $scope.actionList = "alunos";
  $scope.actionGetTurma = "get_turma_by_id";
    
  var redireciona = function(){
      if ($scope.turma.situacao == 0){
          $scope.$on('$ionicView.enter', function(e){
              $state.go('tab.desempenho-turma.aprovados');
          });
      }else{
          $scope.$on('$ionicView.enter', function(e){
              $state.go('tab.desempenho-turma.reprovados');
          })
      }
  }
    
  $scope.getTurma = function(){
      var params = {
          one: $scope.turmaId,
          two: ''
      }
      
      connectionService.getConnection($scope.actionGetTurma,
                                     '',
                                     'GET',
                                     params).success(function(data){
          $scope.turma = data[0];
          redireciona();
      }).error(function(){
          console.log("Erro");
      })
  }
      
    $scope.getAlunos = function(){
        var params = {
            one:$scope.turmaId,
            two:''
        }
        
        connectionService
            .getConnection(
            $scope.actionList,
            '',
            'GET',
            params
        ).success(function(data){
            $scope.alunos =data;
        }).error(function(){
            console.log("Erro ao listar alunos.")
        })
    }

  if (!$scope.turma){
      $scope.getTurma();
  }else{
      redireciona();
  }
  $scope.getAlunos();
})

.controller('DesempenhoTurmaAlunosCtrl', function($scope){

    $scope.filterAlunosAprovados = function(aluno){
        return aluno.media>=6;
    }
    $scope.filterAlunosReprovados = function(aluno){
        return aluno.media<6;
    }
})

.controller('FrequenciaAlunoCtrl', function($scope,$stateParams, connectionService){
    $scope.alunoId = $stateParams.alunoId;
    $scope.actionGetFrequencia = "frequencia";
    
    $scope.presencas = 0;
    $scope.faltas = 0;
    $scope.getFrequencias = function(){
        var params = {
            one: $scope.alunoId,
            two: ''
        }
        
        connectionService.getConnection($scope.actionGetFrequencia,
                                       '',
                                       'GET',
                                       params).success(function(data){
            $scope.frequencias = data;
            $scope.contaPresencas();
        }).error(function(){
            console.log("Problemas ao baixar frequencia do aluno " + $scope.alunoId)
        })
    }
    $scope.contaPresencas = function(){
        for (index in $scope.frequencias){
            if ($scope.frequencias[index].presente==1){
                $scope.presencas++;
            }else{
                $scope.faltas++;
            }
        }
    }
    
    $scope.getFrequencias();
})

.controller('ResultadoCtrl', function($scope, $stateParams, connectionService, $state){
    $scope.turmaId = $stateParams.turmaId;
    $scope.alunoId = $stateParams.alunoId;
    $scope.frequenciaInfo = '';
    $scope.assiduidade = '';
    $scope.totalInfo = '';
    $scope.actionGet = 'aluno';
    $scope.actionInfo = 'frequenciaInfo';
    
    $scope.getAluno = function(){
        var params = {
            one: $scope.turmaId,
            two: $scope.alunoId
        }
        
        connectionService.getConnection($scope.actionGet,
                                       '',
                                       'GET',
                                       params).success(function(data){
            $scope.aluno = data[0];
            $scope.getFrequenciaInfo();
        }).error(function(){
            console.log("Problema ao baixar aluno.");
        })
    }
    
    $scope.getFrequenciaInfo = function(){
        var params = {
            one: $scope.alunoId,
            two: ''
        }
        
        connectionService.getConnection($scope.actionInfo,
                                       '',
                                       'GET',
                                       params).success(function(data){
            $scope.frequenciaInfo = data[0];
            $scope.calculaMedias();
            $scope.calculaAssiduidade();
        }).error(function(){
            console.log("Erro ao baixar frequencia info.");
        })
    }
    
    $scope.calculaAssiduidade = function(){
        if ($scope.frequenciaInfo.numdias){
            if($scope.frequenciaInfo.faltas == 0){
                $scope.assiduidade = 100;
            }else{
                $scope.assiduidade = ($scope.frequenciaInfo.presencas/($scope.frequenciaInfo.faltas+$scope.frequenciaInfo.presencas))*100;
            }
            
            $scope.totalInfo = $scope.frequenciaInfo.presencas + $scope.frequenciaInfo.faltas + '/' + $scope.frequenciaInfo.numdias;
        }else{
            $scope.assiduidade = '0';
            $scope.totalInfo = '';
        }
    }
    
    $scope.calculaMedias = function(){
        $scope.mediaParcial = $scope.aluno.media.toFixed(2);
        $scope.mediaFinal = ($scope.frequenciaInfo.situacao==0)?
            $scope.mediaParcial:'';
    }
    
    $scope.voltar = function(){
        if ($scope.mediaParcial>=6){
            $state.go('^.aprovados');
        }else{
            $state.go('^.reprovados')
        }
    }
    
    $scope.getAluno();
});
