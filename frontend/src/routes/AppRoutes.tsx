import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import Pricing from "../pages/public/Pricing";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
      </Route>
    </Routes>
  );
}