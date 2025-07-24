import { HttpExceptionFilter, ErrorResponse } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: '/test',
      method: 'GET',
      headers: { 'x-request-id': 'req-123' },
    };
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should return unified error structure for HttpException', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error',
        error: 'Bad Request',
        path: '/test',
        method: 'GET',
        requestId: 'req-123',
      })
    );
  });

  it('should handle exception with array message', () => {
    const exception = new HttpException({ message: ['Error1', 'Error2'] }, HttpStatus.UNPROCESSABLE_ENTITY);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: ['Error1', 'Error2'],
        error: 'Unprocessable Entity',
      })
    );
  });

  it('should handle unknown status', () => {
    const exception = new HttpException('Unknown error', 599 as HttpStatus);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(599);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 599,
        error: 'Error',
      })
    );
  });
}); 