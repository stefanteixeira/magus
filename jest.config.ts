import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  collectCoverageFrom: [
    'src/**/*.(js|jsx|ts|tsx)',
    '!src/constants/*.(js|jsx|ts|tsx)',
    '!src/db/*.(js|jsx|ts|tsx)',
    '!src/types/*.(js|jsx|ts|tsx)',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['lcov'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/__tests__/e2e'],
}

export default createJestConfig(config)
