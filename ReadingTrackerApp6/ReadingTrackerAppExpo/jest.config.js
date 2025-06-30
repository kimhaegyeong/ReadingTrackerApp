module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(expo-sqlite|expo-modules-core|expo-file-system|expo-asset|expo|@expo|@react-native|react-native|@react-navigation)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}; 