import { AppEditor } from './Editor';

function App() {
  return (
    <div className="container max-w-6xl px-4 mx-auto mt-10 xl:p-0">
      <div className="flex flex-col gap-4 mb-6 md:items-end md:justify-between md:flex-row">
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
