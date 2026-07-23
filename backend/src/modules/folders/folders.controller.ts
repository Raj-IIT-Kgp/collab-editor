import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  create(@CurrentUser() user: User, @Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(user.id, createFolderDto);
  }

  @Get('workspace/:workspaceId')
  @ApiOperation({ summary: 'Get all folders in a workspace' })
  findAllInWorkspace(@Param('workspaceId') workspaceId: string, @CurrentUser() user: User) {
    return this.foldersService.findAllInWorkspace(workspaceId, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.foldersService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update/Move folder' })
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() updateFolderDto: UpdateFolderDto) {
    return this.foldersService.update(id, user.id, updateFolderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete folder' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.foldersService.remove(id, user.id);
  }
}
