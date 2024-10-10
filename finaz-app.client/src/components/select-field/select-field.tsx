import React from "react";
import { useField } from "formik";
import { IconCheck, IconSelector } from "@tabler/icons-react";

import { Field, Select } from "../park-ui";
import { omit } from "radash";

export interface ISelectFieldProps {
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
}: ISelectFieldProps) => {
  const [field, { touched, error }, { setValue }] = useField({ name });

  const invalid = React.useMemo(() => {
    if (error) return true;
    if (touched && !error) return false;
  }, [error, touched]);

  return (
    <Field.Root invalid={invalid}>
      <Select.Root
        items={items}
        {...omit(field, ["onChange", "value"])}
        value={[field.value]}
        positioning={{ sameWidth: true }}
        onValueChange={(details) => {
          console.log(details.value);
          setValue(details.value[0], true);
        }}
      >
        <Select.Label>{label}</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
            <IconSelector stroke={2} style={{ width: 20, height: 20 }} />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <Select.ItemGroup>
              <Select.ItemGroupLabel>{label}</Select.ItemGroupLabel>
              {items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <IconCheck stroke={2} style={{ width: 20, height: 20 }} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.ItemGroup>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
};

export default SelectField;
