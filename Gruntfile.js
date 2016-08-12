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
            },
            templates: {
                expand: true,
                src: 'app/scripts/**/*.html',
                dest: 'dist/assets/templates/',
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
                beautify: true,
                sourceMap: true,
                compress: {
                    drop_console: true
                }
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
                tasks: ['less', 'cssmin'],
                options: {spawn: false}
            },
            templates: {
                files: ['app/**/*.html'],
                tasks: ['clean:templates', 'copy:templates'],
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
        'watch'
    ]);
};