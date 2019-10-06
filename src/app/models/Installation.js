import Sequelize, { Model } from 'sequelize';

class Installation extends Model {
  static init(sequelize) {
    super.init(
      {
        installation_date: Sequelize.DATE,
        data_provider: Sequelize.STRING,
        system_size: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        state: Sequelize.STRING,
        cost: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

export default Installation;
