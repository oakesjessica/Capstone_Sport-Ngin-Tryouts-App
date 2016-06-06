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
                   "angular-chart.js/dist/angular-chart.min.js",
                   "angular-chart.js/dist/angular-chart.min.js.map",
                   "angular-loading-bar/build/loading-bar.min.js",
                   "angular-loading-bar/build/loading-bar.min.css",
                   "angular-route/angular-route.min.js",
                   "angular-route/angular-route.min.js.map",
                   "angular-ui-router/release/angular-ui-router.min.js",
                   "angular-ui-bootstrap/dist/ui-bootstrap.js",
                   "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
                   "bootstrap/dist/js/bootstrap.min.js",
                   "bootstrap/dist/css/bootstrap.min.css",
                   "bootstrap/dist/css/bootstrap.min.css.map",
                   "bootstrap/dist/css/bootstrap-theme.min.css",
                   "bootstrap/dist/css/bootstrap-theme.min.map",
                   "chart.js/dist/Chart.min.js",
                   "jquery/dist/jquery.min.js",
                   "jquery/dist/jquery.min.map",
                   "mobile-angular-ui/dist/js/mobile-angular-ui.min.js",
                   "mobile-angular-ui/dist/js/mobile-angular-ui.min.js.map",
                   "mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js",
                   "mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js.map",
                   "mobile-angular-ui/dist/js/mobile-angular-ui.core.min.js",
                   "mobile-angular-ui/dist/js/mobile-angular-ui.core.min.js.map",
                   "mobile-angular-ui/dist/css/mobile-angular-ui-desktop.min.css",
                   "mobile-angular-ui/dist/css/mobile-angular-ui-desktop.min.css.map",
                   "mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css",
                   "mobile-angular-ui/dist/css/mobile-angular-ui-hover.min.css",
                   "mobile-angular-ui/dist/fonts/fontawesome-webfont.eot",
                   "mobile-angular-ui/dist/fonts/fontawesome-webfont.svg",
                   "mobile-angular-ui/dist/fonts/fontawesome-webfont.ttf",
                   "mobile-angular-ui/dist/fonts/fontawesome-webfont.woff",
                   "mobile-angular-ui/dist/fonts/fontawesome-webfont.woff2",
                   "moment/min/moment.min.js",
                   "ng-pickadate/ng-pickadate.js",
                   "pickadate/lib/compressed/legacy.js",
                   "pickadate/lib/compressed/picker.js",
                   "pickadate/lib/compressed/picker.date.js",
                   "pickadate/lib/compressed/picker.time.js",
                   "pickadate/lib/compressed/themes/default.css",
                   "pickadate/lib/compressed/themes/default.date.css",
                   "pickadate/lib/compressed/themes/default.time.css",
                   "pickadate/lib/compressed/themes/classic.css",
                   "pickadate/lib/compressed/themes/classic.date.css",
                   "pickadate/lib/compressed/themes/classic.time.css",
                   "font-awesome/css/font-awesome.min.css",
                   "font-awesome/fonts/*"
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
