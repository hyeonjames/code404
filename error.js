

var codes = {
	'a01': '로그인이 필요합니다.',
	'a02' : '이미 로그인 되어 있습니다.',
	a03 : '이미 가입된 이메일입니다.',
	a04 : '아이디와 패스워드를 확인해주십시오.',
    auth0 : '권한이 없습니다.'
}
module.exports = function (code,message){
    return {
        error : true,
        code :code,
        message : message || codes[code]
    }
}