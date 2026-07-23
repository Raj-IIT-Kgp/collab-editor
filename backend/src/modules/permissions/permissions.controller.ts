import { Controller, Get, Put, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents/:documentId/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get permissions for a document' })
  getPermissions(@Param('documentId') documentId: string, @CurrentUser() user: User) {
    return this.permissionsService.getDocumentPermissions(documentId, user.id);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user permission for a document' })
  updatePermission(
    @Param('documentId') documentId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: User,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.updateDocumentPermission(documentId, user.id, targetUserId, updatePermissionDto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Remove user permission for a document' })
  removePermission(
    @Param('documentId') documentId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: User,
  ) {
    // using a DTO cast with null, though typically we'd just call delete direct in service
    return this.permissionsService.updateDocumentPermission(documentId, user.id, targetUserId, { role: null as any });
  }
}
