// Using @faker-js/faker

/** start node.js, then run
 *
 * > const User = require("./models/user");
 * > const Message = require("./models/message");
 * > const generateData = require("./seed");
 * >
 * > { users, messages } = generateData(100)
 * > for (u of users) await User.register(u)
 * < for (m of messages) await Message.create(m)
 */

const { faker } = require("@faker-js/faker");

// Generate an array of data
function generateData(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      phone: faker.phone.number(),
    });
  }

  const messages = [];
  for (let i = 0; i < count * 10; i++) {
    const from = users[Math.floor(Math.random() * count)].username;
    const to = users[Math.floor(Math.random() * count)].username;
    messages.push({
      body: faker.commerce.productDescription(),
      from_username: from,
      to_username: to,
    });
  }
  return { users, messages };
}

module.exports = generateData;
