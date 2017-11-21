angular.module('starter.services', [])

.factory('Turmas', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var turmas = [{
    id: 0,
    nome: 'Turma 1',
    avatar: 'img/max.png',
    alunos: [{
        id:0,
        nome:'Pedro Rodrigues',
        avatar:'img/ben.png',
        nota1:7,
        nota2:8,
        nota3:5
    },{
        id:1,
        nome:'Joao',
        avatar:'img/mike.png',
        nota1:5,
        nota2:8,
        nota3:9
    },{
        id:2,
        nome:'Jose',
        avatar:'img/perry.png',
        nota1:4,
        nota2:6,
        nota3:7
    }]
  }, {
    id: 1,
    nome: 'Turma 2',
    avatar: 'img/ionic.png',
    alunos:[]
  }, {
    id: 2,
    nome: 'Turma 3',
    avatar: 'img/adam.jpg',
    alunos: []
  }];

  return {
    all: function() {
      return turmas;
    },
    remove: function(chat) {
      turmas.splice(turmas.indexOf(turma), 1);
    },
    pega: function(turmaId) {
      for (var i = 0; i < turmas.length; i++) {
        if (turmas[i].id === parseInt(turmaId)) {
          return turmas[i];
        }
      }
      return null;
    },
    getAlunoFromTurma: function(turmaId,alunoId){
        for(index in turmas){
            if(turmas[index].id === parseInt(turmaId)){
                for(index2 in turmas[index].alunos){
    if(turmas[index].alunos[index2].id === parseInt(alunoId)){
        return turmas[index].alunos[index2];
                    }
                }
            }
        }
    }
  };
})

.factory('connectionService',function($http){
    var baseURL = "http://localhost:3000/api";
    
    var _getConnectionSystem = function(action,jsonObj,methodHTTP,params){
        var parametros = '';
        if(params!='' && params !=null){
            if(params.one!=''){
                parametros +='/'+params.one;
            }
            if(params.two!=''){
                parametros +='/' +params.two;
            }
        }
        
        if(methodHTTP != null){
            switch(methodHTTP){
                case 'GET':
                    return $http({
                        method:'GET',
                        url:baseURL+'/'+action+parametros
                        });
                default:
                    return $http({
                        method:'POST',
                        url:baseURL+'/'+action+parametros,
                        data:jsonObj});
            }
        }else{
            return $http({
                method:'POST',
                url:baseURL+'/'+action+parametros,
                data:jsonObj
                });
            }
    }
    
    return{
        getConnection: _getConnectionSystem
    }
});
