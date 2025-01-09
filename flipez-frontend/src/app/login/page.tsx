'use client'
import Image from "next/image";
import logo from './../public/images/projectLogo.svg';

import facebook from './../public/images/facebook.png';
import google from './../public/images/google.png';
import rightArrow from './../public/images/rightArrow.svg';
import { signIn, useSession } from "next-auth/react";
import { apiInstance } from "@/app/api-utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
    const router = useRouter();

    const [signInDetails, setSignInDetails] = useState<any>({
        email: '',
        password: '',
    });

    const [isLoading , setIsLoading] = useState<boolean>(false);

    const validateForm = () => {
        if(!signInDetails.email){
            toast.error('Email is required.');
            return false;
        }
        if(!signInDetails.password){
            toast.error('Password is required.');
            return false;
        }
        return true;
    }
    const onSubmit = async () => {
        if(validateForm()){
            setIsLoading(true);
            const response = await apiInstance({
                method: 'post',
                url: '/signin',
                data: signInDetails,
            });
            if (response.status === 200) {
                localStorage.setItem('userInfo', response.data.user);
                await signIn('credentials', {
                    isSuccess: true,
                    email: response.data.user.email,
                    id: response.data.user._id,
                    token: response.data.token,
                    redirect: false,
                });
                if(response.data.user.lastCompleteStepNumber === 5) {
                  router.push('/investment-details');
                } else {
                  router.push('/property-overview');
                }
                setIsLoading(false);
            }
        }else{
            setIsLoading(false);
            return false;
        }
    };

    const handleGoogleLogin = async () => {
        await signIn('google', {
            redirect: false,
        }); 
    };

    

    return (
      <>
        <div className="relative w-full min-h-[800px] h-full bg-[#dee0e2] pl-[28px] pr-[101px] pt-[25px] pb-[25px]">
          <div className="w-full h-full min-h-[800px] bg-[#083c6d] rounded-[21px]">
            <div className="h-[82px] w-fit mb-[20px] py-[13px] pl-[10px] pr-[63px] flex justify-between items-center">
              <div className="w-fit h-fit mt-[70px]">
                <div className="h-[135px] relative">
                  <Image src={logo} alt="Logo - SVG" width="135" height="130" className="logo-screen" />
                  <div className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-[60px] absolute top-[36px] left-[36px] drop-in">INVESTPAIR</div>
                </div>
              </div>
            </div>

            <div className="relative w-full">
              <div className="flex  absolute  w-full justify-center ">
                <div className="flex gap-[134px] ml-[45px]">
                  <div className="bg-[#4a586a] w-[207px] h-[172px] rounded-[50%]"></div>
                  <div className="bg-[#4d1322] w-[177px] h-[165px] rounded-[50%]"></div>
                </div>
              </div>

              <div className="w-full h-fit absolute  top-[85px] flex flex-col justify-center items-center">
                <div className="w-fit h-fit flex flex-col justify-center items-center">
                  <div className="font-normal text-[60px] leading-none  text-[#ffffff] w-[415px] text-center  ">Login to your account</div>
                </div>

                <div className="w-fit h-fit py-[30px] px-[44px] flex flex-col justify-center items-center">
                  <div className="flex gap-10">
                    <div className="flex flex-col items-center">
                      <div>
                        <input
                          type="text"
                          placeholder="Phone/Email"
                          onChange={(e) => setSignInDetails({ ...signInDetails, email: e.target.value })}
                          className="py-3 px-4 w-[338px] h-[54px] rounded-[28px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  "
                        />
                      </div>
                      <div className="mt-[26px]">
                        <input
                          type="password"
                          placeholder="password"
                          onChange={(e) => setSignInDetails({ ...signInDetails, password: e.target.value })}
                          className="py-3 px-4 w-[338px] h-[54px] rounded-[28px] bg-[#FFFFFF] text-[#090848] placeholder-gray-500 focus:outline-none  "
                        />
                      </div>
                      <div className="mt-[26px] cursor-pointer font-normal text-[#FFFFFF] text-xl underline underline-[#FFFFFF]  " onClick={() => router.push("/forgot-password")}>
                        Forgot password?
                      </div>

                      <div className="mt-[24px]">
                        <button className="bg-[#090848] py-3 pl-4 pr-7 rounded-[28px] flex items-center justify-between w-[338px] h-[54px]" onClick={() => onSubmit()}>
                          <span className="text-xs text-[#FFFFFF] font-normal  ">
                            Login To Your Account
                          </span>
                          <span>
                            <Image src={rightArrow} alt="Logo - SVG" width="18" />
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-[96px] font-normal text-3xl">/</div>
                    <div>
                      <div className="flex flex-col items-center">
                        <div>
                          <button className="w-[338px] h-[54px] rounded-[28px] flex gap-[29px] items-center justify-start py-3 px-5 bg-[#F6F4F4]">
                            <span>
                              <Image src={google} alt="Logo - SVG" width="21" height="21" />
                            </span>
                            <span className="text-[#090848] text-base font-normal  " onClick={() => handleGoogleLogin()}>
                              Sign In With Gmail Account
                            </span>
                          </button>
                        </div>
                        <div className="mt-[26px]">
                          <button className="w-[338px] h-[54px] rounded-[28px] flex gap-[29px] items-center justify-start py-3 px-5 bg-[#F6F4F4]">
                            <span>
                              <Image src={facebook} alt="Logo - SVG" width="21" height="21" />
                            </span>
                            <span className="text-[#090848] text-base font-normal  ">Sign in facebook account</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => router.push("/signup")}
                      className="border border-[#F6F4F4] bg-[#F6F4F4] rounded-[28px] w-[112px] h-[45px] flex items-center justify-center text-xl mt-[38px] text-[#090848]  "
                      style={{ boxShadow: "0px 20px 27.1px 0px #0000000F" }}
                    >
                      Sign Up
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