import request from 'supertest';
import { app } from '../../app';

const createTicket = (title = 'title') => {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price: 20
  });
}

it('can fetch a list of tickets', async () => {
  await createTicket('title-1');
  await createTicket('title-2');
  await createTicket('title-3');

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});