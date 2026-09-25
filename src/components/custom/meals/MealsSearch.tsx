import { mealsApi, mealsQueryKeys } from "@/api/meals/meals-api";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";

export const MealsSearch = () => {
  const { data: products } = useQuery({
    queryFn: mealsApi.getProducts,
    queryKey: [mealsQueryKeys.getProducts],
    select: (res) => res?.data?.data,
  });
  const anchor = useComboboxAnchor();
  return (
    <section
      aria-labelledby="recommendations-title"
      className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6"
    >
      <Combobox
        multiple
        autoHighlight
        items={products}

        // defaultValue={products?.[0]}
      >
        <ComboboxChips ref={anchor} className="w-full max-w-xs">
          <ComboboxValue>
            {(values) => (
              <Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput />
              </Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </section>
  );
};
