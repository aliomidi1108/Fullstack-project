import { getSequelize } from '../sequelize.js'
import defineUserModel from './user.model.js'
import defineRefreshTokenModel from './refresh-token.model.js'
import defineOtpCodeModel from './otp-code.model.js'
import definePaymentModel from './payment.model.js'
import defineCourseVideoModel from './course-video.model.js'
import defineCommentModel from './comment.model.js'

let models = null
let dbReady = false
let dbInitError = null

const initDbModels = () => {
  if (models) return models

  const sequelize = getSequelize()
  const User = defineUserModel(sequelize)
  const RefreshToken = defineRefreshTokenModel(sequelize)
  const OtpCode = defineOtpCodeModel(sequelize)
  const Payment = definePaymentModel(sequelize)
  const CourseVideo = defineCourseVideoModel(sequelize)
  const Comment = defineCommentModel(sequelize)

  User.hasMany(RefreshToken, {
    foreignKey: 'user_id',
    as: 'refresh_tokens',
  })
  RefreshToken.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  })

  User.hasMany(Payment, {
    foreignKey: 'user_id',
    as: 'payments',
  })
  Payment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  })

  User.hasMany(Comment, {
    foreignKey: 'user_id',
    as: 'comments',
  })
  Comment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  })

  models = {
    sequelize,
    User,
    RefreshToken,
    OtpCode,
    Payment,
    CourseVideo,
    Comment,
  }

  return models
}

const syncDatabase = async () => {
  try {
    const { sequelize } = initDbModels()
    await sequelize.authenticate()
    await sequelize.sync()
    dbReady = true
    dbInitError = null
    return true
  } catch (error) {
    dbReady = false
    dbInitError = error
    return false
  }
}

const isDatabaseReady = () => dbReady

const getDatabaseInitError = () => dbInitError

export { getDatabaseInitError, initDbModels, isDatabaseReady, syncDatabase }
