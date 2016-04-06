var m = require('mongoose');
var error = require('../error.js');
var crypto = require('crypto');
var board = require('./board.js');
var Account = require('./account.js');
var AutoIncrement = require('mongoose-sequence');
var schema = new m.Schema({
    board_id: { type: m.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true, minlength: 2 },
    body: { type: String, required: true },
    user_id: { type: m.Schema.Types.ObjectId },
    user_nm: { type: String, required: true },
    regist_dt: { type: Date, default: Date.now }
});
schema.plugin(AutoIncrement, { inc_field: 'article_id' });

function password(pw) {

    var shasum = crypto.createHash('sha256');

    return shasum.update(pw).digest('hex');
}

var Article = m.model('articles', schema);

function findByArticleId(id) {
    return new Promise(function(resolve, reject) {
        Article.findOne({ article_id: id }).select('article_id title user_nm body regist_dt').exec(function(err, doc) {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    });
}
function router(route) {
    route.get('/list/:board/:count/:page', function(req, res) {
        var count = Number(req.params.count);
        var page = Number(req.params.page);
        if (isNaN(count) || isNaN(page) || page < 1) {

            return;
        }
        board.findByName(req.params.board)
            .then(function(doc) {
                Article
                    .find({ board_id: doc._id })
                    .sort({ regist_dt: 1 })
                    .skip((page - 1) * count)
                    .limit(count)
                    .select('article_id title user_nm regist_dt')
                    .exec(function(err, docs) {
                        if (err) {
                            console.error(err);
                            throw err;
                        } else {
                            res.send(docs);
                        }
                    });
            });
    });
    route.get('/:article_id', function(req, res) {
        findByArticleId(req.params.article_id)
            .then(function(doc) {
                res.send(doc);
            });
    });
    route.post('/w/:board', function(req, res) {
        var account = (req.session.account) || { lv: 0, name: 'Guest' };

        board.findByName(req.params.board)
            .then(function(doc) {
                if (doc.lv > account.lv) {
                    res.send(error('auth0'));
                } else {
                    new Article({
                        board_id: doc._id,
                        title: req.body.title,
                        body: req.body.body,
                        user_id: account._id,
                        user_nm: account.name,
                        article_pw: req.body.pw
                    }).save(function(err) {
                        console.log(err);
                        res.send(err ? '0' : '1');
                    });
                }
            });
    });
}

router.findByArticleId = findByArticleId;
module.exports = router;