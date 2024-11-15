import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    console.log('Dupa', accessToken);
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    console.log('Dupa2', accessToken);

    return next.handle(req).pipe(
      catchError((error) => {
        console.log('Dupa3', accessToken);
        if (error.status === 401 || error.status === 403) {
          const refreshToken = this.authService.getRefreshToken();
          if (refreshToken) {
            return this.authService.refresh(refreshToken).pipe(
              switchMap((tokens) => {
                this.authService.setTokens(tokens.accessToken, refreshToken);
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                  },
                });
                return next.handle(req);
              })
            );
          }
        }
        throw error;
      })
    );
  }
}
