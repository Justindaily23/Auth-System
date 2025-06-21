import { DataTypes, Model } from "sequelize";

export class RefreshToken extends Model {

  // Defines associations called in models/index.js
  static associate(models) {
    // One-to-many: one user to many refresh tokens
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }

  // Define model fields and options
  static initModel(sequelize) {
    RefreshToken.init(
      {
        // Unique token ID
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        // The actual refresh token string (JWT)
        token: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        // Optional: User agent (browser or device info)
        userAgent: {
          type: DataTypes.STRING,
        },
        // Expiration timestamp for token
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        // Foreign key linking token to user
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'RefreshToken',
        tableName: 'refresh_tokens',
        timestamps: true,
      }
    );

    return RefreshToken;
  }
}
