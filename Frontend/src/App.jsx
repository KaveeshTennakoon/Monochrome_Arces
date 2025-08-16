import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<CreateAccount />} />

      {/* Catch-all route: Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
