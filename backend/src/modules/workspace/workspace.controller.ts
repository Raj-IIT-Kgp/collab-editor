import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  create(@CurrentUser() user: User, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(user.id, createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all workspaces for the current user' })
  findAll(@CurrentUser() user: User) {
    return this.workspaceService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.workspaceService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workspace' })
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceService.update(id, user.id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workspace' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.workspaceService.delete(id, user.id);
  }

  @Post(':workspaceId/members')
  @ApiOperation({ summary: 'Add member to workspace' })
  addMember(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.workspaceService.addMember(workspaceId, user.id, addMemberDto);
  }

  @Delete(':workspaceId/members/:userId')
  @ApiOperation({ summary: 'Remove member from workspace' })
  removeMember(
    @Param('workspaceId') workspaceId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: User,
  ) {
    return this.workspaceService.removeMember(workspaceId, user.id, targetUserId);
  }
}
