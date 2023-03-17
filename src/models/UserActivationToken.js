module.exports = (sequelize, DataType) => {
  const UserActivationToken = sequelize.define(
    'user_activation_token',
    {
      user_id: {
        type: DataType.INTEGER
      },
      token: {
        type: DataType.STRING
      },
      used: {
        type: DataType.DATE
      }
    },
    {
      createdAt: 'created',
      updatedAt: false
    }
  )
  return UserActivationToken
}
