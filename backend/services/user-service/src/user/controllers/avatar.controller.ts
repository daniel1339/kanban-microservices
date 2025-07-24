import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { 
  UploadAvatarResponse,
  UnauthorizedResponse,
  FileTooLargeResponse,
  UnsupportedMediaTypeResponse,
  InternalServerErrorResponse
} from '../../docs/responses/user.responses';
import {
  AvatarUploadResponseExample,
  AvatarUploadRequestExample,
  AvatarFileTooLargeExample,
  AvatarInvalidFileTypeExample,
  AvatarEmptyFileExample,
  AvatarMissingFileExample,
  AvatarUnauthorizedExample,
  AvatarInvalidExtensionExample
} from '../../docs/examples/avatar.examples';

@ApiTags('Avatar')
@ApiBearerAuth('JWT-auth')
@Controller('avatar')
@UseGuards(JwtAuthGuard)
export class AvatarController {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

  @Post('upload')
  @ApiOperation({ 
    summary: 'Upload user avatar',
    description: 'Uploads an avatar image for the authenticated user. Supported formats: PNG, JPG, JPEG, GIF. Maximum size: 5MB.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file for avatar',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (PNG, JPG, JPEG, GIF)',
        },
      },
      required: ['file'],
    },
    examples: {
      'Valid file': AvatarUploadRequestExample
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Avatar uploaded successfully',
    content: {
      'application/json': {
        example: AvatarUploadResponseExample
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file',
    content: {
      'application/json': {
        examples: {
          'File too large': AvatarFileTooLargeExample,
          'Type not allowed': AvatarInvalidFileTypeExample,
          'Empty file': AvatarEmptyFileExample,
          'File required': AvatarMissingFileExample,
          'Invalid extension': AvatarInvalidExtensionExample
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: AvatarUnauthorizedExample
      }
    }
  })
  @UploadAvatarResponse
  @UnauthorizedResponse
  @FileTooLargeResponse
  @UnsupportedMediaTypeResponse
  @InternalServerErrorResponse
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    // Validate that a file was uploaded
    if (!file) {
      throw new BadRequestException('File required');
    }

    // Validate MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed. Supported types: ${this.allowedMimeTypes.join(', ')}`);
    }

    // Validate file extension
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (!this.allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(`File extension not allowed. Supported extensions: ${this.allowedExtensions.join(', ')}`);
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Validate that the file is not empty
    if (file.size === 0) {
      throw new BadRequestException('File cannot be empty');
    }

    // File upload simulation
    return {
      url: 'https://example.com/avatar.png',
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
    };
  }
} 