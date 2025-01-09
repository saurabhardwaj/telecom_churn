"use client";
import React, { useImperativeHandle, useState } from 'react';

const BorrowerInformation = (props: { isNextClicked: boolean, propertyDetails: any, setPropertyDetails: any }, ref: React.Ref<unknown> | undefined) =>  {

    const [errors, setErrors] = useState({
        name: '',
        ficoScore: '',
        liens: '',
    });

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    const onChangeValue = (key: string, value: string | number | boolean) => {
        props.setPropertyDetails((prevState: any) => ({
            ...prevState,
            borrowerInformation: {
                ...prevState.borrowerInformation,
                [key]: value,
            },
        }));
    }

    const validateForm = () => {
        const newErrors = {
            name: '',
            ficoScore: '',
            liens: '',
        };

        if (!props.propertyDetails.borrowerInformation.fullName) { 
            newErrors.name = 'Name is required.';
        }

        if (props.propertyDetails.borrowerInformation.fullName.length < 5) { 
            newErrors.name = 'Name must be at least 5 characters.';
        }

        if (props.propertyDetails.borrowerInformation.ficoScore < 0) {
            newErrors.ficoScore = 'FICO score is required.';
        }

        if (props.propertyDetails.borrowerInformation.flipCompleteCount === '') {
            newErrors.liens = 'Please select an option for how many flips have you completed in the last year.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = () => {
        if (validateForm()) {
            return true;
        }else{
            return false;
        }
    };

    const labelStyle = {
        fontSize: '16px',
        lineHeight: 'normal',
        fontWeight: '400',
        display: 'block',
        color: '#083c6d',
       };

    return (
        <>
            <div className='w-[660px] h-fit'>
                <div className='text-[#374153] font-bold text-[18px] leading-normal'>Tell us a bit about yourself!</div>

                <div className='mt-4'>
                    <form>
                        <div className='flex flex-col'>
                            <label style={labelStyle}>
                                1.  What is your full name?
                            </label>
                            <input
                                type="text"
                                name='name'
                                value={props.propertyDetails.borrowerInformation.fullName}
                                onChange={(e) => {onChangeValue('fullName', e.target.value); setErrors({...errors, name: ''})}}
                                placeholder="enter your full name"
                                className={`w-[361px] h-[47px] mt-[12px] border ${errors.name ? 'border-red-500' : 'border-[#00000033]'} rounded-lg py-1 px-6  placeholder:text-[#0000005e] placeholder:-text-[22px] focus:outline-none text-[#090848] font-normal  `}
                            />
                        </div>

                        <div className='mt-[24px] flex flex-col'>
                            <label style={labelStyle}>
                                2.  What’s your current FICO score?
                            </label>
                            <input
                                type="text"
                                value={props.propertyDetails.borrowerInformation.ficoScore}
                                onChange={(e) => {
                                    if(Number(e.target.value) >= 0 && Number(e.target.value) <= 900) {
                                        onChangeValue('ficoScore', e.target.value);
                                        setErrors({...errors, ficoScore: ''})
                                    } else {
                                        e.target.value = "";
                                    }
                                }}
                                placeholder="enter your fico score"
                                className={`w-[361px] mt-[12px] h-[47px] border ${errors.ficoScore ? 'border-red-500' : 'border-[#00000033]'} rounded-lg py-1 px-6  placeholder:text-[#0000005e] placeholder:-text-[22px] focus:outline-none text-[#090848] font-normal `}
                            />
                        </div>

                        <div className='mt-[24px] flex flex-col'>
                            <label style={labelStyle}>
                               3.  How many flips have you completed in the last year?
                            </label>
                            <div className="flex gap-[42px] mt-[12px]">
                                <div>
                                    <label className="flex items-center custom-radio">
                                        <input
                                            type="radio"
                                            name="liens"
                                            value="none"
                                            checked={props.propertyDetails.borrowerInformation.flipCompleteCount === 'none'}
                                            onChange={() => {onChangeValue('flipCompleteCount', 'none'); setErrors({...errors, liens: ''})}}
                                            className="mr-[18px] w-[40px] h-[31px]"
                                        />
                                        <span className="radio-checkmark"></span>
                                        <span className='pt-1' style={labelStyle}>None</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center custom-radio">
                                        <input
                                            type="radio"
                                            name="liens"
                                            value="lessThanThree"
                                            checked={props.propertyDetails.borrowerInformation.flipCompleteCount === 'lessThanThree'}
                                            onChange={() => {
                                                onChangeValue('flipCompleteCount', 'lessThanThree');
                                                setErrors({...errors, liens: ''})
                                            }}
                                            className="mr-[18px] w-[40px] h-[31px]"
                                        />
                                        <span className="radio-checkmark"></span>
                                        <span className='pt-1' style={labelStyle}>{'< 3'}</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center custom-radio">
                                        <input
                                            type="radio"
                                            name="liens"
                                            value="greaterThanThree"
                                            checked={props.propertyDetails.borrowerInformation.flipCompleteCount === 'greaterThanThree'}
                                            onChange={() => {onChangeValue('flipCompleteCount', 'greaterThanThree'); setErrors({...errors, liens: ''})}}
                                            className="mr-[18px] w-[40px] h-[31px]"
                                        />
                                        <span className="radio-checkmark"></span>
                                        <span className='pt-1' style={labelStyle}>{'3+'}</span>
                                    </label>
                                </div>
                            </div>
                            {errors.liens && props.isNextClicked && <span className="text-red-600 mt-3">{errors.liens}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default React.forwardRef(BorrowerInformation);