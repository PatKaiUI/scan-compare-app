import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Scanner from ".pages/Scanner";
import Product from ".pages/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/product/:barcode" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;
