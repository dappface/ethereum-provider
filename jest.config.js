module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'src/@types',
    'src/connection/wallet/worker.ts',
    'src/connection/wallet/background.worker.ts'
  ],
  globals: {
    ReactNativeWebView: {
      postMessage: () => {}
    }
  },
  modulePathIgnorePatterns: ['node_modules', 'dist', 'example'],
  preset: 'ts-jest'
}
