const { check }  = require('express-validator/check');
var bcrypt=require('bcrypt');

var employees={};
employees.validate = [
    check('email').isEmail().withMessage('Must be a Valid E-mail'),

    check('name').custom((value, { req }) => {
        return new Promise(function(resolve, reject){

            if(value.trim()){
                resolve(true);
            }else {
                reject(false);
            }
        });

}).withMessage('Name is required'),

check('email').custom((value, { req }) => {
    return new Promise(function(resolve, reject){

        if(value.trim()){
            resolve(true);
        }else {
            reject(false);
        }
    });

}).withMessage('E-mail is required'),



check('email').custom((value, { req }) => {


    return new Promise(function(resolve, reject){

        let query='SELECT email FROM employees WHERE email = ?';

        params=[req.body.email];

        if(req.params.id){
            query='SELECT email FROM employees WHERE email = ? AND id!=?';
            params=[req.body.email,req.params.id];

        }


        connection.query(query
            , params, function(error, results, fields) {

                if (error) {
                    console.log("ERRORS:");
                    console.log(error);
                    //reject(false);
                    throw error;
                    //return  res.end(JSON.stringify(error,null, 3));
                }


                if (results.length > 0&&value==results[0].email) {
                    // console.log(results[0].email);
                    reject(false);

                }else {
                    resolve(true);
                }

            }
        );

    });

}).withMessage('E-mail already in use'),


];

employees.sendErrorResponse=function(errors,req,res) {

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

employees.parseAttributes=function(req){

    //Mondatory fields
    var attributes={
        'name':req.body.name.trim(),
        'email':req.body.email.trim(),
    };

    return attributes;
};

employees.create=function(req,res) {


    //Perform Insertion
    params=employees.parseAttributes(req);
    query='INSERT INTO employees SET created_at = now(),updated_at = now(), ?';


    connection.query(query,params, function (error, results, fields) {
        if (error) {
            return  res.end(JSON.stringify(error,null, 3));
        }
        console.log(results);

        connection.query('SELECT * from employees where id=?',results.insertId, function (error, results, fields) {
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

    });


}

employees.update=function(req,res) {

    if(req.params.id){

        query1='SELECT id FROM employees WHERE id=?';
        params1=[req.params.id];

        connection.query(query1,params1, function (error, results, fields) {
            if (error) {
                return  res.end(JSON.stringify(error,null, 3));
            }
            console.log(results);

            console.log(query1);


            if (results.length==0) {

                let response={
                    'status':0,
                    'errors':{
                        'id':['Invalid Record']
                    }
                };


                return res.end(JSON.stringify(response,null, 3));
            }



            //Perform Insertion/Updation
            params2=employees.parseAttributes(req);

                query2='UPDATE employees SET updated_at = now(), name=?,email=? WHERE id=?';
                params2=[params2.name,params2.email,req.params.id];



            connection.query(query2,params2, function (error, results, fields) {
                if (error) {
                    return  res.end(JSON.stringify(error,null, 3));
                }
                console.log(results);


                connection.query('SELECT * from employees where id=?',req.params.id, function (error, results, fields) {
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

            });


        });
    }







}

employees.delete=function(req,res) {


        query='SELECT id FROM employees WHERE id=?';
        params=[req.params.id];

       connection.query(query,params, function (error, results, fields) {
        if (error) {
            return  res.end(JSON.stringify(error,null, 3));
        }
        console.log(results);


           if (results.length ==0) {

               let response={
                   'status':0,
                   'errors':{
                       'id':['Invalid Record']
                   }
               };


               return res.end(JSON.stringify(response,null, 3));
           }


           //Perform Deletion

           query='DELETE FROM employees WHERE id=?';
           params=[req.params.id];

           connection.query(query,params, function (error, results, fields) {
               if (error) {
                   return  res.end(JSON.stringify(error,null, 3));
               }
               console.log(results);

               let response={
                   'status':1,
                   'message':'Deleted Successfully',
                   'data':{
                       'id':req.params.id
                   }
               };


               return res.end(JSON.stringify(response,null, 3));

           });

       });









}
employees.find=function(req,res,id) {

    if(req.params.id){

        query1='SELECT id FROM employees WHERE id=?';
        params1=[id];

        connection.query(query1,params1, function (error, results, fields) {
            if (error) {
                return  res.end(JSON.stringify(error,null, 3));
            }
            console.log(results);

            console.log(query1);


            if (results.length==0) {

                let response={
                    'status':0,
                    'errors':{
                        'id':['Invalid Record']
                    }
                };


                return res.end(JSON.stringify(response,null, 3));
            }


                connection.query('SELECT * from employees where id=?',id, function (error, results, fields) {
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

            });

    }

}
employees.findAll=function(req,res) {

    let offset=0;
    let limit=2;
    let page=1;
    let search_condition='';

    params=[];

    if(req.query.limit){
        limit=parseInt(req.query.limit);
    }
    console.log("Page:"+req.query.page);
    if(req.query.page){
        page=parseInt(req.query.page);
        offset = (page - 1) * limit;
    }
    params.push(offset);
    params.push(limit);

    search_params={};
    if(req.query.search){
        search_params=req.query.search;
        search_params_count=0;
        search_condition='WHERE';

        if(req.query.search.name){
            search_condition+=' name like "'+req.query.search.name+'%" ';
            search_params_count++;
        }

        if(req.query.search.email){
            if( search_params_count>0) {
                search_condition+=' AND';
            }
            search_condition+=' email like "'+req.query.search.email+'%" ';
            search_params_count++;
        }

        if( search_params_count==0){
            search_condition='';
        }

    }
    sort_string="";
    if(req.query.sort){
        sort_string=req.query.sort;
        if(req.query.sort){
            sort_string=' ORDER BY '+req.query.sort+' ';
        }


    }


    connection.query('SELECT * from employees '+search_condition+'  '+sort_string+' limit ?,?',params, function (error, results1, fields) {
        if (error) {
            return  res.end(JSON.stringify(error,null, 3));
        }
        console.log(results1);


        connection.query('SELECT count(*) from employees',[], function (error, results2, fields) {
            if (error) {
                return  res.end(JSON.stringify(error,null, 3));
            }

            let response={
                'status':1,
                'data':{},
                'page':page,
                'size':limit,
                'totalCount':results2[0]['count(*)'],
                'search_params':search_params,
                'sort_by':sort_string
            };

            response['data']=results1;

            return res.end(JSON.stringify(response,null, 3));

        });




    });


}

module.exports = employees;
