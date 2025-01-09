"use client";
import Image from "next/image";
import logo from './../public/images/projectLogo.svg';
import { Checkbox, Col, Dropdown, Input, Radio, Row, Select } from "antd";
import React ,{ useState } from "react";
import {getForgotPassword} from "@/app/api/service/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  const router = useRouter();

    const [email , setEmail] = useState<string>('');
    const [isNextClicked , setIsNextClicked] = useState<boolean>(false);
    const [errors , setErrors] = useState<any>({});
    const [isLoading , setIsLoading] = useState<boolean>(false);
  
    const validateForm = () => {
        const newErrors = {
          email: '',
        };
    
        if (!email) {
            newErrors.email = 'Email is required.';
            toast.error('Email is required.');
        }
    
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const onSubmit = async () => {
      setIsNextClicked(true);
      if(validateForm()){
        setIsLoading(true);
        const verifyEmail = {email : email}
        const res = await getForgotPassword(verifyEmail);
        if (res) {
          setIsLoading(false);
          toast.success('Password reset link sent to your email!');
        }  else {
          setIsLoading(false);
          toast.error('Failed to send password reset link. Please try again.');
          return false;
        }
      }
    }

  return (
    <>
      <div className="w-full min-h-full h-full max-h-fit bg-[#d3d3d3] pl-[2%] pr-[4%] pt-[2%] pb-0">
        <div className="w-full  min-h-full h-full max-h-fit bg-[#083c6d] rounded-[21px] pl-[10px] pr-[3%] pb-[3%] pt-[10px] ">
          <div className="h-[82px] w-full flex justify-between items-center">
            <div className="h-fit w-fit">
              <div className="h-fit w-fit mt-[60px]">
                <div className='h-[135px] relative'>
                    <Image src={logo} alt="Logo - SVG" width="135" height="130" className="logo-screen" />
                    <div className='text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-[60px] absolute top-[36px] left-[36px] drop-in'>INVESTPAIR</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center pl-[2%] pr-[2%] pb-[2%]" style={{ height: "calc(100% - 82px)"}}>
            <div className="w-full h-full flex justify-center items-center flex-col relative">
              <div className="font-semibold text-2xl sm:text-3xl md:text-4xl leading-normal text-[#ffffff] text-center">Forgot Password</div>

              <div className="mt-[15px] font-semibold  sm:text-base md:text-lg lg:text-xl text-[#B6B6B6] text-center w-full">Enter your email for the password reset.</div>

              <div className="pt-[48px] w-full h-fit flex flex-col justify-center items-center">
                <Row gutter={[16, 16]} className="w-full">
                    <Col flex={"100%"} className="flex justify-center">
                        <input
                        type="text"
                        placeholder="Email"
                        onChange={(e) => { setEmail(e.target.value) }}
                        className={`${errors.email && isNextClicked ? 'border-red-600' : 'border-[#00000033]'} border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none`}
                        />
                    </Col>
                </Row>
              </div>

              <div className="mt-[24px] w-full flex justify-center px-[8px]">
                <button
                  style={{ placeContent: "center" }}
                  onClick={() => onSubmit()}
                  className="bg-[#FFF] sm:text-base md:text-lg lg:text-xl text-[#083c6d] px-[30px] font-bold rounded-[12px] flex items-center text-center justify-between  w-full max-w-[360px] h-[52px]"
                >
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}