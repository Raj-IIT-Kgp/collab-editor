import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents/:documentId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment to a document' })
  createComment(
    @Param('documentId') documentId: string,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(documentId, user.id, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a document' })
  getComments(
    @Param('documentId') documentId: string,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.getComments(documentId, user.id);
  }

  @Put(':commentId/resolve')
  @ApiOperation({ summary: 'Resolve a comment' })
  resolveComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.resolveComment(commentId, user.id);
  }

  @Post(':commentId/replies')
  @ApiOperation({ summary: 'Add a reply to a comment' })
  createReply(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.commentsService.createReply(commentId, user.id, createReplyDto);
  }
}
