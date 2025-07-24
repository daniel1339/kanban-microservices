import { Test, TestingModule } from '@nestjs/testing';
import { AvatarController } from './avatar.controller';

describe('AvatarController', () => {
  let controller: AvatarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
    }).compile();

    controller = module.get<AvatarController>(AvatarController);
  });

  describe('uploadAvatar', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should upload avatar successfully with valid file', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024000,
        destination: '/tmp',
        filename: 'test-avatar.png',
        path: '/tmp/test-avatar.png',
        buffer: Buffer.from('test'),
        stream: null as any,
      };

      const result = controller.uploadAvatar(mockFile);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        url: 'https://example.com/avatar.png',
        filename: 'test-avatar.png',
        size: 1024000,
        mimetype: 'image/png',
        uploadedAt: expect.any(String),
      });
    });

    it('should handle file with different image formats', () => {
      const imageFormats = [
        { mimetype: 'image/jpeg', originalname: 'avatar.jpg' },
        { mimetype: 'image/png', originalname: 'avatar.png' },
        { mimetype: 'image/gif', originalname: 'avatar.gif' },
      ];

      imageFormats.forEach(({ mimetype, originalname }) => {
        const mockFile: Express.Multer.File = {
          fieldname: 'file',
          originalname,
          encoding: '7bit',
          mimetype,
          size: 512000,
          destination: '/tmp',
          filename: originalname,
          path: `/tmp/${originalname}`,
          buffer: Buffer.from('test'),
          stream: null as any,
        };

        const result = controller.uploadAvatar(mockFile);

        expect(result.mimetype).toBe(mimetype);
        expect(result.filename).toBe(originalname);
        expect(result.size).toBe(512000);
      });
    });

    it('should handle file with large size', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'large-avatar.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 5242880, // 5MB
        destination: '/tmp',
        filename: 'large-avatar.png',
        path: '/tmp/large-avatar.png',
        buffer: Buffer.from('test'),
        stream: null as any,
      };

      const result = controller.uploadAvatar(mockFile);

      expect(result.size).toBe(5242880);
      expect(result.filename).toBe('large-avatar.png');
    });

    it('should handle file with special characters in filename', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'avatar with spaces & symbols.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024000,
        destination: '/tmp',
        filename: 'avatar with spaces & symbols.png',
        path: '/tmp/avatar with spaces & symbols.png',
        buffer: Buffer.from('test'),
        stream: null as any,
      };

      const result = controller.uploadAvatar(mockFile);

      expect(result.filename).toBe('avatar with spaces & symbols.png');
      expect(result.url).toBe('https://example.com/avatar.png');
    });

    it('should handle null file gracefully', () => {
      expect(() => controller.uploadAvatar(null as any)).toThrow('File required');
    });

    it('should handle undefined file gracefully', () => {
      expect(() => controller.uploadAvatar(undefined as any)).toThrow('File required');
    });

    it('should return consistent response structure', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024000,
        destination: '/tmp',
        filename: 'test.png',
        path: '/tmp/test.png',
        buffer: Buffer.from('test'),
        stream: null as any,
      };

      const result = controller.uploadAvatar(mockFile);

      expect(result).toMatchObject({
        url: expect.any(String),
        filename: expect.any(String),
        size: expect.any(Number),
        mimetype: expect.any(String),
        uploadedAt: expect.any(String),
      });
    });

    it('should generate valid ISO date string', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024000,
        destination: '/tmp',
        filename: 'test.png',
        path: '/tmp/test.png',
        buffer: Buffer.from('test'),
        stream: null as any,
      };

      const result = controller.uploadAvatar(mockFile);

      expect(result.uploadedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(() => new Date(result.uploadedAt)).not.toThrow();
    });

    it('should handle file with zero size', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'empty.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 0,
        destination: '/tmp',
        filename: 'empty.png',
        path: '/tmp/empty.png',
        buffer: Buffer.from(''),
        stream: null as any,
      };

      expect(() => controller.uploadAvatar(mockFile)).toThrow('File cannot be empty');
    });
  });
}); 