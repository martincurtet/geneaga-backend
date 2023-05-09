module.exports = (sequelize, DataType) => {
  const SystemLoginAttempt = sequelize.define(
    'system_login_attempt',
    {
      email: {
        type: DataType.STRING
      },
      ip: {
        type: DataType.STRING
      },
      result: {
        type: DataType.BOOLEAN
      },
      fail_method: {
        type: DataType.STRING
      },
      session_id: {
        type: DataType.STRING
      }
    },
    {
      createdAt: 'timestamp',
      updatedAt: false
    }
  )
  return SystemLoginAttempt
}
