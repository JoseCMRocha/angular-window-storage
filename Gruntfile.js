module.exports = function(grunt) {
	// Do grunt-related things in here
  
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		settings: {
			banner:['/**',
					'* <%= pkg.name %> ',
					'* <%= pkg.description %> ',
					'* Author: <%= pkg.author %> ',
					'* Version: <%= pkg.version %> ',
					'* Date: <%= grunt.template.today("yyyy-mm-dd") %> ',
					'* Project github: <%= pkg.homepage %>',
					'* License: <%= pkg.license %> ',
					'*/'].join('\n'),
			dirs: {
				src: 'src/',
				dest:'build/'
			}
		},
		// concat task		
		concat: {
			options: {
				banner:['<%= settings.banner %>',
						'(function (window, angular) {',
						''].join('\n'),
				footer:['',
						'})(window, window.angular);'].join('\n')
			},
			build: {
				src: ['<%= settings.dirs.src %><%= pkg.name %>.js'],
				dest: '<%= settings.dirs.dest %><%= pkg.name %>.js'
			}
		},
		// uglify task
		uglify: {
			options: {
				banner: '<%= settings.banner %>',
				sourceMap: true
			},
			build: {
			  src: ['<%= concat.build.dest %>'],
			  dest: '<%= settings.dirs.dest %><%= pkg.name %>.min.js'
			}
		},
		bower: {
			install: {
				options: {
					install: true,
					copy: false,
					targetDir: 'bower_components',
					cleanTargetDir: true
				}
			}
		},
		jshint: {
			all: [ 'Gruntfile.js', 'src/angular-window-storage.js', 'build/angular-window-storage.js' ]
		},
		karma: {
			options: {
				configFile: 'test/karma.conf.js'
			},
			unit: {
				singleRun: true
			},			  
			continuous: {
				singleRun: false,
				autoWatch: true
			}
		},
		nugetpack: {
			advanced: {
				options: {
					id: '<%= pkg.name %>',
					version: '<%= pkg.version %>',
					authors: '<%= pkg.author %>',
					description: '<%= pkg.description %>',
					releaseNotes: 'Cookie chunking, encoders and decoders function by parameter bringing the possibility for third party compressors.',
					summary: 'Easy interface to use web storage and cookies allowing old browsers to default to cookies when web storage not supported.',
					language: 'en-us',
					projectUrl: '<%= pkg.homepage %>',
					licenseUrl: 'https://github.com/JoseCMRocha/angular-window-storage/blob/master/LICENSE',
					//copyright: 'Copyright (c) 2017 <%= pkg.author %>',
					requireLicenseAcceptance: true,
					tags: 'angularjs, angular, session, local, storage, window, cookie, localStorage, sessionStorage, document',
					outputDir: 'nuget'
				},
	 
				files: [
					{src: "<%= concat.build.dest %>", dest: "/content/scripts/<%= pkg.name %>/<%= pkg.name %>.js"},
					{src: "<%= settings.dirs.dest %><%= pkg.name %>.min.js", dest: "/content/scripts/<%= pkg.name %>/<%= pkg.name %>.min.js"}
				]
			}
		}
	});
	
	// Load the plugin that provides the "concat" task.
	// Responsible for file concatenation.
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	// Load the plugin that provides the "uglify" task.
	// Responsible for file minification.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// Load the plugin that provides the "jshint" task.
	// Responsible for validate code quality
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// Load the plugin that provides the "bower" task.
	// Responsible for automatically retrieve the latest Bower dependencies
	grunt.loadNpmTasks('grunt-bower-task');
	
	// Load the plugin that provides the "karma" task.
	// Responsible for execute karma inside grunt ... tests
	grunt.loadNpmTasks('grunt-karma');
	
	// Load the plugin that provides the "nugget" task.
	// to publish to the nugget
	grunt.loadNpmTasks('grunt-nuget-pack');
	
	// Test task(s).
	grunt.registerTask('test', ['bower', 'concat', 'jshint', 'karma:unit']);
	
	// Default task(s).
	grunt.registerTask('default', ['bower', 'concat', 'jshint', 'karma:unit', 'uglify']);
	
	// nuget publish
	grunt.registerTask('nuget-pack', ['default', 'nugetpack:advanced']);
	
	// skip tests
	grunt.registerTask('skip-tests', ['bower', 'concat', 'jshint', 'uglify']);
};