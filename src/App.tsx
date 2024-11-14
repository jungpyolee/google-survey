import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Edit from "./pages/Edit";
import ViewForm from "./pages/Viewform";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        {/* 라우팅 */}
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/edit" />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/viewform" element={<ViewForm />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
