module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        clean: {
            options: {force: true},
            structure: ['.tmp', 'dist']
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
                beautify: true,
                sourceMap: true,
                compress: {drop_console: true}
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'less',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin'
    ]);
};