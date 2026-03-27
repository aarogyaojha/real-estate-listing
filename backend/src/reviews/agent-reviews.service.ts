import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentReviewDto } from './dto/create-agent-review.dto';

@Injectable()
export class AgentReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(agentId: string, userId: string, dto: CreateAgentReviewDto) {
    const existing = await this.prisma.agentReview.findUnique({
      where: { agentId_userId: { agentId, userId } },
    });
    if (existing) throw new ConflictException('You have already reviewed this agent');

    return this.prisma.agentReview.create({
      data: {
        agentId,
        userId,
        ...dto,
      },
    });
  }

  async findByAgent(agentId: string) {
    return this.prisma.agentReview.findMany({
      where: { agentId },
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
