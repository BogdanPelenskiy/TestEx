import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Invite extends Model {
    static associate(models) {
      // define association here
      // приклад: Invite.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
    }
  }

  Invite.init(
    {
      tripId: DataTypes.INTEGER,
      email: DataTypes.STRING,
      token: DataTypes.STRING,
      status: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Invite',
    }
  );

  return Invite;
};
