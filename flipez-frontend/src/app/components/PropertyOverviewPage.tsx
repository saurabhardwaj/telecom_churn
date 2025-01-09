"use client";
import { AutoComplete, Button, Form, Input, Radio, Select, Spin } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getAddress, getAddressPrice } from '../api/service/property-overview.service';

const PropertyOverviewPage = (props: { isNextClicked: boolean, propertyDetails: any, setPropertyDetails: any }, ref: React.Ref<unknown> | undefined) => {

    const [errors, setErrors] = useState({
        address: '',
        purchasePrice: '',
        liens: '',
    });

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));


    const onChangeValue = (key : string, value : string | number | boolean) => {
        props.setPropertyDetails((prevState: any) => ({
            ...prevState,
            propertyOverview: {
              ...prevState.propertyOverview,
              [key]: value, 
            },
          }));
    }

    const validateForm = () => {
        const newErrors = {
            address: '',
            purchasePrice: '',
            liens: '',
        };

        if (!props.propertyDetails.propertyOverview.address) {
            newErrors.address = 'Address is required.';
        }

        if (!props.propertyDetails.propertyOverview.initialPurchasePrice || props.propertyDetails.propertyOverview.initialPurchasePrice <= 0) {
            newErrors.purchasePrice = 'Purchase price must be a positive number.';
        }

        if (props.propertyDetails.propertyOverview.isHaveLiesOrEncumbrances === '') {
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

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const onSearch = (value: string) => {
     if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); 
    }
  
    timeoutRef.current = setTimeout(async () => {
      setFetching(true); 
      try {
        const response = await getAddress(value);
        const addressOptions = response.data.map((item:any) => ({
          value: item.display,
          label: item.display,
        }));
        setOptions(addressOptions);
      } catch (error) {
        console.error('Error fetching address:', error);
      } finally {
        setFetching(false);
      }
    }, 1000);
    };

    const handleSelectChange = (value: any) => {
      const label = value;
      props.setPropertyDetails((prevState: any) => ({
        ...prevState,
        propertyOverview: {
          ...prevState.propertyOverview,
          address: label, 
        },
      }))
    };

    const getPrice = async (address : string) => {
      const res:any = await getAddressPrice({address: address});
      if (res && res.price) {
        onChangeValue("initialPurchasePrice", parseFloat(res.price));
      }
    };


     const labelStyle = {
      fontSize: '16px',
      lineHeight: 'normal',
      fontWeight: '400',
      display: 'block',
      color: '#083c6d',
     };

     const inputStyle = {
       fontSize: '14px',
       lineHeight: 'normal',
       fontWeight: '400',
       border: '1px solid #7f808570',
       height: '31px',
       borderRadius: '5px',
       padding : '0px 12px 0px 12px',
       width: '100%',
       color: '#5e5e5e',
     }

     const inputTextStyle ={
       fontSize: '14px',
       lineHeight: 'normal',
       fontWeight: '400',
       border: '1px solid #7f808570',
       borderRadius: '5px',
       padding : '0px 12px 0px 12px',
       width: '100%',
       height: '53px',
       outline: 'none',
       color: '#5e5e5e',
     }

     const errorInputStyle = {
       border: '1px solid red',
       fontSize: '14px',
       lineHeight: 'normal',
       fontWeight: '400',
       height: '31px',
       borderRadius: '5px',
       padding : '0px 12px 0px 12px',
       width: '100%',
       color: '#5e5e5e'
     }

    return (
      <>
        <div className="w-[660px] h-fit">
          <div className="text-[#374153] font-bold text-[18px] leading-normal  ">Lets get some basic details about the property?</div>

          <div className="mt-4">
            <form>
              <div className="flex flex-col">
                <label style={labelStyle}>1. What's the property address?</label>
                  <Select
                    filterOption={false}
                    value={props.propertyDetails.propertyOverview.address}
                    onSearch={onSearch}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    options={options} 
                    onChange={(e) => {
                      handleSelectChange(e);
                      getPrice(e);
                    }}
                    showSearch
                    placeholder="Search Address"
                    className={`${errors.address && props.isNextClicked ? "border-red-600 searchAddress" : "searchAddress"} mt-[12px] placeholder-gray-500 focus:outline-none h-[47px] w-[361px]`}
                  />
              </div>

              <div className="mt-[24px] flex flex-col">
                <label style={labelStyle}>2. Do you know if there are any liens or encumbrances on the property?</label>
                <div className="flex gap-[42px] ml-5 mt-[12px]">
                  <div>
                    <label className="flex items-center custom-radio">
                      <input
                        type="radio"
                        name="liens"
                        value="yes"
                        checked={props.propertyDetails.propertyOverview.isHaveLiesOrEncumbrances === true}
                        onChange={() => {
                          onChangeValue("isHaveLiesOrEncumbrances", true);
                          setErrors({ ...errors, liens: "" });
                        }}
                        className="mr-[18px] w-[40px] h-[31px]"
                      />
                      <span className="radio-checkmark"></span>
                      <span style={labelStyle} className='pt-1'>Yes</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center custom-radio">
                      <input
                        type="radio"
                        name="liens"
                        value="no"
                        checked={props.propertyDetails.propertyOverview.isHaveLiesOrEncumbrances === false}
                        onChange={() => {
                          onChangeValue("isHaveLiesOrEncumbrances", false);
                          setErrors({ ...errors, liens: "" });
                        }}
                        className="mr-[18px] w-[40px] h-[31px]"
                      />
                      <span className="radio-checkmark"></span>
                      <span style={labelStyle} className='pt-1'>No</span>
                    </label>
                  </div>
                </div>
                {errors.liens && props.isNextClicked && <span className="text-red-600 mt-2">{errors.liens}</span>}
              </div>

              <div className="mt-[28px] flex flex-col">
                <label style={labelStyle}>3. What's the initial purchase price?</label>
                <div className="relative mt-[12px]">
                  <span className="absolute left-6 top-[49%] transform -translate-y-1/2 text-[#0000005e] font-normal text-[18px] leading-normal  ">$</span>
                  <input
                    type="number"
                    name="initialPurchasePrice"
                    value={props.propertyDetails.propertyOverview.initialPurchasePrice}
                    onChange={(e) => {
                      if(Number(e.target.value) >= 0) {
                        onChangeValue("initialPurchasePrice", parseFloat(e.target.value));
                        setErrors({ ...errors, purchasePrice: "" });
                      } else {
                        e.target.value = "";
                        setErrors({ ...errors, purchasePrice: "" });
                      }
                    }}
                    className={`w-[361px] h-[47px] border ${
                      errors.purchasePrice && props.isNextClicked ? "border-red-600" : "border-[#00000033]"
                    } rounded-lg py-1 pl-10 pr-6 placeholder-[#0000005e] focus:outline-none text-[#5e5e5e] font-normal  `}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}

export default forwardRef(PropertyOverviewPage);
