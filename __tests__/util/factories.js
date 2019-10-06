import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../../src/app/models/User';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  state: faker.address.stateAbbr(),
  password: faker.internet.password(),
});

export default factory;
