import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { ListingsService } from '../listings/listings.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, ListingsService], // Providing ListingsService here for sharing sanitation/where building
})
export class AgentsModule {}
