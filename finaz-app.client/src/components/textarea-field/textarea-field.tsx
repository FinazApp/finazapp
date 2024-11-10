import React from "react";
import { useField } from "formik";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Textarea, { TextareaProps } from "@mui/joy/Textarea";

export interface ITextareaFieldProps extends TextareaProps {
  name: string;
  label: string;
  helperText?: string;
  placeholder: string;
}

const TextareaField = ({
  name,
  label,
  helperText,
  placeholder,
  ...props
}: ITextareaFieldProps) => {
  const [field, { touched, error }] = useField({ name });

  const invalid = React.useMemo(() => {
    if (error) return true;
    if (touched && !error) return false;
  }, [error, touched]);

  return (
    <FormControl error={invalid}>
      <FormLabel>{label}</FormLabel>
      <Textarea {...field} {...props} id={name} placeholder={placeholder} />
      {helperText ||
        (error && (
          <FormHelperText>
            {invalid && error}
            {helperText && !invalid && helperText}
          </FormHelperText>
        ))}
    </FormControl>
  );
};

export default TextareaField;
