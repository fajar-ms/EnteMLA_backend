import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Complaint extends Document {

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

  @Prop({
    default: 'Public',
  })
  visibility: string;

  @Prop({
    default: 'Pending',
  })
  status: string;

  // User who created complaint
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  citizenId: Types.ObjectId;

  // Complaint image
  @Prop()
  evidence?: string;

  // Optional location
  @Prop()
  location?: string;

  // 👍 Likes count
  @Prop({
    default: 0,
  })
  likes: number;

  // 🔁 Reposts count
  @Prop({
    default: 0,
  })
  reposts: number;

  // 👀 Views count
  @Prop({
    default: 0,
  })
  views: number;

  // 💬 Replies / Comments
  @Prop({
    type: [
      {
        from: String,

        text: String,

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    default: [],
  })
  replies: {
    from: string;
    text: string;
    date: Date;
  }[];
}

export const ComplaintSchema =
  SchemaFactory.createForClass(Complaint);