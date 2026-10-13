import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import { FieldFrame, cxControl, fieldControlProps, type FieldProps } from "./Field";

type TextAreaElementProps = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "id" | "required" | "aria-invalid" | "aria-describedby" | "className" | "value"
>;

interface TextAreaProps extends FieldProps, TextAreaElementProps {
  value: string;
  /**
   * Shows a visual character count against this limit. The limit is enforced by
   * validation rather than `maxLength`, so pasted text is never silently truncated.
   */
  countLimit?: number;
}

export function TextArea({
  id,
  label,
  hint,
  error,
  optional,
  className,
  countLimit,
  value,
  rows = 4,
  ...textAreaProps
}: TextAreaProps) {
  const field = { id, label, hint, error, optional };
  const over = countLimit !== undefined && value.length > countLimit;

  return (
    <FieldFrame
      {...field}
      className={className}
      aside={
        countLimit !== undefined ? (
          // Decorative: the limit is stated in the hint and enforced with an error message.
          <p
            aria-hidden="true"
            className={cx(
              "mt-2 shrink-0 text-xs tabular-nums",
              over ? "text-danger" : "text-muted",
            )}
          >
            {value.length} / {countLimit}
          </p>
        ) : null
      }
    >
      <textarea
        rows={rows}
        value={value}
        {...textAreaProps}
        {...fieldControlProps(field)}
        className={cxControl("min-h-28 resize-y")}
      />
    </FieldFrame>
  );
}
