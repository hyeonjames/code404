var m = require('mongoose');
var crypto = require('crypto');
var error = require('../error.js');
var Schema = new m.Schema({
    name : { type : String , required : true , minlength : 2, maxlength:16 },
    password : { type: String, required : true },
    email : { type : String, required : true, match : /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i },
    lv : {type : String, required : true, min : 1},
    regist_dt : {type : Date,default : Date.now}
});
var Account = m.model('accounts',Schema );
function password(pw){
    
    var shasum = crypto.createHash('sha256');

    return shasum.update(pw).digest('hex');
}
function router(route){
    
    function needSession(req,res,next){
        if(req.session.account) {
            next();
        } else {
            res.send(error('a01'));
        }
    }
    function noSession(req,res,next){
        if(!req.session.account){
            next();
        } else {
            res.send(error('a02'));
        }
    }
    route.get('/', function (req, res) {
        var a = req.session.account;
        if(a){
            res.send({
                name : a.name,
                email : a.email,
                lv : a.lv
            });
        } else {
            res.send('0');
        }
    });
    route.post('/check',noSession, function (req, res) {
        Account.findOne({ email : req.body.email }, function (err, row) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (row == null) {
                res.send('1');
            } else {
                res.send('0');
            }
        });
    });
    route.post('/login', noSession, function (req, res) {
        Account.findOne({ email : req.body.email, password : password(req.body.password) }
          , function (err, row) {
            if (err) {
                console.error(err);
                throw err;
            }
            if (!row) {
                res.send(error('a04'));
            } else {
                req.session.account = row;
                req.session.save(function (){
                    
                    res.send({
                        name : row.name,
                        email : row.email,
                        lv : row.lv
                    });
                });
            }
        });
    });
   
    route.post('/join',noSession,function (req,res){
        console.log(req.body)
        new Account({
            name : req.body.name,
            email : req.body.email,
            password : password(req.body.password),
            lv : 1
        }).save(function (err,row){
            if(err){
                //res.send(error('a99'));
                console.error(err);
                throw err;
            } else {
                res.send('1');
            }
        });
    });
}

router.findById = function (id){
    return new Promise(function (resolve,reject){
        Account.findById(id,function (err,doc){
            if(err){
                console.error(err);
                reject(err);
            } else {
                resolve(doc);
            }
        }); 
    });
}
module.exports = router;