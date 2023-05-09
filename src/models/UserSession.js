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
      ip: {
        type: DataType.STRING
      },
      browser: {
        type: DataType.STRING
      },
      expired: {
        type: DataType.DATE
      },
      expires: {
        type: DataType.DATE
      },
      max_expires: {
        type: DataType.DATE
      },
      expired_method: {
        type: DataType.STRING
      }
    },
    {
      createdAt: 'created',
      updatedAt: false
    }
  )
  return UserSession
}
