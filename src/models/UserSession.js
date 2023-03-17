module.exports = (sequelize, DataType) => {
  const UserSession = sequelize.define(
    'user_session',
    {
      user_id: {
        type: DataType.INTEGER
      },
      session_id: {
        type: DataType.STRING
      },
      expired: {
        type: DataType.BOOLEAN
      }
    },
    {
      createdAt: 'created',
      updatedAt: false
    }
  )
  return UserSession
}
