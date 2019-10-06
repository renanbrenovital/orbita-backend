import request from 'supertest';
import app from '../../src/app';

import factory from '../util/factories';
import truncate from '../util/truncate';

describe('SESSION', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to login', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.body).toHaveProperty('token');
  });
});
