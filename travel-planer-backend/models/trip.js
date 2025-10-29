import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Trip extends Model {
    static associate(models) {
      // define association here
    }
  }

  Trip.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      ownerId: DataTypes.INTEGER,
      collaboratorIds: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Trip',
    }
  );

  return Trip;
};
