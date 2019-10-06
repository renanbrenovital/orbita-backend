import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const index = await User.findAll({
      attributes: ['id', 'name', 'email', 'state'],
    });
    return res.json(index);
  }

  async show(req, res) {
    const { id } = req.params;
    const show = await User.findOne({
      where: { id },
      attributes: ['id', 'name', 'email', 'state'],
    });
    return res.json(show);
  }

  async store(req, res) {
    const { body } = req;
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
      state: Yup.string()
        .length(2)
        .required(),
    });

    if (!(await schema.isValid(body))) {
      return res
        .status(400)
        .json({ error: 'Dados inválidos para registrar usuário' });
    }

    const userExists = await User.findOne({ where: { email: body.email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário com este email' });
    }

    const { id, name, email, state } = await User.create(body);

    return res.json({
      id,
      name,
      email,
      state,
    });
  }

  async update(req, res) {
    const { body, params } = req;
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      state: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirm: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword, password, passwordConfirm } = body;

    const user = await User.findByPk(params.id);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Password confirm does not match' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Old password does not match' });
    }

    const { id, name, state } = await user.update(body);

    return res.json({ id, name, email, state });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deleting = await User.destroy({ where: { id } });

    if (!deleting) {
      res.status(500).json({ error: 'Internal error on delete user' });
    }

    return res.json();
  }
}

export default new UserController();
