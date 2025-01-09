import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { getForgotPassword } from '@/app/api/service/auth.service';

interface Props {
  onSignInClick: () => void;
}

const ForgotPasswordPage: React.FC<Props> = ({onSignInClick}) => {

    const [email , setEmail] = useState<string>('');
    const [errors , setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {
          email: '',
        };
    
        if (!email) {
            newErrors.email = 'Email is required.';
        }
        if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
          newErrors.email = 'Email is Invalid.';
          toast.error('Email is Invalid.');
        }
    
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const onSubmit = async () => {
        
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
        }else{
          setIsLoading(false);
          return false;
        }
      }


  const antdTitle = {
    paddingBottom: '30px',
    color: '#2d4756',
    fontSize: '34px',
    fontWeight: '300',
    textAlign: 'center' as const,
  };

  const inputBoxStyle = {
    height: '42px',
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: '3px',
    border: '1px solid #607E90',
    color: '#2d4756',
    fontSize: '14px',
    lineHeight: 'normal',
    paddingInlineStart: '40px',
  }

  const inputBoxErrorStyle = {
    border: '1px solid red',
    height: '42px',
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: '3px',
    color: '#2d4756',
    fontSize: '14px',
    lineHeight: 'normal',
    paddingInlineStart: '40px',
  }

  return (
    <div className="h-fit w-fit px-8 pt-8">
      <div className="bg-white rounded-lg w-[200px] sm:w-[300px] md:w-[400px]">
        <h2 style={antdTitle}>Reset Password</h2>

        <div className="mb-2">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-[#607e90] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <input
                type="text"
                id="input-group-1"
                onChange={(e) => {setEmail(e.target.value);setErrors({...errors , email : ''})}}
                 style={errors.email ? inputBoxErrorStyle : inputBoxStyle}
                className=" focus:outline-none "
                placeholder="Email Address"
              />
            </div>
          </div>

        <div className="text-[#607E90] text-base font-medium mb-8">Enter the email address associated with your account, and we’ll email you a link to reset your password.</div>


        <button className="w-full bg-[#d25525] text-white py-2 rounded-lg font-bold" onClick={onSubmit}>
            Send Reset Link {isLoading && <Spin className='ml-4' indicator={<LoadingOutlined spin />} size="small" />}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">
            Remember your password?{" "}
          <a  className="text-blue-500" onClick={onSignInClick}>    
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
