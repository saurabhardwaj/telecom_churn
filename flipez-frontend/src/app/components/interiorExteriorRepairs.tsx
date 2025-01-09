"use client";
import { Checkbox } from "antd";
import React, { useImperativeHandle, useState } from "react";

const InteriorExteriorRepairs = (props: { isNextClicked: boolean, propertyDetails: any, setPropertyDetails: any }, ref: React.Ref<unknown> | undefined) => {
    
  const formSections= [
    { label: '1. Do you need to repair drywall or insulation?' , propsKey: 'dryWallStatus'},
    { label: '2. What about the flooring?' , propsKey: 'floorStatus'},
    { label: '3. Would you need to repaint the interior?' , propsKey: 'rePlaintStatus'},
    { label: '4. Any kitchen or bathroom updates planned?', propsKey: 'bathroomUpdateStatus'},
    { label: '5. Are you planning any landscaping?', propsKey: 'landScrapingStatus'},
    { label: '6. Is exterior painting needed?' , propsKey: 'exteriorPaintingStatus'},
  ];

  // const options = ["Minor", "Moderate", "Extensive"];
  const options = [{ label: "Minor", value: "Minor" }, { label: "Moderate", value: "Moderate" }, { label: "Extensive", value: "Extensive" }];
  const flooringOptions = [{ label: "Carpet", value: "Minor" }, { label: "Tiles", value: "Moderate" }, { label: "Hardwood", value: "Extensive" }];

  const handleRadioChange = (key : string, value : string | number | boolean) => {
    props.setPropertyDetails((prevState: any) => ({
      ...prevState,
      interiorDetails: {
        ...prevState.interiorDetails,
        [key]: value, 
      },
    }));
  };

  type InteriorDetailsKeys = "dryWallStatus" | "floorStatus" | "rePlaintStatus" | "bathroomUpdateStatus" | "landScrapingStatus" | "exteriorPaintingStatus";

  const [errors , setErrors] = useState({
    dryWallStatus: '',
    floorStatus: '',
    rePlaintStatus: '',
    bathroomUpdateStatus: '',
    landScrapingStatus: '',
    exteriorPaintingStatus: '',
  });

  const validation = () => {
    const newErrors = {
      dryWallStatus: '',
      floorStatus: '',
      rePlaintStatus: '',
      bathroomUpdateStatus: '',
      landScrapingStatus: '',
      exteriorPaintingStatus: '',
  };

  if (!props.propertyDetails.interiorDetails.dryWallStatus) {
    newErrors.dryWallStatus = 'Please specify the status of drywall or insulation repairs';
  }

  if (!props.propertyDetails.interiorDetails.floorStatus) {
    newErrors.floorStatus = 'Please specify the status of flooring repairs.';
  }

  if (!props.propertyDetails.interiorDetails.rePlaintStatus) {
    newErrors.rePlaintStatus = 'Please specify if interior repainting is needed.';
  }

  if (!props.propertyDetails.interiorDetails.bathroomUpdateStatus) {
    newErrors.bathroomUpdateStatus = 'Please specify the status of kitchen or bathroom updates.';
  }

  if (!props.propertyDetails.interiorDetails.landScrapingStatus) {
    newErrors.landScrapingStatus = 'Please specify if landscaping is planned.';
  }

  if (!props.propertyDetails.interiorDetails.exteriorPaintingStatus) {
    newErrors.exteriorPaintingStatus = 'Please specify if exterior painting is needed.';
  }
  
  setErrors(newErrors);
  return Object.values(newErrors).every((error) => error === '');
  }

  useImperativeHandle(ref, () => ({
        handleSubmit,
}));
  const handleSubmit = () => {
    if(validation()) {
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
      <div className="w-[660px] h-fit">
        <div className="w-[580px] text-[#374153] font-bold text-[18px] leading-normal">We’re almost done! Let’s talk about interior & exterior work.</div>

        <div className="mt-4 max-w-[686px] w-[80%]">
          <hr className="w-full border border-[#0A1E37] h-[2.5px] bg-[#0A1E37] " />

          <form className="mt-[10px] w-full h-fit bg-[#FFFFFF] pt-[12px] pb-[40px] pl-[31px] pr-[31px]" style={{ boxShadow: "0px 0px 21.9px 0px rgba(0, 0, 0, 0.16)" }}>
            {formSections.map((section, index) => (
              <div className="flex flex-col mt-[20px]" key={index}>
                <label style={labelStyle}>{section.label}</label>
                <div className={`flex ${index == 7 ? "gap-[41px]" : "gap-[25px]"} ml-[20px]`}>
                  {(section.propsKey == "floorStatus" ? flooringOptions:options).map((option) => (
                    <Checkbox key={option.value} className="custom-checkbox" 
                      value={option.value} 
                      checked={props.propertyDetails.interiorDetails[formSections[index].propsKey] == option.value} 
                      onChange={() => {
                        handleRadioChange(formSections[index].propsKey, option.value);
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          [formSections[index].propsKey]: ''
                        }));
                        }}>
                      <span className="text-[#5e5e5e] text-sm  ">{option.label}</span>
                    </Checkbox>
                  ))}
                </div>
                {errors[formSections[index]?.propsKey as InteriorDetailsKeys] && <div className="text-red-500 text-xs ml-5 mt-1 mb-[-16px]  ">{errors[formSections[index]?.propsKey as InteriorDetailsKeys]}</div>}
              </div>
            ))}
          </form>
        </div>
      </div>
    </>
  );
}

export default React.forwardRef(InteriorExteriorRepairs);
