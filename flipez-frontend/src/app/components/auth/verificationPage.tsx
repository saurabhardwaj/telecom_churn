import { LoadingOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { getVerificationCode, resendVerificationCode } from '@/app/api/service/auth.service';

interface verificationPage {
  closeModal: () => void; 
}

const VerificationPage:React.FC<verificationPage> = ({closeModal}) => {

  const [code, setCode] = useState('');
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
    } else {
      setIsLoading(true);
      const verifyCode = { verificationCode: Number(code) };
      const res = await getVerificationCode(verifyCode);
      if (res) {
         await signIn("credentials", {
            isSuccess: true,
            email: res.user.email,
            id: res.user._id,
            token: res.token,
            redirect: false,
          });
        closeModal();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return false;
      }
    }
  };

  const resendCode = async () => {
    await resendVerificationCode();
  }

  return (
    <div className="h-fit w-fit px-8 pt-8">
      <div className="bg-white rounded-lg w-[200px] sm:w-[200px] md:w-[300px]">
        <div className='flex place-content-center'>
          <button className="flex items-center justify-center w-[80px] h-[80px]  bg-[#2d4756] text-white rounded-full mb-4 text-base font-semibold">
            <div>
              <svg className="w-[50px] h-[30px] text-[#FFFFFF] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
            </div>
          </button>
        </div>

        <div className="text-[#2d4756] text-lg font-medium mb-2 text-center">Check your email inbox and enter the code we sent you</div>

          <div className='mb-4 mt-8 flex place-content-center'><Input.OTP className="custom-otp" length={6} {...sharedProps} /></div>

          <button className="w-full bg-[#d25525] text-white py-2 rounded-lg font-bold" onClick={onSubmit}>
            Verify Email  {isLoading && <Spin className='ml-4' indicator={<LoadingOutlined spin />} size="small" />}
          </button>

          <div className="text-center mt-4 text-sm text-gray-500" >
            <a className="text-blue-500" onClick={resendCode}>Resend code</a>  
          </div>

      </div>
    </div>
  );
};

export default VerificationPage;
