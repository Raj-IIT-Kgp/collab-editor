import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No roles restricted
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Assumes workspaceId is either in params or body
    const workspaceId = request.params.workspaceId || request.body.workspaceId || request.params.id;

    if (!user || !workspaceId) {
      return false;
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id, // Depends on how JwtAuthGuard formats user
        }
      }
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    if (!requiredRoles.includes(membership.role)) {
      throw new ForbiddenException(`Require one of roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
