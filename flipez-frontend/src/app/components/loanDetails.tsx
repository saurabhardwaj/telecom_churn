"use client";
import { Button, Form, Input, Radio } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
const LoanDetails = (props: { isNextClicked: boolean, propertyDetails: any, setPropertyDetails: any }, ref: React.Ref<unknown> | undefined) => {

    const [hasLiens, setHasLiens] = React.useState<number | null>(null);
    const [loanAmount, setLoanAmount] = useState<number | ''>('');

    const [errors, setErrors] = useState({
        loanAmount: '',
        liens: '',
    });

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    const onChangeValue = (key: string, value: string | number | boolean) => {
        props.setPropertyDetails((prevState: any) => ({
            ...prevState,
            loanDetails: {
                ...prevState.loanDetails,
                [key]: value,
            },
        }));
    }

    const validateForm = () => {
        const newErrors = {
            loanAmount: '',
            liens: '',
        };

        if (!props.propertyDetails.loanDetails.loanAmount) {
            newErrors.loanAmount = 'Loan Amount is required.';
        }
        if (props.propertyDetails.loanDetails.loanPosition === '') {
            newErrors.liens = 'Please select an option for liens or encumbrances.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };


    const handleSubmit = (e: React.FormEvent) => {

        if (validateForm()) {
            return true;
        } else {
            return false;
        }
    };

    const labelStyle = {
        fontSize: '18px',
        lineHeight: 'normal',
        fontWeight: '400',
        display: 'block',
        color: '#083c6d',
        marginTop: '12px',
       };

    return (
        <>
            <div className='w-[660px] h-fit'>
                <div className='text-[#374153] font-bold text-[18px] leading-normal  '>Now, let’s talk about the loan details.</div>

                <div className='mt-4'>
                    <form>
                        <div className='flex flex-col'>
                            <label style={labelStyle}>
                                1.  What is the loan Amount you are looking for?
                            </label>
                            <div className="relative mt-[12px]">
                                <span className="absolute left-6 top-[49%] transform -translate-y-1/2 text-[#0000005e] font-normal text-[18px] leading-normal">
                                    $
                                </span>
                                <input
                                    type="number"
                                    name='loanAmount'
                                    value={props.propertyDetails.loanDetails.loanAmount}
                                    onChange={(e) => {
                                        if(Number(e.target.value) >= 0) {
                                            onChangeValue('loanAmount', e.target.value); 
                                            setErrors({ ...errors, loanAmount: '' }) 
                                        } else {
                                            e.target.value = '';
                                        }
                                        
                                    }}
                                    className={`w-[361px] h-[47px] border ${errors.loanAmount && props.isNextClicked ? 'border-red-600' : 'border-[#00000033]'} rounded-lg py-1 pl-10 pr-6 placeholder-[#0000005e] focus:outline-none text-[#5e5e5e] font-normal`}
                                />
                            </div>
                        </div>
                        <div className='mt-[24px] flex flex-col'>
                            <label style={labelStyle}>
                                2. What type of Loan Position would you offer?
                            </label>
                            <div className="flex gap-[42px] ml-5">
                                <div>
                                    <label className="flex items-center custom-radio">
                                        <input
                                            type="radio"
                                            name="liens"
                                            value="firstLine"
                                            checked={props.propertyDetails.loanDetails.loanPosition === '1st Lien'}
                                            onChange={() => { onChangeValue('loanPosition', '1st Lien'); setErrors({ ...errors, liens: '' }) }}
                                            className="mr-[18px] w-[40px] h-[31px]"
                                        />
                                        <span className="radio-checkmark"></span>
                                        <span style={labelStyle} className='pt-1'>1st Lien</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center custom-radio">
                                        <input
                                            type="radio"
                                            name="liens"
                                            value="secondLine"
                                            checked={props.propertyDetails.loanDetails.loanPosition === '2nd Lien'}
                                            onChange={() => { onChangeValue('loanPosition', '2nd Lien'); setErrors({ ...errors, liens: '' }) }}
                                            className="mr-[18px] w-[40px] h-[31px]"
                                        />
                                        <span className="radio-checkmark"></span>
                                        <span style={labelStyle} className='pt-1'>2nd Lien</span>
                                    </label>
                                </div>
                            </div>
                            {errors.liens && props.isNextClicked && <span className="text-red-600 mt-2">{errors.liens}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default React.forwardRef(LoanDetails)