import { Test, TestingModule } from '@nestjs/testing';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegisterBirdhouseDto } from '../src/birdhouse/dtos';
import { DataSource, Repository } from 'typeorm';
import { BirdhouseService } from '../src/birdhouse/birdhouse.service';
import { BirdhouseEntity } from '../src/birdhouse/entities/birdhouse.entity';
import { BirdhouseOccupancyEntity } from '../src/birdhouse/entities/birdhouse-occupancy.entity';
import { UbidAuthGuard } from '../src/birdhouse/guards/ubid-auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BirdhousesController (e2e)', () => {
  let app: INestApplication;
  let birdhousesRepository: Repository<BirdhouseEntity>;
  let occupancyRepository: Repository<BirdhouseOccupancyEntity>;
  let birdhouseService: BirdhouseService;
  let dataSource: DataSource;

  beforeEach(async () => {
    class FakeUbidAuthGuard implements CanActivate {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      canActivate(context: ExecutionContext): boolean {
        return true;
      }
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(UbidAuthGuard)
      .useClass(FakeUbidAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    birdhousesRepository = moduleFixture.get(
      getRepositoryToken(BirdhouseEntity),
    );
    occupancyRepository = moduleFixture.get(
      getRepositoryToken(BirdhouseOccupancyEntity),
    );
    birdhouseService = moduleFixture.get(BirdhouseService);
    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Register birdhouse', () => {
    it('/birdhouses (POST)', () => {
      const requestBody: RegisterBirdhouseDto = {
        name: 'Meadows',
        longitude: 45.678,
        latitude: 12.234,
      };
      const expectedResponse = {
        id: '9e89ac4f-23b0-4ceb-be0e-2412dfacfe02',
        ubid: '9c637d99-0254-4d7b-9fef-c81c62c8df4e',
        ...requestBody,
        birds: 0,
        eggs: 0,
      };

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementationOnce(async () => expectedResponse);

      return request(app.getHttpServer())
        .post('/birdhouses')
        .send(requestBody)
        .expect(HttpStatus.CREATED)
        .expect(expectedResponse);
    });

    it('/birdhouses (POST) validation failure', () => {
      const body: RegisterBirdhouseDto = {
        name: 'a',
        latitude: 12.234,
        longitude: 45.678,
      };

      const expectedResponse = {
        message: ['name must be longer than or equal to 4 characters'],
        error: 'Bad Request',
        statusCode: 400,
      };

      return request(app.getHttpServer())
        .post('/birdhouses')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(expectedResponse);
    });
  });

  describe('Update birdhouse', () => {
    it('/houses/:ubid (PATCH)', () => {
      const ubid = '40a5ec43-9f45-487f-ba2e-8f3fa0395071';
      const requestBody = {
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
      };
      const expectedResponse = {
        ...requestBody,
        eggs: 0,
        birds: 0,
      };

      jest
        .spyOn(birdhouseService, 'update')
        .mockImplementationOnce(async () => expectedResponse);

      return request(app.getHttpServer())
        .patch(`/birdhouses/${ubid}`)
        .send(requestBody)
        .expect(HttpStatus.OK)
        .expect(expectedResponse);
    });

    it('/houses/:ubid (PATCH) disallow empty payload', () => {
      const ubid = 'd41b063e-8171-435b-9908-c7265e08e85b';

      return request(app.getHttpServer())
        .patch(`/birdhouses/${ubid}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Empty object is not allowed',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('/houses/:ubid (PATCH) Not Found', () => {
      const ubid = 'd41b063e-8171-435b-9908-c7265e08e85b';

      jest
        .spyOn(birdhouseService, 'update')
        .mockImplementationOnce(async () => {
          throw new NotFoundException(`Birdhouse does not exist`);
        });

      return request(app.getHttpServer())
        .patch(`/birdhouses/${ubid}`)
        .send({
          name: 'meadows',
          latitude: 12.234,
          longitude: 45.678,
        })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'Birdhouse does not exist',
          error: 'Not Found',
          statusCode: 404,
        });
    });
  });

  describe('Birdhouse occupancy', () => {
    it('/house/:ubid/occupancy (POST)', async () => {
      const ubid = '355ee836-a427-40da-9edd-827789d3ee61';
      const requestBody = {
        birds: 2,
        eggs: 3,
      };
      const expectedResponse = {
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
        birds: requestBody.birds,
        eggs: requestBody.eggs,
      };

      jest
        .spyOn(birdhousesRepository, 'findOne')
        .mockImplementationOnce(async () => ({
          id: '78447029-225d-49fb-932a-da346fb383fd',
          ubid: 'a4e41adb-9f2f-487f-baae-82087eb898ca',
          name: expectedResponse.name,
          latitude: expectedResponse.latitude,
          longitude: expectedResponse.longitude,
          history: [],
        }));
      jest
        .spyOn(occupancyRepository, 'save')
        .mockImplementation(async (): Promise<any> => {});

      await request(app.getHttpServer())
        .post(`/birdhouses/${ubid}/occupancy`)
        .send(requestBody)
        .expect(HttpStatus.CREATED)
        .expect(expectedResponse);

      expect(occupancyRepository.save).toHaveBeenCalledWith(
        {
          birds: requestBody.birds,
          eggs: requestBody.eggs,
          ubid,
        },
        { transaction: false },
      );
    });
  });

  describe('Get birdhouse', () => {
    it('/houses/:ubid (GET)', () => {
      const ubid = 'a6b44f38-df51-4e48-90b9-7f8714184bbf';
      const expectedResponse = {
        name: 'meadows',
        longitude: 45.678,
        latitude: 12.234,
        eggs: 1,
        birds: 2,
      };

      jest
        .spyOn(birdhousesRepository, 'findOne')
        .mockImplementation(async () => ({
          id: 'bc73c77e-16cf-4a5b-9154-fc174894dcc8',
          ubid,
          ...expectedResponse,
          history: [],
        }));

      jest.spyOn(occupancyRepository, 'find').mockImplementation(async () => [
        {
          eggs: expectedResponse.eggs,
          birds: expectedResponse.birds,
          birdhouse: null,
          id: 1,
          ubid,
          createdAt: new Date(),
        },
      ]);

      return request(app.getHttpServer())
        .get(`/birdhouses/${ubid}`)
        .expect(HttpStatus.OK)
        .expect(expectedResponse);
    });
  });
});
