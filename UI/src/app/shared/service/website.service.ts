import { Injectable } from '@angular/core';
// import { Http ,Response,Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable, BehaviorSubject, Subject, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {environment} from '../../../environments/environment.prod';
import { 
	HttpClient,
	HttpHeaders, 
	// HttpEventType, 
	// HttpRequest, 
	// HttpErrorResponse, 
	// HttpEvent
} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

const api =  environment.endPoint

const httpOptions = {
  headers: new HttpHeaders({
    // 'Content-Type':  'application/json',
    'Accept': 'application/json',
    // 'X-Content-Type-Options': 'nosniff',
    // 'X-XSS-Protection': '1',
    // 'authorization': token
  })
};

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  navBarUpdate = new Subject();
  _loader1 = new Subject();
  constructor(
  	private http: HttpClient, 
  	private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
  ) { 
  }

  openSnackBar(message: string, action: string, time : number) {
    this._snackBar.open(message, action, {
      duration: time
    });
  }


  onLogout(){
    if(localStorage['isLoggedin']){    
      localStorage.removeItem('isLoggedin');
      this.router.navigate(['/login']);
    }
  }


  // Create new wallet
    __createNewWallet(body): Observable<any>{
        const url = api+"setup";
        return this.http.post<any>(url, body, httpOptions)
          .pipe(
          tap(heroes => this.log(`post   __createNewWallet Test`)),
          catchError(this.handleError('post_error   __createNewWallet Test', null))   
        );
    }
  // 

  // Create transaction
    __createTransact(id, body): Observable<any>{
        const url = api+"transact/"+id;
        return this.http.post<any>(url, body, httpOptions)
          .pipe(
          tap(heroes => this.log(`post   __createNewWallet Test`)),
          catchError(this.handleError('post_error   __createNewWallet Test', null))   
        );
    }
  // 

  // get wallet details
    _getWallet(id): Observable<any>{
        let url = api+"wallet/"+id;
        return this.http.get<any>(url, httpOptions)
          .pipe(
          tap(heroes => this.log(`get   myDashboard Test`)),
          catchError(this.handleError('get_error   myDashboard Test', null))   
        );
    }
  // 

  // get Transaction Count
    _getTransactionCount(id): Observable<any>{
        let url = api+"transactionsCount/"+id;
        return this.http.get<any>(url, httpOptions)
          .pipe(
          tap(heroes => this.log(`get   myDashboard Test`)),
          catchError(this.handleError('get_error   myDashboard Test', null))   
        );
    }
  // 

  // get Transaction Data with pagination
    _getTransaction(walletId, skip = 0,limit = 10): Observable<any>{
        let url = api+`transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`;
        return this.http.get<any>(url, httpOptions)
          .pipe(
          tap(heroes => this.log(`get   myDashboard Test`)),
          catchError(this.handleError('get_error   myDashboard Test', null))   
        );
    }
  // 
	////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       * Handle Http operation that failed.
       * Let the app continue.
       * @param operation - name of the operation that failed
       * @param result - optional value to return as the observable result
       */
      private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
     
          // TODO: send the error to remote logging infrastructure
          // console.error(error['error']['message']); // log to console instead
     
          // TODO: better job of transforming error for user consumption
          // this.log(`${operation} failed: ${error.message}`);
          this.openSnackBar(error['error']['message'],'',3000)
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
     
      /** Log a HeroService message with the MessageService */
      private log(message: string) {
        // this.messageService.add('HeroService: ' + message);
        // console.log(message)
      }

}
