module.exports = {
  app: {
    port: 3000,
    hashPassword: 'something',
    jwtSecret: 'jwtSuperSecret',
    cors: {
      origin: '',
    },
  },
  user: {
    takeMax: 200,
  },
  profile: {
    takeMax: 200,
  },
  post: {
    takeMax: 200,
  },
  category: {
    takeMax: 200,
  },
  tag: {
    takeMax: 200,
  },
};
