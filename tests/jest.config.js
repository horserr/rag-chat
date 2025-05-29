export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const roots = ['<rootDir>'];
export const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/../src/$1',
};
export const testMatch = [
  '<rootDir>/**/*.test.ts',
  '<rootDir>/**/*.test.js',
];
export const setupFiles = ['<rootDir>/setup.js'];
