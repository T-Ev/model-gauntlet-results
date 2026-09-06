import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ModelPage from "./pages/ModelPage";
import PromptPage from "./pages/PromptPage";

export default function App() {
  return (
    <div className="shell">
      <header className="site">
        <h1>
          <Link className="home" to="/">
            Model Gauntlet Results
          </Link>
        </h1>
        <span className="meta">Public scores · private prompts stay private</span>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/models/:slug" element={<ModelPage />} />
        <Route path="/models/:slug/prompts/:id" element={<PromptPage />} />
      </Routes>
    </div>
  );
}
