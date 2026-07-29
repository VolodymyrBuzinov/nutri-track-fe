import { AppErrorBoundary } from "@/components/custom/shared/AppErrorBoundary";
import { routesData } from "@/routing/routesData";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast";

function App() {
  return (
    <AppErrorBoundary>
      <ToastProvider />
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
