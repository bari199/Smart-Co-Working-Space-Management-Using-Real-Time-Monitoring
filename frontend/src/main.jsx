import React from "react";
import ReactDOM from "react-dom/client";
//added here
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
