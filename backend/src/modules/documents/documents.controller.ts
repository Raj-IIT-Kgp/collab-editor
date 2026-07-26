import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  create(@CurrentUser() user: User, @Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(user.id, createDocumentDto);
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Get all active documents in a workspace' })
  findAllInWorkspace(@Param('workspaceId') workspaceId: string, @CurrentUser() user: User) {
    return this.documentsService.findAllInWorkspace(workspaceId, user.id);
  }

  @Get('workspace/:workspaceId/trash')
  @ApiOperation({ summary: 'Get all trashed documents in a workspace' })
  findTrashInWorkspace(@Param('workspaceId') workspaceId: string, @CurrentUser() user: User) {
    return this.documentsService.findTrashInWorkspace(workspaceId, user.id);
  }

  @Get('workspace/:workspaceId/starred')
  @ApiOperation({ summary: 'Get all starred documents in a workspace' })
  findStarredInWorkspace(@Param('workspaceId') workspaceId: string, @CurrentUser() user: User) {
    return this.documentsService.findStarredInWorkspace(workspaceId, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.documentsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document (rename, move, archive)' })
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, user.id, updateDocumentDto);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a document' })
  duplicate(@Param('id') id: string, @CurrentUser() user: User) {
    return this.documentsService.duplicate(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently delete document' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.documentsService.remove(id, user.id);
  }
}
