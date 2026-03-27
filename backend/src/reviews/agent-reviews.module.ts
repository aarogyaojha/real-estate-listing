import { Module } from '@nestjs/common';
import { AgentReviewsController } from './agent-reviews.controller';
import { AgentReviewsService } from './agent-reviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AgentReviewsController],
  providers: [AgentReviewsService],
})
export class AgentReviewsModule {}
