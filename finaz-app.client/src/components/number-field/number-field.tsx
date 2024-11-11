import React from "react";
import { omit } from "radash";
import { useField } from "formik";

import { Field, NumberInputProps, NumberInput } from "../park-ui";

export interface INumberFieldProps extends NumberInputProps {
  name: string;
  label: string;
  helperText?: string;
}

const NumberField = ({ name, label, helperText, ...props }: INumberFieldProps) => {
  const [field, { touched, error }, { setValue }] = useField({ name });

  return (
    <Field.Root invalid={touched && !!error}>
      <Field.Label>{label}</Field.Label>
      <Field.Input asChild>
        <NumberInput
          {...props}
          {...omit(field, ["onChange", "value"])}
          p="0"
          value={isNaN(field.value) ? "" : field.value}
          onValueChange={(details) => setValue(details.valueAsNumber)}
        />
      </Field.Input>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};

export default NumberField;
