import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  AddOccupancyDto,
  RegisterBirdhouseDto,
  UpdateBirdhouseDto,
} from '../src/houses/dtos';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  }, 3000);

  describe('Register birdhouse', () => {
    it('/houses (POST)', () => {
      const body: RegisterBirdhouseDto = {
        name: 'Jake',
        latitude: 12.234,
        longitude: 45.678,
      };

      const expectedBirdEggs = { birds: 0, eggs: 0 };
      const expectedResponse = Object.assign(
        {
          id: '9e89ac4f-23b0-4ceb-be0e-2412dfacfe02',
        },
        body,
        expectedBirdEggs,
      );

      jest
        .spyOn(dataSource, 'transaction')
        .mockImplementationOnce(async () => [
          expectedResponse,
          expectedBirdEggs,
        ]);

      return request(app.getHttpServer())
        .post('/houses')
        .send(body)
        .expect(HttpStatus.CREATED)
        .expect(expectedResponse);
    });

    it('/houses (POST) validation failure returns 400 Bad Request', () => {
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

      jest
        .spyOn(dataSource, 'query')
        .mockImplementationOnce(async () => [expectedResponse]);

      return request(app.getHttpServer())
        .post('/houses')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(expectedResponse);
    });
  });

  describe('Register birdhouse', () => {
    it('/houses/:ubid (PATCH)', () => {
      const ubid = '40a5ec43-9f45-487f-ba2e-8f3fa0395071';
      const body = {
        ubid,
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
      };
      const expectedbirdAndEggs = { eggs: 2, birds: 2 };

      jest
        .spyOn(dataSource, 'query')
        .mockImplementationOnce(async () => [body])
        .mockImplementationOnce(async () => [expectedbirdAndEggs]);

      return request(app.getHttpServer())
        .patch(`/houses/${ubid}`)
        .send(body)
        .expect(HttpStatus.OK)
        .expect({ ...body, ...expectedbirdAndEggs });
    });

    it('/houses/:ubid (PATCH) ubid param validation failure returns 400 Bad Request', () => {
      const badUbid = '123';
      return request(app.getHttpServer())
        .patch(`/houses/${badUbid}`)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });

  it('/house/:ubid/occupancy (POST)', () => {
    const ubid = '355ee836-a427-40da-9edd-827789d3ee61';

    const occupancy: AddOccupancyDto = {
      birds: 2,
      eggs: 3,
    };

    const expectBody = Object.assign(
      {
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
      },
      occupancy,
    );

    jest
      .spyOn(dataSource, 'query')
      .mockImplementationOnce(async () => [expectBody])
      .mockImplementationOnce(async () => [occupancy]);

    return request(app.getHttpServer())
      .post(`/houses/${ubid}/occupancy`)
      .send(occupancy)
      .expect(HttpStatus.CREATED)
      .expect(expectBody);
  });

  describe('Get birdhouse', () => {
    it('/houses/:ubid (GET)', () => {
      const ubid = 'a6b44f38-df51-4e48-90b9-7f8714184bbf';
      const expectedBody = {
        ubid,
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
      };

      jest
        .spyOn(dataSource, 'query')
        .mockImplementation(async () => [expectedBody]);

      return request(app.getHttpServer())
        .get(`/houses/${ubid}`)
        .expect(HttpStatus.OK)
        .expect(expectedBody);
    });
  });
});
