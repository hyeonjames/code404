var fs = require('fs');
module.exports = function (grunt){
    var setting = JSON.parse(fs.readFileSync('./setting.json'));
    var config = {
        pkg : grunt.file.readJSON('package.json'),
        concat : {
            css : {
                files : [{
                    src : setting.source.css,
                    dest : setting.build.css
                }]
            },
            lib : {
                files : [{
                    src : setting.source.lib,
                    dest : setting.build.lib
                }]
            }
        },
        browserify : {
            babel : {
                files : {
           
                },
                options : {
                    transform : [['babelify',{
                        presets : ["es2015"]
                    }]],
                    browserifyOptions : {
                        debug : true
                    }
                }
            }
        },
        watch : {
            css : {
                files : setting.source.css,
                tasks : ['concat:css']
            },
            lib : {
                files : setting.source.lib,
                tasks : ['concat:lib']
            },
            babel : {
                files : setting.source.babel,
                tasks : ['browserify:babel']
            }
        }
    }
    config.browserify.babel.files[setting.build.babel] = setting.source.babel;
    grunt.initConfig(config);
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['concat','browserify']);
    
}