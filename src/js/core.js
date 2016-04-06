import angular from 'angular';
import router from 'angular-ui-router';
import sanitize from 'angular-sanitize';
import $ from 'jquery';
import bootstrap from 'bootstrap';

angular.module('myApp',['ui.router','ngSanitize'])
.run(['$rootScope',($root)=>{
    
}])
.factory('$api',['$http',($http)=>{
    var api = (url,data,opt) => {
			return api.post.call(api,url,data,opt);
		}
		function ajax(opt){
			var defer = $q.defer();
			$http(opt).success((data)=>{
				if(typeof data == 'object') {
					if(data.error){
						Materialize.toast(data.message,5000);
						defer.reject(data.message);
					}
				}
				//console.log(data);
				defer.resolve(data);
			}).error((rejection)=>{
				console.log(rejection);
				defer.reject(rejection)
			});
			return defer.promise;
		}
		api.get = (url,data,opt)=>{
			return ajax({
				url : url,
				method : 'GET',
				data : data
			});
		}
		api.post = (url,data,opt)=>{
			return ajax({
				url : url,
				method : 'POST',
				data : data
			});
		}
		return api;
}])
.controller('mainCtrl',['$scope','$stateParams',($s,$param)=>{
    $.extend($s,{
        init () {
            
        }
    });
}]);