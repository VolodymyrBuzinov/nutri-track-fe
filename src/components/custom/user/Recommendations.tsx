import {
  Eye,
  Gauge,
  HeartPulse,
  Moon,
  Sunrise,
  Timer,
  Utensils,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const recommendationSections = [
  {
    id: "nutrition-principles",
    title: "Головні принципи харчування",
    icon: Utensils,
    points: [
      "Сніданок — не пізніше ніж через годину-півтори після підйому.",
      "Проміжки між прийомами їжі — не менше 3 годин.",
      "Орієнтовна норма води — 30 мл на 1 кг ваги.",
      "У проміжках між їжею можна пити воду, чай і каву без цукру та молока.",
      "Каву з молоком краще пити після їжі; враховуйте, що вона може впливати на засвоєння деяких поживних речовин.",
      "Вечеряйте за 2–3 години до сну.",
      "Намагайтеся залишати нічну перерву між вечерею та сніданком щонайменше 12 годин, але не більше 16 годин.",
      "Надавайте перевагу ранній вечері та ранньому сніданку.",
    ],
  },
  {
    id: "intermittent-fasting",
    title: "Про інтервальне голодування",
    icon: Timer,
    intro:
      "Це режим харчування з чергуванням періодів, коли дозволено їсти, та часу без їжі.",
    points: [
      "Починайте з режиму 10/14 і поступово переходьте до 16/8. Використовуйте його не частіше 3 разів на тиждень.",
      "За такого режиму вечеря має бути ранньою, як і сніданок, а не навпаки.",
      "Під час інтервального голодування можна не дотримуватися 3-годинних проміжків між прийомами їжі.",
      "Снідайте впродовж години-півтори після підйому. Наприклад, якщо ви встаєте о 6:30, поснідайте орієнтовно о 8:00, а вечеряйте близько 16:00–16:30.",
      "Не використовуйте цей метод при проблемах із шлунково-кишковим трактом, діабеті чи вагітності.",
    ],
  },
  {
    id: "breakfast",
    title: "Навіщо потрібен сніданок",
    icon: Sunrise,
    points: [
      "Сніданок допомагає розпочати день і забезпечити організм енергією.",
      "Якщо ви маєте проблеми зі шлунком або рівнем цукру, обговоріть режим харчування з лікарем.",
      "Якщо кава натщесерце викликає дискомфорт, спробуйте пити її після сніданку.",
      "Збалансований сніданок може містити складні вуглеводи, білки та корисні жири: вуглеводи дають енергію, білок потрібен для тканин, а жири сприяють ситості.",
    ],
  },
  {
    id: "basal-metabolism",
    title: "Базовий обмін речовин",
    icon: Gauge,
    intro:
      "Це мінімальна кількість енергії, необхідна для підтримки життєдіяльності організму у стані спокою. Надто суворе обмеження калорій може зашкодити здоров’ю, тому не занижуйте калораж без рекомендації фахівця.",
  },
  {
    id: "growth-hormone",
    title: "Соматотропін (гормон росту)",
    icon: HeartPulse,
    intro:
      "Цей гормон виробляється гіпофізом. У дитинстві він бере участь у рості й розвитку, а в дорослому віці — у регуляції обміну речовин і підтримці тканин.",
    points: [
      "Повноцінний сон і регулярна фізична активність підтримують загальне здоров’я.",
      "За наявності питань щодо гормонального балансу зверніться до лікаря.",
    ],
  },
  {
    id: "hunger",
    title: "Як впоратися з відчуттям голоду",
    icon: Moon,
    points: [
      "Прополощіть рот м’ятним ополіскувачем або почистьте зуби.",
      "Випийте води.",
      "Спробуйте розсмоктати заморожену ягоду.",
      "Якщо перед сном ви голодні, можна з’їсти огірок і варене яйце.",
    ],
  },
];

export const Recommendations = () => (
  <section aria-labelledby="recommendations-title">
    <h2
      id="recommendations-title"
      className="font-heading text-lg font-semibold"
    >
      Поради
    </h2>

    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {recommendationSections.map(
        ({ id, title, icon: Icon, intro, points }) => (
          <Popover key={id}>
            <PopoverTrigger
              aria-label={`Відкрити пораду: ${title}`}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md p-4 text-left text-sm text-content bg-main-soft"
            >
              <Icon className="size-4 shrink-0 text-main" aria-hidden="true" />
              <span className="flex-1 font-medium">{title}</span>
              <Eye className="size-4 shrink-0 text-main" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="max-h-[70vh] overflow-y-auto"
            >
              <PopoverHeader>
                <PopoverTitle>{title}</PopoverTitle>
              </PopoverHeader>
              {intro ? (
                <p className="leading-relaxed text-content-muted">{intro}</p>
              ) : null}
              {points ? (
                <ul className="list-disc space-y-2 pl-4 leading-relaxed text-content-muted marker:text-main">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </PopoverContent>
          </Popover>
        ),
      )}
    </div>
  </section>
);
