import { LoadingOutlined } from "@ant-design/icons";
import { Divider, Select, Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { getCityList, getState, signUp } from "@/app/api/service/auth.service";
import toast from "react-hot-toast";

interface SignUpPageProps {
  onSignInClick: () => void; 
  onVerificationPage: () => void
}

const SignUpPage:React.FC<SignUpPageProps> = ({ onSignInClick , onVerificationPage }) => {
  const [signUpDetails, setSignUpDetails] = useState<any>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    role: "lender",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    city: "",
    state: "",
  });
  const [stateData, setStateData] = useState<any>([]);
  const [cityData , setCityData] = useState([]);
  const [isSignUpWithEmail , setIsSignUpWithEmail] = useState<boolean>(false);

  useEffect(() => {
    setIsSignUpWithEmail(false);
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

const handleStateChange =(value: any) => {
    setSignUpDetails({ ...signUpDetails, state: value.label, city: '' });
    setCityData([]);
    const stateCode = stateData.find((state: any) => state.name === value.label)?.state_code;
    getCityData(stateCode);    
  }

  
const stateOptions = stateData.map((state :any ) => ({
    label: state.name,
    value: state.id,
  }));

  const cityOptions = cityData.map((city :any ) => ({
    label: city.name,
    value: city.id,
  }));

  const router = useRouter();

  const validateForm = () => {
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phone: "",
      city: "",
      state: "",
    };
    if (!signUpDetails.email) {
      newErrors.email = "Email is required.";
    }
    if (signUpDetails.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(signUpDetails.email)) {
      newErrors.email = "Email is Invalid.";
      toast.error("Email is Invalid.");
    }
    if (!signUpDetails.firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!signUpDetails.lastName) {
      newErrors.lastName = "Last name is required.";
    }
    if (!signUpDetails.password) {
      newErrors.password = "Password is required.";
    }
    if (!signUpDetails.phone) {
      newErrors.phone = "Phone is required.";
    }
    if (signUpDetails.phone &&signUpDetails.phone.length < 10) {
      newErrors.phone = "Phone number should be 10 digits.";
      toast.error("Phone number should be 10 digits.");
    }
    if (!signUpDetails.city) {
      newErrors.city = "City is required.";
    }
    if (!signUpDetails.state) {
      newErrors.state = "State is required.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  }; 
   const createSignUp = async () => {
    if(validateForm()){
      setIsLoading(true);
      const res = await signUp(signUpDetails);
      if (res) {
        try {
          onVerificationPage();
         
        } catch (error) {
          console.error("Sign-in failed:", error);
        }
        setIsLoading(false);
      }  else {
        setIsLoading(false);
        return false;
      }
    }
  }

  const handleGoogleLogin = async () => {
    await signIn("google", {
      redirect: false,
    });
  };

  const antdTitle = {
    paddingBottom: "30px",
    color: "#2d4756",
    fontSize: "34px",
    fontWeight: "300",
    textAlign: "center" as const,
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
    padding: '10px',
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
    padding: '10px',
  }



  return (
    <div className="h-fit w-fit px-8 pt-8 ">
      <div className="bg-white rounded-lg w-[300px] sm:w-[400px] md:w-[500px]">
        <h2 style={antdTitle}>
          Sign Up to Continue
        </h2>
        {/* <button className="flex items-center justify-center w-full border-[2px] border-[#4967a8] bg-[#4967a8] text-white py-2 px-4 rounded-sm mb-4 h-[42px] text-base font-semibold">
          <div className="mr-2 mt-[-4px]">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
              <path fill="#4967a8" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
              <path
                fill="#fff"
                d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
              ></path>
            </svg>
          </div>
          Through Facebook
        </button> */}
        <button
          className="flex items-center justify-center w-full  border-[2px] border-[#D24B3D] text-[#2d4756] py-2 px-4 rounded-sm mb-9 h-[42px] text-base font-semibold"
          onClick={handleGoogleLogin}
        >
          <div className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
          </div>
          With Google
        </button>

        <div className="text-center text-[#2d4756] mb-6 px-16">
          <Divider style={{ borderColor: "#dbd7cb" }}>OR</Divider>
        </div>

        {!isSignUpWithEmail ?
          <button
          className="flex items-center justify-center w-full  border-[2px] border-[#607E90] text-[#2d4756] py-2 px-4 rounded-sm mb-9 h-[42px] text-base font-semibold"
          onClick={() => setIsSignUpWithEmail(true)}
        >
            <div className="mr-3">
              <svg className="w-5 h-5 text-[#607e90] " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </div>
          Sign up with Email
        </button>
         :
         <>
            <div className="text-[#2d4756] text-lg font-medium mb-2 text-center">Sign up with Email</div>

            <div className="flex justify-center w-full items-center h-fit mt-[30px]">
                <div className="bg-gray-200 p-1 rounded-sm flex w-full">
                  <button
                    className={`px-10 w-[50%] md:px-14 py-2 font-semibold rounded-sm transition-all 
                    ${signUpDetails.role === "lender" ? "bg-[#2d4756] text-white" : "bg-white text-black"}`}
                    onClick={() => setSignUpDetails({ ...signUpDetails, role: "lender" })}
                  >
                    Lender
                  </button>
                  <button
                    className={`px-10 w-[50%] md:px-14  py-2 font-semibold rounded-sm transition-all 
                    ${signUpDetails.role === "borrower" ? "bg-[#2d4756] text-white" : "bg-white text-black"}`}
                    onClick={() => setSignUpDetails({ ...signUpDetails, role: "borrower" })}
                  >
                    Borrower
                  </button>
                </div>
              </div>

            <div className="mb-3 mt-4">
              <div>
                <input
                  type="text"
                  onChange={(e) => {
                    setSignUpDetails({ ...signUpDetails, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  id="input-group-1"
                  style={errors.email ? inputBoxErrorStyle : inputBoxStyle}
                  className=" focus:outline-none "
                  placeholder="Email Address"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      setSignUpDetails({ ...signUpDetails, firstName: e.target.value });
                      setErrors({ ...errors, firstName: "" });
                    }}
                    id="input-group-1"
                    style={errors.firstName ? inputBoxErrorStyle : inputBoxStyle}
                    className=" focus:outline-none "
                    placeholder="First Name"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      setSignUpDetails({ ...signUpDetails, lastName: e.target.value });
                      setErrors({ ...errors, lastName: "" });
                    }}
                    id="input-group-1"
                    style={errors.lastName ? inputBoxErrorStyle : inputBoxStyle}
                    className=" focus:outline-none "
                    placeholder="Last Name"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <div>
                  <input
                    type="password"
                    id="input-group-1"
                    onChange={(e) => {
                      setSignUpDetails({ ...signUpDetails, password: e.target.value });
                      setErrors({ ...errors, password: "" });
                    }}
                    style={errors.password ? inputBoxErrorStyle : inputBoxStyle}
                    className=" focus:outline-none "
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="mb-3">
                <div>
                  <input
                    type="text"
                    id="input-group-1"
                    onChange={(e) => {
                      setSignUpDetails({ ...signUpDetails, phone: e.target.value });
                      setErrors({ ...errors, phone: "" });
                    }}
                    style={errors.phone ? inputBoxErrorStyle : inputBoxStyle}
                    className=" focus:outline-none "
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <Select 
                  labelInValue
                  onChange={(e) => {
                    handleStateChange(e);
                  }}
                  options={stateOptions}
                  placeholder="Select a state"
                  className={`h-[42px] w-full ${errors.state ? "errorSearchState" : "searchState"}`}
                />
              </div>
              <div className="mb-3">
                <Select
                  labelInValue
                  options={cityOptions}
                  value={signUpDetails.city ? { value: signUpDetails.city, label: signUpDetails.city } : undefined}
                  onChange={(e) => {
                    setSignUpDetails({ ...signUpDetails, city: e.label });
                  }}
                  placeholder="Select a city"
                  className={`h-[42px] w-full ${errors.city ? "errorSearchState" : "searchState"}`}                />
              </div>
            </div>

            <button className="mt-2 w-full h-[42px] bg-[#d25525] text-white py-2 rounded-sm font-bold" onClick={createSignUp}>
              Sign Up Now {isLoading && <Spin className="ml-4" indicator={<LoadingOutlined spin />} size="small" />}
            </button>
         </>
         }



        <div className="text-center mt-4 text-sm text-gray-500">
          Already have an account? <a className="text-blue-500" onClick={onSignInClick}>Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
