// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.turmas', {
    cache: false,
    url: '/turmas',
    views: {
      'tab-turmas': {
        templateUrl: 'templates/tab-turmas.html',
        controller: 'TurmasCtrl'
      }
    }
  })
  .state('tab.turma-alunos',{
      url:'/turmas/:turmaId',
      views:{
          'tab-turmas':{
              templateUrl:'templates/turma-alunos.html',
              controller:'AlunosCtrl'
          }
      }
  })
  
  .state('tab.aluno-detalhe',{
      url:'/turmas/:turmaId/:alunoId',
      views:{
          'tab-turmas':{
              templateUrl:'templates/aluno-detalhe.html',
              controller:'AlunoDetailCtrl'
          }
      }
  })

  .state('tab.desempenho', {
      cache: false,
      url: '/desempenho',
      views: {
        'tab-desempenho': {
          templateUrl: 'templates/tab-desempenho.html',
          controller: 'DesempenhoCtrl'
        }
      }
    })
    .state('tab.frequencia', {
      cache: false,
      url: '/frequencia',
      views: {
        'tab-frequencia': {
          templateUrl: 'templates/tab-frequencia.html',
          controller: 'FrequenciaCtrl'
        }
      }
    })
  .state('tab.frequencia-alunos',{
      cache: false,
      url:'/frequencia/:turmaId',
      views:{
          'tab-frequencia':{
              templateUrl:'templates/frequencia-alunos.html',
              controller:'FrequenciaAlunosCtrl'
          }
      }
  })
  .state('tab.frequencia-aluno',{
      cache: false,
      url:'/frequencia/aluno/:alunoId',
      views:{
          'tab-frequencia':{
              templateUrl:'templates/frequencia-aluno.html',
              controller:'FrequenciaAlunoCtrl'
          }
      }
  })    
    .state('tab.desempenho-turma', {
      url: '/desempenho/:turmaId',
      views : {
          'tab-desempenho': {
              templateUrl: 'templates/desempenho-turma.html',
              controller: 'DesempenhoTurmaCtrl'
          }
      }
  })
    .state('tab.desempenho-turma.resultado',{
           url:'/resultado/:alunoId',
           views: {
               'desempenho-info':{
                   templateUrl: 'templates/aluno-resultado.html',
                   controller: 'ResultadoCtrl'
            }
       }
    })
    
    .state('tab.desempenho-turma.aprovados', {
      url:'/aprovados',
      views : {
          'desempenho-info':{
              templateUrl: 'templates/desempenho-aprovados.html',
              controller:'DesempenhoTurmaAlunosCtrl'
          }
      }
  })
    .state('tab.desempenho-turma.reprovados', {
      url:'/reprovados',
      views : {
          'desempenho-info':{
              templateUrl: 'templates/desempenho-reprovados.html',
              controller:'DesempenhoTurmaAlunosCtrl'
          }
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/turmas');

})

.config(function(ionicDatePickerProvider){
    var datePickerObj = {
        inputDate:new Date(),
        titleLabel:'Selecione uma Data',
        setLabel:'Salvar',
        todayLabel:'Hoje',
        closeLabel:'Fechar',
        mondayFirst:'false',
        weeksList:['D','S','T','Q','Q','S','S'],
        monthsList:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        templateType:'popup',
        showTodayButton:true,
        dateFormat:'dd MM yyyy',
        closeOnSelect:false,
        disableWeekdays:[]
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
});
