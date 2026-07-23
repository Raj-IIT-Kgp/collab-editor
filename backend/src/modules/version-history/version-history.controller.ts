import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { VersionHistoryService } from './version-history.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Version History')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents/:documentId/versions')
export class VersionHistoryController {
  constructor(private readonly versionHistoryService: VersionHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all versions of a document' })
  getVersions(
    @Param('documentId') documentId: string,
    @CurrentUser() user: User,
  ) {
    return this.versionHistoryService.getVersions(documentId, user.id);
  }

  @Get(':versionId')
  @ApiOperation({ summary: 'Get a specific document version snapshot' })
  getVersionSnapshot(
    @Param('versionId') versionId: string,
    @CurrentUser() user: User,
  ) {
    return this.versionHistoryService.getVersionSnapshot(versionId, user.id);
  }

  @Post(':versionId/restore')
  @ApiOperation({ summary: 'Restore document to a specific version' })
  restoreVersion(
    @Param('documentId') documentId: string,
    @Param('versionId') versionId: string,
    @CurrentUser() user: User,
  ) {
    return this.versionHistoryService.restoreVersion(documentId, versionId, user.id);
  }
}
