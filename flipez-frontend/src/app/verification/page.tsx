"use client";
import Image from "next/image";
import logo from "./../public/images/projectLogo.svg";
import { Checkbox, Col, Dropdown, Input, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import { getVerificationCode } from "@/app/api/service/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function verification() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (verificationCode: any) => {
    setCode(verificationCode);
  };

  const sharedProps = {
    onChange,
  };

  const onSubmit = async () => {
    if (!code) {
      toast.error("Verification code is required.");
      return false;
    } else if (code) {
      setIsLoading(true);
      const verifyCode = { verificationCode: Number(code) };
      const res = await getVerificationCode(verifyCode);
      if (res) {
        router.push("/");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return false;
      }
    }
  };

  return (
    <>
      <div className="relative w-full min-h-full h-full">
        <div className="w-full min-h-full h-full max-h-fit bg-[#d3d3d3] pl-[2%] pr-[4%] pt-[2%] pb-0">
          <div className="w-full  min-h-full h-full max-h-fit bg-[#083c6d] rounded-[21px] pl-[10px] pr-[3%] pb-[3%] pt-[10px] ">
            <div className="h-[82px] w-full flex justify-between items-center">
              <div className="h-fit w-fit">
                <div className="h-fit w-fit mt-[60px]">
                  <div className="h-[135px] relative">
                    <Image src={logo} alt="Logo - SVG" width="135" height="130" className="logo-screen" />
                    <div className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-[60px] absolute top-[36px] left-[36px] drop-in">INVESTPAIR</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center pl-[2%] pr-[2%] pb-[2%]" style={{ height: "calc(100% - 82px)" }}>
              <div className="w-full h-full flex justify-center items-center flex-col relative">
                <div className="font-semibold text-2xl sm:text-3xl md:text-4xl leading-normal text-[#ffffff] text-center">Verification Code</div>

                <div className="mt-[15px] font-semibold  sm:text-base md:text-lg lg:text-xl text-[#B6B6B6] text-center">We have sent the verification code to your email address</div>

                <div className="pt-[48px] px-[20px] w-full h-fit flex flex-col justify-center items-center">
                  <Row gutter={[16, 16]}>
                    <Col flex={"100%"} className="flex justify-center">
                      <Input.OTP className="custom-otp" length={6} {...sharedProps} />
                    </Col>
                  </Row>
                </div>

                <div className="mt-[24px] w-full flex justify-center">
                  <button
                    style={{ placeContent: "center" }}
                    onClick={onSubmit}
                    className="bg-[#FFF] text-base md:text-lg lg:text-xl text-[#083c6d] px-[30px] font-bold rounded-[12px] flex items-center text-center justify-between  w-full max-w-[360px] h-[52px]"
                  >
                    <span>Confirm</span>
                  </button>
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
