/* eslint-disable @typescript-eslint/explicit-function-return-type -- js file */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const userRoles = ['USER', 'ADMIN'];
      const postTypes = ['TEXT', 'GALLERY'];

      await queryInterface.createTable(
        'Users',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          role: {
            type: Sequelize.ENUM,
            values: userRoles,
            default: userRoles[0],
          },
          username: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          image: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Profiles',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          bio: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          firstName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          userId: {
            type: Sequelize.UUID,
            references: {
              model: 'Users',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Categories',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Tags',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Posts',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          content: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          mainImage: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          images: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          type: {
            type: Sequelize.ENUM,
            values: postTypes,
            default: postTypes[0],
          },
          published: {
            type: Sequelize.BOOLEAN,
            default: false,
          },
          authorId: {
            type: Sequelize.UUID,
            references: {
              model: 'Users',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          categoryId: {
            type: Sequelize.UUID,
            references: {
              model: 'Categories',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'PostsTags',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          postId: {
            type: Sequelize.UUID,
            references: {
              model: 'Posts',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          tagId: {
            type: Sequelize.UUID,
            references: {
              model: 'Tags',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.createTable(
        'Comments',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          content: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          authorId: {
            type: Sequelize.UUID,
            references: {
              model: 'Users',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          postId: {
            type: Sequelize.UUID,
            references: {
              model: 'Posts',
              key: 'id',
            },
            onDelete: 'SET NULL',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

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
      await queryInterface.dropTable('Comments', { transaction });
      await queryInterface.dropTable('PostsTags', { transaction });
      await queryInterface.dropTable('Posts', { transaction });
      await queryInterface.dropTable('Tags', { transaction });
      await queryInterface.dropTable('Categories', { transaction });
      await queryInterface.dropTable('Profiles', { transaction });
      await queryInterface.dropTable('Users', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      global.console.error(error);
      throw error;
    }
  },
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
