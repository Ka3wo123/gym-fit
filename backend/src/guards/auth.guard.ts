import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _authService: AuthService) { }
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization } = request.headers;

      if(!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Provide token');
      }

      const authToken = authorization.replace(/bearer/gim, '').trim();
      const response = this._authService.validateToken(authToken);

      request.decodedData = response;
      return true;

    } catch (error) {
      console.log('auth error -> ' + error)
    }
  }
}
