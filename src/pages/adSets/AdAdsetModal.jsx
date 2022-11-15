import React, { useState, useEffect } from 'react'
import { Button, Form, Select, DatePicker } from 'antd';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createAdsets, getTargeting, getLocations, getLanguages, displayError, displaySuccess } from '../../api'
import * as Yup from 'yup';
import AntdTextField from '../../components/antd/AntdTextField'
import { EditOutlined, SendOutlined } from '@ant-design/icons';
import moment from 'moment';
const AdAdsetModal = ({ campgainId, setModalOpened, fetchData }) => {
    const [search, setSearch] = useState()
    const [searchLocations, setSearchLocations] = useState()
    const [searchLang, setSearchLang] = useState()
    const [options, setOptions] = useState([]);
    const [optionsLocations, setOptionsLocations] = useState([]);
    const [optionsLang, setOptionsLang] = useState([]);

    const [selected, setSelected] = useState([])
    const [selectedGender, setSelectedGender] = useState()
    const [selectedLocations, setSelectedLocations] = useState([])
    const [selectedCities, setSelectedCities] = useState([])
    const [selectedCountries, setSelectedCountries] = useState([])
    const [selectedLang, setSelectedLang] = useState([])
    const [asset, setAsset] = useState([])
    // const [instagram, setInstagram] = useState([])
    const [startTime, setStartTime] = useState(moment());
    const fetchTargets = async () => {
        const targets = await getTargeting(search)
        // console.log({ targets })
        const targetOptions = targets.data.map(target => ({ value: target.id, label: target.name }))
        setOptions(targetOptions)
    }
    const fetchLocations = async () => {
        const targets = await getLocations(searchLocations)
        console.log({ locations: targets })
        const targetOptions = targets.data.map(target => ({ value: target.key, type: target.type, label: `${target.name} (${target.type})` }))
        setOptionsLocations(targetOptions)
    }
    const fetchLanguages = async () => {
        const targets = await getLanguages(searchLang)

        const targetOptions = targets.data.map(target => ({ value: target.key, label: target.name }))
        setOptionsLang(targetOptions)
    }

    useEffect(() => {
        fetchTargets()
    }, [search])

    useEffect(() => {
        fetchLocations()
    }, [searchLocations])
    useEffect(() => {
        fetchLanguages()
    }, [searchLang])


    const [form] = Form.useForm();
    const schema = Yup.object().shape({
        name: Yup.string()
            .required('this field is required required'),
        // location: Yup.string()
        //     .required('this field is required required'),
        // interests: Yup.string()
        //     .required('this field is required required'),
        // Languages: Yup.string()
        //     .required('this field is required required'),

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

    setValue('Traffic', "Website");
    setValue('Optimization', "LINK_CLICKS");
    setValue('Budget', 3);

    setValue('Placment', 'Manual');
    setValue('Devices', 'ALL');
    setValue('Platforms', 'facebook + instagram');

    const assestOptions = [
        { value: 1, label: 'Facebook Feed + Instagram Feed' },
        { value: 2, label: 'Instagram Stories + Facebook Stories' },
    ]
    const onSubmit = async (data) => {
        /** validations */


        const body = {
            campgainId,
            name: data.name,
            Traffic: data.Traffic,
            optimizationGoal: data.Optimization,
            dailyBudget: data.Budget,
            startTime: startTime.utc().format(),
            targeting: {
                genders: [selectedGender],
                interests: [...selected],
                geo_locations: {
                    countries: selectedCountries,
                    cities: selectedCities

                },
                publisher_platforms: ['facebook', 'instagram'],
                facebook_positions:asset,
                instagram_positions:asset.map(element =>{
                    if(element === 'feed'){
                        return 'profile_feed'
                    }
                    return element
                })
                // device_platforms default all
            }

        };
        console.log({ body })
        if (!selectedGender && selected.length == 0 && selectedCountries.length == 0 && selectedCities.length == 0) {
            displayError({ title: 'validation Error', message: 'Please select audience' })
            console.log("raise error here")
        } else if (asset.length == 0){
            displayError({ title: 'validation Error', message: 'Please select at least 1 asset' })
        }
        else {
            const response = await createAdsets(body);
            if(response){
                displaySuccess({ title: 'success', message: 'Ad set created' })
            }
            console.log({ response })
            setModalOpened(false)
            await fetchData()
        }


    };
    const targeting = {
        genders: [selectedGender],
        interests: [...selected],
        geo_locations: {
            countries: selectedCountries,
            cities: selectedCities

        }
    }
    console.log({ targeting })
    console.log({ start_time: startTime.utc().format() })
    return (
        <div>
            <Form form={form} layout="vertical" onFinish={handleSubmit(onSubmit)} >
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="name"
                        type="text"
                        placeholder={'Adset name'}
                        label={'name'}
                        errorMsg={errors?.name?.message}
                        validateStatus={errors?.name ? 'error' : ''}
                        prefix={<EditOutlined />}
                        control={control}
                    />
                </div>
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="Traffic"
                        type="text"
                        placeholder={'Traffic Type'}
                        label={'Traffic'}
                        disabled={true}
                        errorMsg={errors?.userName?.message}
                        validateStatus={errors?.userName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                </div>
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="Optimization"
                        type="text"
                        placeholder={'Optimization for ad delivery'}
                        label={'Optimization for ad delivery'}
                        disabled={true}
                        errorMsg={errors?.userName?.message}
                        validateStatus={errors?.userName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                </div>
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="Budget"
                        type="text"
                        placeholder={'Daily Budget'}
                        label={'Budget'}
                        disabled={true}
                        errorMsg={errors?.userName?.message}
                        validateStatus={errors?.userName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                </div>
                <div className="form-field-wrapper">
                    <DatePicker
                        style={{
                            width: '290px'
                        }}
                        showTime={true}
                        allowClear={false}
                        // locale={locale[lang]}
                        onChange={(date) => {
                            setStartTime(date);
                        }}
                        // value={startTime}
                        disabledDate={(current) => {
                            if (!current) {
                                return;
                            }
                            let customDate = moment().format('x');

                            let selected = current.format('x');

                            return selected < customDate;
                        }}
                        disabledTime={(current) => {
                            // let now = moment().format("x");
                            if (!current) {
                                return;
                            }
                            let customDate = moment().format('x');
                            let selected = current.format('x');

                            return selected < customDate;
                        }}
                        defaultValue={startTime}
                        format={'MMMM Do YYYY, h:mm a'}
                    // onOk={'sd'}
                    />
                </div>
                ---------------------------------------- audience ----------------------------------------------------------------

                <p>locations</p>
                <Select
                    key={'locations'}
                    mode="multiple"
                    style={{
                        width: '100%'
                    }}
                    name="locations"
                    placeholder={'locations'}
                    options={optionsLocations}
                    allowClear={true}
                    showSearch={true}
                    filterOption={false}
                    onSelect={(value, test) => {
                        if (test.type === 'city') {
                            setSelectedCities(prev => [...prev, { key: value }])

                        }
                        if (test.type === "country") {
                            setSelectedCountries(prev => [...prev, value])

                        }
                        setSelectedLocations([...selectedLocations, { id: test.value, name: test.label }])
                    }}
                    onClear={async () => {

                        setSearchLocations("")
                    }}

                    onChange={(value, test) => {




                        const newSelectedCities = selectedCities.filter(element => {
                            if (value.includes(element.key)) {
                                return element;
                            }
                            return;
                        })
                        setSelectedCities([...newSelectedCities])



                        const newSelectedCountries = selectedCountries.filter(element => {
                            if (value.includes(element)) {
                                return element;
                            }
                            return;
                        })
                        setSelectedCountries([...newSelectedCountries])



                    }}
                    // searchValue={search}
                    onSearch={(value) => {
                        setSearchLocations(value);
                    }}
                    size="large"
                    label={<p className="select-option-label">{'locations'}</p>}
                    className="add-Category-form"
                />

                <p>interests</p>
                <Select

                    mode="multiple"
                    style={{
                        width: '100%'
                    }}
                    name="interests"
                    placeholder={'interests'}
                    options={options}
                    allowClear={true}
                    showSearch={true}
                    filterOption={false}
                    onSelect={(value, test) => {
                        console.log({ value, test })
                        // const selectedOption = options.find(option => option.id === value)
                        setSelected([...selected, { id: test.value, name: test.label }])
                    }}
                    onClear={async () => {
                        // console.log({value2:value})
                    }}

                    onChange={(value) => {
                        const newSelected = selected.filter(element => {
                            if (value.includes(element.id)) {
                                return element;
                            }
                            return;
                        })
                        console.log({ newSelected })
                        setSelected([...newSelected])
                    }}
                    // searchValue={search}
                    onSearch={(value) => {
                        setSearch(value);
                    }}
                    size="large"
                    label={<p className="select-option-label">{'user'}</p>}
                    className="add-Category-form"
                />


                {/* lang selector  */}
                <p>Languages</p>
                <Select

                    mode="multiple"
                    style={{
                        width: '100%'
                    }}
                    name="Languages"
                    placeholder={'Languages'}
                    options={optionsLang}
                    allowClear={true}
                    showSearch={true}
                    filterOption={false}
                    onSelect={(value, test) => {
                        console.log({ value, test })
                        // const selectedOption = options.find(option => option.id === value)
                        setSelectedLang([...selectedLang, { id: test.value, name: test.label }])
                    }}
                    onClear={async () => {
                        // console.log({value2:value})
                        setSearchLang('')

                    }}

                    onChange={(value) => {
                        const newSelected = selectedLang.filter(element => {
                            if (value.includes(element.id)) {
                                return element;
                            }
                            return;
                        })
                        console.log({ newSelected })
                        setSelectedLang([...newSelected])
                    }}
                    // searchValue={search}
                    onSearch={(value) => {
                        setSearchLang(value);
                    }}
                    size="large"
                    label={<p className="select-option-label">{'user'}</p>}
                    className="add-Category-form"
                />

                {/* Gender selector */}
                <p>Gender</p>
                <Select

                    // mode="multiple"
                    style={{
                        width: '100%'
                    }}
                    name="Gender"
                    placeholder={'Gender'}
                    options={[
                        { value: 1, label: 'men' },
                        { value: 2, label: 'women' },
                        // { value: 3, label: 'all' },
                    ]}
                    allowClear={true}
                    // showSearch={true}
                    filterOption={false}
                    onSelect={(value, test) => {
                        console.log({ value, test })
                        // const selectedOption = options.find(option => option.id === value)

                        setSelectedGender(value)


                    }}
                    onClear={async () => {
                        // console.log({value2:value})
                        // setSearchLang('')
                        setSelectedGender()
                    }}

                    // onChange={(value) => {
                    //     const newSelected = selectedLang.filter(element => {
                    //         if (value.includes(element.id)) {
                    //             return element;
                    //         }
                    //         return;
                    //     })
                    //     console.log({ newSelected })
                    //     setSelectedLang([...newSelected])
                    // }}
                    // searchValue={search}

                    size="large"
                    label={<p className="select-option-label">{'Gender'}</p>}
                    className="add-Category-form"
                />

                ---------------------------------------- placment ----------------------------------------------------------------

                <div className="form-field-wrapper">
                    <AntdTextField
                        name="Placment"
                        type="text"
                        placeholder={'placment'}
                        label={'Placment'}
                        disabled={true}
                        errorMsg={errors?.userName?.message}
                        validateStatus={errors?.userName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                </div>
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="Devices"
                        type="text"
                        placeholder={'Devices'}
                        label={'Devices'}
                        disabled={true}
                        errorMsg={errors?.userName?.message}
                        validateStatus={errors?.userName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                </div>
                <div className="form-field-wrapper">
                    <AntdTextField
                        name="Platforms"
                        type="text"
                        placeholder={'Platforms'}
                        label={'Platforms'}
                        disabled={true}
                        errorMsg={errors?.userName?.message}
                        validateStatus={errors?.userName ? 'error' : ''}
                        // prefix={<EditOutlined />}
                        control={control}
                    />
                </div>

                <p>Asset Customisation</p>
                <Select
                    key={'Asset'}
                    mode="multiple"
                    style={{
                        width: '100%'
                    }}
                    name="Asset"
                    placeholder={'Asset'}
                    options={assestOptions}
                    allowClear={true}
                    showSearch={true}
                    filterOption={false}
                    onSelect={(value, test) => {
                        if(value === 1){ // feed
                            setAsset(prev => [...prev,'feed'])
                            // setInstagram(prev => [...prev,'feed'])
                        } else if (value === 2){
                            setAsset(prev => [...prev,'feed'])
                            // setInstagram(prev => [...prev,'story'])
                        }
                    }}
                    onClear={async () => {

                        // setSearchLocations("")
                    }}

                    onChange={(value, test) => {






                        const newSelectedAssets = asset.filter(element => {
                            if (value.includes(element)) {
                                return element;
                            }
                            return;
                        })
                        setAsset([...newSelectedAssets])



                    }}
                    // searchValue={search}
                    onSearch={(value) => {
                        setSearchLocations(value);
                    }}
                    size="large"
                    label={<p className="select-option-label">{'locations'}</p>}
                    className="add-Category-form"
                />

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

export default AdAdsetModal