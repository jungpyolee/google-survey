import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Edit from "./pages/Edit";
import ViewForm from "./pages/Viewform";
import { PersistGate } from "redux-persist/integration/react";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App min-h-screen bg-violet-100 pb-40">
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/edit" />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/viewform" element={<ViewForm />} />
            </Routes>
          </Router>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
