import React from "react";
import { AppNavigator } from "@/navigations/AppNavigator";
import { BookProvider } from "@/contexts/BookContext";

const App = () => {
  return (
    <BookProvider>
      <AppNavigator />
    </BookProvider>
  );
};

export default App;
