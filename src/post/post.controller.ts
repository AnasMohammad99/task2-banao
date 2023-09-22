import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AddCommentDto, CreatePostDto, updatePostDto } from './dto/dto';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  //Posts crud API
  //all routes need user auth so if you don't have a user account, you unauthrized to use them
  // Add new post
  // post can be included -optional- file like image or txt file
  // I connect user with his likes and comments throw token so I don't need to pass user Id in api request body 
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createPost(
    @Req() request,
    @Body() CreatePostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(CreatePostDto, request, file);
  }
  @UseGuards(JwtAuthGuard)
  //get all posts
  @Get('all')
  findAllPosts() {
    return this.postService.findAllPosts();
  }
  @UseGuards(JwtAuthGuard)
  //get post
  @Get(':post_id')
  findOne(@Param('post_id') post_id: number) {
    return this.postService.findPost(+post_id);
  }
  @UseGuards(JwtAuthGuard)
  // get all posts that belong to a specific user
  @Get('all/:user_id')
  findUserAllPosts(@Param('user_id') user_id: number) {
    return this.postService.findUserAllPosts(+user_id);
  }
  @UseGuards(JwtAuthGuard)
  //update post
  @Patch(':post_id')
  updatePost(
    @Req() request,
    @Body() updatePostDto: updatePostDto,
    @Param('post_id') post_id: number,
  ) {
    return this.postService.updatePost(updatePostDto, +post_id, request);
  }
  @UseGuards(JwtAuthGuard)
  //delete post
  @Delete(':post_id')
  deletePost(@Req() request, @Param('post_id') post_id: number) {
    return this.postService.deletePost(+post_id, request);
  }
  //---------------------------like and comment routes-------------------------
  @UseGuards(JwtAuthGuard)
  //add like
  //if same user try to like same post again it won't be count or saved
  @Post(':post_id/like')
  likePost(@Req() request, @Param('post_id') post_id: number) {
    return this.postService.likePost(+post_id, request);
  }
  @UseGuards(JwtAuthGuard)
  //add comment
  //same user can add many comments
  @Post('comment/:post_id')
  addComment(
    @Req() request,
    @Param('post_id') post_id: number,
    @Body() AddCommentDto: AddCommentDto,
  ) {
    return this.postService.addComment(AddCommentDto, +post_id, request);
  }
  @UseGuards(JwtAuthGuard)
  //remove comment
  @Delete('comment/:comment_id')
  deleteComment(@Req() request, @Param('comment_id') comment_id: number) {
    return this.postService.deleteComment(+comment_id, request);
  }
}
