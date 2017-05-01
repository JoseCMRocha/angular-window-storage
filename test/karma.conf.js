module.exports = function(config) {
	config.set({		
		autoWatch: false,
		basePath: '../',
		browsers: [ 
				'PhantomJS'
			],
		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'build/angular-window-storage.js',
			'test/mock/*.js',
			'test/spec/*.js'
		],
		frameworks: [ 'jasmine' ],
        plugins: [			
			'karma-phantomjs-launcher',
			'karma-jasmine'
		],
		singleRun: true,
		reporters: ['progress'],
		// preprocessors
		preprocessors: {},
		
		colors: true
  });
};