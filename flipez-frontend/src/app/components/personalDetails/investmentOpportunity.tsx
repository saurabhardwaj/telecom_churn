"use client";
import { getImageId } from "@/app/api/service/image.service";
import { Select, Spin } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const InvestmentOpportunity = (
  props: {
    isNextClicked: boolean;
    personalDetails: any;
    setPersonalDetails: any;
  },
  ref: React.Ref<unknown> | undefined
) => {
  const [errors, setErrors] = useState({
    propertyAddress: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    purchasePrice: "",
    contribution: "",
    estARV: "",
    totalCost: "",
    loanAmount: "",
    loanToValue: "",
    loanTermYear: "",
    loanTermMonth: "",
    loanType: "",
    loanPurpose: "",
    loanPosition: "",
    loanToARV: "",
    propertyPhoto: null as File | null | string,
    // kitchenImage: null as File | null | string,
    // bathRoomImage: null as File | null | string,
    // bedRoomImage: null as File | null | string,
  });

  const [kitchenImage, setKitchenImage] = useState<any>();
  const [bathRoomImage, setBathRoomImage] = useState<any>();
  const [bedRoomImage, setBedRoomImage] = useState<any>();

  const labelStyle = {
    fontSize: "16px",
    lineHeight: "normal",
    fontWeight: "400",
    display: "block",
    marginBottom: "6px",
    color: "#083c6d",
  };

  const inputStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 12px",
    width: "100%",
    color: "#5e5e5e",
  };

  const prefixInputStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 28px",
    width: "100%",
    color: "#5e5e5e",
  };

  const uploadBtnStyle = {
    border: "1px solid #0C1D35",
    borderRadius: "6px",
    padding: "0px 12px 0px 12px",
    width: "69px",
    height: "22px",
    backgroundColor: "#0C1D35",
    color: "white",
    fontSize: "12px",
    lineHeight: "normal",
  };

  const yearTermInputStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 56px",
    width: "100%",
    color: "#5e5e5e",
  };

  const monthTermInputStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 72px",
    width: "100%",
    color: "#5e5e5e",
  };

  const errorInputStyle = {
    border: "1px solid red",
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 12px",
    width: "100%",
    color: "#5e5e5e",
  };

  const errorYearInputStyle = {
    border: "1px solid red",
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 56px",
    width: "100%",
    color: "#5e5e5e",
  };

  const errorMonthInputStyle = {
    border: "1px solid red",
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 72px",
    width: "100%",
    color: "#5e5e5e",
  };

  const errorPrefixInputStyle = {
    border: "1px solid red",
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 28px",
    width: "100%",
    color: "#5e5e5e",
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ) => {
    let { value } : any = event.target;
    const { name } : any = event.target;
    if(type === "number") {
      value = Number(value);
    };
    props.setPersonalDetails((prevState: any) => ({
      ...prevState,
      investmentOpportunity: {
        ...prevState.investmentOpportunity,
        [name]: value,
      },
    }));
  };

  const loanTypeOptions = [
    { value: "Fixed-Rate", label: "Fixed-Rate" },
    { value: "Adjustable-Rate", label: "Adjustable-Rate" },
  ];

  const loanPurposeOptions = [
    { value: "Flip & Fix", label: "Flip & Fix" },
    { value: "Bridge", label: "Bridge" },
    { value: "New construction", label: "New construction" },
    { value: "Long Term", label: "Long Term" },
  ];

      const [fileLoader, setFileLoader] = useState({
        kitchenImage: false,
        bathRoomImage: false,
        bedRoomImage: false,
      });
  

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = event.target;
    if (files) {
      setFileLoader((prevState) => ({
        ...prevState,
        [name]: true,
      }))
      const res = await getImageId(files[0]);
      if (name === "kitchenImage") setKitchenImage(files[0]);
      if (name === "bathRoomImage") setBathRoomImage(files[0]);
      if (name === "bedRoomImage") setBedRoomImage(files[0]);
      props.setPersonalDetails((prevState: any) => ({
        ...prevState,
        investmentOpportunity: {
          ...prevState.investmentOpportunity,
          [name]: res._id,
        },
      }));
      setFileLoader((prevState) => ({
        ...prevState,
        [name]: true,
      }))
    }
  };

  const validateForm = () => {
    const newErrors = {
      propertyAddress: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      purchasePrice: "",
      contribution: "",
      estARV: "",
      totalCost: "",
      loanAmount: "",
      loanToValue: "",
      loanTermYear: "",
      loanTermMonth: "",
      loanType: "",
      loanPurpose: "",
      loanPosition: "",
      loanToARV: "",
      propertyPhoto: null as File | null | string,
      // kitchenImage: null as File | null | string,
      // bathRoomImage: null as File | null | string,
      // bedRoomImage: null as File | null | string,
    };
    if (!props.personalDetails.investmentOpportunity.propertyAddress) {
      newErrors.propertyAddress = "Property Address is required";
    }
    if (!props.personalDetails.investmentOpportunity.bedrooms) {
      newErrors.bedrooms = "Bedrooms is required";
    }
    if (!props.personalDetails.investmentOpportunity.bathrooms) {
      newErrors.bathrooms = "Bathrooms is required";
    }
    if (!props.personalDetails.investmentOpportunity.area) {
      newErrors.area = "Area is required";
    }
    if (!props.personalDetails.investmentOpportunity.purchasePrice) {
      newErrors.purchasePrice = "Purchase Price is required";
    }
    if (!props.personalDetails.investmentOpportunity.contribution) {
      newErrors.contribution = "Contribution is required";
    }
    if (!props.personalDetails.investmentOpportunity.estARV) {
      newErrors.estARV = "Estimated ARV is required";
    }
    if (!props.personalDetails.investmentOpportunity.loanAmount) {
      newErrors.loanAmount = "Loan Amount is required";
    }
    if (!props.personalDetails.investmentOpportunity.totalCost) {
      newErrors.totalCost = "Total Cost is required";
    }
    if (!props.personalDetails.investmentOpportunity.loanToValue) {
      newErrors.loanToValue = "Loan To Value is required";
    }
    if (
      !props.personalDetails.investmentOpportunity.loanTermYear &&
      !props.personalDetails.investmentOpportunity.loanTermMonth
    ) {
      newErrors.loanTermYear = "Loan Term is required";
      newErrors.loanTermMonth = "Loan Term is required";
    }
    if (!props.personalDetails.investmentOpportunity.loanType) {
      newErrors.loanType = "Loan Type is required";
    }
    if (!props.personalDetails.investmentOpportunity.loanPurpose) {
      newErrors.loanPurpose = "Loan Purpose is required";
    }
    if (!props.personalDetails.investmentOpportunity.loanPosition) {
      newErrors.loanPosition = "Loan Position is required";
    }
    if (!props.personalDetails.investmentOpportunity.loanToARV) {
      newErrors.loanToARV = "Loan To ARV is required";
    }
    // if (!props.personalDetails.investmentOpportunity.kitchenImage) {
    //   newErrors.kitchenImage = "Kitchen Image is required";
    // }
    // if (!props.personalDetails.investmentOpportunity.bathRoomImage) {
    //   newErrors.bathRoomImage = "Bath Room Image is required";
    // }
    // if (!props.personalDetails.investmentOpportunity.bedRoomImage) {
    //   newErrors.bedRoomImage = "Bed Room Image is required";
    // }
    setErrors(newErrors);
    return Object.values(newErrors).every(
      (value) => value === "" || value === null
    );
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

  useEffect(() => {
    props.setPersonalDetails((prevState: any) => ({
      ...prevState,
      investmentOpportunity: {
        ...prevState.investmentOpportunity,
        loanToARV: Number(
          ((props.personalDetails.investmentOpportunity.loanAmount / props.personalDetails.investmentOpportunity.estARV) * 100).toFixed(0)
        ),
        loanToValue: ((Number(props.personalDetails.investmentOpportunity.loanAmount) / Number(props.personalDetails.investmentOpportunity
          .totalCost)) * 100).toFixed(0),
      },
    }));
  }, [props.personalDetails.investmentOpportunity.loanAmount])

  return (
    <>
      <div>
        <form className="max-w-full mx-auto p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4">
            <div>
              <label style={labelStyle}>Property Address</label>
              <input
                style={
                  props.isNextClicked && errors.propertyAddress
                    ? errorInputStyle
                    : inputStyle
                }
                className="input-style"
                type="text"
                name="propertyAddress"
                value={
                  props.personalDetails.investmentOpportunity.propertyAddress
                }
                disabled={!!props.personalDetails.investmentOpportunity.propertyAddress}
                onChange={(e) => {
                  handleInputChange(e, 'string');
                  setErrors({ ...errors, propertyAddress: "" });
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Bedrooms</label>
              <input
                style={
                  props.isNextClicked && errors.bedrooms
                    ? errorInputStyle
                    : inputStyle
                }
                className="input-style"
                type="text"
                name="bedrooms"
                value={props.personalDetails.investmentOpportunity.bedrooms}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleInputChange(e, 'number');
                    setErrors({ ...errors, bedrooms: "" });
                  }
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Bathrooms</label>
              <input
                style={
                  props.isNextClicked && errors.bathrooms
                    ? errorInputStyle
                    : inputStyle
                }
                className="input-style"
                type="text"
                name="bathrooms"
                value={props.personalDetails.investmentOpportunity.bathrooms}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleInputChange(e, 'number');
                    setErrors({ ...errors, bathrooms: "" });
                  }
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Area</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                 style={{
                  paddingRight: '40px !important',
                  ...(props.isNextClicked && errors.area ? errorInputStyle : inputStyle),
                }}
                  className="input-style"
                  type="text"
                  name="area"
                  value={props.personalDetails.investmentOpportunity.area}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      setErrors({ ...errors, area: "" });
                    }
                  }}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">sq ft</span>
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Purchase Price</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  style={
                    props.isNextClicked && errors.purchasePrice
                      ? errorPrefixInputStyle
                      : prefixInputStyle
                  }
                  className="input-style"
                  type="text"
                  name="purchasePrice"
                  disabled={!!props.personalDetails.investmentOpportunity.purchasePrice}
                  value={
                    props.personalDetails.investmentOpportunity.purchasePrice
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      setErrors({ ...errors, purchasePrice: "" });
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Contribution</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  style={
                    props.isNextClicked && errors.contribution
                      ? errorPrefixInputStyle
                      : prefixInputStyle
                  }
                  className="input-style"
                  type="text"
                  name="contribution"
                  value={
                    props.personalDetails.investmentOpportunity.contribution
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      props.setPersonalDetails((prevState: any) => ({
                        ...prevState,
                        investmentOpportunity: {
                          ...prevState.investmentOpportunity,
                          loanAmount:
                            props.personalDetails.investmentOpportunity
                              .totalCost - Number(value),
                        },
                      }));
                      setErrors({ ...errors, contribution: "" });
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Est. ARV</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  style={
                    props.isNextClicked && errors.estARV
                      ? errorPrefixInputStyle
                      : prefixInputStyle
                  }
                  className="input-style"
                  type="text"
                  name="estARV"
                  value={props.personalDetails.investmentOpportunity.estARV}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      setErrors({ ...errors, estARV: "" });
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Total Project Cost</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  style={
                    props.isNextClicked && errors.totalCost
                      ? errorPrefixInputStyle
                      : prefixInputStyle
                  }
                  className="input-style"
                  type="text"
                  name="totalCost"
                  disabled={!!props.personalDetails.investmentOpportunity.totalCost}
                  value={props.personalDetails.investmentOpportunity.totalCost}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      setErrors({ ...errors, totalCost: "" });
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Total Rehab Cost</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  style={
                    props.isNextClicked && errors.totalCost
                      ? errorPrefixInputStyle
                      : prefixInputStyle
                  }
                  className="input-style"
                  type="text"
                  name="totalCost"
                  value={props.personalDetails?.rehabAssessment?.totalCost}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Loan Amount</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  style={
                    props.isNextClicked && errors.loanAmount
                      ? errorPrefixInputStyle
                      : prefixInputStyle
                  }
                  className="input-style"
                  type="text"
                  name="loanAmount"
                  value={props.personalDetails.investmentOpportunity.loanAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      setErrors({ ...errors, loanAmount: "" });
                      props.setPersonalDetails((prevState: any) => ({
                        ...prevState,
                        investmentOpportunity: {
                          ...prevState.investmentOpportunity,
                          contribution:
                            props.personalDetails.investmentOpportunity
                              .totalCost - Number(value),
                        },
                      }));
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Loan To Value</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  style={
                    props.isNextClicked && errors.loanToValue
                      ? errorInputStyle
                      : inputStyle
                  }
                  className="input-style"
                  type="text"
                  name="loanToValue"
                  value={
                    props.personalDetails.investmentOpportunity.loanToValue
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e, 'number');
                      setErrors({ ...errors, loanToValue: "" });
                    }
                  }}
                />
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Loan Term</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative  rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-[1px] flex items-center h-[29px] px-2 top-[1px] bg-gray-200 border rounded-l-[5px]">
                    <span className="text-gray-500 sm:text-sm">Year</span>
                  </div>
                  <input
                    style={
                      props.isNextClicked && errors.loanTermYear
                        ? errorYearInputStyle
                        : yearTermInputStyle
                    }
                    className="input-style"
                    type="text"
                    name="loanTermYear"
                    value={
                      props.personalDetails.investmentOpportunity.loanTermYear
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^(?:[1-9]\d{0,3})?$/.test(value) || value === "") {
                        handleInputChange(e, 'string');
                        setErrors({
                          ...errors,
                          loanTermYear: "",
                          loanTermMonth: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="relative  rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-[1px] flex items-center h-[29px] px-2 top-[1px] bg-gray-200 border rounded-l-[5px]">
                    <span className="text-gray-500 sm:text-sm">Month</span>
                  </div>
                  <input
                    style={
                      props.isNextClicked && errors.loanTermMonth
                        ? errorMonthInputStyle
                        : monthTermInputStyle
                    }
                    className="input-style"
                    type="text"
                    name="loanTermMonth"
                    value={
                      props.personalDetails.investmentOpportunity.loanTermMonth
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[1-9]$|^1[0-2]$/.test(value) || value === "") {
                        handleInputChange(e, 'string');
                        setErrors({
                          ...errors,
                          loanTermYear: "",
                          loanTermMonth: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Loan Type</label>
              <Select
                labelInValue
                options={loanTypeOptions}
                value={props.personalDetails.investmentOpportunity.loanType}
                onChange={(value) => {
                  props.setPersonalDetails((prevState: any) => ({
                    ...prevState,
                    investmentOpportunity: {
                      ...prevState.investmentOpportunity,
                      loanType: value.label,
                    },
                  }));
                  setErrors({ ...errors, loanType: "" });
                }}
                placeholder="Select a Loan Type"
                className={`h-[31px] w-full ${
                  errors.loanType ? "commonErrorSelect" : "commonSelect"
                }`}
              />
              {/* <input
                  style={props.isNextClicked && errors.loanType ? errorInputStyle : inputStyle}
                  className="input-style"
                  type="text"
                  name="loanType"
                  value={props.personalDetails.investmentOpportunity.loanType}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, loanType: "" });
                  }}
                /> */}
            </div>
            <div>
              <label style={labelStyle}>Loan Purpose</label>
              <Select
                labelInValue
                options={loanPurposeOptions}
                value={props.personalDetails.investmentOpportunity.loanPurpose}
                onChange={(value) => {
                  props.setPersonalDetails((prevState: any) => ({
                    ...prevState,
                    investmentOpportunity: {
                      ...prevState.investmentOpportunity,
                      loanPurpose: value.label,
                    },
                  }));
                  setErrors({ ...errors, loanPurpose: "" });
                }}
                placeholder="Select a Loan Type"
                className={`h-[31px] w-full ${
                  errors.loanPurpose ? "commonErrorSelect" : "commonSelect"
                }`}
              />
              {/* <input
                  style={props.isNextClicked && errors.loanPurpose ? errorInputStyle : inputStyle}
                  className="input-style"
                  type="text"
                  name="loanPurpose"
                  value={props.personalDetails.investmentOpportunity.loanPurpose}
                  onChange={(e) => {
                    handleInputChange(e);
                    setErrors({ ...errors, loanPurpose: "" });
                  }}
                /> */}
            </div>
            <div>
              <label style={labelStyle}>Loan Position</label>
              <input
                style={
                  props.isNextClicked && errors.loanPosition
                    ? errorInputStyle
                    : inputStyle
                }
                className="input-style"
                type="text"
                name="loanPosition"
                value={props.personalDetails.investmentOpportunity.loanPosition}
                onChange={(e) => {
                  handleInputChange(e, 'string');
                  setErrors({ ...errors, loanPosition: "" });
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Loan To ARV</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  style={
                    props.isNextClicked && errors.loanToARV
                      ? errorInputStyle
                      : inputStyle
                  }
                  className="input-style"
                  type="text"
                  name="loanToARV"
                  value={props.personalDetails.investmentOpportunity.loanToARV}
                  onChange={(e) => {
                    handleInputChange(e, 'number');
                    setErrors({ ...errors, loanToARV: "" });
                  }}
                />
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {props.personalDetails.investmentOpportunity.propertyPhoto ? (
              <div>
                <label style={labelStyle}>Property Photo</label>
                {props.personalDetails.investmentOpportunity.propertyPhoto && (
                  <div className="flex items-center space-x-4 w-full justify-between mt-4">
                    <div className='w-[159px] h-[108px] p-2 border border-[#7f808570]'>
                    <img
                      className='h-[90px] w-[141px] rounded-[5px]'
                      src={
                        props.personalDetails.investmentOpportunity
                          .propertyPhoto
                      }
                    />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div>
              <div>
                <label style={labelStyle}>
                  Current Property Interior Photos
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2 border border-[#7f808570] p-3">
                  <div>
                    {props.personalDetails.investmentOpportunity.kitchenImage &&
                    props.personalDetails.investmentOpportunity.kitchenImage
                      .contentType ? (
                      <>
                        <div style={labelStyle}>Kitchen</div>
                        <div className="max-w-[159px] h-[108px] flex justify-center items-center border border-gray-300 rounded-[5px] mt-2">
                          <img
                            className="w-full h-full"
                            width="159px"
                            height="108px"
                            src={`data:${props.personalDetails.investmentOpportunity.kitchenImage.contentType};base64,${props.personalDetails.investmentOpportunity.kitchenImage.data}`}
                          />
                        </div>
                      </>
                    ) : kitchenImage ? (
                      <>
                        <div style={labelStyle}>Kitchen</div>
                        <div className="max-w-[159px] h-[108px] flex justify-center items-center border border-gray-300 rounded-[5px]">
                          <img
                            className="w-full h-full"
                            width="159px"
                            height="108px"
                            src={URL.createObjectURL(kitchenImage)}
                          />
                        </div>
                      </>
                    ): fileLoader.kitchenImage ? (
                      <div className='max-w-[159px] h-[108px] p-2 border border-[#7f808570] flex justify-center items-center'>
                        <Spin ></Spin>
                      </div>
                    ) : (
                      <div
                        className={`relative max-w-[159px] h-[108px] border ${
                          false
                            ? "border-red-500"
                            : "border-gray-300"
                        }  flex items-center justify-center rounded-[5px]`}
                      >
                        <input
                          type="file"
                          name="kitchenImage"
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                        <div className="flex items-center justify-center flex-col">
                          <div style={labelStyle}>Kitchen</div>
                          <div>
                            <button style={uploadBtnStyle}>Upload</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {props.personalDetails.investmentOpportunity
                      .bathRoomImage &&
                    props.personalDetails.investmentOpportunity.bathRoomImage
                      .contentType ? (
                      <>
                        <div style={labelStyle}>Bathroom</div>
                        <div className="max-w-[159px] h-[108px] flex justify-center items-center border border-gray-300 rounded-[5px] mt-2">
                          <img
                            className="w-full h-full"
                            width="159px"
                            height="108px"
                            src={`data:${props.personalDetails.investmentOpportunity.bathRoomImage.contentType};base64,${props.personalDetails.investmentOpportunity.bathRoomImage.data}`}
                          />
                        </div>
                      </>
                    ) : bathRoomImage ? (
                      <>
                        <div style={labelStyle}>Bathroom</div>
                        <div className="max-w-[159px] h-[108px] flex justify-center items-center border border-gray-300 rounded-[5px]">
                          <img
                            className="w-full h-full"
                            width="159px"
                            height="108px"
                            src={URL.createObjectURL(bathRoomImage)}
                          />
                        </div>
                      </>
                    ) : fileLoader.bathRoomImage ? (
                      <div className='max-w-[159px] h-[108px] p-2 border border-[#7f808570] flex justify-center items-center'>
                        <Spin ></Spin>
                      </div>
                    ) : (
                      <div
                        className={`relative max-w-[159px] h-[108px] border ${
                          false
                            ? "border-red-500"
                            : "border-gray-300"
                        }  flex items-center justify-center rounded-[5px]`}
                      >
                        <input
                          type="file"
                          name="bathRoomImage"
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                        <div className="flex items-center justify-center flex-col">
                          <div style={labelStyle}>Bathroom</div>
                          <div>
                            <button style={uploadBtnStyle}>Upload</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {props.personalDetails.investmentOpportunity.bedRoomImage &&
                    props.personalDetails.investmentOpportunity.bedRoomImage
                      .contentType ? (
                      <>
                        <div style={labelStyle}>Bedroom</div>

                        <div className="max-w-[159px] h-[108px] flex justify-center items-center border border-gray-300 rounded-[5px] mt-2">
                          <img
                            className="w-full h-full"
                            width="159px"
                            height="108px"
                            src={`data:${props.personalDetails.investmentOpportunity.bedRoomImage.contentType};base64,${props.personalDetails.investmentOpportunity.bedRoomImage.data}`}
                          />
                        </div>
                      </>
                    ) : bedRoomImage ? (
                      <>
                        <div style={labelStyle}>Bedroom</div>

                        <div className="max-w-[159px] h-[108px] flex justify-center items-center border border-gray-300 rounded-[5px]">
                          <img
                            className="w-full h-full"
                            width="159px"
                            height="108px"
                            src={URL.createObjectURL(bedRoomImage)}
                          />
                        </div>
                      </>
                    ) : fileLoader.bedRoomImage ? (
                      <div className='max-w-[159px] h-[108px] p-2 border border-[#7f808570] flex justify-center items-center'>
                        <Spin ></Spin>
                      </div>
                    ) : (
                      <div
                        className={`relative max-w-[159px] h-[108px] border ${
                          false
                            ? "border-red-500"
                            : "border-gray-300"
                        }  flex items-center justify-center rounded-[5px]`}
                      >
                        <input
                          type="file"
                          name="bedRoomImage"
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                        <div className="flex items-center justify-center flex-col">
                          <div style={labelStyle}>Bedroom</div>
                          <div>
                            <button style={uploadBtnStyle}>Upload</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default forwardRef(InvestmentOpportunity);
