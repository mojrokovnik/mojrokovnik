module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
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
            }
        },
        less: {
            development: {
                options: {
                    paths: 'app/styles',
                    yuicompress: true
                },
                files: {
                    'app/styles/style.css': ['app/**/*.less', '!app/scripts/bower_components/**/*.less']
                }
            }
        }
    });

    grunt.registerTask('default', [
        'copy:html',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin'
    ]);
};