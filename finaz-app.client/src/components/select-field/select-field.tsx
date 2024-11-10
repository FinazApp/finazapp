import React from "react";
import { useField } from "formik";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";

type SelectProps = React.ComponentProps<typeof Select>;

export interface ISelectFieldProps extends SelectProps {
  name: string;
  label: string;
  helperText?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: { label: string; value: any; disabled?: boolean }[];
}

const SelectField = ({
  name,
  label,
  helperText,
  placeholder,
  items,
  ...props
}: ISelectFieldProps) => {
  const [field, { touched, error }, { setValue }] = useField({ name });

  const invalid = React.useMemo(() => {
    if (error) return true;
    if (touched && !error) return false;
  }, [error, touched]);

  return (
    <FormControl error={invalid}>
      <FormLabel>{label}</FormLabel>
      <Select
        {...field}
        onChange={(_, value) => setValue(value)}
        {...props}
        id={name}
        placeholder={placeholder}
      >
        {items.map((item) => (
          <Option key={item.label} value={item.value} disabled={item.disabled}>
            {item.label}
          </Option>
        ))}
      </Select>
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

export default SelectField;
