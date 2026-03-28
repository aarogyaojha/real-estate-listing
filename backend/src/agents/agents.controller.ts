import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { AgentResponseDto } from './dto/agent-response.dto';
import { SearchListingsDto } from '../listings/dto/search-listings.dto';
import { CreateAgentDto } from './dto/create-agent.dto';

import { CreateListingDto } from '../listings/dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new agent (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Created agent',
    type: AgentResponseDto,
  })
  async create(@Body() data: CreateAgentDto) {
    return this.agentsService.create(data);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get overall listing stats per agent (Admin only)' })
  @ApiResponse({ status: 200, description: 'Stats array' })
  async getStats() {
    return this.agentsService.getAdminStats();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update agent profile' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated agent' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.agentsService.update(id, data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, type: [AgentResponseDto] })
  async findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID with their active listings' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Agent with paginated active listings',
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id') id: string, @Query() dto: SearchListingsDto) {
    return this.agentsService.findOne(id, dto);
  }
}
