import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // findCitizens() {
  //   return this.userModel.find({ role: 'citizen' });
  // }

  async getCitizens() {
  return this.userModel.find({ role: 'citizen' });
}
  findAll() {
    return this.userModel.find();
  }
}