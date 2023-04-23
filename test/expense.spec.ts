import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';
import { AppModule } from '../src/app.module';

initialiseTestTransactions();

describe('ExpenseController (e2e)', () => {
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
    '/expense (POST) - testa a criação de um despesa',
    runInTransaction(async () => {
      const userDto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(userDto);
      const { body: bearer } = await request.post('/user/signin').send(userDto);

      const dto = {
        description: 'gasto 1',
        value: 97.99,
      };
      const { status, body } = await request
        .post('/expense')
        .send(dto)
        .auth(bearer.access_token, { type: 'bearer' });
      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual(
        expect.objectContaining({
          description: 'gasto 1',
          value: 97.99,
          user: {
            id: expect.any(String),
            email: 'user@gmail.com',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    }),
  );

  it(
    '/expense (GET) - resgata despesas por usuário',
    runInTransaction(async () => {
      const userDto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(userDto);
      const { body: bearer } = await request.post('/user/signin').send(userDto);

      const dto = {
        description: 'gasto 1',
        value: 97.99,
      };
      await request
        .post('/expense')
        .send(dto)
        .auth(bearer.access_token, { type: 'bearer' });

      const { status, body } = await request
        .get('/expense')
        .auth(bearer.access_token, { type: 'bearer' });
      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: expect.any(String),
            value: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      );
    }),
  );

  it(
    '/expense/:id (GET) - resgata uma despesa especifica',
    runInTransaction(async () => {
      const userDto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(userDto);
      const { body: bearer } = await request.post('/user/signin').send(userDto);

      const dtoList = [
        {
          description: 'gasto 1',
          value: 97.99,
        },
        {
          description: 'gasto 2',
          value: 45,
        },
      ];

      for (const dto of dtoList) {
        await request
          .post('/expense')
          .send(dto)
          .auth(bearer.access_token, { type: 'bearer' });
      }
      const { body: expenses } = await request
        .get('/expense')
        .auth(bearer.access_token, { type: 'bearer' });

      const { status, body } = await request
        .get(`/expense/${expenses[1].id}`)
        .auth(bearer.access_token, { type: 'bearer' });

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          description: 'gasto 2',
          value: 45,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    }),
  );

  it(
    '/expense/:id (PACTH) - edita o valor de uma despesa especifica',
    runInTransaction(async () => {
      const userDto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(userDto);
      const { body: bearer } = await request.post('/user/signin').send(userDto);

      const dtoList = [
        {
          description: 'gasto 1',
          value: 97.99,
        },
        {
          description: 'gasto 2',
          value: 45,
        },
      ];

      for (const dto of dtoList) {
        await request
          .post('/expense')
          .send(dto)
          .auth(bearer.access_token, { type: 'bearer' });
      }
      const { body: expenses } = await request
        .get('/expense')
        .auth(bearer.access_token, { type: 'bearer' });

      const { status } = await request
        .patch(`/expense/${expenses[1].id}`)
        .send({ value: 33 })
        .auth(bearer.access_token, { type: 'bearer' });

      expect(status).toBe(HttpStatus.OK);
    }),
  );
  it(
    '/expense/:id (DELETE) - exclui uma despesa especifica',
    runInTransaction(async () => {
      const userDto = {
        email: 'user@gmail.com',
        password: '1234',
      };
      await request.post('/user/signup').send(userDto);
      const { body: bearer } = await request.post('/user/signin').send(userDto);

      const dtoList = [
        {
          description: 'gasto 1',
          value: 97.99,
        },
        {
          description: 'gasto 2',
          value: 45,
        },
      ];

      for (const dto of dtoList) {
        await request
          .post('/expense')
          .send(dto)
          .auth(bearer.access_token, { type: 'bearer' });
      }
      const { body: expenses } = await request
        .get('/expense')
        .auth(bearer.access_token, { type: 'bearer' });

      const { status } = await request
        .delete(`/expense/${expenses[1].id}`)
        .auth(bearer.access_token, { type: 'bearer' });

      expect(status).toBe(HttpStatus.NO_CONTENT);
    }),
  );
});
