module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        clean: {
            options: {force: true},
            structure: ['.tmp', 'dist'],
            templates: ['dist/assets/templates'],
            images: ['dist/assets/images']
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
                dest: 'dist/assets/fonts/',
                flatten: true
            },
            images: {
                expand: true,
                src: 'app/styles/images/*',
                dest: 'dist/assets/images/',
                flatten: true
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
            options: {sourceMap: true}
        },
        uglify: {
            options: {
                sourceMap: true,
                beautify: true,
                compress: {
                    drop_console: false
                },
                mangle: false
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
            }
        },
        watch: {
            config: {
                files: ['Gruntfile.js'],
                tasks: ['build'],
                options: {spawn: false}
            },
            uglify: {
                files: ['app/scripts/**/*.js'],
                tasks: ['useminPrepare', 'concat', 'uglify:generated', 'usemin'],
                options: {spawn: false}
            },
            less: {
                files: ['app/**/*.less'],
                tasks: ['less', 'useminPrepare', 'concat', 'cssmin:generated'],
                options: {spawn: false}
            },
            html: {
                files: ['app/index.html'],
                tasks: ['build'],
                options: {spawn: false}
            },
            templates: {
                files: ['app/scripts/**/*.html'],
                tasks: ['clean:templates', 'htmlmin'],
                options: {spawn: false}
            },
            images: {
                files: ['app/styles/images/*'],
                tasks: ['clean:images', 'copy:images'],
                options: {spawn: false}
            }
        }
    });

    grunt.registerTask('build', [
        'clean:structure',
        'less',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('develop', [
        'build',
        'http-server',
        'watch'
    ]);

    grunt.registerTask('server', [
        'build',
        'http-server'
    ]);
};