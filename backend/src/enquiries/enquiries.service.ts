import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEnquiryDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: dto.listingId } });
    if (!listing) throw new NotFoundException('Listing not found');

    const agent = await this.prisma.agent.findUnique({ where: { id: dto.agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    const enquiry = await this.prisma.enquiry.create({
      data: dto,
    });

    console.log(`[Enquiry] New enquiry for agent ${dto.agentId}:`, enquiry);
    return enquiry;
  }
}
