'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'), // Or Sequelize.UUIDV4 if using Node-side default
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    role: {
      type: Sequelize.ENUM('user', 'moderator', 'admin'),
      defaultValue: 'user'
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    refresh_token: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
},

  down: async (queryInterface, _Sequelize) => {
   await queryInterface.dropTable('users');
}

};
