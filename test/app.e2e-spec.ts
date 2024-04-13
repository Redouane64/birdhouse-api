import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Pool } from 'pg';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pool: Pool;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    pool = app.get(Pool);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    jest.spyOn(pool, 'query').mockImplementationOnce(() => ({
      rows: [{ time: '2024-04-12T23:40:51.387Z' }],
    }));

    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        ready: true,
        environment: 'test',
        db: { ready: true, time: '2024-04-12T23:40:51.387Z' },
      });
  });
});
