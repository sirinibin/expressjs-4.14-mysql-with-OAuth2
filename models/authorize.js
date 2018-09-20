const { check }  = require('express-validator/check');
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcrypt');
var moment = require('moment');



var authorize={};
authorize.validate = [
    check('username').custom((value, { req }) => {
        return new Promise(function(resolve, reject){

            if(value.trim()){
                resolve(true);
            }else {
                reject(false);
            }
        });

}).withMessage('Username is required'),

check('password').custom((value, { req }) => {
    return new Promise(function(resolve, reject){

        if(value.trim()){
            resolve(true);
        }else {
            reject(false);
        }
    });

}).withMessage('Password is required'),


];

authorize.sendErrorResponse=function(errors,req,res) {

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

authorize.parseAttributes=function(req){

    //Mondatory fields
    var attributes={
        'username':req.body.username.trim(),
        'password':req.body.password.trim()
    };

    return attributes;
};

authorize.generateAuthToken=function(req,res,attributes) {


    var attributes=this.parseAttributes(req);


            connection.query('SELECT * from users where username=?', attributes['username'], function (error, results, fields) {
                if (error) {
                    return  res.end(JSON.stringify(error,null, 3));
                }
                if(results[0]==undefined){

                    let response={
                        'status':0,
                        'errors':{
                            'username':['Username or Password is Wrong']
                        }
                    };

                    //response['data']=results[0];

                    return res.end(JSON.stringify(response,null, 3));

                }


                bcrypt.compare(attributes['password'], results[0].password, function(err, compareResult) {
                    // res == true
                    if(compareResult){

                        /*
                        let response={
                            'status':1,
                            'data':{}
                        };

                        response['data']=results[0];
                        */

                        let code=uuidv4();
                        let now = moment();
                        let expires_at = now.add(3, 'minutes');

                       // expires_at=Date.parse(expires_at.format("YYYY-MM-DD hh:mm:ss"));
                        expires_at=expires_at.format("YYYY-MM-DD HH:mm:ss");

                        let auth_attributes={
                            'code':code,
                            'user_id':results[0].id,
                            'expires_at':expires_at
                        };

                    //expres_at=UNIX_TIMESTAMP((now() + INTERVAL 5 MINUTE))

                        connection.query('INSERT INTO authorization_codes SET created_at = now(),updated_at = now(), ?',auth_attributes, function (error, results, fields) {
                            if (error) {
                                return  res.end(JSON.stringify(error,null, 3));
                            }

                            let response={
                                'status':1,
                                'data':{
                                    'authorization_code':code,
                                    'expires_at':expires_at
                                }
                            };

                            return res.end(JSON.stringify(response,null, 3));


                        });




                    }else {

                        let response={
                            'status':0,
                            'errors':{
                                'username':['Username or Password is Wrong']
                            }
                        };

                        //response['data']=results[0];

                        return res.end(JSON.stringify(response,null, 3));
                    }
                });



            });




}
module.exports = authorize;
