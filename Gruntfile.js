module.exports = function(grunt) {
   // Project configuration.
   grunt.initConfig({
       pkg: grunt.file.readJSON('package.json'),
       watch: {
         scripts: {
           files: ['client/*.js', 'client/*.scss'],
           tasks: ['uglify', 'sass'],
           options: {
             spawn: false,
           },
         },
       },
       sass: {
         dist: {
           options: {
             style: 'compressed'
           },
           files: {
             'server/public/assets/css/style.min.css': 'client/style.scss'
           }
         }
       },
       uglify: {
           options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
           },
           build: {
               src: ['client/client.js', 'client/controllers.js', 'client/router.js', 'client/factories.js',],
               dest: 'server/public/assets/js/client.min.js'
           }
       },
       copy: {
           main: {
               expand: true,
               cwd: "node_modules/",
               src: [
                   "angular/angular.min.js",
                   "angular/angular.min.js.map",
                   "angular/angular-csp.css",
                   "angular-route/angular-route.min.js",
                   "angular-route/angular-route.min.js.map",
                   "angular-ui-router/release/angular-ui-router.min.js",
                   "angular-loading-bar/build/loading-bar.min.js",
                   "angular-loading-bar/build/loading-bar.min.css",
                   "angular-chart.js/dist/angular-chart.min.js",
                   "angular-chart.js/dist/angular-chart.min.js.map",
                   "jquery/dist/jquery.min.js",
                   "jquery/dist/jquery.min.map",
                   "bootstrap/dist/js/bootstrap.min.js",
                   "bootstrap/dist/css/bootstrap.min.css",
                   "bootstrap/dist/css/bootstrap.min.css.map",
                   "bootstrap/dist/css/bootstrap-theme.min.css",
                   "bootstrap/dist/css/bootstrap-theme.min.map",
                   "moment/min/moment.min.js",
                   "chart.js/dist/Chart.min.js"
               ],
               "dest": "server/public/vendor/"
           }
       }
   });

   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-sass');

   // Default task(s).
   grunt.registerTask('default', ['copy', 'uglify', 'sass', 'watch']);

};
