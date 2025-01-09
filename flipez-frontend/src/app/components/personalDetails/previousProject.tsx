"use client";
import { getImageId } from "@/app/api/service/image.service";
import { getAddress } from "@/app/api/service/property-overview.service";
import { Select, Spin } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const PreviousProject = (
  props: {
    isNextClicked: boolean;
    personalDetails: any;
    setPersonalDetails: any;
  },
  ref: React.Ref<unknown> | undefined
) => {
  const [errors, setErrors] = useState({
    propertyAddress: "",
    purchasePrice: "",
    rehabCost: "",
    soldPrice: "",
    propertyPhoto: null as File | null | string,
  });
  const [isAddMoreDetails, setIsAddMoreDetails] = useState(false);

  const [formData, setFormData] = useState({
    propertyAddress: "",
    purchasePrice: "",
    rehabCost: "",
    soldPrice: "",
    propertyPhoto: null as File | null,
  });

  const [profileImage, setProfileImage] = useState<any>(null);

  const [previousProjects, setPreviousProjects] = useState<any>([]);

  useEffect(() => {
    setPreviousProjects(props.personalDetails.previousProjects);
  }, [props.personalDetails.previousProjects]);

  useEffect(() => {
    if(previousProjects.length > 0){
      const projectBody = JSON.parse(JSON.stringify(previousProjects))
      projectBody.forEach((item: any) => {
        if(item.profileImage){
          delete item.profileImage;
        }
      });
      props.setPersonalDetails((prevState: any) => ({
        ...prevState,
        previousProjects: previousProjects
      }))
    }
  }, [previousProjects]);

  const validateForm = () => {
    const newErrors = {
      propertyAddress: "",
      purchasePrice: "",
      rehabCost: "",
      soldPrice: "",
      propertyPhoto: null as File | null | string,
    };

    if (!formData.propertyAddress) {
      newErrors.propertyAddress = "Property Address is required.";
    }
    if (!formData.purchasePrice) {
      newErrors.purchasePrice = "Purchase Price is required.";
    }
    if (!formData.rehabCost) {
      newErrors.rehabCost = "Rehab Cost is required.";
    }
    if (!formData.soldPrice) {
      newErrors.soldPrice = "Sold Price is required.";
    }
    if (!formData.propertyPhoto) {
      newErrors.propertyPhoto = "Property Photo is required.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(
      (error) => error === "" || error === null
    );
  };

  const addSaveDetails = () => {
    if (!validateForm()) {
      return false;
    } else {
      setPreviousProjects((prevState: any) => [...prevState, {
        propertyAddress: formData.propertyAddress,
        purchasePrice: formData.purchasePrice,
        rehabCost: formData.rehabCost,
        soldPrice: formData.soldPrice,
        profileImage: profileImage,
        propertyPhoto: formData.propertyPhoto
      }]);
      
      setIsAddMoreDetails(false);
      setFormData({
        propertyAddress: "",
        purchasePrice: "",
        rehabCost: "",
        soldPrice: "",
        propertyPhoto: null as File | null,
      });
      setProfileImage(null);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = event.target;
    if (files) {
      const res = await getImageId(files[0]);
      setProfileImage(files[0]);
      setFormData((prevState) => ({
        ...prevState,
        [name]: res._id,
      }))
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        const addressOptions = response.data.map((item: any) => ({
          value: item.display,
          label: item.display,
        }));
        setOptions(addressOptions);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setFetching(false);
      }
    }, 1000);
  };

  const handleSelectChange = (value: any) => {
    const label = value ? value : "";
    setFormData((prevState) => ({
      ...prevState,
      propertyAddress: label,
    }));
  };

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    return true;
  };

  const addBtnStyle = {
    border: "1px solid #0C1D35",
    borderRadius: "6px",
    padding: "0px 12px 0px 12px",
    width: "fit-content",
    height: "22px",
    backgroundColor: "#0C1D35",
    color: "white",
    fontSize: "12px",
    lineHeight: "normal",
  };

  const labelStyle = {
    fontSize: '16px',
    lineHeight: 'normal',
    fontWeight: '400',
    display: 'block',
    marginBottom: '6px',
    color: '#083c6d',
  };

  const prefixInputStyle = {
    color: "#5e5e5e",
    border: "1px solid #7f808570",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 28px",
    width: "100%",
    fontSize: "14px",
    lineHeight: "normal",
  };

  const errorPrefixInputStyle = {
    border: "1px solid red",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px 0px 28px",
    width: "100%",
    fontSize: "14px",
    lineHeight: "normal",
    color: '#5e5e5e'
  };

  return (
    <>
      <div className="max-w-full p-4">
        <div className="flex flex-col gap-4">
          {previousProjects.length > 0 &&
            !props.personalDetails.previousProject?.propertyPhoto
              ?.contentType &&
            previousProjects.map((project: any, index: number) => (
              <div key={index}>
                <div className="flex gap-4 items-center">
                  <div
                    className={`relative w-[126px] h-[137px] border  border-gray-300 flex items-center justify-center rounded-[5px]`}
                  >
                    {project.profileImage && !project.propertyPhoto.contentType && (
                      <img
                        src={URL.createObjectURL(project.profileImage)}
                        alt="Property Photo"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {project?.propertyPhoto?.contentType && <img
                        src={`data:${project.propertyPhoto.contentType};base64,${project.propertyPhoto.data}`}
                        alt="Property Photo"
                        className="w-full h-full object-cover"
                      />}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex text-[#083c6d]">
                      Property Address:&nbsp;{" "}
                      <div className="text-[#5e5e5e] font-bold border-dotted border-b min-w-[150px] w-fit ml-2">
                        {project.propertyAddress}
                      </div>
                    </div>
                    <div className="flex text-[#083c6d]">
                      Purchase Price:&nbsp;{" "}
                      <div className="text-[#5e5e5e] font-bold border-dotted border-b min-w-[150px] w-fit ml-2">
                        ${project.purchasePrice}
                      </div>{" "}
                    </div>
                    <div className="flex text-[#083c6d]">
                      Rehab Cost:&nbsp;{" "}
                      <div className="text-[#5e5e5e] font-bold border-dotted border-b min-w-[150px] w-fit ml-2">
                        ${project.rehabCost}
                      </div>
                    </div>
                    <div className="flex text-[#083c6d]">
                      Sold Price:&nbsp;{" "}
                      <div className="text-[#5e5e5e] font-bold border-dotted border-b min-w-[150px] w-fit ml-2">
                        ${project.soldPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {(isAddMoreDetails ||
          props.personalDetails.previousProjects.length === 0) && (
          <div className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Property Address</label>
                <Select
                  filterOption={false}
                  value={formData.propertyAddress}
                  onSearch={onSearch}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  options={options}
                  onChange={handleSelectChange}
                  showSearch
                  placeholder="Search Address"
                  className={
                    errors.propertyAddress
                      ? "errorSearchAddressProject w-full"
                      : "searchAddressProject w-full"
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Purchase Price</label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    style={
                      errors.purchasePrice
                        ? errorPrefixInputStyle
                        : prefixInputStyle
                    }
                    className="input-style"
                    type="text"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[1-9]\d*$/.test(value) || value === "") {
                        handleInputChange(e);
                        setErrors({ ...errors, purchasePrice: "" });
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Rehab Cost</label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    style={
                      errors.rehabCost
                        ? errorPrefixInputStyle
                        : prefixInputStyle
                    }
                    className="input-style"
                    type="text"
                    name="rehabCost"
                    value={formData.rehabCost}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[1-9]\d*$/.test(value) || value === "") {
                        handleInputChange(e);
                        setErrors({ ...errors, rehabCost: "" });
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Sold Price</label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    style={
                      errors.soldPrice
                        ? errorPrefixInputStyle
                        : prefixInputStyle
                    }
                    className="input-style"
                    type="text"
                    name="soldPrice"
                    value={formData.soldPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[1-9]\d*$/.test(value) || value === "") {
                        handleInputChange(e);
                        setErrors({ ...errors, soldPrice: "" });
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <label style={labelStyle} className="mt-4">
              Property Image
            </label>
            {profileImage ? (
              <div>
                <img
                  width="159px"
                  height="108px"
                  src={URL.createObjectURL(profileImage)}
                />
              </div>
            ) : (
              <div
                className={`relative w-[159px] h-[108px] border ${
                  props.isNextClicked && errors.propertyPhoto
                    ? "border-red-500"
                    : "border-gray-300"
                }  flex items-center justify-center rounded-[5px]`}
              >
                <input
                  type="file"
                  name="propertyPhoto"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    setErrors({ ...errors, propertyPhoto: null });
                    handleFileChange(e);
                  }}
                />
                <span className="text-[#00000070] text-[24px]">
                  Upload
                </span>
              </div>
            )}
          </div>
        )}

        {!isAddMoreDetails &&
          props.personalDetails.previousProjects.length > 0 && (
            <div className="w-full flex justify-end mt-2">
              <button
                style={addBtnStyle}
                onClick={() => setIsAddMoreDetails(true)}
              >
                Add More
              </button>
            </div>
          )}

        {(isAddMoreDetails ||
          props.personalDetails.previousProjects.length == 0) && (
          <div className="w-full flex justify-end mt-2">
            <button style={addBtnStyle} onClick={() => addSaveDetails()}>
              Save Details
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default forwardRef(PreviousProject);
