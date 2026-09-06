import { Link, Route, Routes, useSearchParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ModelPage from "./pages/ModelPage";
import PromptPage from "./pages/PromptPage";
import { withRunQuery } from "./lib/api";

function SiteHeader() {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get("run");
  return (
    <header className="site">
      <h1>
        <Link className="home" to={withRunQuery("/", runId)}>
          Model Gauntlet Results
        </Link>
      </h1>
      <span className="meta">Public scores · private prompts stay private</span>
    </header>
  );
}

export default function App() {
  return (
    <div className="shell">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/models/:slug" element={<ModelPage />} />
        <Route path="/models/:slug/prompts/:id" element={<PromptPage />} />
      </Routes>
    </div>
  );
}
