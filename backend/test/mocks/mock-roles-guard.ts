import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export default class MockRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.user.role === 'trainer';
    
  }
}
