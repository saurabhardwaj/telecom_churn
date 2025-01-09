"use client";
import Image from "next/image";
import logo from './../public/images/projectLogo.svg';
import user from './../public/images/userIcon.png';
import activeNotification from './../public/images/activeNotification.png';
import { Checkbox, Col, Dropdown, Radio, Row, Select, Spin } from "antd";
import React ,{ useEffect, useRef, useState } from "react";
import { getCityList, getState, signUp } from "@/app/api/service/auth.service"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";


export default function SignUp() {

    const router = useRouter();

    const [signUpDetails, setSignUpDetails] = useState<any>({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      role: 'lender',
      city: '',
      state: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [stateData, setStateData] = useState<any>([]);
  const [isAgreeTC, setIsAgreeTC] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isNextClicked , setIsNextClicked] = useState<boolean>(false);

  const [cityData , setCityData] = useState([]);


  useEffect(() => {
    getStateData();
 }, []);

    const getStateData = async () => {
      const res = await getState();
      if (res) {
          setStateData(res);     
      }
    }

    const getCityData = async (code: string) => {
      const stateCode = code;
      const res = await getCityList(stateCode);
      if (res) {
        setCityData(res);     
      }
  }

  
  const stateOptions = stateData.map((state :any ) => ({
    label: state.name,
    value: state.id,
  }));

  const cityOptions = cityData.map((city :any ) => ({
    label: city.name,
    value: city.id,
  }));

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      city: '',
      state: '',
    };

    if (!signUpDetails.firstName) {
        newErrors.firstName = 'First name is required.';
    }

    if (!signUpDetails.lastName) {
        newErrors.lastName = 'Last name is required.';
    } 

    if (!signUpDetails.email) {
        newErrors.email = 'Email is required.';
    }

    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(signUpDetails.email)){
      newErrors.email = 'Email is required.';
      toast.error('Email is invalid.');
    }

    if (!signUpDetails.password) {
        newErrors.password = 'Password is required.';
        if(signUpDetails.password.length < 8){
          toast.error('Password must be at least 8 characters.'); 
        }
    }

    if (!signUpDetails.phone) {
        newErrors.phone = 'Phone number is required.';
        if(signUpDetails.phone.length < 10){
          toast.error('Phone number must be at least 10 characters.'); 
        }
    }

    if (!signUpDetails.city) {
        newErrors.city = 'City is required.';
    }

    if (!signUpDetails.state) {
        newErrors.state = 'State is required.';
    }

    if(!isAgreeTC){
      toast.error('Please agree to the terms and conditions.');
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
};

  const createSignUp = async () => {
    setIsNextClicked(true);
    if(validateForm()){
      setIsLoading(true);
      const res = await signUp(signUpDetails);
      if (res) {
        try {
          const result = await signIn("credentials", {
            isSuccess: true,
            email: res.user.email,
            id: res.user._id,
            token: res.token,
            redirect: false,
          });
      
          if (result?.ok) {
            router.push('/verification');
          } else {
            console.error("Error during sign-in:", result?.error);
          }
        } catch (error) {
          console.error("Sign-in failed:", error);
        }
        setIsLoading(false);
      }  else {
        setIsNextClicked(true);
        setIsLoading(false);
        return false;
      }
    }
  }

  const handleStateChange =(value: any) => {
    setSignUpDetails({ ...signUpDetails, state: value.label, city: '' });
    setCityData([]);
    const stateCode = stateData.find((state: any) => state.name === value.label)?.state_code;
    getCityData(stateCode);    
  }

  return (
    <>
    <div className="relative w-full min-h-fit h-full">
      <div className="w-full min-h-fit h-full bg-[#d3d3d3] pl-[2%] pr-[4%] pt-[2%] pb-0">
        <div className="w-full  min-h-fit h-full bg-[#083c6d] rounded-[21px] pl-[10px] pr-[3%] pb-[3%] pt-[10px] ">
          <div className="h-[82px] w-full flex justify-between items-center">
            <div className="h-fit w-fit mt-[60px]">
              <div className="h-[135px] relative">
                <Image src={logo} alt="Logo - SVG" width="135" height="130" className="logo-screen" />
                <div className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-[60px] absolute top-[36px] left-[36px] drop-in">INVESTPAIR</div>
              </div>
            </div>
          </div>

          <div className="w-full h-fit flex justify-center items-center pl-[2%] pr-[2%] pb-[2%]">
            <div className="w-full h-fit flex justify-center items-center flex-col relative">
              <div className="md:mt-[-10px] sm:mt-0 font-normal text-[48px] leading-normal text-[#ffffff] w-full text-center  ">Sign Up</div>

              <div className="flex justify-center items-center h-fit mt-[30px]">
                <div className="bg-gray-200 p-1 rounded-full flex">
                  <button
                    className={`px-10 md:px-14 py-2 font-semibold rounded-full transition-all 
                    ${signUpDetails.role === "lender" ? "bg-black text-white" : "bg-transparent text-black"}`}
                    onClick={() => setSignUpDetails({ ...signUpDetails, role: "lender" })}
                  >
                    Lender
                  </button>
                  <button
                    className={`px-10 md:px-14  py-2 font-semibold rounded-full transition-all 
                    ${signUpDetails.role === "borrower" ? "bg-black text-white" : "bg-transparent text-black"}`}
                    onClick={() => setSignUpDetails({ ...signUpDetails, role: "borrower" })}
                  >
                    Borrower
                  </button>
                </div>
              </div>

              <div className="pt-[20px] px-[20px] w-full h-fit flex flex-col justify-center items-center">
                <Row gutter={[16, 16]}>
                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="text"
                      placeholder="First Name"
                      onChange={(e) => {
                        setSignUpDetails({ ...signUpDetails, firstName: e.target.value });
                      }}
                      className={`${
                        errors.firstName && isNextClicked ? "border-red-600" : ""
                      } border-[2px]  py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
                    />
                  </Col>
                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="text"
                      placeholder="Last Name"
                      onChange={(e) => {
                        setSignUpDetails({ ...signUpDetails, lastName: e.target.value });
                      }}
                      className={`${
                        errors.lastName && isNextClicked ? "border-red-600" : ""
                      } border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
                    />
                  </Col>
                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="text"
                      placeholder="Email"
                      onChange={(e) => {
                        setSignUpDetails({ ...signUpDetails, email: e.target.value });
                      }}
                      className={`${
                        errors.email && isNextClicked ? "border-red-600" : ""
                      } border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
                    />
                  </Col>
                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="password"
                      placeholder="Your Password"
                      onChange={(e) => {
                        setSignUpDetails({ ...signUpDetails, password: e.target.value });
                      }}
                      className={`${
                        errors.password && isNextClicked ? "border-red-600" : ""
                      } border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
                    />
                  </Col>
                  <Col flex={"100%"} className="flex justify-center">
                    <Select
                      labelInValue
                      onChange={(e) => {
                        handleStateChange(e);
                      }}
                      options={stateOptions}
                      placeholder="Select a state"
                      className={`${errors.state && isNextClicked ? 'border-red-600 searchState' : 'searchState'} placeholder-gray-500 focus:outline-none h-[40px]`}
                    />
                  </Col>
                  <Col flex={"100%"} className="flex justify-center">
                    <Select
                        labelInValue
                        options={cityOptions}
                        value={signUpDetails.city ? { value: signUpDetails.city, label: signUpDetails.city } : undefined}
                        onChange={(e) => {
                          setSignUpDetails({ ...signUpDetails, city: e.label });
                        }}
                        placeholder="Select a state"
                        className={`${errors.city && isNextClicked ? 'border-red-600 searchState' : 'searchState'} placeholder-gray-500 focus:outline-none h-[40px]`}
                      />
                  </Col>

                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="text"
                      placeholder="Contact Number"
                      onChange={(e) => {
                        setSignUpDetails({ ...signUpDetails, phone: e.target.value });
                      }}
                      className={`${
                        errors.phone && isNextClicked ? "border-red-600" : ""
                      } border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
                    />
                  </Col>
                </Row>

                <div className="flex flex-col mt-[20px] flex-start ">
                  <div className={`flex gap-[10px]`}>
                    <Checkbox className="custom-checkbox" onChange={() => setIsAgreeTC (!isAgreeTC)}>
                      <span className="text-[#FFF] text-sm">
                        I agree to the <a>terms and conditions</a>
                      </span>
                    </Checkbox>
                  </div>
                </div>

                <div className="mt-[8px] w-full flex justify-center">
                  <button
                    style={{ placeContent: "center" }}
                    onClick={createSignUp}
                    className="bg-[#FFFFFF] text-base md:text-lg lg:text-xl text-[#083c6d] px-[30px] font-semibold   rounded-[12px] flex items-center text-center justify-between  w-full max-w-[360px] h-[40px]"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>

                <div className="flex flex-col mt-[10px] flex-start">
                  <div className={`flex gap-[10px]`}>
                    <span className="text-[#FFF] text-sm">
                      Already have an account?{" "}
                      <a className="underline cursor-pointer" onClick={() => router.push("/login")}>
                        Sign In
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

    </div>
    </>
  );
}