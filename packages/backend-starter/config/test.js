module.exports = {
  app: {
    port: 3000,
    hashPassword: 'something',
    jwtSecret: 'jwtSuperSecret',
  },
  users: {
    takeMax: 200
  },
  profiles: {
    takeMax: 200
  },
  posts: {
    takeMax: 200
  },
  category: {
    takeMax: 200,
  }
};
