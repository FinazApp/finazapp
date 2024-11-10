import React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import { InputField, IInputFieldProps } from "../input-field";

export interface INumberFieldProps extends IInputFieldProps {
  name: string;
  label: string;
  helperText?: string;
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatAdapter = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="$"
      />
    );
  }
);

const NumberField = (props: INumberFieldProps) => {
  return (
    <InputField
      {...props}
      slots={{
        input: NumericFormatAdapter,
      }}
    />
  );
};

export default NumberField;
