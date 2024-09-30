import React from "react";
import { useField } from "formik";

import { Field, InputProps } from "../park-ui";

export interface ITextFieldProps extends InputProps {
  name: string;
  label: string;
  helperText?: string;
  placeholder: string;
}

const TextField = ({
  name,
  label,
  helperText,
  placeholder,
  ...props
}: ITextFieldProps) => {
  const [field, { touched, error }] = useField({ name });

  const invalid = React.useMemo(() => {
    if (error) return true;
    if (touched && !error) return false;
  }, [error, touched]);

  return (
    <Field.Root invalid={invalid}>
      <Field.Label>{label}</Field.Label>
      <Field.Input
        {...field}
        {...props}
        name={name}
        id={name}
        placeholder={placeholder}
      />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};

export default TextField;
