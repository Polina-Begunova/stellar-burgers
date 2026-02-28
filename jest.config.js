module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@components$': '<rootDir>/src/components/index.ts',
    '^@pages$': '<rootDir>/src/pages/index.ts',
    '^@ui$': '<rootDir>/src/components/ui/index.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@zlden/react-developer-burger-ui-components$': '<rootDir>/__mocks__/ui-components.ts'
  },
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/**/index.ts',
    '!src/components/ui/**/*'
  ]
};
