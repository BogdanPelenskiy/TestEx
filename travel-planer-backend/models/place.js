import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Place extends Model {
    static associate(models) {
      // define association here
      // приклад: Place.belongsTo(models.Trip, { foreignKey: 'tripId' });
    }
  }

  Place.init(
    {
      tripId: DataTypes.INTEGER,
      locationName: DataTypes.STRING,
      notes: DataTypes.TEXT,
      dayNumber: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Place',
    }
  );

  return Place;
};
