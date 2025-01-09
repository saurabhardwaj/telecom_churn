"use client";
import { updateLatestRehabValues } from "@/app/api/service/investment-details.service";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Spin,
} from "antd";
import { Color } from "antd/es/color-picker";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

const Rehab = (
  props: {
    isNextClicked: boolean;
    personalDetails: any;
    setPersonalDetails: any;
  },
  ref: React.Ref<unknown> | undefined
) => {


  const formSections = [
    { title: "Kitchen", key: "kitchen" },
    { title: "Bathroom", key: "bathRoom" },
    { title: "Flooring", key: "flooring" },
    { title: "Interior Painting", key: "interiorPainting" },
    { title: "Exterior Painting", key: "exteriorPainting" },
    { title: "Plumbing", key: "plumbing" },
    { title: "Electrical", key: "electrical" },
    { title: "Landscaping", key: "landscaping" },
    { title: "HVAC", key: "hvac" },
    { title: "Demolition & Cleanout", key: "demolition" },
    { title: "Roofing", key: "roofing" },
    { title: "Foundation", key: "foundation" },
    { title: "Extra Bed & Bath", key: "extraBedBath" },
  ];

  const options = [
    { label: "Minor", value: "Minor" },
    { label: "Moderate", value: "Moderate" },
    { label: "Extensive", value: "Extensive" },
  ];

  const flooringOptions = [
    { label: "Hardwood", value: "Minor" },
    { label: "Tile", value: "Moderate" },
    { label: "Carpet", value: "Extensive" },
  ];

  const lastOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const [isCostChange, setIsCostChange] = useState(false);

  const handleRadioChange = (
    key: string,
    value: string | number | boolean,
    cost: number
  ) => {
    props.setPersonalDetails((prevState: any) => ({
      ...prevState,
      rehabAssessment: {
        ...prevState.rehabAssessment,
        [key]: {
          status: value,
          cost,
        },
      },
    }));
  };

  useEffect(() => {
    if (isCostChange) {
      props.setPersonalDetails((prevState: any) => ({
        ...prevState,
        rehabAssessment: {
          ...prevState.rehabAssessment,
          totalCost: calculateTotal(),
        }
      }));
      setIsCostChange(false);
    }
  }, [isCostChange]);

  const handleRehabCostChange = (
    key: string,
    value: string | number | boolean
  ) => {
    props.setPersonalDetails((prevState: any) => ({
      ...prevState,
      rehabAssessment: {
        ...prevState.rehabAssessment,
        [key]: {
          ...prevState.rehabAssessment[key],
          cost: Number(value),
        },
        totalCost: calculateTotal(),
      },
    }));
    setIsCostChange(true);
  };

  const [isAddingRow, setIsAddingRow] = useState(false);
  const [row, setRow] = useState<any>({ title: "", cost: "" });
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [errors, setErrors] = useState({
    title: "",
    cost: "",
  });

  const handleRowTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRow({ ...row, title: value });
  };

  const addRow = () => {
    if (props.personalDetails.additionalRehabs.length <= 3) {
      setIsAddingRow(true);
      setRow({ title: "", cost: "" });
    } else {
      toast.error("Maximum 3 rows allowed");
      return;
    }
  };

  const editRehab = async (index: number) => {
    setRow({
      title: props.personalDetails.additionalRehabs[index].title,
      cost: props.personalDetails.additionalRehabs[index].cost
    })
    setIsAddingRow(true);
    setSelectedIndex(index);
  }

  const handleModelOk = () => {
    if(validateRow()) {
      if(selectedIndex > -1) {
        const updatedValue = [...props.personalDetails.additionalRehabs];
        updatedValue[selectedIndex] = { title: row.title, cost: row.cost };
        props.setPersonalDetails((prevState: any) => ({
          ...prevState,
          additionalRehabs: updatedValue,
        }));
      } else {
        if (row.title && row.cost) {
          props.setPersonalDetails((prevState: any) => ({
            ...prevState,
            additionalRehabs: [...props.personalDetails.additionalRehabs, { title: row.title, cost: row.cost }],
          }));
        }
      }
      setRow({ title: "", cost: "" });
      setIsAddingRow(false);
      setIsCostChange(true);
    }else{
      return false;
    }

  };

  const validateRow = () => {
    const newErrors = {
      title: "",
      cost: "",
    };

    if (!row.title) {
      newErrors.title = "Title is required";
    }

    if (!row.cost) {
      newErrors.cost = "Cost is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  }

  const handleModelCancel = () => {
    setIsAddingRow(false);
  };
  const handleRowCostChange = (cost: number) => {
    setRow({ ...row, cost: cost });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(props.personalDetails.rehabAssessment).forEach((key) => {
      if (props.personalDetails.rehabAssessment[key].cost) {
        total += Number(props.personalDetails.rehabAssessment[key].cost);
      }
    });
    
    for (let index = 0; index < props.personalDetails.additionalRehabs.length; index++) {
      const element = props.personalDetails.additionalRehabs[index];
      total += Number(element.cost || 0);
    }
    return total;
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    return true;
  };

  const calculateTotalRehab = async () => {
    const res = await updateLatestRehabValues({
      rehabAssessment: props.personalDetails.rehabAssessment,
      additionalRehabs: props.personalDetails.additionalRehabs || [],
    }, props.personalDetails._id,);
    props.setPersonalDetails((prevState: any) => ({
      ...prevState,
      ...res,
    }));
  };


  const inputModelStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    borderRadius: "5px",
    padding: "6px 6px 6px 12px",
    width: "100%",
    color: "#5e5e5e",
  };

  const errorInputModelStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid red",
    borderRadius: "5px",
    padding: "6px 6px 6px 12px",
    width: "100%",
    color: "#5e5e5e",
  };

  const prefixInputModelStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    borderRadius: "5px",
    padding: "6px 6px 6px 28px",
    width: "100%",
    color: "#5e5e5e",
  };

  const errorPrefixInputModelStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid red",
    borderRadius: "5px",
    padding: "6px 6px 6px 28px",
    width: "100%",
    color: "#5e5e5e",
  };

  const inputStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid #7f808570",
    borderRadius: "5px",
    padding: "0px 6px 0px 28px",
    width: "100%",
    color: "#5e5e5e",
  };

  const labelStyle = {
    fontSize: "16px",
    lineHeight: "normal",
    fontWeight: "400",
    color: "#083c6d",
  };

  return (
    <>
      <div>
        <form className="max-w-full mx-auto px-4 pb-4">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            style={{ gridTemplateColumns: "3fr 3fr 1fr" }}
          >
            <div></div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
              <div style={labelStyle}>Minor</div>
              <div style={labelStyle}>Moderate</div>
              <div style={labelStyle}>Extensive</div>
            </div>
            <div style={labelStyle} className="place-self-center">
              Cost
            </div>
          </div>
          {formSections.map((section, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-2 p-1 gap-4 border border-[#7f808570] rounded-[5px] h-[31px]"
              style={{ gridTemplateColumns: "3fr 3fr 1fr" }}
            >
              <div style={labelStyle}>{section.title}</div>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {(index == 2
                  ? flooringOptions
                  : index == 12
                  ? lastOptions
                  : options
                ).map((option) => (
                  <Checkbox
                    key={option.value}
                    className="custom-checkbox"
                    value={option}
                    checked={
                      props.personalDetails.rehabAssessment[
                        formSections[index].key
                      ].status == option.value
                    }
                    onChange={() =>
                      handleRadioChange(
                        formSections[index].key,
                        option.value,
                        props.personalDetails.rehabAssessment[
                          formSections[index].key
                        ].cost
                      )
                    }
                  >
                    {(index == 2 || index == 12) && (
                      <span className="text-[#0C1D35] text-sm">
                        {option.label}
                      </span>
                    )}
                  </Checkbox>
                ))}
              </div>
              <div className="w-full">
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    style={inputStyle}
                    className="input-style"
                    value={
                      props.personalDetails.rehabAssessment[
                        formSections[index].key
                      ].cost
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      handleRehabCostChange(
                        formSections[index].key,
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {props.personalDetails.additionalRehabs &&
            props.personalDetails.additionalRehabs.length > 0 &&
            props.personalDetails.additionalRehabs.map((row: any, index: any) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-2 p-1 gap-4 border border-[#7f808570] rounded-[5px] h-[31px]"
                style={{ gridTemplateColumns: "3fr 3fr 1fr" }}
              >
                  <div key={index} style={labelStyle}>
                    {row.title}
                  </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div className="w-full flex items-center gap-4 min-w-max">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      readOnly
                      type="text"
                      style={inputStyle}
                      className="input-style"
                      value={row?.cost}
                    />
                  </div>
                  <div className="cursor-pointer" onClick={() => editRehab(index)}><EditOutlined style={{ color: 'black' }} /></div>
                </div>
              </div>
            ))}
        </form>

        <div className="flex w-full justify-center items-center gap-4">
          {props.personalDetails.additionalRehabs && props.personalDetails.additionalRehabs.length < 3 && <div className="mt-4 flex justify-center items-center">
            <button
              className="bg-white text-[#0C1D35] border border-[#0C1D35] text-sm  font-normal py-2 px-4 rounded-[5px]"
              onClick={() => addRow()}
            >
              Add Row
            </button>
          </div>}

          <div className="mt-4 flex justify-center items-center">
            <button
              className="bg-[#0C1D35] text-white text-sm  font-normal py-2 px-4 rounded-[5px]"
              onClick={() => calculateTotalRehab()}
            >
              Calculate Total Rehab
            </button>
          </div>
        </div>

        <div className="mt-4 mb-6 ml-4 place-items-end pr-4">
          <div className="border border-[#1b197696] rounded-[5px] h-[36px] w-fit min-w-[200px] flex items-center pl-2 pr-2">
            <div className="text-[#0C1D35] text-sm  font-semibold">
              Total Rehab: &nbsp; $ &nbsp;{" "}
              {props.personalDetails.rehabAssessment.totalCost != 0 ? (
                <span className="font-bold text-base">
                  {props.personalDetails.rehabAssessment.totalCost.toLocaleString("en-US")}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<div className="text-xl mb-4 font-semibold text-[#374153]">Add Rehab</div>}
        open={isAddingRow}
        onOk={handleModelOk}
        onCancel={handleModelCancel}
      >
        <div className="mt-4">
          <div style={labelStyle}>Title</div>
          <div className="w-full mt-1">
            <input
              type="text"
              style={errors.title ? errorInputModelStyle : inputModelStyle}
              className="input-style mt-1"
              value={row.title}
              onChange={(e) => {handleRowTitleChange(e); setErrors({...errors, title: ''})}}
              placeholder="Enter title"
            />
          </div>
        </div>

        <div style={labelStyle} className="mt-4">
          Cost
        </div>

        <div className="w-full mt-1">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 top-1 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              style={errors.cost ? errorPrefixInputModelStyle : prefixInputModelStyle}
              className="input-style mt-1"
              value={row.cost}
              onChange={(e: any) => {
                const value = e.target.value;
                if (/^[1-9]\d*$/.test(value) || value === "") {
                  handleRowCostChange(e.target.value);
                  setErrors({...errors, cost: ''});
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default forwardRef(Rehab);
