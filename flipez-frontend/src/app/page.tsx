// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// import projectLogo from "./public/images/projectLogo.svg";
// import homeBg from "./public/images/homeBg.png";
// import homeInquiry from "./public/images/homeInquiry.png";
// import user from "./public/images/userIcon.png";
// import activeNotification from "./public/images/activeNotification.png";
// import { signOut, useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { Collapse, Dropdown, MenuProps, Modal } from "antd";
// import {
//   CloseOutlined,
//   LogoutOutlined,
//   MinusOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import { logOut } from "@/app/api/service/auth.service";
// import SignInPage from "./components/auth/signInPage";
// import SignUpPage from "./components/auth/signUpPage";
// import VerificationPage from "./components/auth/verificationPage";
// import ForgotPasswordPage from "./components/auth/forgotPasswordPage";
// import SetNewPassword from "./components/auth/setNewPassword";

// export default function Home() {
//   const router = useRouter();
//   const session = useSession();

//   useEffect(() => {
//     const isGoogleLogin = localStorage.getItem("googleLogin");
//     if (isGoogleLogin) {
//       setModalOpen({
//         ...modalOpen,
//         signIn: true,
//         signUp: false,
//         verification: false,
//         forgotPassword: false,
//         setNewPassword: false,
//       });
//     }
//   }, []);

//   const setCookie = (name: string, value: any, days: any) => {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     const expires = `expires=${date.toUTCString()}`;
//     document.cookie = `${name}=${value};${expires};path=/`;
//   };

//   const [modalOpen, setModalOpen] = useState({
//     signIn: false,
//     signUp: false,
//     verification: false,
//     forgotPassword: false,
//     setNewPassword: false,
//   });

//   useEffect(() => {
//     if (session.data && session.data?.token) {
//       setCookie("token", session.data?.token, 7);
//     }
//   }, [session.data]);

//   const goToInvestmentMemo = () => {
//     if (session.data && session.data?.token) {
//       router.push("/property-overview");
//     } else {
//       onSignInClick();
//     }
//   };

//   const goToLogin = () => {
//     onSignInClick();
//   };

//   const onSignInClick = () => {
//     setModalOpen({
//       ...modalOpen,
//       signIn: true,
//       signUp: false,
//       verification: false,
//       forgotPassword: false,
//       setNewPassword: false,
//     });
//   };

//   const onSignUpClick = () => {
//     setModalOpen({
//       ...modalOpen,
//       signIn: false,
//       signUp: true,
//       verification: false,
//       forgotPassword: false,
//       setNewPassword: false,
//     });
//   };

//   const onVerification = () => {
//     setModalOpen({
//       ...modalOpen,
//       signIn: false,
//       signUp: false,
//       verification: true,
//       forgotPassword: false,
//       setNewPassword: false,
//     });
//   };

//   const onForgotPasswordClick = () => {
//     setModalOpen({
//       ...modalOpen,
//       signIn: false,
//       signUp: false,
//       verification: false,
//       forgotPassword: true,
//       setNewPassword: false,
//     });
//   };

//   const closeModal = () => {
//     setModalOpen({
//       signIn: false,
//       signUp: false,
//       verification: false,
//       forgotPassword: false,
//       setNewPassword: false,
//     });
//   };

//   const renderPage = () => {
//     if (modalOpen.signIn)
//       return (
//         <SignInPage
//           onForgotPasswordClick={onForgotPasswordClick}
//           onSignUpClick={onSignUpClick}
//           closeModal={closeModal}
//         />
//       );
//     if (modalOpen.signUp)
//       return (
//         <SignUpPage
//           onSignInClick={onSignInClick}
//           onVerificationPage={onVerification}
//         />
//       );
//     if (modalOpen.verification)
//       return <VerificationPage closeModal={closeModal} />;
//     if (modalOpen.forgotPassword)
//       return <ForgotPasswordPage onSignInClick={onSignInClick} />;
//     if (modalOpen.setNewPassword)
//       return <SetNewPassword onSignInClick={onSignInClick} />;
//     return null;
//   };

//   const goToLogOut = async () => {
//     await signOut();
//     const res = await logOut();
//     if (res) {
//       router.push("/");
//     }
//   };

//   const menuItem = [
//     {
//       key: "1",
//       label: (
//         <div style={{color: "#233f56" , fontWeight: "bold"}}>
//         {session?.data?.user?.name}
//       </div>
//       ),
//     },
//     {
//       key: "2",
//       label: (
//         <div onClick={() => router.push("/my-investment-memos")}>
//           My Investment Memos
//         </div>
//       ),
//     },
//     {
//       key: "3",
//       label: (
//         <div onClick={() => goToLogOut()}>
//           <LogoutOutlined className="mr-2" />
//           SignOut
//         </div>
//       ),
//     },
//   ];

//   const items = [
//     {
//       key: "1",
//       label: "What is Investpair.com?",
//       children: (
//         <p>
//           Investpair.com is an open marketplace that connects qualified real
//           estate investors with vetted private and hard money lenders
//           nationwide, streamlining the financing and underwriting process.
//         </p>
//       ),
//     },
//     {
//       key: "2",
//       label: "Who can use Investpair.com?",
//       children: (
//         <p>
//           Our platform is designed for real estate investors of all experience
//           levels and backgrounds, as well as private and hard money lenders
//           looking to finance real estate deals.
//         </p>
//       ),
//     },
//     {
//       key: "3",
//       label: "What is investment memo (memorandum)",
//       children: (
//         <p>
//           An investment memo for a flip and fix investor is a crucial document
//           that outlines the key aspects of a real estate investment opportunity.
//           It serves as a comprehensive summary for potential investors or
//           lenders, detailing the project's viability and financial projections.
//           This memo has:
//           <ul
//             style={{
//               listStyleType: "disc",
//               marginLeft: "30px",
//               marginTop: "10px",
//             }}
//           >
//             <li>Brief overview of the investment opportunity.</li>
//             <li>Property Details</li>
//             <li>Market Analysis</li>
//             <li>Investment Strategy</li>
//             <li>Financial Projections</li>
//             <li>Neighbor hood rating</li>
//             <li>Investment Potential Score</li>
//           </ul>
//         </p>
//       ),
//     },
//     {
//       key: "4",
//       label: "How do I get started as an investor?",
//       children: (
//         <p>
//           To start, you need to upload required verification documents, choose
//           your payment option (per deal or subscription), and submit your
//           proposed deal terms.
//         </p>
//       ),
//     },
//     {
//       key: "5",
//       label: "What documents do I need to provide?",
//       children: (
//         <p>
//           Investors must provide
//           <ul
//             style={{
//               listStyleType: "disc",
//               marginLeft: "30px",
//               marginTop: "10px",
//             }}
//           >
//             <li>FICO Score</li>
//             <li>Investment experience</li>
//             <li>Deal information and terms</li>
//             <li>Verified bank statements</li>
//             <li>Affidavit of no pending</li>
//             <li>litigation or bankruptcies</li>
//           </ul>
//         </p>
//       ),
//     },
//     {
//       key: "6",
//       label: "How long does it take to receive funding offers?",
//       children: (
//         <p>
//           Investors will be notified within 4 business days of potential lenders
//           and proposed funding terms.
//         </p>
//       ),
//     },
//     {
//       key: "7",
//       label: "How much does it cost to join Investpair?",
//       children: (
//         <p>
//           Nothing — joining HeyDiva is completely free of charge. Investpair
//           makes money by charging small success-based and subscription fees to
//           patrons and brokers.
//         </p>
//       ),
//     },
//     {
//       key: "8",
//       label: "How do I get started as a lender?",
//       children: (
//         <p>
//           Lenders must upload verification documents, pay an annual fee, and
//           then gain access to the lender portal to review investor deals.No,
//           Investpair isn’t a broker. We facilitate connections between lenders,
//           patrons, and brokers through our technology, but we don’t act as a
//           broker ourselves.
//         </p>
//       ),
//     },
//     {
//       key: "9",
//       label: "Will I always be matched with different patrons?",
//       children: (
//         <p>
//           No. Our patrons and brokers are looking to build long-term
//           relationships with lenders. Initially, you may connect with new
//           patrons or brokers entering different asset classes or markets. Once
//           established, they will continue to bring deals to you through the
//           platform, leveraging our deal creation and management tools.
//         </p>
//       ),
//     },
//     {
//       key: "10",
//       label: "Can I specify the loan types and asset classes I lend against?",
//       children: (
//         <p>
//           Absolutely. The more information you share with us about the programs
//           you offer and your lending criteria, the better your matches will be.
//           Every interaction you have with patrons is a learning opportunity for
//           our AI model so matches will get better and better over time.
//         </p>
//       ),
//     },
//     {
//       key: "11",
//       label: "What happens if I have a dispute with another user?",
//       children: (
//         <p>
//           Users are encouraged to resolve disputes amicably; however, Investpair
//           provides guidelines for mediation if necessary.
//         </p>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="w-full h-fit">
//         <div
//           className="h-[800px] w-full bg-cover bg-bottom p-[10px]"
//           style={{ backgroundImage: `url(${homeBg.src})` }}
//         >
//           <div className="flex justify-between">
//             <div className="h-[135px] relative">
//               <Image
//                 src={projectLogo}
//                 alt="Logo - SVG"
//                 width="135"
//                 height="130"
//               />
//               <div className="text-white  font-bold text-2xl md:text-3xl lg:text-4xl leading-[60px] absolute top-[36px] left-[36px] drop-in">
//                 INVESTPAIR
//               </div>
//             </div>
//             {!session.data && (
//               <div>
//                 <button
//                   onClick={() => goToLogin()}
//                   className="bg-[#d25525] rounded-3xl h-fit w-fit px-7 py-2 text-white font-semibold text-sm md:text-base lg:text-lg flex justify-center items-center"
//                 >
//                   LOGIN
//                 </button>
//               </div>
//             )}

//             {session.data && (
//               <div className="h-fit w-fit flex gap-[12px] items-center mr-[24px]">
//                 <div className="w-fit h-fit">
//                   <Dropdown menu={{ items: menuItem }} placement="bottomRight">
//                     <Image src={user} alt="Logo" width="73" height="61" />
//                   </Dropdown>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="ml-[80px] mt-[260px] flex flex-col p-[30px]">
//             <div
//               style={{ letterSpacing: "0.05em" }}
//               className="text-white  font-semibold text-3xl md:text-4xl lg:text-5xl leading-[60px] drop-in"
//             >
//               We help you finance <br /> ​your real estate deals
//             </div>
//             <div className="mt-6">
//               <button
//                 onClick={() => goToInvestmentMemo()}
//                 className="bg-[#d25525] rounded-3xl h-fit w-fit px-7 py-2 text-white  font-semibold text-sm md:text-base lg:text-lg flex justify-center items-center"
//               >
//                 GET INVESTMENT MEMO
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-[60px] bg-white w-full f-fit flex items-end">
//           <div className="w-[60%]">
//             <div className="flex flex-col">
//               <div className="ml-11 mb-10 max-w-[778px] text-3xl md:text-4xl lg:text-5xl font-bold text-[#233f56]">
//                 Take control over your ​deal financing process
//               </div>
//               <Image src={homeInquiry} alt="Logo - SVG" className="w-full" />
//             </div>
//           </div>

//           <div className="pl-[40px] w-[40%]">
//             <div className="flex flex-col items-center">
//               <div className="text-[#000] font-semibold text-base md:text-lg lg:text-2xl">
//                 We get you lowest interest rate from ​nationwide lenders to get
//                 your deal ​financed in 4 days
//               </div>
//               <div className="mt-8">
//                 <button className="bg-[#d25525] rounded-3xl h-fit w-fit px-7 py-2 text-white font-semibold text-sm md:text-base lg:text-lg flex justify-center items-center">
//                   INQUIRE NOW
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="pl-[180px] py-[60px] pr-[60px] mt-[40px] bg-white w-full f-fit flex items-center">
//           <div className="w-[40%]">
//             <div className="w-full">
//               <div className="flex justify-end relative">
//                 <video className="h-full w-full rounded-lg" controls>
//                   <source src="/videos/1LeadersData.mp4" type="video/mp4" />
//                 </video>
//               </div>
//             </div>
//           </div>

//           <div className="pl-[60px] w-[60%] flex items-center">
//             <div className="flex flex-col">
//               <div className="mb-7 text-3xl md:text-4xl lg:text-5xl font-bold text-[#233f56]">
//                 Harness the power of real-time lender data
//               </div>
//               <div className="text-[#000] font-semibold text-base md:text-lg lg:text-2xl">
//                 Access up-to-date programs, lending ​criteria, and recent
//                 transactions from ​a network of 4,000+ lenders.
//               </div>
//               <div className="mt-8">
//                 <button className="bg-[#d25525] rounded-3xl h-fit w-fit px-7 py-2 text-white font-semibold text-sm md:text-base lg:text-lg flex justify-center items-center">
//                   INQUIRE NOW
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="pl-[100px] py-[60px] pr-[60px] mt-[40px] bg-white w-full f-fit flex items-center">
//           <div className=" w-[60%] flex items-center">
//             <div className="flex flex-col">
//               <div className="mb-7 text-3xl md:text-4xl lg:text-5xl font-bold text-[#233f56]">
//                 Get your deal in front of ​the right leanders
//               </div>
//               <div className="text-[#000] font-semibold text-base md:text-lg lg:text-2xl">
//                 Our AI platform is cloud-based, enabling it to ​automatically
//                 calculate essential financial metrics, ​conduct rehab
//                 assessments, evaluate investment ​potential, and provide
//                 neighborhood scores. These ​insights are visually represented in
//                 investment ​memorandum through engaging charts and ​graphs.
//               </div>
//             </div>
//           </div>

//           <div className="w-[40%] pl-[60px]">
//             <div className="w-full">
//               <div className="flex justify-end relative">
//                 <video className="h-full w-full rounded-lg" controls>
//                   <source src="/videos/2DealData.mp4" type="video/mp4" />
//                 </video>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="pl-[100px] py-[60px] pt-[30px] pr-[60px] pb-[60px] bg-white w-full f-fit flex flex-col">
//           <span className="mb-7 text-3xl md:text-4xl lg:text-5xl font-bold text-[#233f56]">
//             Frequently Asked Questions
//           </span>

//           <Collapse
//             expandIcon={({ isActive }) => (
//               <>{isActive ? <CloseOutlined /> : <PlusOutlined />}</>
//             )}
//             defaultActiveKey={["1"]}
//             items={items}
//           />
//         </div>
//       </div>

//       <Modal
//         style={{ top: 30, color: "#000" }}
//         centered
//         open={
//           modalOpen.signIn ||
//           modalOpen.signUp ||
//           modalOpen.verification ||
//           modalOpen.forgotPassword ||
//           modalOpen.setNewPassword
//         }
//         onCancel={closeModal}
//         footer={null}
//         width={"fit-content"}
//         maskClosable={false}
//       >
//         {renderPage()}
//       </Modal>
//     </>
//   );
// }

"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SignInPage from "./components/auth/signInPage";
import SignUpPage from "./components/auth/signUpPage";
import VerificationPage from "./components/auth/verificationPage";
import ForgotPasswordPage from "./components/auth/forgotPasswordPage";
import SetNewPassword from "./components/auth/setNewPassword";
import { logOut } from "./api/service/auth.service";
import { Dropdown, Modal } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import user from "./public/images/userIcon.png";

export default function Home() {
  const router = useRouter();
  interface SessionData {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
    token?: string | null;
  }
  
  const session = useSession() as { data: SessionData | null };

  useEffect(() => {
    const isGoogleLogin = localStorage.getItem("googleLogin");
    if (isGoogleLogin) {
      setModalOpen({
        ...modalOpen,
        signIn: true,
        signUp: false,
        verification: false,
        forgotPassword: false,
        setNewPassword: false,
      });
    }
  }, []);

  const setCookie = (name: string, value: any, days: any) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const [modalOpen, setModalOpen] = useState({
    signIn: false,
    signUp: false,
    verification: false,
    forgotPassword: false,
    setNewPassword: false,
  });

  useEffect(() => {
    if (session.data && session.data?.token) {
      setCookie("token", session.data?.token, 7);
    }
  }, [session.data]);

  const goToInvestmentMemo = () => {
    if (session.data && session.data?.token) {
      router.push("/property-overview");
    } else {
      onSignInClick();
    }
  };

  const goToLogin = () => {
    onSignInClick();
  };

  const onSignInClick = () => {
    setModalOpen({
      ...modalOpen,
      signIn: true,
      signUp: false,
      verification: false,
      forgotPassword: false,
      setNewPassword: false,
    });
  };

  const onSignUpClick = () => {
    setModalOpen({
      ...modalOpen,
      signIn: false,
      signUp: true,
      verification: false,
      forgotPassword: false,
      setNewPassword: false,
    });
  };

  const onVerification = () => {
    setModalOpen({
      ...modalOpen,
      signIn: false,
      signUp: false,
      verification: true,
      forgotPassword: false,
      setNewPassword: false,
    });
  };

  const onForgotPasswordClick = () => {
    setModalOpen({
      ...modalOpen,
      signIn: false,
      signUp: false,
      verification: false,
      forgotPassword: true,
      setNewPassword: false,
    });
  };

  const closeModal = () => {
    setModalOpen({
      signIn: false,
      signUp: false,
      verification: false,
      forgotPassword: false,
      setNewPassword: false,
    });
  };

  const renderPage = () => {
    if (modalOpen.signIn)
      return (
        <SignInPage
          onForgotPasswordClick={onForgotPasswordClick}
          onSignUpClick={onSignUpClick}
          closeModal={closeModal}
        />
      );
    if (modalOpen.signUp)
      return (
        <SignUpPage
          onSignInClick={onSignInClick}
          onVerificationPage={onVerification}
        />
      );
    if (modalOpen.verification)
      return <VerificationPage closeModal={closeModal} />;
    if (modalOpen.forgotPassword)
      return <ForgotPasswordPage onSignInClick={onSignInClick} />;
    if (modalOpen.setNewPassword)
      return <SetNewPassword onSignInClick={onSignInClick} />;
    return null;
  };

  const goToLogOut = async () => {
    await signOut();
    const res = await logOut();
    if (res) {
      router.push("/");
    }
  };
  const menuItem = [
    {
      key: "1",
      label: (
        <div style={{ color: "#233f56", fontWeight: "bold" }}>
          {session?.data?.user?.name}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <>
          {session?.data?.user?.role !== "admin" && <div onClick={() => router.push("/my-investment-memos")}>
            My Investment Memos
          </div>}
          {session?.data?.user?.role == "admin" && <div onClick={() => {
            debugger
            router.push("/admin/investment-memos")
          }}>
            Investment Memos
          </div>}
        </>
      ),
    },
    {
      key: "3",
      label: (
        <div onClick={() => goToLogOut()}>
          <LogoutOutlined className="mr-2" />
          SignOut
        </div>
      ),
    },
  ];

  const onHome = () => {
    window.location.href = "https://www.investpair.com";
  };

  return (
    <>
      <div className="bg-gray-100  xl:px-[16%] xl:py-[60px] md:px-[16%] md:py-[60px]  min-h-screen">
        <div className="flex justify-end items-center bg-transparent rounded-md p-4">
          <div className="flex items-center gap-2">
            <button
              className="bg-[#1b54da] text-white px-4 py-2 rounded"
              onClick={() => onHome()}
            >
              Home
            </button>
            {!session.data && (
              <button
                className="bg-[#1b54da] text-white px-4 py-2 rounded"
                onClick={() => goToLogin()}
              >
                Login
              </button>
            )}

            {session.data && (
              <div className="h-fit w-fit flex gap-[12px] items-center">
                <div className="w-fit h-fit">
                  <Dropdown menu={{ items: menuItem }} placement="bottomRight">
                    <div
                      id="avatarButton"
                      className="relative w-10 h-10 overflow-hidden bg-[#1b54da] rounded-full dark:bg-[#1b54da] cursor-pointer"
                    >
                      <svg
                        className="absolute w-12 h-12 text-white -left-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </Dropdown>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <img
              src="https://cdn.gamma.app/8q11b96mb8tpz6n/4ce6cbdda28c4a579244368343fb4cba/original/Transparent_logo.png"
              alt="Transparent Logo"
              className="w-full max-w-[239px] ml-8"
            />
            <h1 className="text-4xl font-medium text-center mt-5 text-[#1b1b27]">
              Get Your
            </h1>
            <h1 className="text-4xl font-medium text-center text-[#1b1b27] mt-2">
              Investment Memo
            </h1>
            <button
              className="mt-6 border border-[#1b54da] text-[#1b54da] px-6 py-2 rounded hover:bg-[#1b54da] hover:text-white font-semibold text-xl"
              onClick={() => goToInvestmentMemo()}
            >
              Get Started
            </button>
          </div>

          <div className="flex justify-end items-center">
            <img
              src="https://cdn.gamma.app/8q11b96mb8tpz6n/generated-images/qwaiRp0PyL3LqWaop9EsT.jpg"
              alt="Generated Content"
              className="w-full max-w-lg rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
      <Modal
        style={{ top: 30, color: "#000" }}
        centered
        open={
          modalOpen.signIn ||
          modalOpen.signUp ||
          modalOpen.verification ||
          modalOpen.forgotPassword ||
          modalOpen.setNewPassword
        }
        onCancel={closeModal}
        footer={null}
        width={"fit-content"}
        maskClosable={false}
      >
        {renderPage()}
      </Modal>
    </>
  );
}
