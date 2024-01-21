import { ParseFilePipe } from '@nestjs/common';
import { fileValidators } from './file.validator';

describe('FileValidator', () => {
  it('should be defined', () => {
    expect(fileValidators).toBeInstanceOf(ParseFilePipe);
  });
});
