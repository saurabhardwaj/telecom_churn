import { LoadingOutlined } from "@ant-design/icons";
import { Divider, Spin, Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { apiInstance } from "@/app/api-utils";
import toast from "react-hot-toast";
import { getPropertyDetails } from "@/app/api/service/property-overview.service";
import { clearSession } from "@/app/api/service/user.service";
import { getInvestmentDetails } from "@/app/api/service/investment-details.service";

const { confirm } = Modal;

interface SignInPageProps {
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
  closeModal: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({
  onSignUpClick,
  onForgotPasswordClick,
  closeModal,
}) => {
  useEffect(() => {
    const isGoogleLogin = localStorage.getItem("googleLogin");
    if (isGoogleLogin) {
      localStorage.removeItem("googleLogin");
      handleGoogle();
    }
  }, []);

  const [signInDetails, setSignInDetails] = useState<any>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  // const [modal, contextHolder] = Modal.useModal();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [propertyName, setPropertyName] = useState<string>("");

  // const showConfirm = () => {
  //   confirm({
  //     title: "Would you like to resume your previous session or start over? Your progress will be saved until payment is complete.",
  //     okText: "Start Over",
  //     cancelText: "Resume Session",
  //     okType: "primary",
  //     onOk() {
  //       clearSession();
  //     },
  //     onCancel() {
  //       router.push("/property-overview");
  //     },
  //   });
  // };

  const handleGoogle = async () => {
    const isQuestionModelOpen = await getPropertyData();
    if (isQuestionModelOpen) {
      showConfirm();
      closeModal();
    }
  };

  const showConfirm = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    clearSession();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    if(propertyName === "INVESTMENT") {
      router.push("/investment-details");
    } else {
      router.push("/property-overview");
    }
    setIsModalVisible(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    if (!signInDetails.email) {
      newErrors.email = "Email is required.";
    }
    if (
      signInDetails.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(signInDetails.email)
    ) {
      newErrors.email = "Email is Invalid.";
      toast.error("Email is Invalid.");
    }
    if (!signInDetails.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const getPropertyData = async () => {
    const res = await getPropertyDetails();
    const investmentRes = await getInvestmentDetails();
    setPropertyName((investmentRes?._id) ? "INVESTMENT" : res?.propertyOverview?.address);
    return res ? true : false;
  };

  const onSubmit = async () => {
    setErrors({});

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await apiInstance({
          method: "post",
          url: "/signin",
          data: signInDetails,
        });
        if (response.status === 200) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.user));
          await signIn("credentials", {
            isSuccess: true,
            email: response.data.user.email,
            id: response.data.user._id,
            token: response.data.token,
            role: response.data.user.role,
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            redirect: false,
          });
          const isQuestionModelOpen = await getPropertyData();
          if (isQuestionModelOpen) {
            showConfirm();
            setIsLoading(false);
          }
          setIsLoading(false);
          closeModal();
        } else {
          setIsLoading(false);
          return false;
        }
        setIsLoading(false);
        return false;
      } catch (error) {
        setIsLoading(false);
        return false;
      }
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", {
      redirect: false,
      // callbackUrl: process.env.NEXTAUTH_URL
    });
    localStorage.setItem("googleLogin", "true");
  };

  const antdTitle = {
    paddingBottom: "30px",
    color: "#2d4756",
    fontSize: "34px",
    fontWeight: "300",
    textAlign: "center" as const,
  };

  const inputBoxStyle = {
    height: "42px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "3px",
    border: "1px solid #607E90",
    color: "#2d4756",
    fontSize: "14px",
    lineHeight: "normal",
    paddingInlineStart: "40px",
  };

  const inputBoxErrorStyle = {
    border: "1px solid red",
    height: "42px",
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: "3px",
    color: "#2d4756",
    fontSize: "14px",
    lineHeight: "normal",
    paddingInlineStart: "40px",
  };

  return (
    <>
      <div className="h-fit w-fit px-8 pt-8">
        <div className="bg-white rounded-lg w-[300px] sm:w-[400px] md:w-[500px]">
          <h2 style={antdTitle}>Sign In to Continue</h2>
          {/* <button className=" flex items-center justify-center w-full border-[2px] border-[#4967a8] bg-[#4967a8] text-white py-2 px-4 rounded-sm mb-4 h-[42px] text-base font-semibold">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 48 48"
              >
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

          <div className="text-[#2d4756] text-lg font-medium mb-2 text-center">
            Sign in with Email
          </div>

          <div className="mb-4 mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-[#607e90] "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <input
                type="text"
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setSignInDetails({ ...signInDetails, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                id="input-group-1"
                style={errors.email ? inputBoxErrorStyle : inputBoxStyle}
                className=" focus:outline-none "
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="mb-4 mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="16"
                  height="16"
                  viewBox="0 0 30 30"
                >
                  <path
                    fill="#607E90"
                    d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                onKeyDown={handleKeyDown}
                id="input-group-1"
                onChange={(e) => {
                  setSignInDetails({
                    ...signInDetails,
                    password: e.target.value,
                  });
                  setErrors({ ...errors, password: "" });
                }}
                style={errors.password ? inputBoxErrorStyle : inputBoxStyle}
                className=" focus:outline-none "
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#083c6d]" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a
              className="text-sm text-blue-500"
              onClick={onForgotPasswordClick}
            >
              Forgot password?
            </a>
          </div>

          <button
            className="w-full bg-[#d25525] text-white py-2 rounded-lg font-bold"
            onClick={onSubmit}
          >
            Sign In Now{" "}
            {isLoading && (
              <Spin
                className="ml-4"
                indicator={<LoadingOutlined spin />}
                size="small"
              />
            )}
          </button>

          <div className="text-center mt-4 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a className="text-blue-500" onClick={onSignUpClick}>
              Sign Up
            </a>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        footer={null}
        open={isModalVisible}
        closable={false}
        centered
        width={"fit-content"}
        maskClosable={false}
      >
        <div className="h-fit w-fit px-8 pt-8">
          <div className="bg-white rounded-lg w-[300px] sm:w-[400px] md:w-[500px]">
            <div className="text-center">
              <h2 className="text-4xl font-medium text-gray-800">
                Resume Your Session
              </h2>
              <div className="mt-6 text-gray-500 text-xl font-normal">
                Welcome back! It looks like you were working on
              </div>
              <div className="text-blue-500 text-lg font-semibold">
                {propertyName}
              </div>

              <div className="mt-3 text-gray-500 text-xl font-normal">
                Would you like to:
              </div>
            </div>

            <div className="mt-10 mb-4 flex justify-end gap-6 items-center w-full">
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-lg"
                onClick={handleCancel}
              >
                Resume Session
              </button>
              <button
                className="w-full border border-gray-500 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold text-lg"
                onClick={handleOk}
              >
                Start from Beginning
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignInPage;
