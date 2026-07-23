import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('workspace/:workspaceId/documents')
  @ApiOperation({ summary: 'Search documents by title' })
  @ApiQuery({ name: 'q', required: true })
  searchDocuments(
    @Param('workspaceId') workspaceId: string,
    @Query('q') query: string,
    @CurrentUser() user: User,
  ) {
    return this.searchService.searchDocuments(workspaceId, user.id, query);
  }

  @Get('workspace/:workspaceId/recent')
  @ApiOperation({ summary: 'Get recently updated documents' })
  getRecentDocuments(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: User,
  ) {
    return this.searchService.getRecentDocuments(workspaceId, user.id);
  }
}
