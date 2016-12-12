module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        clean: {
            options: {force: true},
            structure: ['.tmp', 'dist'],
            templates: ['dist/assets/templates'],
            images: ['dist/assets/images'],
            production: ['production']
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {dest: 'dist'}
        },
        usemin: {
            html: ['dist/index.html']
        },
        copy: {
            html: {
                src: 'app/index.html',
                dest: 'dist/index.html'
            },
            fonts: {
                expand: true,
                src: 'app/styles/fonts/*',
                dest: 'dist/fonts/',
                flatten: true
            },
            fontAwesome: {
                expand: true,
                src: 'bower_components/font-awesome/fonts/*',
                dest: 'dist/fonts/',
                flatten: true
            },
            images: {
                expand: true,
                src: 'app/styles/images/*',
                dest: 'dist/assets/images/',
                flatten: true
            },
            production: {
                expand: true,
                cwd: 'dist',
                src: ['assets/**/*', 'fonts/*', 'index.html'],
                dest: 'production'
            }
        },
        less: {
            production: {
                options: {
                    paths: 'app/styles',
                    rootpath: '../assets',
                    compress: true,
                    cleancss: true
                },
                files: {
                    '.tmp/style.css': ['app/**/*.less']
                }
            }
        },
        concat: {
            options: {sourceMap: true}
        },
        cssmin: {
            generated: {
                options: {sourceMap: true}
            },
            production: {
                options: {sourceMap: false},
                files: {
                    'production/css/style.min.css': ['dist/css/style.min.css'],
                    'production/css/vendor.min.css': ['dist/css/vendor.min.css']
                }
            }
        },
        uglify: {
            generated: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: function (uglifySource) {
                        return uglifySource + '.map';
                    },
                    beautify: true,
                    mangle: false
                }
            },
            production: {
                options: {
                    sourceMap: false,
                    preserveComments: false,
                    compress: {drop_console: true},
                    mangle: false
                },
                files: {
                    'production/js/app.js': ['dist/js/app.js'],
                    'production/js/vendor.js': ['dist/js/vendor.js']
                }
            }
        },
        htmlmin: {
            templates: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                        expand: true,
                        flatten: true,
                        src: ['app/scripts/**/*.html'],
                        dest: 'dist/assets/templates/'
                    }]
            }
        },
        'http-server': {
            dev: {
                host: 'localhost',
                port: 8100,
                root: 'dist',
                runInBackground: true,
                openBrowser: true
            },
            server: {
                host: 'localhost',
                port: 8100,
                root: 'dist'
            }
        },
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            config: {
                files: ['Gruntfile.js'],
                tasks: ['build']
            },
            uglify: {
                files: ['app/scripts/**/*.js'],
                tasks: ['useminPrepare', 'concat', 'uglify:generated', 'usemin']
            },
            less: {
                files: ['app/**/*.less'],
                tasks: ['less', 'useminPrepare', 'concat', 'cssmin:generated']
            },
            html: {
                files: ['app/index.html'],
                tasks: ['build']
            },
            templates: {
                files: ['app/scripts/**/*.html'],
                tasks: ['clean:templates', 'htmlmin']
            },
            images: {
                files: ['app/styles/images/*'],
                tasks: ['clean:images', 'copy:images']
            }
        }
    });

    grunt.registerTask('build', [
        'clean:structure',
        'less',
        'copy',
        'useminPrepare',
        'concat',
        'uglify:generated',
        'cssmin:generated',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('production', [
        'clean:production',
        'build',
        'copy:production',
        'uglify:production',
        'cssmin:production'
    ]);

    grunt.registerTask('develop', [
        'build',
        'http-server:dev',
        'watch'
    ]);

    grunt.registerTask('server', [
        'build',
        'http-server:server'
    ]);
};