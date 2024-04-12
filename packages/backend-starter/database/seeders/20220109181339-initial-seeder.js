/* eslint-disable @typescript-eslint/explicit-function-return-type -- js file */
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      let i = 5;
      const users = [];
      const profiles = [];
      const posts = [];
      const currentDate = new Date();

      while (i--) {
        users.push({
          id: uuidv4(),
          email: faker.internet.email(),
          password: bcrypt.hashSync('superSecret', bcrypt.genSaltSync(10)),
          role: faker.helpers.arrayElement(['USER', 'ADMIN']),
          username: faker.internet.userName(),
          image: faker.image.avatar(),
          createdAt: faker.date.recent(10, currentDate),
          updatedAt: faker.date.recent(10, currentDate),
        });
      }

      console.info('users: ', JSON.stringify(users, null, 2));

      await queryInterface.bulkInsert('Users', users, { transaction });

      i = 5;

      while (i--) {
        profiles.push({
          id: uuidv4(),
          bio: faker.lorem.paragraphs(3),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          userId: users[i].id,
          createdAt: faker.date.recent(10, currentDate),
          updatedAt: faker.date.recent(10, currentDate),
        });
      }

      console.info('profiles: ', JSON.stringify(profiles, null, 2));

      await queryInterface.bulkInsert('Profiles', profiles, { transaction });

      i = 25;

      while (i--) {
        const type = faker.helpers.arrayElement(['TEXT', 'GALLERY']);
        const images = [];

        while (type === 'GALLERY' && images.length < 5) {
          images.push(faker.image.abstract());
        }

        posts.push({
          id: uuidv4(),
          title: faker.lorem.sentence(7),
          content: faker.lorem.paragraphs(18),
          type,
          mainImage: faker.image.abstract(),
          images: images.join('|'),
          published: true,
          authorId: users[faker.helpers.arrayElement([0, 1, 2, 3, 4])].id,
          createdAt: faker.date.recent(10, currentDate),
          updatedAt: faker.date.recent(10, currentDate),
        });
      }

      console.info('posts: ', JSON.stringify(posts, null, 2));

      await queryInterface.bulkInsert('Posts', posts, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      global.console.error(error);
      throw error;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('Posts');
      await queryInterface.bulkDelete('Profiles');
      await queryInterface.bulkDelete('Users');

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      global.console.error(error);
      throw error;
    }
  },
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
