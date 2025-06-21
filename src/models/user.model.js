import { DataTypes, Model } from 'sequelize';

export default class User extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('user', 'moderator', 'admin'),
        defaultValue: 'user',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    });
  }

  static associate(_models) {
    // Define associations here (optional)
  }
}
