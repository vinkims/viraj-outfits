import { BrowserRouter } from "react-router-dom";

import { Footer, Hero, Navbar } from "./components";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar/>
        <Hero/>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
