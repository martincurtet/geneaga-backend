module.exports = (sequelize, DataType) => {
  const UserPreference = sequelize.define(
    'user_preference',
    {
      user_id: {
        type: DataType.INTEGER
      },
      language: {
        type: DataType.STRING
      },
      email_system: {
        type: DataType.BOOLEAN
      },
      email_news: {
        type: DataType.BOOLEAN
      }
    },
    {
      createdAt: false,
      updatedAt: 'modified'
    }
  )
  return UserPreference
}
