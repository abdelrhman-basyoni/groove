import React, { useState } from 'react'
import { Button, Form, Upload } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AntdTextField from '../../components/antd/AntdTextField'
import { EditOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { displayError, getPageID, uploadVideo,uploadToFB, createAdCreative,createAd } from '../../api'

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
const NewAddModal = ({adsetsId}) => {
    const [form] = Form.useForm();
    const schema = Yup.object().shape({
        pageUrl: Yup.string()
            .required('this field is required')

    });
    const [page, setPage] = useState()
    const [fileUrl, setFileUrl] = useState()
    const [videoId,setvideoId] = useState()
    const [creativeId,setCreativeId] = useState()
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState();
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
    // setValue('Page', 'Traffic');
    setValue('Limit', 350);
    //   setValue('cardSerial', selected.serial);
    //   setValue('chassisNumber', selected.plateNumber);

    const props = {
        onRemove: (file) => {

            setFile();
            setFileUrl()
        },
        beforeUpload: (file) => {
            setFile(file);

            return false;
        },
        file,
    };

    const onSubmit = async (data) => {
        const body = {
            name: data.name,
            type: data.Type,
            Objective: data.Objective,
            Limit: data.Limit
        };
        console.log({ data })
        const response = await createCampaign(data.name, data.Objective, data.Type, data.Limit)
        console.log({ response })
        setModalOpened(false)
        await fetchData()

    };


    const getPageDetails = async (data) => {
        const page = await getPageID(data.pageUrl)
        console.log({ page })
        if (page != null) {
            setValue('pageName', page.name);
            setPage(page)
        }

    }
    const  handleUpload = async (e) => {
        setUploading(true)
        console.log({ file, page })
        console.log(e);
        const formData = new FormData();
        formData.append('file',file)
        if (!page?.id) {
            displayError({ title: 'invalid request', message: 'enter page url first' })
        } else {
        //    const res = await  uploadVideo({path:'https://winch.sheltertest.ml/file/upload',formData})
        //    if(res?.data?.link){
            
            // setFileUrl(res?.data?.link)
            setFileUrl('https://winch.sheltertest.ml/file/videoplayback-6342.mp4')
            const fbres = await uploadToFB(page.id,'https://winch.sheltertest.ml/file/videoplayback-6342.mp4')
            console.log({fbres})
            setUploading(false)
            setvideoId(fbres.id)
            /** addcreative then ad */
            const adCreativeRes = await createAdCreative({pageId:page.id,videoId:fbres.id,adCreativeName:'testcreative'})
            setCreativeId(adCreativeRes.id)
            console.log({adsetsId})
            const adres= await createAd({
                pageId:page.id,
                addSetId:adsetsId,
                creativeId:adCreativeRes.id,
                adName:'testad'

            })

        //    }
        //    console.log({res})
        }


    }


      // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit2 = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }
    return (
        <div>

            <Form form={form} layout="vertical" onFinish={handleSubmit(getPageDetails)} >
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="pageUrl"
                        type="text"
                        placeholder={'page url'}
                        label={'pageUrl'}
                        errorMsg={errors?.name?.message}
                        validateStatus={errors?.name ? 'error' : ''}
                        prefix={<EditOutlined />}
                        control={control}

                    />
                    <AntdTextField
                        name="pageName"
                        type="text"
                        placeholder={'Page'}
                        label={'Page'}
                        disabled={true}
                        errorMsg={errors?.pageName?.message}
                        validateStatus={errors?.pageName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                    <Button
                        className="submit-btn"
                        htmlType="submit"
                        type="primary"
                        icon={<SendOutlined />}
                        loading={isSubmitting}>
                        {'fetch'}
                    </Button>
                </div>
            </Form>
            ------------------------------------------------------------------------------------ Ad creative -------------------------------------------------------------------------------
            <div>
                {/* <Dropzone
                    getUploadParams={getUploadParams}
                    onChangeStatus={handleChangeStatus}
                    onSubmit={handleSubmit2}
                    accept="image/*,audio/*,video/*"
                /> */}




                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={!file}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            </div>
            {/* <Upload customRequest={handleUpload} >
                <Button>Select file</Button>
            </Upload> */}
        </div>
    )
}

export default NewAddModal