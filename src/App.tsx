import { AppErrorBoundary } from "@/components/custom/shared/AppErrorBoundary";
import { routesData } from "@/routing/routesData";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";

function App() {
  return (
    <AppErrorBoundary>
      <Toaster timeout={3000} />
      <BrowserRouter>
        <Routes>
          {routesData.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
