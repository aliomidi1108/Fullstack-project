import { DataTypes } from 'sequelize'

const defineOtpCodeModel = (sequelize) =>
  sequelize.define(
    'OtpCode',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      phone: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'otp_codes',
      timestamps: false,
    }
  )

export default defineOtpCodeModel
