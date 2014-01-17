module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'www/js/output.min.js': ['js/vendor/mustache.js', 'js/main.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

};