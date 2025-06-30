'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.addColumn('users', 'auth_provider', {
  type: Sequelize.ENUM('local', 'google', 'github'),
  allowNull: false,
  defaultValue: 'local',
});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'auth_provider');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_auth_provider";');  
  }
};
