module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // todo(sandro-k) configure uglify or closure
        uglify: {
            build: {
                src: 'js/app.js', // input
                dest: 'js/build/app.min.js' // output
            }
        },

        // the SASS task
        // there should be no dedicated styles for the Chrome-App,
        // as all styles are loaded with the mqtt-lens component
        sass: {
            dist: {
                files: [{
                    expand: true,
                    src: ['mqttLensChromeApp.scss'],
                    dest: '.',
                    ext: '.css'
                }]
            }
        },

        // the vulcanize task
        // vulcanize is needed to run polymer within a Chrome-App
        vulcanize: {
            default: {
                options: {
                    csp: true,
                    strip: true
                },
                files: {
                    // Target-specific file lists and/or options go here.
                    'build.html': 'index.html'
                }
            }
        },

        mkdir: {
            build: {
                options: {
                    create: [
                        'build',
                        'build/assets',
                        'build/styles',
                        'build/bower_components/platform',
                        'build/bower_components/polymer',
                        'build/bower_components/webcomponentsjs',
                        'build/bower_components/core-focusable/',
                        'build/bower_components/chrome-app-livereload']
                }
            }
        },

        clean: {
            build: {
                src: ["build.html", "build.js"]
            }
        },

        copy: {
            manifest: {
                expand: true,
                src: ['manifest.json'],
                dest: 'build/',
                filter: 'isFile'
            },
            vulcanize: {
                options: {
                    csp: true,
                    strip: true
                },
                src: ['build.html', 'build.js'],
                dest: 'build/',
                filter: 'isFile'
            },
            assets: {
                expand: true,
                src: ['assets/*'],
                dest: 'build/',
                filter: 'isFile'
            },

            polymer: {
                expand: true,
                src: [
                    'bower_components/webcomponentsjs/webcomponents.js',
                    'bower_components/polymer/polymer.js',
                    'bower_components/core-focusable/polymer-mixin.js',
                    'bower_components/core-focusable/core-focusable.js'],
                dest: 'build/',
                filter: 'isFile'
            },


            //polymer2: {
            //    expand: true,
            //    src: 'bower_components/**',
            //    dest: 'build/'
            //},
            //

            bower_css: {
                cwd: 'bower_components/',
                flatten:true,
                expand: true,
                filter: 'isFile',
                src: '**/*.css',
                dest: 'build/'
            },

            bower_css2: {
                cwd: 'bower_components/',
                expand: true,
                filter: 'isFile',
                src: '**/*.css',
                dest: 'build/'
            },


            // we need a patched version of livereload to work within a chrome app
            // see: https://github.com/mklabs/tiny-lr#0.0.5
            // TODO (sandro-k) add link to patched github version
            livereload: {
                expand: true,
                src: ['bower_components/chrome-app-livereload/livereload.js'],
                dest: 'build/',
                filter: 'isFile'
            },

            mainjs: {
                expand: true,
                src: ['main.js'],
                dest: 'build/',
                filter: 'isFile'
            },

            scripts: {
                expand: true,
                src: [
                    'bower_components/google-code-prettify/src/prettify.js',
                    'bower_components/moment/min/moment.min.js',
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/mqtt-connection/mows/mows.js',
                    'bower_components/mqtt-connection/bundel.js',
                    'bower_components/underscore/underscore.js'
                ],
                dest: 'build/',
                filter: 'isFile'
            },
            appAssets: {
                expand: true,
                src: [
                    'assets/*'
                ],
                dest: 'build/',
                filter: 'isFile'
            },
            assets: {
                expand: true,
                src: [
                    'bower_components/*/assets/*'
                ],
                dest: 'build/',
                filter: 'isFile'
            }
        },

        connect: {
            server: {
                options: {
                    open: {
                        target: 'http://localhost:9001/build.html'
                    },
                    port: 9001,
                    base: 'build'
                }
            }
        },

        watch: {
            // watch for SCSS files and compile to css
            sass: {
                files: ['styles/*.scss'],
                tasks: ['sass'],
                options: {
                    // use live reload that is build in with grunt watch and use default port
                    livereload: true
                }
            },
            vulcanize: {
                files: ['index.html'],
                tasks: ['polymer_clean'],
                options: {
                    // use live reload that is build in with grunt watch and use default port
                    livereload: true
                }
            },
            manifest: {
                files: ['manifest.json'],
                task: ['copy:manifest'],
                options: {
                    // use live reload that is build in with grunt watch and use default port
                    // todo(sandro-k) check if changes in the manifest are refreshed
                    livereload: true
                }
            },
            assets: {
                files: ['assets/*'],
                task: ['copy:assets'],
                options: {
                    // use live reload that is build in with grunt watch and use default port
                    // todo(sandro-k) check if changes in the manifest are refreshed
                    livereload: true
                }
            },
            mainjs: {
                files: ['main.js'],
                task: ['copy:mainjs'],
                options: {
                    // use live reload that is build in with grunt watch and use default port
                    livereload: true
                }
            }
        }
    });


    // a task that creates the initial folder structure and copies some dependencies
    //grunt.registerTask('init', ['mkdir:build', 'copy:polymer', 'copy:polymer2', 'copy:livereload', 'copy:assets', 'copy:manifest', 'sass', 'copy:mainjs', 'copy:scripts', 'copy:appAssets']);
    grunt.registerTask('init', ['mkdir', 'copy', 'sass']);

    // a task that builds the overall app
    grunt.registerTask('build', ['init', 'polymer_clean', 'mows']);

    grunt.registerTask('serv', ['build','connect', 'watch']);

    // a that that builds, moves and cleans polymer
    grunt.registerTask('polymer_clean', ['vulcanize', 'copy:vulcanize', 'clean:build']);

    // a task that builds mows
    // todo(sandro-k) create build process
    grunt.registerTask('mows', []);


    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // load sass
    grunt.loadNpmTasks('grunt-contrib-sass');

    // watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    // local http server
    grunt.loadNpmTasks('grunt-contrib-connect');

    // vulcanize
    grunt.loadNpmTasks('grunt-vulcanize');

    // grunt copy we need to manually copy a couple of files to the build folder
    grunt.loadNpmTasks('grunt-contrib-copy');

    // we need to create some directories
    grunt.loadNpmTasks('grunt-mkdir');

    // we need to clean up after build
    grunt.loadNpmTasks('grunt-contrib-clean');


    // Default task(s).
    grunt.registerTask('default', ['build']);


};
