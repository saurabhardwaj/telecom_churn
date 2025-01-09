"use client";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getImageId } from '@/app/api/service/image.service';
import { message, Spin } from 'antd';

const PersonalInformation = (props: { isNextClicked: boolean, personalDetails: any, setPersonalDetails: any }, ref: React.Ref<unknown> | undefined) => {

    const [errors , setErrors] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        ficoScore: '',
        totalProjects: '',
        totalProjectsLastYear: '',
        emailId: '',
        phoneNumber: '',
        profilePicture: null as File | null | string,
    });

    const [file , setFile] = useState<any>();
    const [fileLoader, setFileLoader] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const { name, value } = event.target;
        props.setPersonalDetails((prevState: any) => ({
          ...prevState,
          personalInformation: {
            ...prevState.personalInformation,
            [name]: value,
          }
        }));
      };

      const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if(files){
          setFileLoader(true);
          const res = await getImageId(files[0]);
          setFile(files[0]);
          props.setPersonalDetails((prevState: any) => ({
            ...prevState,
            personalInformation: {
              ...prevState.personalInformation,
              [name]: res._id,
            }
          }));
          setFileLoader(false);
        }
      };

      // const handleDeleteFile = () => {
      //   setFile('');
      // }

      const validateForm = () => {
        const newErrors = {
          firstName: '',
            lastName: '',
            companyName: '',
            ficoScore: '',
            totalProjects: '',
            totalProjectsLastYear: '',
            emailId: '',
            phoneNumber: '',
            profilePicture: null as File | null | string,
        };
    
        if (!props.personalDetails.personalInformation.firstName) {
            newErrors.firstName = 'First name is required.';
        }
    
        if (!props.personalDetails.personalInformation.lastName) {
            newErrors.lastName = 'Last name is required.';
        } 

        if (!props.personalDetails.personalInformation.companyName) {
            newErrors.companyName = 'Company name is required.';
        }

        if (props.personalDetails.personalInformation.ficoScore < 0 || !props.personalDetails.personalInformation.ficoScore ) {
            newErrors.ficoScore = 'FICO score is required.';
        }

        if (props.personalDetails.personalInformation.totalProjects < 0 || !props.personalDetails.personalInformation.totalProjects) {
            newErrors.totalProjects = 'Total projects is required.';
        }

        if (props.personalDetails.personalInformation.totalProjectsLastYear < 0 || !props.personalDetails.personalInformation.totalProjectsLastYear) {
            newErrors.totalProjectsLastYear = 'Total projects last year is required.';
        }

        if (!props.personalDetails.personalInformation.emailId) {
            newErrors.emailId = 'Email is required.';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(props.personalDetails.personalInformation.emailId)) {
            newErrors.emailId = 'Email is invalid.';
            message.error('Email is invalid.');
        }

        if (!props.personalDetails.personalInformation.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required.';
        } else if (!/^\d{10}$/i.test(props.personalDetails.personalInformation.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number is invalid.';
            message.error('Phone number is invalid.');
        }

        if (!props.personalDetails.personalInformation.profilePicture) {
            newErrors.profilePicture = 'Profile picture is required.';
        }
    
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '' || error === null);
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
       marginBottom: '6px',
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
        padding : '12px',
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
        <div>
          <form className="max-w-full mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  style={props.isNextClicked && errors.firstName ? errorInputStyle : inputStyle}
                  className='input-style'
                  type="text"
                  name="firstName"
                  value={props.personalDetails.personalInformation.firstName}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, firstName: "" });
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input 
                  style={props.isNextClicked && errors.lastName ? errorInputStyle : inputStyle} 
                  className='input-style'
                  type="text" name="lastName" 
                  value={props.personalDetails.personalInformation.lastName} 
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, lastName: "" });
                  }} />
              </div>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input
                  style={props.isNextClicked && errors.companyName ? errorInputStyle : inputStyle}
                  className='input-style'
                  type="text"
                  name="companyName"
                  value={props.personalDetails.personalInformation.companyName}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, companyName: "" });
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>FICO Score</label>
                <input
                  style={props.isNextClicked && errors.ficoScore ? errorInputStyle : inputStyle}
                  className='input-style'
                  type="text"
                  name="ficoScore"
                  value={props.personalDetails.personalInformation.ficoScore}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, ficoScore: "" });
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Total Projects Completed</label>
                <input
                  style={props.isNextClicked && errors.totalProjects ? errorInputStyle : inputStyle}
                  className='input-style'
                  type="text"
                  name="totalProjects"
                  value={props.personalDetails.personalInformation.totalProjects}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, totalProjects: "" });
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Projects Completed Last Year</label>
                <input
                  style={props.isNextClicked && errors.totalProjectsLastYear ? errorInputStyle : inputStyle}
                  className='input-style'
                  type="text"
                  name="totalProjectsLastYear"
                  value={props.personalDetails.personalInformation.totalProjectsLastYear}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, totalProjectsLastYear: "" });
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <label style={labelStyle}>Description</label>
              <textarea 
                className='input-style py-3'
                style={inputTextStyle} name="descriptions" value={props.personalDetails.personalInformation.descriptions} onChange={handleInputChange} rows={4} />
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Email Id</label>
                <input 
                  className='input-style'
                  style={props.isNextClicked && errors.emailId ? errorInputStyle : inputStyle} 
                  type="email" 
                  name="emailId" 
                  value={props.personalDetails.personalInformation.emailId} 
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, emailId: "" });
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  style={props.isNextClicked && errors.phoneNumber ? errorInputStyle : inputStyle}
                  className='input-style'
                  type="tel"
                  name="phoneNumber"
                  value={props.personalDetails.personalInformation.phoneNumber}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, phoneNumber: "" });
                  }}
                />
              </div>
            </div>
            <div className="mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Profile Picture</label>

                {props.personalDetails.personalInformation.profilePicture && props.personalDetails.personalInformation.profilePicture.contentType ? (
                  <div className="flex items-center space-x-4 w-full justify-between mt-4">
                    <div className='w-[159px] h-[108px] p-2 border border-[#7f808570]'>
                      <img className='h-[90px] w-[141px] rounded-[5px] object-contain' src={`data:${props.personalDetails.personalInformation.profilePicture.contentType};base64,${props.personalDetails.personalInformation.profilePicture.data}`} />
                    </div>
                  </div>
                ) : (fileLoader ? (
                  <div className='w-[159px] h-[108px] p-2 border border-[#7f808570] flex justify-center items-center'>
                    <Spin ></Spin>
                  </div>
                ): file ? (
                  <div className='w-[159px] h-[108px] p-2 border border-[#7f808570]'>
                    <img className='h-[90px] w-[141px] rounded-[5px] object-contain' src={URL.createObjectURL(file)} />
                  </div>
                ):(
                  <div className={`relative w-[159px] h-[108px] border ${props.isNextClicked && errors.profilePicture ? 'border-red-500' : 'border-gray-300'}  flex items-center justify-center rounded-[5px]`}>
                  <input 
                    type="file" 
                    name="profilePicture" 
                    className="absolute w-full h-full opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      handleFileChange(e);
                      setErrors({ ...errors, profilePicture: null });
                    }}
                  />
                  <span className="text-[#00000070] text-[24px]">Upload</span>
                </div>
                )
          
                )}
              </div>
            </div>
          </form>
        </div>
      </>
    );
}

export default forwardRef(PersonalInformation);