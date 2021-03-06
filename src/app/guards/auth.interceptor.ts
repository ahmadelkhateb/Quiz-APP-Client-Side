import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { UserService } from '../user/user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private userService: UserService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (req.headers.get('noauth') == "true") {
            return next.handle(req.clone());
        }    
        else {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + this.userService.getToken())
            });console.log(req.headers)
            return next.handle(clonedreq).pipe(
                tap (
                    event => { },
                    err => {
                        console.log(err)
                        if(err.status == 422) {
                            this.userService.deleteToken();
                            this.router.navigate(['/user']);
                        }
                        //this.router.navigateByUrl('/user');
                    })
            );
        }
    }
}