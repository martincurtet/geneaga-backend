module.exports = (sequelize, DataType) => {
  const UserPassword = sequelize.define(
    'user_password',
    {
      user_id: {
        type: DataType.INTEGER
      },
      password: {
        type: DataType.STRING
      }
    },
    {
      createdAt: false,
      updatedAt: 'modified'
    }
  )
  return UserPassword
}
