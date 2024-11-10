import React from "react";
import { useField } from "formik";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input, { InputProps } from "@mui/joy/Input";

export interface IInputFieldProps extends InputProps {
  name: string;
  label: string;
  helperText?: string;
  placeholder: string;
}

const InputField = ({
  name,
  label,
  helperText,
  placeholder,
  ...props
}: IInputFieldProps) => {
  const [field, { touched, error }] = useField({ name });

  const invalid = React.useMemo(() => {
    if (error) return true;
    if (touched && !error) return false;
  }, [error, touched]);

  return (
    <FormControl error={invalid}>
      <FormLabel>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        name={name}
        id={name}
        placeholder={placeholder}
      />
      {helperText ||
        (error && (
          <FormHelperText>
            {invalid && error}
            {helperText && !invalid && helperText}
          </FormHelperText>
        ))}
    </FormControl>
    // <Field.Root invalid={invalid}>
    //   <Field.Label>{label}</Field.Label>
    //   <Field.Input
    //     {...field}
    //     {...props}
    //     name={name}
    //     id={name}
    //     placeholder={placeholder}
    //   />
    //   {error && <Field.ErrorText>{error}</Field.ErrorText>}
    //   {helperText && !error && (
    //     <Field.HelperText>{helperText}</Field.HelperText>
    //   )}
    // </Field.Root>
  );
};

export default InputField;
