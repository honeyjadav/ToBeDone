import { Routes, Route } from "react-router-dom";

// Teammates will import their pages here, e.g.:
// import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/" element={<h1>CloudCollab — Setup Working</h1>} />
    </Routes>
  );
}