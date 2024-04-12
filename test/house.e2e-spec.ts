import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  AddOccupancyDto,
  RegisterBirdhouseDto,
  UpdateBirdhouseDto,
} from '../src/houses/dtos';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ ready: true, environment: 'test' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/house (POST)', () => {
    const body: RegisterBirdhouseDto = {
      name: 'Jake',
      latitude: 12.234,
      longitude: 45.678,
    };

    return request(app.getHttpServer())
      .post('/house')
      .send(body)
      .expect(HttpStatus.CREATED)
      .expect(body);
  });

  it('/house (POST) validation failure returns 400 Bad Request', () => {
    const body: RegisterBirdhouseDto = {
      name: 'a',
      latitude: 12.234,
      longitude: 45.678,
    };

    return request(app.getHttpServer())
      .post('/house')
      .send(body)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: ['name must be longer than or equal to 4 characters'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/house/:ubid (PATCH)', () => {
    const ubid = '40a5ec43-9f45-487f-ba2e-8f3fa0395071';
    const body: UpdateBirdhouseDto & { ubid: string } = {
      ubid,
      name: 'meadows',
      latitude: 12.234,
      longitude: 45.678,
    };

    return request(app.getHttpServer())
      .patch(`/house/${ubid}`)
      .send(body)
      .expect(HttpStatus.OK)
      .expect(body);
  });

  it('/house/:ubid (PATCH) ubid param validation failure returns 400 Bad Request', () => {
    const badUbid = '123';
    return request(app.getHttpServer())
      .patch(`/house/${badUbid}`)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/house/:ubid/occupancy (POST)', () => {
    const ubid = '355ee836-a427-40da-9edd-827789d3ee61';
    const body: AddOccupancyDto = {
      birds: 2,
      eggs: 3,
    };

    const expectBody = Object.assign(
      {
        ubid,
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
      },
      body,
    );

    return request(app.getHttpServer())
      .post(`/house/${ubid}/occupancy`)
      .send(body)
      .expect(HttpStatus.CREATED)
      .expect(expectBody);
  });

  it('/house/:ubid (GET)', () => {
    const ubid = 'a6b44f38-df51-4e48-90b9-7f8714184bbf';

    const expectedBody = {
      ubid,
      name: 'meadows',
      latitude: 12.234,
      longitude: 45.678,
    };

    return request(app.getHttpServer())
      .get(`/house/${ubid}`)
      .expect(HttpStatus.OK)
      .expect(expectedBody);
  });
});
