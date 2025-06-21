export default {
  async up(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('users', 'refresh_token');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.TEXT,
    });
  },
};
