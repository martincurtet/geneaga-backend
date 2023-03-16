module.exports = (sequelize, DataType) => {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: DataType.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: DataType.STRING,
        allowNull: false
      },
      active: {
        type: DataType.BOOLEAN
      },
      last_login: {
        type: DataType.DATE
      }
    },
    {
      createdAt: 'created',
      updatedAt: 'modified'
    }
  )
  User.associate = (models) => {
    User.hasOne(models.user_password, { foreignKey: 'user_id' })
    User.hasOne(models.user_preference, { foreignKey: 'user_id' })
  }
  return User
}
