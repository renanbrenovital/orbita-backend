module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('installations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      installation_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_provider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      system_size: {
        type: Sequelize.NUMERIC,
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cost: {
        type: Sequelize.NUMERIC,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('installations');
  },
};
