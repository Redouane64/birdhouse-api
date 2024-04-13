import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
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

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    const time = '2024-04-12T23:40:51.387Z';
    jest
      .spyOn(dataSource, 'query')
      .mockImplementationOnce(async () => [{ time }]);

    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        ready: true,
        environment: 'test',
        db: { ready: true, time },
      });
  });
});
