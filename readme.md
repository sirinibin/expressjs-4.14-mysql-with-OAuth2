[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

  Expressjs 4.15.5 + Mysql  RESTful API with OAuth2

This is a RESTful API with OAuth2 authentication/security developed using Expressjs 4.15.5.
You can use this if you want to quick start developing your own custom RESTful API by skipping 95% of your scratch works.
Hopefully this will save lot of your time as this API includes all the basic stuffs you need to get started.

This API also includes a developer dashboard with the API documentation which is developed in Angularjs 6.2. This will be useful to manage your developers access to the API documentation.

[DEMO](http://api.nodejs.nintriva.net)
-------------------
```
http://developers.nodejs.nintriva.net
Login: developer/developer
```


INSTALLATION
-------------------
```
Step1. cd /var/www
git clone -b master https://github.com/sirinibin/expressjs-4.14-mysql-with-OAuth2.git expressjs_api

Step2: Make a new file under config/db.js and edit Mysql Db details.

        db={};

        db.info={
            host     : 'localhost',
            user     : 'root',
            password : 'root',
            port     : 3306,
            database : 'expressjs_api'
        };
        module.exports = db;


Step3: Set up Db from the file expressjs_api.sql

Step4. Install App:
       cd expressjs_api
       npm install



Step5. Start app
       DEBUG=myapp1:* npm start


Step6: Configure the developer dashboard
       cd developers
       vim proxy.conf.json
        {
          "/v1/*": {
            "target": "<API_END_POINT>",
            "secure": false,
            "changeOrigin": true
          }
        }

Step7: Start Developer dashboard
       ng serve --port 4446  --proxy-config proxy.conf.json


```

## Security Vulnerabilities

If you discover a security vulnerability within this template, please send an e-mail to Sirin k at sirin@nintriva.com. All security vulnerabilities will be promptly addressed.

## License

The Expressjs 4.15.5 is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

