module.exports = (sequelize, DataType) => {
  const UserPreference = sequelize.define(
    'user_preference',
    {
      user_id: {
        type: DataType.INTEGER
      },
      preferences: {
        type: DataType.STRING
      }
    },
    {
      createdAt: false,
      updatedAt: 'modified'
    }
  )
  return UserPreference
}
