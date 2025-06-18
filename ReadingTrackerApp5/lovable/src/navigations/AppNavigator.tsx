import React, { Suspense } from "react";
import HomeScreen from "@/screens/HomeScreen";
import BookDetailScreen from "@/screens/BookDetailScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";
import NotFoundScreen from "@/screens/NotFoundScreen";
import BookSearchScreen from "@/screens/BookSearchScreen";

// 간단한 라우팅 구현 (실제 RN Navigation 대체)
const routes = {
  "/": HomeScreen,
  "/book/:id": BookDetailScreen,
  "/settings": SettingsScreen,
  "/profile": UserProfileScreen,
  "/search": BookSearchScreen,
};

function getCurrentPath() {
  return window.location.pathname;
}

export const AppNavigator = () => {
  const path = getCurrentPath();
  let Screen = routes[path] || NotFoundScreen;
  // 동적 파라미터 등은 실제 라우터로 대체 가능
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Screen />
    </Suspense>
  );
};
