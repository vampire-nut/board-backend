/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/models/users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private usersModel: typeof Users) {}

  async create(username: string): Promise<any> {
    try {
      const [user, created] = await this.usersModel.findOrCreate({
        attributes: ['users_id', 'username'],
        where: { username: username },
        defaults: {
          username,
        },
      });
      return {
        success: true,
        code: 200,
        data: user,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findOne(username: string): Promise<any> {
    try {
      const findOne = await this.usersModel.findOne({
        attributes: ['users_id', 'username'],
        where: {
          username,
        },
      });

      if (findOne) {
        return findOne.toJSON();
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
