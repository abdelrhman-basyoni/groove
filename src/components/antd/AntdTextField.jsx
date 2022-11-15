import React from 'react';
import { useController } from 'react-hook-form';
import { Form, Input } from 'antd';

const AntdTextField = ({
  control,
  name,
  type,
  label,
  placeholder,
  prefix,
  disabled,
  validateStatus,
  defaultValue,
  errorMsg
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
        prefix={prefix}
        type={type}
        size="large"
        defaultValue={defaultValue}
        disabled ={disabled|| false}
        value={defaultValue ? defaultValue : field.value}
      />
    </Form.Item>
  );
};

export default AntdTextField;
