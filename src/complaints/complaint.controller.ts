import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
} from '@nestjs/common';

import { ComplaintsService } from './complaints.service';

import { CreateCommentDto } from './dto/create-comment.dto';

import { CreateComplaintDto } from './dto/complaint.dto';
import { Complaint } from './schemas/complaint.schema';
// import { Types } from 'mongoose';

@Controller('complaints')
export class ComplaintsController {

    constructor(
        private readonly complaintsService: ComplaintsService,
    ) { }

    // POST /complaints
    @Post()
    async create(@Body() dto: CreateComplaintDto): Promise<Complaint> {
        return this.complaintsService.create(dto);
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

    @Get('stats')
    async getStats() {

        return await this.complaintsService
            .getComplaintStats();
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
    ) {
        return this.complaintsService.updateStatus(id, status);
    }

    @Post(':id/comment')
    addComment(
        @Param('id') id: string,
        @Body() body: CreateCommentDto,
    ) {
        return this.complaintsService.addComment(id, body);
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
}