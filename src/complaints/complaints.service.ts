import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import { Complaint } from './schemas/complaint.schema';

import { CreateComplaintDto } from './dto/complaint.dto';

@Injectable()
export class ComplaintsService {

  constructor(
    @InjectModel(Complaint.name)
    private complaintModel: Model<Complaint>,
  ) {}

  // =========================================
  // CREATE COMPLAINT
  // =========================================

  async create(
    createComplaintDto: CreateComplaintDto,
  ): Promise<Complaint> {

    const newComplaint =
      new this.complaintModel(
        createComplaintDto,
      );

    return await newComplaint.save();
  }

  // =========================================
  // GET CITIZEN COMPLAINTS
  // =========================================

  async findByCitizen(
    citizenId: string,
  ): Promise<Complaint[]> {

    return await this.complaintModel

      .find({
        citizenId:
          new Types.ObjectId(citizenId),
      })

      .sort({
        createdAt: -1,
      })

      .exec();
  }

  // =========================================
  // GET ALL COMPLAINTS
  // EMPLOYEE DASHBOARD
  // =========================================

  async findAll(): Promise<Complaint[]> {

    return await this.complaintModel

      .find()

      .populate(
        'citizenId',
        'name',
      )

      .sort({
        createdAt: -1,
      })

      .exec();
  }

  // =========================================
  // GET PUBLIC COMPLAINTS
  // PUBLIC FEED
  // =========================================

  async getPublicComplaints(): Promise<Complaint[]> {

    return await this.complaintModel

      .find({
        visibility: 'Public',
      })

      .populate(
        'citizenId',
        'name',
      )

      .sort({
        createdAt: -1,
      })

      .exec();
  }

  // =========================================
  // LIKE COMPLAINT
  // =========================================

  async likeComplaint(
    id: string,
  ): Promise<Complaint | null> {

    return await this.complaintModel.findByIdAndUpdate(

      id,

      {
        $inc: {
          likes: 1,
        },
      },

      {
        new: true,
      },
    );
  }

  // =========================================
  // REPOST COMPLAINT
  // =========================================

  async repostComplaint(
    id: string,
  ): Promise<Complaint | null> {

    return await this.complaintModel.findByIdAndUpdate(

      id,

      {
        $inc: {
          reposts: 1,
        },
      },

      {
        new: true,
      },
    );
  }

  // =========================================
  // ADD REPLY / COMMENT
  // =========================================

  async addReply(

    id: string,

    replyText: string,

    fromRole: string,
  ): Promise<Complaint | null> {

    const newReply = {

      from: fromRole,

      text: replyText,

      date: new Date(),
    };

    return await this.complaintModel.findByIdAndUpdate(

      id,

      {
        $push: {
          replies: newReply,
        },
      },

      {
        new: true,
      },
    );
  }

  // =========================================
  // UPDATE STATUS
  // =========================================

  async updateStatus(

    id: string,

    status: string,
  ): Promise<Complaint | null> {

    return await this.complaintModel.findByIdAndUpdate(

      id,

      {
        status,
      },

      {
        new: true,
      },
    );
  }
}