const { check }  = require('express-validator/check');

var oauth2={};

oauth2.user_id="";

oauth2.validate = [

    check('access_token').custom((value, { req,res }) => {
        return new Promise(function(resolve, reject){

            if(value.trim()){
                resolve(true);
            }else {
                reject(false);
            }
        });

}).withMessage('Access token is required'),

check('access_token').custom((value, { req,res }) => {

    if(!value){
       return true;
     }
   console.log("AT:"+value);


    return new Promise(function(resolve, reject){

        connection.query('SELECT token,user_id FROM access_tokens WHERE token = ? AND expires_at>NOW()'
            ,value, function(error, results, fields) {

                if (error) {
                    console.log("ERRORS:");
                    console.log(error);
                    //reject(false);
                    throw error;
                    //return  res.end(JSON.stringify(error,null, 3));
                }
                console.log("RESULTS:");
                console.log(results);
                if (results.length > 0&&value==results[0].token) {
                    // console.log(results[0].email);
                    oauth2.user_id=results[0].user_id;
                    resolve(true);

                }else {
                    reject(false);
                }


            }
        );

    });

}).withMessage('Invalid Access token'),


];

module.exports = oauth2;
