import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { AgentsModule } from './agents/agents.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { AgentReviewsModule } from './reviews/agent-reviews.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    ListingsModule, 
    AgentsModule, 
    EnquiriesModule, 
    AgentReviewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
