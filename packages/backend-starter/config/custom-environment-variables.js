module.exports = {
  app: {
    port: 'APP_PORT',
    hashPassword: 'HASH_PASSWORD',
    jwtSecret: 'JWT_SECRET',
    cors: {
      origin: 'APP_CORS_ORIGIN',
    },
  },
  user: {
    takeMax: 'APP_USERS_TAKE_MAX',
  },
  profile: {
    takeMax: 'APP_PROFILE_TAKE_MAX',
  },
  post: {
    takeMax: 'APP_POSTS_TAKE_MAX',
  },
  category: {
    takeMax: 'APP_CATEGORY_TAKE_MAX',
  },
};
