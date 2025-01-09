import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getResetPassword } from '@/app/api/service/auth.service';

interface Props {
  onSignInClick: () => void
}

const SetNewPassword: FC<Props> = ({onSignInClick}) => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [token, setToken] = useState<string | null>(null);

    const validateForm = () => {
        const newErrors = {
          password: '',
          confirmPassword: '',
        };
    
        if (!password) {
            newErrors.password = 'Password is required.';
        }
        if (!confirmPassword) {
          newErrors.confirmPassword = 'Confirm Password is required.';
        }
        if (confirmPassword !== password) {
          newErrors.confirmPassword = 'Password and Confirm Password should be same.';
          toast.error('Password and Confirm Password should be same.');
        }
    
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryToken = params.get('token');
        setToken(queryToken);
      }, []);

    const onSubmit = async () => {
        if(validateForm()){
          setIsLoading(true);
          const verifyPassword = {token: token ,password : password}
          const res = await getResetPassword(verifyPassword);
          if (res) {
            toast.success('Password reset successfully!');
            onSignInClick();
            setIsLoading(false);
          }  else {
            toast.error('Failed to reset password. Please try again.');
            setIsLoading(false);
            return false;
          }
        }else{
          setIsLoading(false);
          return false;
        }
      }


  const antdTitle = {
    paddingBottom: '20px',
    color: '#2d4756',
    fontSize: '34px',
    fontWeight: '300',
    textAlign: 'center' as const,
  };

  return (
    <div className="h-fit w-fit px-8 pt-8">
      <div className="bg-white rounded-lg w-[200px] sm:w-[300px] md:w-[400px]">
        <h2 style={antdTitle}>
          Set New Password
        </h2>

        <div className="mb-2">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 30 30">
                  <path
                    fill="#607E90"
                    d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                id="input-group-1"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className="h-[42px] bg-white border border-[#607E90] text-[#2d4756] text-sm rounded-sm focus:outline-none  block w-full ps-10 p-2.5  "
                placeholder="New Password"
              />
            </div>
          </div>

          <div className="mb-8 mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 30 30">
                  <path
                    fill="#607E90"
                    d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                id="input-group-1"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: "" });
                }}
                className="h-[42px] bg-white border border-[#607E90] text-[#2d4756] text-sm rounded-sm focus:outline-none  block w-full ps-10 p-2.5  "
                placeholder="Repeat New Password"
              />
            </div>
          </div>

          <button className="w-full bg-[#d25525] text-white py-2 rounded-lg font-bold" onClick={onSubmit}>
            Set New Password {isLoading && <Spin className="ml-4" indicator={<LoadingOutlined spin />} size="small" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
