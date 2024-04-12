export function mockServiceFactory(): {
  find: jest.Mock<any[], []>;
  findById: jest.Mock<
    {
      toJSON: jest.Mock<any, any>;
    },
    []
  >;
  findOne: jest.Mock<
    {
      toJSON: jest.Mock<any, any>;
    },
    []
  >;
  count: jest.Mock<number, []>;
  create: jest.Mock<
    {
      toJSON: jest.Mock<any, any>;
    },
    []
  >;
  overwrite: jest.Mock<
    {
      toJSON: jest.Mock<any, any>;
    },
    []
  >;
  update: jest.Mock<
    {
      toJSON: jest.Mock<any, any>;
    },
    []
  >;
  remove: jest.Mock<number, []>;
} {
  return {
    find: jest.fn(() => []),
    findById: jest.fn(() => ({ toJSON: jest.fn() })),
    findOne: jest.fn(() => ({ toJSON: jest.fn() })),
    count: jest.fn(() => 1),
    create: jest.fn(() => ({ toJSON: jest.fn() })),
    overwrite: jest.fn(() => ({ toJSON: jest.fn() })),
    update: jest.fn(() => ({ toJSON: jest.fn() })),
    remove: jest.fn(() => 1),
  };
}

export function authServiceMockFactory(): {
  login: jest.Mock<
    {
      access_token: string;
    },
    []
  >;
} {
  return {
    login: jest.fn(() => ({ access_token: 'abcdefghi' })),
  };
}
