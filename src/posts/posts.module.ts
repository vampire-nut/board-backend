import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from 'src/models/post.entity';
import { Users } from 'src/models/users.entity';

@Module({
  imports: [SequelizeModule.forFeature([Post, Users])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
