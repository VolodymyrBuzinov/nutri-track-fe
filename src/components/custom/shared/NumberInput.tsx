import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import type { ComponentProps } from "react";

export type NumberInputValue = number | string | undefined;

interface NumberInputProps
  extends Omit<
    ComponentProps<"input">,
    "value" | "onChange" | "onBlur" | "type" | "min" | "max" | "step"
  > {
  value: NumberInputValue;
  onChange: (value: NumberInputValue) => void;
  onBlur?: () => void;
  max: number;
  suffix?: string;
}

const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));

const toNumber = (value: NumberInputValue) => {
  if (!value) return 0;

  const numeric = Number(value);

  if (Number.isNaN(numeric)) return 0;

  return numeric;
};

export const NumberInput = ({
  value,
  onChange,
  onBlur,
  max,
  suffix,
  className,
  disabled,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: NumberInputProps) => {
  const numericValue = toNumber(value);
  const displayValue = value === "" || value == null ? "" : String(value);

  const setValue = (next: number | "") => {
    onChange(next === "" ? "" : clamp(next, max));
  };

  return (
    <InputGroup className={className} aria-invalid={ariaInvalid}>
      <InputGroupButton
        aria-label="Зменшити"
        disabled={disabled || numericValue <= 0}
        onClick={() => setValue(numericValue - 1)}
      >
        <Minus aria-hidden="true" />
      </InputGroupButton>

      <div className="relative min-w-0 flex-1">
        <InputGroupInput
          {...inputProps}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          value={displayValue}
          className={cn(
            "text-center tabular-nums",
            suffix ? "pr-10" : undefined
          )}
          onChange={(event) => {
            const nextValue = event.target.value;

            if (nextValue === "") {
              setValue("");
              return;
            }

            if (!/^\d*\.?\d*$/.test(nextValue)) {
              return;
            }

            setValue(toNumber(nextValue));
          }}
          onBlur={(event) => {
            setValue(toNumber(event.target.value));
            onBlur?.();
          }}
        />

        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-content-muted">
            {suffix}
          </span>
        ) : null}
      </div>

      <InputGroupButton
        aria-label="Збільшити"
        disabled={disabled || numericValue >= max}
        onClick={() => setValue(numericValue + 1)}
      >
        <Plus aria-hidden="true" />
      </InputGroupButton>
    </InputGroup>
  );
};
