import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AgentReviewsService } from './agent-reviews.service';
import { CreateAgentReviewDto } from './dto/create-agent-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/interfaces/user.interface';

@ApiTags('Agent Reviews')
@Controller('agents/:agentId/reviews')
export class AgentReviewsController {
  constructor(private readonly reviewsService: AgentReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Leave a review for an agent' })
  @ApiResponse({ status: 201, description: 'Review submitted' })
  async create(
    @Param('agentId') agentId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateAgentReviewDto,
  ) {
    return this.reviewsService.create(agentId, user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for an agent' })
  async findByAgent(@Param('agentId') agentId: string) {
    return this.reviewsService.findByAgent(agentId);
  }
}
