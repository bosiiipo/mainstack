import request from 'supertest';
import app from '../server';
import {describe, test, expect} from '@jest/globals';
import {faker} from '@faker-js/faker';

describe('POST /wallets', () => {
  test('Should create a wallet', async () => {
    const fakeUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app)
      .post('/v1/auth/register')
      .send(fakeUser);

    const fakeWallet = {
      userId: response.body.data.user._id,
      currency: 'USD',
    };

    const walletResponse = await request(app)
      .post(`/v1/wallet/create/${response.body.data.user._id}`)
      .set('Authorization', `Bearer ${response.body.data.jwtToken}`)
      .send(fakeWallet);

    expect(walletResponse.statusCode).toBe(201);
    expect(walletResponse.body).toEqual({
      status: 'success',
      message: 'Wallet created successfully',
      data: expect.objectContaining({
        accountName: expect.any(String),
        availableBalance: expect.any(Number),
      }),
    });
  });

  test("Get a user's wallets", async () => {
    const fakeUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app)
      .post('/v1/auth/register')
      .send(fakeUser);

    const wallets = ['USD', 'GBP', 'NGN', 'EUR'].map(currency => ({
      userId: response.body.data.user._id,
      currency,
    }));

    const responses = await Promise.all(
      wallets.map(wallet =>
        request(app)
          .post(`/v1/wallet/create/${wallet.userId}`)
          .set('Authorization', `Bearer ${response.body.data.jwtToken}`)
          .send(wallet)
      )
    );

    const walletsResponse = await request(app)
      .get(`/v1/wallet/${response.body.data.user._id}`)
      .set('Authorization', `Bearer ${response.body.data.jwtToken}`)
      .send({userId: response.body.data.user._id});

    expect(walletsResponse.statusCode).toBe(200);

    expect(walletsResponse.body.data).toHaveLength(4);

    walletsResponse.body.data.forEach((wall: any) => {
      expect(wall).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          userId: expect.any(String),
          accountName: expect.any(String),
          availableBalance: expect.any(Number),
          currency: expect.any(String),
        })
      );
    });
  });

  test("Top Up A User's Wallet", async () => {
    const fakeUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app)
      .post('/v1/auth/register')
      .send(fakeUser);

    const wallet = {
      userId: response.body.data.user._id,
      currency: 'USD',
    };

    const newWallet = await request(app)
      .post(`/v1/wallet/create/${wallet.userId}`)
      .set('Authorization', `Bearer ${response.body.data.jwtToken}`)
      .send(wallet);

    const toppedUpWalletResponse = await request(app)
      .post(
        `/v1/wallet/${newWallet.body.data._id}/user/${response.body.data.user._id}`
      )
      .set('Authorization', `Bearer ${response.body.data.jwtToken}`)
      .send({
        userId: response.body.data.user._id,
        walletId: response.body.data._id,
        amount: 1000000,
      });

    expect(toppedUpWalletResponse.statusCode).toBe(200);

    expect(toppedUpWalletResponse.body.data).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        userId: expect.any(String),
        accountName: expect.any(String),
        availableBalance: expect.any(Number),
        currency: expect.any(String),
      })
    );
  });

  test('Send money from one wallet to another', async () => {
    const fakeUserOne = [
      {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    ];

    const fakeUserTwo = [
      {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    ];

    const newUsers = await Promise.all(
      [...fakeUserOne, ...fakeUserTwo].map(user =>
        request(app).post('/v1/auth/register').send(user)
      )
    );

    const newWallets = await Promise.all(
      newUsers.map(us =>
        request(app)
          .post(`/v1/wallet/create/${us.body.data.user._id}`)
          .set('Authorization', `Bearer ${us.body.data.jwtToken}`)
          .send({currency: 'GBP', userId: us.body.data.user._id})
      )
    );

    const sendingWallet = newWallets[0].body.data;
    const sendingWalletAuthToken = newUsers.find(
      el => el.body.data.user._id === sendingWallet.userId
    )?.body.data.jwtToken;
    const receivingWallet = newWallets[1].body.data;

    const topUpOneWalletForTransfer = await request(app)
      .post(`/v1/wallet/${sendingWallet._id}/user/${sendingWallet.userId}`)
      .set('Authorization', `Bearer ${sendingWalletAuthToken}`)
      .send({
        userId: sendingWallet.userId,
        walletId: sendingWallet._id,
        amount: 1000000,
      });

    const sendMoney = await request(app)
      .post('/v1/wallet/send')
      .set('Authorization', `Bearer ${sendingWalletAuthToken}`)
      .send({
        userId: sendingWallet.userId,
        senderWalletId: sendingWallet._id,
        recipientWalletId: receivingWallet._id,
        currency: sendingWallet.currency,
        amount: 500000,
      });

    expect(sendMoney.statusCode).toBe(201);
  });
});
