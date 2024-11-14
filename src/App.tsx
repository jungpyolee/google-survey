import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Survey</h1>
      </div>
    </Provider>
  );
};

export default App;
