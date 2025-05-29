module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
  },
  testMatch: [
    '<rootDir>/**/*.test.ts',
    '<rootDir>/**/*.test.js',
  ],
  setupFiles: ['<rootDir>/setup.js'],
};
