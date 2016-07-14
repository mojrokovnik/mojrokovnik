module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.config.init({
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: ['dist/index.html']
        },
        copy: {
            html: {
                src: 'app/index.html', dest: 'dist/index.html'
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