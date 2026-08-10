import { AppErrorBoundary } from "@/components/custom/shared/AppErrorBoundary";
import { ScrollToTop } from "@/routing/ScrollToTop";
import { routesData } from "@/routing/routesData";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";
import { Suspense } from "react";
import { Loader } from "./components/custom/shared/Loader";

function App() {
  return (
    <AppErrorBoundary>
      <Toaster timeout={3000} />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            {routesData.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
