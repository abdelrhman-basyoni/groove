import React from 'react';
import { useController } from 'react-hook-form';
import { Form } from 'antd';
import { Input } from '@mui/material';

const MUITextField = ({
  control,
  name,
  type,
  label,
  placeholder,
  validateStatus,
  defaultValue,
  errorMsg,
  className
}) => {
  const {
    // field: { ...inputProps }
    field
  } = useController({
    name,
    control
  });

  return (
    <Form.Item label={label} help={errorMsg} validateStatus={validateStatus} colon={false}>
      <Input
        {...field}
        placeholder={placeholder}
        type={type}
        size="large"
        defaultValue={defaultValue}
        className={className}
        // value={defaultValue ? defaultValue : field.value}
      />
    </Form.Item>
  );
};

export default MUITextField;