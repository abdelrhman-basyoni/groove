import React, { useState } from 'react'
import { Button, Form, Upload, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AntdTextField from '../../components/antd/AntdTextField'
import { EditOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { displayError, getPageID, getInstagramID, uploadVideo, uploadToFB, createAdCreative, createAd, displaySuccess } from '../../api'

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
const NewAddModal = ({ adsetsId, setModalOpened,fetchData }) => {

    const [addBody, setAddBody] = useState({})
    const [adCreativeBody, setAdCreativeBody] = useState({})

    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const schema = Yup.object().shape({
        pageUrl: Yup.string()
            .required('this field is required')

    });
    const [page, setPage] = useState()
    const [fileUrl, setFileUrl] = useState()
    const [thumbnailUrl, setThumbnailUrl] = useState()
    const [videoId, setvideoId] = useState()
    const [creativeId, setCreativeId] = useState()
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState();
    const [thumbnail, setThumbnail] = useState();
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
    const thumbnailProps = {
        onRemove: (file) => {

            setThumbnail();
            setThumbnailUrl()
        },
        beforeUpload: (file) => {

            setThumbnail(file);

            return false;
        },
        thumbnail,
        listType: 'picture'
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
    const getInstagramDetails = async (data) => {
        if (!page?.id) {
            displayError({ title: 'invalid request', message: 'enter page url first' });
            return;
        }
        const res = await getInstagramID(page.id)
        console.log({ res })
    }


    const getPageDetails = async (data) => {
        const page = await getPageID(data.pageUrl)
        console.log({ page })
        if (page != null) {
            setValue('pageName', page.name);
            setPage(page)
        }

    }
    const handleUpload = async (e) => {
        /**
         * validate that there is page id and a file and thumbnail
         * upload the files to the backendserver
         * create the ad creative
         */

        if (!page?.id) {
            displayError({ title: 'invalid request', message: 'enter page url first' });
            return;
        }
        if (!file || !thumbnail) {
            displayError({ title: 'invalid request', message: 'video and thumbnail must be uploaded' });
            return;
        }
        if (!adCreativeBody.primaryText || !adCreativeBody.headLine || !adCreativeBody.destination) {
            displayError({ title: 'invalid request', message: 'u must enter primary text, headline and destination' });
            return;
        }
        setUploading(true)
        const formData = new FormData();
        formData.append('file', file)

        const thumbnailFormData = new FormData();
        thumbnailFormData.append('file', thumbnail)

        /** upload to backendServer */
        const [fileRes, imageRes] = await Promise.all([
            uploadVideo({path:'https://winch.sheltertest.ml/file/upload',formData}),
            uploadVideo({path:'https://winch.sheltertest.ml/file/upload',formData:thumbnailFormData}),
        ])
        if(!fileRes || !imageRes) {
            displayError({ title: 'invalid request', message: 'error happened while uploading'})
            setUploading(false)
            return;
        }
        setFileUrl(fileRes.data.link)
        setThumbnailUrl(imageRes.data.link)
        const imageUrl = imageRes.data.link
        const fileUrl = fileRes.data.link
        setThumbnailUrl(imageUrl)

        /** upload the video*/
        const fbres = await uploadToFB(page.id, fileUrl)
        if (!fbres.id) {

        }
        setvideoId(fbres.id)
        /** addcreative then ad */
        const adCreativeRes = await createAdCreative({
            pageId: page.id,
            videoId: fbres.id,
            adCreativeName: 'testcreative',
            primaryText: adCreativeBody.primaryText,
            headLine: adCreativeBody.headLine,
            destination: adCreativeBody.destination,
            imageUrl
        })
        if(adCreativeRes?.id){
            setCreativeId(adCreativeRes.id)
        }
        setUploading(false)








    }


    const createAdHandler = async () => {
        if (!page || !creativeId) {
            displayError({ title: 'invalid request', message: 'missing page id or ad ad creative' })
        }
        console.log({ addBody })
        const adRes = await createAd({
            pageId: page.id,
            addSetId: adsetsId,
            creativeId: creativeId,
            adName: addBody.name,
            pixelId: addBody?.pixelId,
            appEvents: addBody?.appEvents,


        })
        console.log({adRes})
        if (adRes != null) {
            displaySuccess({ title: 'success', message: "ad created successfully" });
            fetchData()
            setModalOpened(false);
        }

    }



    return (
        <div className="container">
            <div className="row">
                <div className="col">
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
                </div>
                {/* <div className="col">
                    <Form form={form2} layout="vertical" onFinish={handleSubmit(getInstagramDetails)} >
                        <div className="form-field-wrapper">
                            <AntdTextField
                                name="instagramUrl"
                                type="text"
                                placeholder={'instagram url'}
                                label={'pageUrl'}
                                errorMsg={errors?.name?.message}
                                validateStatus={errors?.name ? 'error' : ''}
                                prefix={<EditOutlined />}
                                control={control}

                            />
                            <AntdTextField
                                name="instagramName"
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

                </div> */}
            </div>
            <div className="row" style={{ 'justify-content': 'center' }}>
                ---------------------------------------------- Ad creative ----------------------------------------------
            </div>
            <div className="row">
                {/* upload video */}

                <div className="row">



                    <div className="col">
                        {/* <p>select video</p> */}
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Select video</Button>
                        </Upload>
                    </div>
                    <div className="col">
                        {/* <p>select thumbnail</p> */}
                        <Upload {...thumbnailProps}>
                            <Button icon={<UploadOutlined />}>Select thumbnail</Button>
                        </Upload>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '5px',marginLeft:'2px' }}>
                    <Input
                        name="headLine"
                        type="text"
                        size="large"
                        placeholder={'HeadLine'}
                        label={'titile'}
                        onChange={(e) => setAdCreativeBody(prev => ({ ...prev, [e.target.name]: e.target.value }))}

                    />
                </div>
                <div className="row" style={{ marginTop: '5px',marginLeft:'2px' }}>
                    <Input
                        name="primaryText"
                        type="text"
                        size="large"
                        placeholder={'primary text'}
                        label={'primary'}
                        onChange={function (e) { setAdCreativeBody(prev => ({ ...prev, [e.target.name]: e.target.value })) }}

                    />
                </div>
                <div className="row" style={{ marginTop: '5px',marginLeft:'2px' }}>
                    <Input
                        name="destination"
                        type="text"
                        placeholder={'enter url of target'}
                        label={'primary'}
                        size="large"
                        onChange={function (e) { setAdCreativeBody(prev => ({ ...prev, [e.target.name]: e.target.value })) }}

                    />
                </div>

                <div className="row">
                    <div className="col">
                        <Button
                            type="primary"
                            onClick={handleUpload}
                            disabled={!file}
                            loading={uploading}
                            style={{ marginTop: 16 }}
                        >
                            {uploading ? 'Uploading' : 'Start Upload'}
                        </Button>
                        {creativeId ? <p> ad creative has been  created </p> : null}
                    </div>
                </div>
            </div>

            <div className="row" style={{ 'justify-content': 'center' }}>
                ---------------------------------------------- Ad creation ----------------------------------------------
            </div>
            {/* <Upload customRequest={handleUpload} >
                <Button>Select file</Button>
            </Upload> */}

            <div className="row" style={{ margin: '5px' }}>
                <Input
                    name="name"
                    type="text"
                    size="large"
                    placeholder={'add name'}
                    label={'name'}
                    onChange={(e) => setAddBody(prev => ({ ...prev, [e.target.name]: e.target.value }))}

                />
            </div>
            <div className="row" style={{ margin: '5px' }}>
                <Input
                    name="pixelId"
                    type="text"
                    size="large"
                    placeholder={'enter pixel id'}
                    label={'primary'}
                    onChange={function (e) { setAddBody(prev => ({ ...prev, [e.target.name]: e.target.value })) }}

                />
            </div>
            <div className="row" style={{ margin: '5px' }}>
                <Input
                    name="appEvents"
                    type="text"
                    size="large"
                    placeholder={'enter app id'}
                    label={'primary'}
                    onChange={function (e) { setAddBody(prev => ({ ...prev, [e.target.name]: e.target.value })) }}

                />
            </div>

            <div className="row">
                <div className="col">
                    <Button
                        type="primary"
                        onClick={createAdHandler}
                        // disabled={!file}
                        style={{ marginTop: 16 }}
                    >
                        create ad
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default NewAddModal