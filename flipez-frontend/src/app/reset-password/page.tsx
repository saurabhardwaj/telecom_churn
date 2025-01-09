"use client";
import Image from "next/image";
import logo from "./../public/images/projectLogo.svg";
import { Checkbox, Col, Dropdown, Input, Radio, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { getResetPassword } from "@/app/api/service/auth.service";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  const [isNextClicked, setIsNextClicked] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("token");
    setToken(queryToken);
  }, []);

  const validateForm = () => {
    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!password) {
      newErrors.password = "Password is required.";
      message.error("Password is required.");
    }

    const alphanumericRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (password &&!alphanumericRegex.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters long and alphanumeric.";
        message.error("Password must be at least 6 characters long and alphanumeric.");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
      message.error("Confirm Password is required.");
    }

    if (confirmPassword && confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
      message.error("Passwords do not match.");
    }

    setErrors(newErrors);
    console.log("🚀 ~ validateForm ~ newErrors:", newErrors)
    return Object.values(newErrors).every((error) => error === "");
  };

  const onSubmit = async () => {
    setIsNextClicked(true);
    if (validateForm()) {
      setIsLoading(true);
      const verifyPassword = { token: token, password: password };
      const res = await getResetPassword(verifyPassword);
      if (res) {
        toast.success("Password reset successfully!");
        router.push("/");
        setIsLoading(false);
      } else {
        toast.error("Failed to reset password. Please try again.");
        setIsLoading(false);
        return false;
      }
    }
  };

  return (
    <>
      <div className="relative w-full min-h-full h-full max-h-fit bg-[#d3d3d3] pl-[2%] pr-[4%] pt-[2%] pb-0">
        <div className="w-full  min-h-full h-full max-h-fit bg-[#083c6d] rounded-[21px] pl-[10px] pr-[3%] pb-[3%] pt-[10px] ">
          <div className="h-[82px] w-full flex justify-between items-center">
            <div className="h-fit w-fit">
              <div className="h-fit w-fit mt-[60px]">
                <div className="h-[135px] relative">
                  <Image
                    src={logo}
                    alt="Logo - SVG"
                    width="135"
                    height="130"
                    className="logo-screen"
                  />
                  <div className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-[60px] absolute top-[36px] left-[36px] drop-in">
                    INVESTPAIR
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-full flex justify-center items-center pl-[2%] pr-[2%] pb-[2%]"
            style={{ height: "calc(100% - 82px)" }}
          >
            <div className="w-full h-full flex justify-center items-center flex-col relative">
              <div className="font-semibold text-2xl sm:text-3xl md:text-4xl leading-normal text-[#ffffff] text-center">
                Reset Password
              </div>

              <div className="pt-[48px] w-full h-fit flex flex-col justify-center items-center">
                <Row gutter={[16, 16]} className="w-full">
                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      className={`${
                        errors.password && isNextClicked
                          ? "border-red-600"
                          : "border-[#00000033]"
                      } border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
                    />
                  </Col>

                  <Col flex={"100%"} className="flex justify-center">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      className={`${
                        errors.confirmPassword && isNextClicked
                          ? "border-red-600"
                          : "border-[#00000033]"
                      } border-[2px] py-3 px-4 w-full max-w-[360px] h-[40px] rounded-[12px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  `}
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

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </>
  );
}
