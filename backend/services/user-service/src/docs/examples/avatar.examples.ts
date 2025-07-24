export const AvatarUploadResponseExample = {
  summary: 'Avatar uploaded successfully',
  description: 'Response when the avatar is uploaded correctly',
  value: {
    url: 'https://example.com/avatars/user-123.png',
    filename: 'user-123.png',
    size: 1024000,
    mimetype: 'image/png',
    uploadedAt: '2024-01-01T12:00:00.000Z'
  }
};

export const AvatarUploadRequestExample = {
  summary: 'Upload avatar file',
  description: 'Valid image file to upload as avatar',
  value: {
    file: '(binary)',
    description: 'Image file (JPG, PNG, GIF) maximum 5MB'
  }
};

export const AvatarFileTooLargeExample = {
  summary: 'File too large',
  description: 'Error when the file exceeds the 5MB limit',
  value: {
    statusCode: 400,
    message: 'File too large. Maximum size: 5MB',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/avatar/upload'
  }
};

export const AvatarInvalidFileTypeExample = {
  summary: 'File type not allowed',
  description: 'Error when trying to upload a file that is not an image',
  value: {
    statusCode: 400,
    message: 'File type not allowed. Supported types: image/jpeg, image/jpg, image/png, image/gif',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/avatar/upload'
  }
};

export const AvatarEmptyFileExample = {
  summary: 'Empty file',
  description: 'Error when trying to upload a file without content',
  value: {
    statusCode: 400,
    message: 'File cannot be empty',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/avatar/upload'
  }
};

export const AvatarMissingFileExample = {
  summary: 'File required',
  description: 'Error when no file is provided',
  value: {
    statusCode: 400,
    message: 'File required',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/avatar/upload'
  }
};

export const AvatarUnauthorizedExample = {
  summary: 'Unauthorized',
  description: 'Error when no valid JWT token is provided',
  value: {
    statusCode: 401,
    message: 'Invalid or missing JWT',
    error: 'Unauthorized',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/avatar/upload'
  }
};

export const AvatarInvalidExtensionExample = {
  summary: 'File extension not allowed',
  description: 'Error when the file extension is not allowed',
  value: {
    statusCode: 400,
    message: 'File extension not allowed. Supported extensions: .jpg, .jpeg, .png, .gif',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/avatar/upload'
  }
};

export const AvatarDeleteResponseExample = {
  summary: 'Avatar deleted successfully',
  description: 'Response when the avatar is deleted correctly',
  value: {
    message: 'Avatar deleted successfully',
    deletedAt: '2024-01-01T12:00:00.000Z'
  }
}; 