"use client";
import { Button, Checkbox, Form, Input, Radio } from 'antd';
import React, { useImperativeHandle, useState } from 'react';

const RehabAssessment = (props: { isNextClicked: boolean, propertyDetails: any, setPropertyDetails: any }, ref: React.Ref<unknown> | undefined) => {

    const formSections = [
        { label: '1. Demolition: tearing down walls, removing fixtures etc'  , propsKey: 'demolitionStatus'},
        { label: '2. Debris removal: dumpster rental, hauling fees for debris etc' , propsKey: 'debrisRemovalStatus' },
        { label: '3. Water damage or mold', propsKey: 'waterDamageStatus' },
        { label: '4. Any foundation issues' , propsKey: 'foundationStatus'},
        { label: '5. Does the roof need replacement' , propsKey: 'roofStatus'},
        { label: '6. Plumbing or electrical updates required' , propsKey: 'electricalStatus'},
        { label: '7. Any HVAC updates required', propsKey: 'hvacUpdateStatus' },
        { label: '8. Will you be adding an extra bed or bath' , propsKey: 'willAddExtraBed' },
    ];

    const options = ['Minor', 'Moderate', 'Extensive'];
    const lastOptions = ['Yes', 'No'];
    const [selectedValues, setSelectedValues] = useState<{ [key: number]: string }>({});

    const handleRadioChange = (key : string, value : string | number | boolean) => {
    //     const key = formSections[sectionIndex].propsKey;
    //   setSelectedValues((prev) => ({
    //     ...prev,
    //     [key]: value,
    //   }));

      props.setPropertyDetails((prevState: any) => ({
        ...prevState,
        rehabAssessment: {
          ...prevState.rehabAssessment,
          [key]: value, 
        },
      }));
    };

    type RehabAssessmentKeys = "demolitionStatus" | "debrisRemovalStatus" | "waterDamageStatus" | "foundationStatus" | "roofStatus" | "electricalStatus" | "hvacUpdateStatus" | "willAddExtraBed"

    const [errors , setErrors] = useState({
        demolitionStatus: '',
        debrisRemovalStatus: '',
        waterDamageStatus: '',
        foundationStatus: '',
        roofStatus: '',
        electricalStatus: '',
        hvacUpdateStatus: '',
        willAddExtraBed: '',
    });

    const validateForm = () => {
        const newErrors = {
          demolitionStatus: '',
          debrisRemovalStatus: '',
          waterDamageStatus: '',
          foundationStatus: '',
          roofStatus: '',
          electricalStatus: '',
          hvacUpdateStatus: '',
          willAddExtraBed: '',
        };
      
        if (!props.propertyDetails.rehabAssessment.demolitionStatus) {
          newErrors.demolitionStatus = 'Please specify the status of demolition work.';
        }
      
        if (!props.propertyDetails.rehabAssessment.debrisRemovalStatus) {
          newErrors.debrisRemovalStatus = 'Please specify if debris removal is required.';
        }
      
        if (!props.propertyDetails.rehabAssessment.waterDamageStatus) {
          newErrors.waterDamageStatus = 'Please indicate if there is any water damage or mold.';
        }
      
        if (!props.propertyDetails.rehabAssessment.foundationStatus) {
          newErrors.foundationStatus = 'Please specify the status of foundation issues.';
        }
      
        if (!props.propertyDetails.rehabAssessment.roofStatus) {
          newErrors.roofStatus = 'Please indicate if roof replacement is needed.';
        }
      
        if (!props.propertyDetails.rehabAssessment.electricalStatus) {
          newErrors.electricalStatus = 'Please specify if plumbing or electrical updates are required.';
        }
      
        if (!props.propertyDetails.rehabAssessment.hvacUpdateStatus) {
          newErrors.hvacUpdateStatus = 'Please specify if any HVAC updates are required.';
        }
      
        if (!props.propertyDetails.rehabAssessment.willAddExtraBed) {
          newErrors.willAddExtraBed = 'Please indicate if you plan to add an extra bed or bath.';
        }
        
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
      };
      

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        if (validateForm()) {
            return true;
        } else {
            return false;
        }
    };

    const labelStyle = {
      fontSize: '16px',
      lineHeight: 'normal',
      fontWeight: '400',
      display: 'block',
      color: '#083c6d',
      marginBottom: '6px',
     };
    

    return (
        <>
            <div className='w-[660px] h-fit'>
                <div className='w-[580px] text-[#374153] font-bold text-[18px] leading-normal'>Let’s review the rehab needs for this property.</div>

                <div className='mt-4 max-w-[686px] w-[80%]'>

                    <hr className="w-full border border-[#0A1E37] h-[2.5px] bg-[#0A1E37] " />

                    <form
                        className="mt-[10px] w-full h-fit bg-[#FFFFFF] pt-[12px] pb-[40px] pl-[31px] pr-[31px]"
                        style={{ boxShadow: '0px 0px 21.9px 0px rgba(0, 0, 0, 0.16)' }}
                    >
                        {formSections.map((section, index) => (
                            <div className="flex flex-col mt-[20px]" key={index}>
                                <label style={labelStyle}>{section.label}?</label>
                                <div className={`flex ${index == 7 ? 'gap-[41px]' : 'gap-[25px]'} ml-[20px]`}>
                                    {(index == 7 ? lastOptions : options).map((option) => (
                                        <Checkbox
                                            key={option}
                                            className="custom-checkbox"
                                            value={option} checked={props.propertyDetails.rehabAssessment[formSections[index].propsKey] == option} 
                                            onChange={() => {handleRadioChange(formSections[index].propsKey, option);
                                                setErrors((prevErrors) => ({
                                                    ...prevErrors,
                                                    [formSections[index].propsKey]: ''
                                                  }));
                                            }}
                                        >
                                            <span className="text-[#5e5e5e] text-sm ">{option}</span>
                                        </Checkbox>
                                    ))}
                                </div>

                                {errors[formSections[index].propsKey as RehabAssessmentKeys] && (
                                    <div className="text-[#FF0000] text-xs ml-5 mt-1 mb-[-16px] ">{errors[formSections[index].propsKey as RehabAssessmentKeys]}</div>
                                )}
                            </div>
                        ))}
                    </form>

                </div>
            </div>
        </>
    )
}

export default React.forwardRef(RehabAssessment);