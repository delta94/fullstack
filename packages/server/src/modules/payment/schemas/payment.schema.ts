import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/user/schemas/user.schema';
import {
  PaymentStatus,
  PaymentType,
  Schema$Payment,
  Schema$PaymentDetails
} from '@/typings';
import { BookPaymentSchema } from './payment-book.schema';
import { ChapterPaymentSchema } from './payment-chapter.schema';
import { Exclude, Transform } from 'class-transformer';

@Schema({ discriminatorKey: 'type' })
export class PaymentDetails {
  @Prop({
    type: Number,
    required: true,
    enum: Object.values(PaymentType).filter(v => typeof v === 'number')
  })
  type: PaymentType;
}

export const PaymentDetailsSchema = SchemaFactory.createForClass(
  PaymentDetails
);

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new Payment(raw)
  }
})
export class Payment implements Schema$Payment {
  id: string;

  @Prop({ type: Number, required: true, min: 1 })
  price: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true
  })
  @Exclude()
  user: string;

  @Prop({ type: PaymentDetailsSchema, required: true })
  details: Schema$PaymentDetails;

  @Prop({
    type: Number,
    default: PaymentStatus.Pending,
    enum: Object.values(PaymentStatus).filter(s => typeof s === 'number')
  })
  status: PaymentStatus;

  @Transform(Number)
  createdAt: string;

  @Transform(Number)
  updatedAt: string;

  constructor(payload: Partial<Payment>) {
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): Payment {
    return new Payment(this);
  }
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.path('details').discriminator(
  (PaymentType.Book as unknown) as string,
  BookPaymentSchema
);

PaymentSchema.path('details').discriminator(
  (PaymentType.Chapter as unknown) as string,
  ChapterPaymentSchema
);
