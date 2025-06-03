import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Post('find-all')
  findAll(@Body() body: any) {
    return this.postsService.findAll(body);
  }

  @Get(':id')
  findById(@Param('id') users_id: string) {
    return this.postsService.findById(users_id);
  }

  @Patch()
  update(@Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Get('find-one/:id')
  findOne(@Param('id') post_id: string) {
    return this.postsService.findOne(post_id);
  }
}
