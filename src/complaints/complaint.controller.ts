import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { ComplaintsService } from './complaints.service';

import { CreateComplaintDto } from './dto/complaint.dto';

@Controller('complaints')
export class ComplaintsController {

  constructor(
    private readonly complaintsService: ComplaintsService,
  ) {}

  // POST /complaints
  @Post()
  async create(
    @Body() createComplaintDto: CreateComplaintDto,
  ) {

    return await this.complaintsService.create(
      createComplaintDto,
    );
  }

  // GET /complaints/citizen/:citizenId
  @Get('citizen/:citizenId')
  async getByCitizen(
    @Param('citizenId') citizenId: string,
  ) {

    return await this.complaintsService.findByCitizen(
      citizenId,
    );
  }

  // GET /complaints
  // Employee Dashboard
  @Get()
  async getAll() {

    return await this.complaintsService.findAll();
  }

  // GET /complaints/public
  // Public Feed
  @Get('public')
  async getPublicComplaints() {

    return await this.complaintsService.getPublicComplaints();
  }

  // PATCH /complaints/:id/like
  @Patch(':id/like')
  async likeComplaint(
    @Param('id') id: string,
  ) {

    return await this.complaintsService.likeComplaint(
      id,
    );
  }

  // PATCH /complaints/:id/repost
  @Patch(':id/repost')
  async repostComplaint(
    @Param('id') id: string,
  ) {

    return await this.complaintsService.repostComplaint(
      id,
    );
  }

  // PATCH /complaints/:id/reply
  @Patch(':id/reply')
  async addReply(

    @Param('id') id: string,

    @Body('text') text: string,

    @Body('from') from: string,
  ) {

    return await this.complaintsService.addReply(
      id,
      text,
      from,
    );
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintsService.remove(id);
  }
}