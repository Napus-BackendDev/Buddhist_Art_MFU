import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/types/types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { JwtPayload } from 'src/common/interface/auth-interface';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const hasRequiredRole = requiredRoles.some(
      (role) => request.user.role === role,
    );
    return hasRequiredRole;
  }
}
