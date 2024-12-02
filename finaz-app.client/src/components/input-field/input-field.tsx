import React from "react";
import { useField } from "formik";
import Stack from "@mui/joy/Stack";
import Skeleton from "@mui/joy/Skeleton";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import Input, { InputProps } from "@mui/joy/Input";
import FormHelperText from "@mui/joy/FormHelperText";

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
    <FormControl sx={{ flex: 1 }} error={invalid}>
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
  );
};

InputField.Skeleton = function InputFieldSkeleton() {
  return (
    <Stack direction="column" spacing={1}>
      <Skeleton variant="rectangular" height={10} />
      <Skeleton variant="rectangular" height={40} />
    </Stack>
  );
};

export default InputField;
