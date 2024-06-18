import { AppEditor } from './Editor';

function App() {
  return (
    <div className="container max-w-6xl mx-auto mt-10">
      <div className="flex items-end justify-between mb-6">
        <h1 className="navi-name">
          <span className="navi">Navi</span> Playground
        </h1>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/installation">Install</a>
          <a href="/learn/">Learn</a>
          <a href="/guides/">Guides</a>
          <a href="https://github.com/navi-language" target="_blank">
            GitHub
          </a>
        </div>
      </div>
      <AppEditor />
      <div className="footer">
        Powered by{' '}
        <a href="https://github.com/navi-language/play" target="_blank">
          Navi Playground
        </a>
        , open-source on GitHub.
      </div>
    </div>
  );
}

export default App;
