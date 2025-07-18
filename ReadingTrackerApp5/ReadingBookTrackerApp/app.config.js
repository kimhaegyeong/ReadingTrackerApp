module.exports = {
  expo: {
    name: "ReadingBookTrackerApp",
    slug: "ReadingBookTrackerApp",
    version: "1.0.0",
    orientation: "portrait",
    // icon: "./src/assets/images/icon.png",
    scheme: "readingbooktrackerapp",
    userInterfaceStyle: "automatic",
    splash: {
      // image: "./src/assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        // foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      // favicon: "./src/assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      "typedRoutes": true
    },
  },
}; 