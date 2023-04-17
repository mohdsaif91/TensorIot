import { Route, Routes } from "react-router-dom";

import Dashboard from "./Page/Dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/:launchType" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
