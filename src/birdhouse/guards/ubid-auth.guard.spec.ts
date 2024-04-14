import { UbidAuthGuard } from './ubid-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BirdhouseEntity } from '../entities/birdhouse.entity';

describe('UbidAuthGuard', () => {
  let guard: UbidAuthGuard;
  let mockRepository: Partial<Repository<BirdhouseEntity>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
    };

    guard = new UbidAuthGuard(mockRepository as Repository<BirdhouseEntity>);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return false if x-ubid header is not present', async () => {
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

  it('should return false if x-ubid header is not a valid UUID', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-ubid': 'nooo!!!',
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });

  it('should return false if birdhouse with given ubid does not exist', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValueOnce(null);

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-ubid': '57f6e4c1-5849-4fbc-97cb-975390008e4d',
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });
  it('should return true if birdhouse with given ubid exists', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValueOnce({});

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-ubid': '04feaa61-8d3a-4453-8c0b-a74b921c9203',
          },
        }),
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });
});
