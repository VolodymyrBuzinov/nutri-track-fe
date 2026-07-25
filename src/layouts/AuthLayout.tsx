import logo from "@/assets/logo.svg";
import { BarChart3, Heart, Leaf } from "lucide-react";
import type { ReactNode } from "react";

const highlights = [
  { icon: Leaf, label: "Усвідомлене харчування" },
  { icon: BarChart3, label: "Вимірюваний прогрес" },
  { icon: Heart, label: "Здоровіші звички" },
];

const titleStyles = "text-3xl font-bold mb-2 last:mb-0";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex items-center px-4 py-6 flex-1">
      <div className="relative pl-4">
        <img width={300} height={70} src={logo} alt="Nutri Track logo" />

        <div className="mt-4">
          <h2 className={titleStyles}>Відстежуй</h2>
          <h2 className={titleStyles}>Балансуй</h2>
          <h2 className={titleStyles}>Живи краще</h2>
          <p className="text-lg mt-4">
            Щоденне харчування, прогрес і цілі — усе в одному місці.
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-lg border border-main px-3 py-2 text-xs text-main bg-white/60 backdrop-blur-sm"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="self-stretch">{children}</div>
    </section>
  );
};
