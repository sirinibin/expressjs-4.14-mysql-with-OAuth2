const { check }  = require('express-validator/check');

var me={};


me.sendErrorResponse=function(errors,req,res) {

    var error_response={
        "status":0,
        "errors":{}
    };
    errors=errors.array();

    for(var i=0;i<errors.length;i++){
        error_response.errors[errors[i].param]=[errors[i].msg];
    }

    return  res.status(400).end(JSON.stringify(error_response,null, 3));
};



me.getInfo=function(req,res,user_id) {


    console.log("User id:"+user_id);
    connection.query('SELECT id,name,username,email,developer,created_at,updated_at from users where id=?', user_id, function (error, results, fields) {
        if (error) {
            return  res.end(JSON.stringify(error,null, 3));
        }
        let response={
            'status':1,
            'data':{}
        };

        response['data']=results[0];

        return res.end(JSON.stringify(response,null, 3));

    });




}
module.exports = me;
