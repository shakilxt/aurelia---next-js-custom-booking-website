import type { ComponentPropsWithoutRef } from "react";
import { FieldFrame, cxControl, fieldControlProps, type FieldProps } from "./Field";

type InputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "id" | "required" | "aria-invalid" | "aria-describedby" | "className"
>;

type TextFieldProps = FieldProps & InputProps;

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  type = "text",
  ...inputProps
}: TextFieldProps) {
  const field = { id, label, hint, error, optional };
  return (
    <FieldFrame {...field} className={className}>
      <input
        type={type}
        {...inputProps}
        {...fieldControlProps(field)}
        className={cxControl("min-h-12")}
      />
    </FieldFrame>
  );
}
