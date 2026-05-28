import { BrowserRouter, Routes, Route } from "react-router-dom";
import Compiler from "./pages/Compiler"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Projects from "./pages/Projects"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Compiler /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/projects" element={ <Projects /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;