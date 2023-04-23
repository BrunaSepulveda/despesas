import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';
import { AppModule } from '../src/app.module';

initialiseTestTransactions();

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    request = supertest(app.getHttpServer());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    '/user/signup (POST) - testa criação de um usuário',
    runInTransaction(async () => {
      const dto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      const { status, body } = await request.post('/user/signup').send(dto);

      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual(
        expect.objectContaining({
          email: 'user@gmail.com',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    }),
  );

  it(
    '/user/signup (POST) - testa o login de um usuário cadastrado',
    runInTransaction(async () => {
      const dto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(dto);
      const { status, body } = await request.post('/user/signin').send(dto);

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          access_token: expect.any(String),
        }),
      );
    }),
  );

  it(
    '/user (GET) - testa o resgate de informações do usuário',
    runInTransaction(async () => {
      const dto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(dto);
      const { body: bearer } = await request.post('/user/signin').send(dto);
      const { status, body } = await request
        .get('/user')
        .auth(bearer.access_token, { type: 'bearer' });
      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: 'user@gmail.com',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    }),
  );

  it(
    '/user (DELETE) - testa a deleção de um usuário',
    runInTransaction(async () => {
      const dto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(dto);
      const { body: bearer } = await request.post('/user/signin').send(dto);
      const { status } = await request
        .delete('/user')
        .auth(bearer.access_token, { type: 'bearer' });
      expect(status).toBe(HttpStatus.NO_CONTENT);
    }),
  );
});
