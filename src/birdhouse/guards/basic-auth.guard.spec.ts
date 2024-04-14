import { BasicAuthGuard } from './basic-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';

describe('BasicAuthGuard', () => {
  let guard: BasicAuthGuard;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockReturnValue({
        username: 'testuser',
        password: 'testpassword',
      }),
    };

    guard = new BasicAuthGuard(mockConfigService as ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if Authorization header is not present', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if Authorization header is not in the correct format', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'InvalidFormat',
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if username or password is incorrect', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization:
              'Basic ' + Buffer.from('invalid:invalid').toString('base64'),
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return true if username and password are correct', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization:
              'Basic ' +
              Buffer.from('testuser:testpassword').toString('base64'),
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });
});
