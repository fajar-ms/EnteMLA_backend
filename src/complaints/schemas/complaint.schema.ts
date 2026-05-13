import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ComplaintDocument = HydratedDocument<Complaint>;

@Schema({ timestamps: true })
export class Complaint {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({
    required: true,
    enum: ['Normal', 'Medium', 'Urgent'],
    default: 'Normal',
  })
  urgency: string;

  @Prop({ required: true })
  details: string;

  @Prop({ default: 'Public' })
  visibility: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  citizenId: Types.ObjectId;

  @Prop()
  evidence?: string;

  @Prop()
  location?: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  reposts: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: "" })
  comment: string;

  @Prop({
    type: [
      {
        userId: {
          type: Types.ObjectId,
          ref: 'User',
          required: true,
        },

        text: {
          type: String,
          required: true,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  })
  replies: {
    userId: Types.ObjectId;
    text: string;
    date: Date;
  }[];
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);