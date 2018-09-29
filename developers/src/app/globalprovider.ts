import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class GlobalProvider {
    isGuest=true;
    username='';
    title="Expressjs 4.15/Mysql RESTful API with OAuth2";
    api_endpoint="http://api.nodejs.nintriva.net";


    constructor(private cookieService: CookieService) {


    }
}
