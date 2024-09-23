import React from "react";
import { useField } from "formik";
import { Field } from "../park-ui";

export interface ITextFieldProps {
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
}: ITextFieldProps) => {
  const [field, { touched, error }] = useField({ name });

  return (
    <Field.Root invalid={touched && !!error}>
      <Field.Label>{label}</Field.Label>
      <Field.Input {...field} name={name} id={name} placeholder={placeholder} />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};

export default TextField;
