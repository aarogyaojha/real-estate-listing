import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@ApiTags('Enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an enquiry about a listing' })
  @ApiResponse({ status: 201, description: 'Enquiry submitted' })
  async create(@Body() dto: CreateEnquiryDto) {
    return this.enquiriesService.create(dto);
  }
}
