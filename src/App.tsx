import { routesData } from "@/routing/routesData";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/custom/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {routesData.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
