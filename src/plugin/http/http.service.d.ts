import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';
export declare class HttpService {
    private http;
    passHeader: Headers;
    constructor(http: Http);
    getData(conf: any): Observable<Response>;
    postData(conf: any): Observable<Response>;
    private requestFn(method, conf);
}
