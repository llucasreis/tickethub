import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload. { id, email }
  const payload = {
    id: uuid(),
    email: 'lprs@gmail.com'
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY);

  // build session object
  const session = { jwt: token };

  // turn that session into json
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};