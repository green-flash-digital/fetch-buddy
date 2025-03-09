import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import { WithSWR } from "./features/swr/WithSWR.tsx";
import { LayoutRoot } from "./features/layout/LayoutRoot.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutRoot />}>
          <Route path="/swr" element={<WithSWR />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
