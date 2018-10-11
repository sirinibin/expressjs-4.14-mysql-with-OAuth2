const { check }  = require('express-validator/check');
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcrypt');
var moment = require('moment');

var time = require('time')(Date);


var accesstoken={};
accesstoken.validate = [
    check('authorization_code').custom((value, { req }) => {
        return new Promise(function(resolve, reject){

            if(value.trim()){
                resolve(true);
            }else {
                reject(false);
            }
        });

}).withMessage('Authorization Code is required'),



];

accesstoken.sendErrorResponse=function(errors,req,res) {

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

accesstoken.parseAttributes=function(req){

    //Mondatory fields
    var attributes={
        'authorization_code':req.body.authorization_code.trim(),
    };
    return attributes;
};

accesstoken.generateAccessToken=function(req,res,attributes) {
    //var d = new Date();
    //d.setTimezone('Asia/Calcutta');


    console.log("cool2");
    var attributes=this.parseAttributes(req);

    console.log("cool3");
    attributes={
        'code':attributes['authorization_code']
    };


    console.log("AC:");
    console.log(attributes);
    connection.query('SELECT * from authorization_codes where ? AND expires_at>NOW()', attributes, function (error, results, fields) {
        if (error) {
            return  res.end(JSON.stringify(error,null, 3));
        }
        console.log(results);
        if(results[0]==undefined){

            let response={
                'status':0,
                'errors':{
                    'authorization_code':['Invalid Authorization Code']
                }
            };

            //response['data']=results[0];

            return res.status(400).end(JSON.stringify(response,null, 3));


        }
         console.log(results[0]);

                let token=uuidv4();
                let now = moment();
                let expires_at = now.add((60*24*60), 'minutes'); // 60 days

               //expires_at=Date.parse(expires_at.format("YYYY-MM-DD hh:mm:ss"));
                 expires_at=expires_at.format("YYYY-MM-DD HH:mm:s");

                let token_attributes={
                    'token':token,
                    'user_id':results[0].user_id,
                    'auth_code':results[0].code,
                    'expires_at':expires_at
                };

                //expres_at=UNIX_TIMESTAMP((now() + INTERVAL 5 MINUTE))

                connection.query('INSERT INTO access_tokens SET created_at = now(),updated_at = now(), ?',token_attributes, function (error, results, fields) {
                    if (error) {
                        return  res.end(JSON.stringify(error,null, 3));
                    }

                    let response={
                        'status':1,
                        'data':{
                            'access_token':token,
                            'expires_at':expires_at
                        }
                    };

                    return res.end(JSON.stringify(response,null, 3));


                });

        });








}
accesstoken.delete=function(req,res) {

    console.log("Inside Delete function");

    if(req.query.access_token){

        //Perform Deletion

        query='DELETE FROM access_tokens WHERE token=?';
        params=[req.query.access_token];

        connection.query(query,params, function (error, results, fields) {
            if (error) {
                return  res.end(JSON.stringify(error,null, 3));
            }
            console.log(results);

            let response={
                'status':1,
                'message':'Deleted Successfully',
                'data':{
                    'token':req.query.access_token
                }
            };

            return res.end(JSON.stringify(response,null, 3));
        });
    
    }

}
module.exports = accesstoken;
