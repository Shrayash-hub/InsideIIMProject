import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResearchProvider } from "./context/ResearchContext.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <ResearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ResearchProvider>
  );
}
