/**
 * AngularJS Tutorial 1
 * @author Sarvesh Dwivedi <sarveshd@smartdatainc.net>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('Socialnetworking', ['ngRoute', 'ngStorage', 'ngResource', 
    "ngSanitize",'ngAnimate','toastr','ngMaterial','ngAria','angularFileUpload']);

/**
 * Configure the Routes
 */
	//console.log("inside basic Authentication");
	//console.log($localStorage);


app.factory('BearerAuthInterceptor', function($window, $q, $localStorage, $location) {
        return {
            request: function(config) { console.log('Call token auth');
                config.headers = config.headers || {};
                console.log(config.url);
                if ($localStorage.token) {
                    // may also use sessionStorage
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                if(config.url == '/users/login' && $localStorage.token){
                     $location.path('/dashboard');
                }
                return config || $q.when(config);
            },
            response: function(response) {
                if (response.status === 201) {
                    //  Redirect user to login page / signup Page.
                    $location.path('/');
                }
                return response || $q.when(response);
            }
        };
    });
    
/*
app.factory('httpInterceptor', function($q, $rootScope, $location, Flash) {
    return {
        request: function(config) {
            console.log(config.url);
            $.blockUI();
            return config;
        },
        requestError: function(response) {
            $.unblockUI();
            return response
        },
        response: function(response) {
            $.unblockUI();
            return response
        },
        responseError: function(response) {
            $.unblockUI();
            return response
        }
    };
});
*/

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        //$httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.interceptors.push('BearerAuthInterceptor');
        $routeProvider
                // Home
                .when("/", {templateUrl: "templates/elements/login.html", controller: "UserCtrl"})
                .when("/dashboard", {templateUrl: "templates/elements/dashboard.html", controller: "UserCtrl"})
                .when("/postgallery", {templateUrl: "templates/elements/postgallery.html", controller: "GalleryCtrl"})
                .when("/profile", {templateUrl: "templates/elements/profile.html", controller: "UserCtrl"})
                .when("/friendprofile/:friendid", {templateUrl: "templates/elements/friendprofile.html", controller: "UserCtrl"})
                .when("/editprofile", {templateUrl: "templates/elements/editprofile.html", controller: "UserCtrl"})
                .when("/changeprofile", {templateUrl: "templates/elements/changeprofile.html", controller: "UserCtrl"})
                .when("/friends", {templateUrl: "templates/elements/friends.html", controller: "UserCtrl"})
                .when("/changepassword", {templateUrl: "templates/elements/changepassword.html", controller: "UserCtrl"})
                .when("/logout", {controller: 'LogoutCtrl'})
                .when("/useractivate/:id", {templateUrl: "templates/elements/activation.html", controller: 'UserCtrl'})
                .when("/forgotpassword", {templateUrl: "templates/elements/forgotpassword.html", controller: 'UserCtrl'})
                .when("/forgotuserpassword/:id", {templateUrl: "templates/elements/forgotuserpassword.html", controller: 'UserCtrl'})
                .when("/inboxmessages", {templateUrl: "templates/elements/inboxmessages.html", controller: "MsgCtrl"})
                .when("/sentmessages", {templateUrl: "templates/elements/sentmessages.html", controller: "MsgCtrl"})
                .when('/search/', {templateUrl: "templates/elements/searchfriend.html", controller: 'FriendsCtrl'})
                // else 404
                .otherwise("/404", {templateUrl: "templates/elements/404.html", controller: "PageCtrl"});
    }]);



app.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
            compareTo: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;

                if (scope.compareTo || ctrl.$viewValue) {
                    combined = scope.compareTo + '_' + ctrl.$viewValue;
                }
                return combined;
            }, function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.compareTo;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("compareTo", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("compareTo", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});

app.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
 
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);

app.directive('checkRequired', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$validators.checkRequired = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                var match = scope.$eval(attrs.ngTrueValue) || true;
                return value && match === value;
            };
        }
    };
});



app.filter('capitalize', function() {
    return function(input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});

app.filter('replacechar', function() {
    return function(input, scope) {
        console.log(input);
        if (input != null) {
            var stringVal = input.replace(/[^a-zA-Z ]/g, "");
            return stringVal.replace(/\s/g, "+");
        }

    }
});

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});

app.directive('googleplaces', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var place = scope.gPlace.getPlace();
                var lat = place.geometry.location.lat();
                var lng = place.geometry.location.lng();
                var elevator = new google.maps.ElevationService;
                elevator.getElevationForLocations({
                    'locations': [place.geometry.location]
                }, function(results, status) {
                   if(status ==='OK'){
                      var elevation =  results[0].elevation;
                   }else{
                      var elevation =  '';
                   }
                   scope.$apply(function() {
                        model.$setViewValue(element.val());
                        scope.masterLatLong = {'lat':lat,'long':lng,'location':element.val(),'elevation':elevation}
                        //console.log(scope.masterLatLong);
                    });
                });
            });
        }
    };
});

app.directive('googleMap', ['$timeout', function($timeout) {
        // directive link function
        var link = function(scope, element, attrs) {
            $timeout(function() {
                var location = scope.name.replace(/\+/g, " ");
                var map, infoWindow;
                var markers = [];

                // map config
                var mapOptions = {
                    center: new google.maps.LatLng(attrs.lat, attrs.lng),
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scrollwheel: true
                };

                // init the map
                function initMap() {
                    if (map === void 0) {
                        map = new google.maps.Map(element[0], mapOptions);
                    }
                }

                // place a marker
                function setMarker(map, position, title, content) {
                    var marker;
                    var markerOptions = {
                        position: position,
                        map: map,
                        title: title,
                        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    };

                    marker = new google.maps.Marker(markerOptions);
                    markers.push(marker); // add marker to array

                    google.maps.event.addListener(marker, 'click', function() {
                        // close window if not undefined
                        if (infoWindow !== void 0) {
                            infoWindow.close();
                        }
                        // create new window
                        var infoWindowOptions = {
                            content: content
                        };
                        infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                        infoWindow.open(map, marker);
                    });
                }

                // show the map and place some markers
                initMap();
//        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), attrs.name, attrs.name);
                setMarker(map, new google.maps.LatLng(attrs.lat, attrs.lng), location, location);
            }, 3000);

        };

        return {
            restrict: 'EA',
            replace: true,
            template: '<div id="gmaps"></div>',
            link: link,
            scope: {
                name: '@',
                lat: '@',
                lng: '@'
            },
        };

    }]);

