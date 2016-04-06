var m = require('mongoose');
var Promise = require('bluebird');
var err = require('../error.js');
var AutoIncrement = require('mongoose-sequence');
var schema = new m.Schema({
    name : {type : String,required : true},
    lv  : {type : Number}
});
schema.plugin(AutoIncrement,{inc_field : 'board_id'});
var Board = m.model('boards',schema);
function router(route){
    route.get('/list',function (req,res){
        
        Board.find({});
    });
}

router.findByName = function (name){
    
    return new Promise(function (resolve,reject){
        Board.findOne({name : name},function (err,doc){
            if(err){
                reject(err);
            }
            else {
                resolve(doc);
            }
        });
    });
}
module.exports = router;