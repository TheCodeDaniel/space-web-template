// Angular Js routes and page controllers

var app = angular.module("myApp", ["ngRoute",],);
app.config(function ($routeProvider) {
    // index page route
    $routeProvider.when('/', {
        templateUrl: 'index.html',
        controller: 'indexController'
    }).when('/contact', {
        // contact page route
        templateUrl: 'pages/contact.html',
        controller: 'contactController'
    }).when('/gallery', {
        // gallery page route
        templateUrl: 'pages/gallery.html',
        controller: 'galleryController'
    }).when('/planets', {
        // planets page route
        templateUrl: 'pages/planets.html',
        controller: 'planetsController'
    }).when('/about', {
        // planets page route
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    }).when('/details/:id', {
        templateUrl: 'pages/postDetails.html',
        controller: 'postdetailsController'
    }).when('/not-found', {
        // planets page route
        templateUrl: 'pages/errors/404.html',
        controller: '404Controller'
    }).otherwise({
        // route for non existing directory
        redirectTo: '/not-found'
    });
});



// typed js initialization
app.directive('typed', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var options = scope.$eval(attrs.typedOptions) || {};
            options.strings = scope.$eval(attrs.typedStrings) || [];

            var typed = new Typed(element[0], options);

            scope.typed = typed;
        }
    };
});


// INDEX PAGE controller/ functions

// visitor count method
app.service('VisitorCountService', function () {
    var STORAGE_KEY = 'visitorCount';

    this.getVisitorCount = function () {
        var count = localStorage.getItem(STORAGE_KEY);
        return count ? parseInt(count) : 0;
    };

    this.incrementVisitorCount = function () {
        var count = this.getVisitorCount();
        count++;
        localStorage.setItem(STORAGE_KEY, count.toString());
    };
});


app.controller('indexController', function ($scope, VisitorCountService) {
    VisitorCountService.incrementVisitorCount();
    $scope.visitorCount = VisitorCountService.getVisitorCount();
    $scope.getCurrentYear = function () {
        return new Date().getFullYear();
    };
});


// GALLERY PAGE controller/ functions

app.service('PlanetService', function ($http) {
    // Local API for planets
    this.getPlanets = function () {
        return $http.get('js/json/planets.json');
    };
});

app.controller('galleryController', function ($scope, PlanetService) {
    PlanetService.getPlanets().then(function (response) {
        $scope.planets = response.data;
    });
    $scope.getCurrentYear = function () {
        return new Date().getFullYear();
    };
    // fancybox scope
    $scope.handleClick = function () {
        Fancybox.bind('[data-fancybox="gallery"]', {
            // Your custom options
        });

    };
});

// CONTACT PAGE controller/ functions
app.controller('contactController', function ($scope, $http) {
    // use this only if you have an actual API to submit too
    $scope.submitData = function () {
        var data = {
            name: $scope.name,
            email: $scope.email,
            message: $scope.message,
        };
        // Edit "yout-api-file" to your API endpoint
        $http.post('http://your-api-file.json', data)
            .then(function (response) {
                console.log('Data submitted successfully.');
                // Perform any other actions upon successful submission
            })
            .catch(function (error) {
                console.error('Error submitting data:', error);
                // Handle any errors that occur during submission
            });
    }
    $scope.getCurrentYear = function () {
        return new Date().getFullYear();
    };
});


// PLANET PAGE controller / function
// Local API for event
app.service('AllEventService', function ($http) {
    this.getAllCurrentEvents = function () {
        return $http.get('js/json/events.json');
    };
});
app.controller('planetsController', function ($scope, AllEventService) {
    AllEventService.getAllCurrentEvents().then(function (response) {
        $scope.events = response.data;
        for (i = 0; i < $scope.events.length; i++) {
            return $scope.events[i].title;
        }
    });

    $scope.noResults = function () {
        return $scope.planets && $scope.planets.length === 0 && $scope.searchTerm && $scope.searchTerm.length > 0;
    };

    // current year for footer
    $scope.getCurrentYear = function () {
        return new Date().getFullYear();
    };

    // search suggestions
    $scope.handleSuggs = function () {
        var route = "js/json/events.json";
        $('#search').typeahead({
            source: function (query, process) {
                return $.get(route, {
                    query: query
                }, function (data) {
                    console.log(data);
                    return process(data);
                });
            }
        });
    }
});


// POST (PAGE) DETAILS controller / function
app.controller('postdetailsController', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
    $http.get('js/json/events.json').then(function (response) {
        var jsonData = response.data;
        var id = $routeParams.id;

        $scope.data = jsonData.find(function (item) {
            return item.id === parseInt(id);
        });
    });
    $scope.getCurrentYear = function () {
        return new Date().getFullYear();
    };
}]);