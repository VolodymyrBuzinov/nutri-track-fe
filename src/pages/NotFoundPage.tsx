import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-32 font-semibold">Page not found</h1>
      <Button onClick={() => navigate("/")}>Go to home</Button>
    </main>
  );
};
