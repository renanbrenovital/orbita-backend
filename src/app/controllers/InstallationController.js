import sequelize from 'sequelize';
import Installation from '../models/Installation';

class InstallationController {
  async index(req, res) {
    const { state, name } = req.user;

    const total = await Installation.findOne({
      where: { state },
      attributes: ['state', [sequelize.fn('COUNT', '*'), 'total']],
      group: 'state',
    });

    const cost = await Installation.findOne({
      where: {
        state,
      },
      attributes: ['zip_code', 'cost'],
      order: sequelize.literal('cost DESC'),
      limit: 1,
    });

    const months = await Installation.findAll({
      where: {
        state,
      },
      attributes: [
        [
          sequelize.fn(
            'date_part',
            'month',
            sequelize.col('installation_date')
          ),
          'month',
        ],
        [sequelize.fn('COUNT', 'month'), 'count'],
      ],
      group: 'month',
      order: sequelize.literal('count DESC'),
      limit: 3,
    });

    const years = await Installation.findAll({
      where: {
        state,
      },
      attributes: [
        [
          sequelize.fn('date_part', 'year', sequelize.col('installation_date')),
          'year',
        ],
        [sequelize.fn('sum', sequelize.col('system_size')), 'count'],
      ],
      group: 'year',
      order: sequelize.literal('year ASC'),
    });

    if (total === null || cost === null || months === [] || years === []) {
      res.status(400).json({
        error: `Nenhum instalação para o usuário ${name} cadastrado no estado ${state}`,
      });
    }

    Promise.all([total, cost, months, years])
      .then(values => res.status(200).json(values))
      .catch(error => res.status(500).json({ error }));
  }
}

export default new InstallationController();
