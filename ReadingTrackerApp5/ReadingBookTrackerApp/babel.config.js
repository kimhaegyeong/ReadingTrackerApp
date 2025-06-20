module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // 모든 플러그인을 일시적으로 비활성화하여 Babel 오류의 원인을 찾습니다.
    plugins: [],
  };
}; 