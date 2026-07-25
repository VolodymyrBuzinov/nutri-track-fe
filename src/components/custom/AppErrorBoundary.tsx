import { Button } from "@/components/ui/button";
import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = () => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="font-heading text-32 font-semibold">Something went wrong</h1>
    <Button onClick={() => window.location.reload()}>Try again</Button>
  </main>
);

export const AppErrorBoundary = ({ children }: PropsWithChildren) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
);
