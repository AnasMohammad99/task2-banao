import { Injectable, UseGuards } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddCommentDto, CreatePostDto, updatePostDto } from './dto/posts.dto';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private database: DatabaseService) {}
  //create a post
  async createPost(CreatePostDto: CreatePostDto, request, file) {
    try {
      const newPost = await this.database.posts.create({
        data: {
          user_id: request.user.tokenId,
          description: CreatePostDto.description,
          file: file,
        },
      });
      return { data: newPost };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //get a post
  async findPost(post_id: number) {
    try {
      const post = await this.database.posts.findUnique({
        where: {
          id: post_id,
        },
        select: {
          user_id: true,
          description: true,
          file: true,
          comments: {
            select: {
              user_id: true,
              description: true,
            },
          },
          _count: {
            select: {
              like: true,
              comments: true,
            },
          },
        },
      });
      return { data: post };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //get all posts
  async findAllPosts() {
    try {
      const posts = await this.database.posts.findMany({
        select: {
          user_id: true,
          description: true,
          comments: {
            select: {
              user_id: true,
              description: true,
            },
          },
          _count: {
            select: {
              like: true,
              comments: true,
            },
          },
        },
      });
      return { data: posts };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //get user all post
  async findUserAllPosts(user_id: number) {
    try {
      const posts = await this.database.users.findUnique({
        where: {
          id: user_id,
        },
        select: {
          posts: true,
        },
      });
      return { data: posts };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //update a post
  async updatePost(updatePostDto: updatePostDto, post_id: number, request) {
    try {
      const post = await this.database.posts.findUnique({
        where: {
          id: post_id,
        },
      });
      if (post.user_id !== request.user.tokenId) {
        throw new HttpException(
          'you can not update others posts',
          HttpStatus.BAD_REQUEST,
        );
      }
      const updatedPost = await this.database.posts.update({
        where: {
          id: post_id,
        },
        data: {
          description: updatePostDto.description,
        },
      });
      return { data: updatedPost };
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }
  //delete a post
  async deletePost(post_id: number, request) {
    try {
      const post = await this.database.posts.findUnique({
        where: {
          id: post_id,
        },
      });
      if (post.user_id !== request.user.tokenId) {
        throw new HttpException(
          'you can not delete others posts',
          HttpStatus.BAD_REQUEST,
        );
      }
      const deletedPost = await this.database.posts.delete({
        where: {
          id: post_id,
        },
      });
      return { data: deletedPost, message: 'post has been deleted' };
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }
  //add like
  async likePost(post_id: number, request) {
    try {
      const addLike = await this.database.like.upsert({
        where: {
          userLikeId: {
            user_id: request.user.tokenId,
            post_id: post_id,
          },
        },
        create: {
          user_id: request.user.tokenId,
          post_id: post_id,
        },
        update: {},
      });
      return { data: addLike };
    } catch (error) {
      throw error.message;
    }
  }
  //add comment
  async addComment(AddCommentDto: AddCommentDto, post_id: number, request) {
    try {
      const newComment = await this.database.comment.create({
        data: {
          post_id: post_id,
          user_id: request.user.tokenId,
          description: AddCommentDto.description,
        },
      });
      return { data: newComment };
    } catch (error) {
      return error.message;
    }
  }
  //delete a comment
  async deleteComment(comment_id: number, request) {
    try {
      const comment = await this.database.comment.findUnique({
        where: {
          id: comment_id,
        },
      });
      if (comment.user_id !== request.user.tokenId) {
        throw new HttpException(
          'you can not delete others comments',
          HttpStatus.BAD_REQUEST,
        );
      }
      const deletedComment = await this.database.comment.delete({
        where: {
          id: comment_id,
        },
      });
      return { data: deletedComment, message: 'comment has been deleted' };
    } catch (error) {
      throw error.message;
    }
  }
}
