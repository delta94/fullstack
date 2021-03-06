import { IsObject, ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import {
  Schema$Payment,
  Param$CreatePayment,
  Schema$PaymentDetails
} from '@/typings';
import { PaymentDetailsDto } from './payment-details.dto';

class Excluded implements Partial<Schema$Payment> {
  @Exclude()
  id?: undefined;

  @Exclude()
  status?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  price?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

export class CreatePaymentDto
  implements
    Required<Omit<Schema$Payment, keyof Excluded>>,
    Required<Omit<Param$CreatePayment, keyof Excluded>> {
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto) // TODO: check discriminator?
  details: Schema$PaymentDetails;
}
