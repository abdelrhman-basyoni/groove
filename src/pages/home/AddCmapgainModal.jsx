import React, {useEffect} from 'react'
import { Button, Form } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AntdTextField from '../../components/antd/AntdTextField'
import { EditOutlined, SendOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import {createCampaign} from '../../api'
const AddCmapgainModal = ({setModalOpened,fetchData}) => {
    const [form] = Form.useForm();
    const  schema = Yup.object().shape({
        name: Yup.string()
          .required('this field is required required')

      });
    
    const {
        setValue,
        handleSubmit,
        control,
        // watch,
        // unregister,
        getValues,
        reset,
        formState: { errors, isSubmitting }
      } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        
      });

      
      setValue('Type', "AUCTION");
      setValue('Objective', 'Traffic');
      setValue('Limit', 350);
    //   setValue('cardSerial', selected.serial);
    //   setValue('chassisNumber', selected.plateNumber);



      const onSubmit = async (data) => {
        const body = {
          name: data.name,
          type: data.Type,
          Objective: data.Objective,
          Limit: data.Limit
        };
        console.log({data})
        const response  = await createCampaign(data.name,data.Objective,data.Type, data.Limit )
        console.log({response})
        setModalOpened(false)
        await fetchData()
  
      };
    
  return (
    <div>
        <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmit)} >
        <div className="form-field-wrapper">
          <AntdTextField
            name="name"
            type="text"
            placeholder={'campgain name'}
            label={'name'}
            errorMsg={errors?.name?.message}
            validateStatus={errors?.name ? 'error' : ''}
            prefix={<EditOutlined />}
            control={control}
          />
        </div>
        <div className="form-field-wrapper">
          <AntdTextField
            name="Type"
            type="text"
            placeholder={'Buying Type'}
            label={'Type'}
            disabled={true}
            errorMsg={errors?.userName?.message}
            validateStatus={errors?.userName ? 'error' : ''}
            prefix={<EditOutlined />}
            control={control}
          />
        </div>
        <div className="form-field-wrapper">
          <AntdTextField
            name="Objective"
            type="text"
            placeholder={'Campaign Objective'}
            label={'Objective'}
            disabled={true}
            defaultValue='Traffic'
            errorMsg={errors?.userName?.message}
            validateStatus={errors?.userName ? 'error' : ''}
            prefix={<EditOutlined />}
            control={control}
          />
        </div>
        <div className="form-field-wrapper">
          <AntdTextField
            name="Limit"
            type="number"
            placeholder={'Campaign Spend Limit'}
            label={'Limit'}
            disabled={true}
            defaultValue={350}
         
            errorMsg={errors?.userName?.message}
            validateStatus={errors?.userName ? 'error' : ''}
            prefix={<EditOutlined />}
            control={control}
          />
        </div>


        <Button
          className="submit-btn"
          htmlType="submit"
          type="primary"
          icon={<SendOutlined />}
          loading={isSubmitting}>
          {'create'}
        </Button>

        </Form>
    </div>
  )
}

export default AddCmapgainModal