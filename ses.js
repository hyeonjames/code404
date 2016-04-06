module.exports = {
    account : function (req){
        return req.session.account || {
            lv : 0,
            name : 'Guest'
        }
    }
}