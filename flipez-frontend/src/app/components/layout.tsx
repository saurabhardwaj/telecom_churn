import Image from "next/image";
import projectLogo from "./../public/images/projectLogo.svg";
import { Progress } from "antd";
import { forwardRef, useEffect, useState } from "react";
import askQuestions from "./../public/images/askQuestions.svg";
import contactUs from "./../public/images/contactUs.svg";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Layout = (props: { calculatePercentage: any; stage: any }) => {
  const router = useRouter();

  const [layoutStage, setLayoutStage] = useState([
    { label: "Registration", completed: false },
    { label: "Preview Questions", completed: false },
    { label: "Personal Details", completed: false },
    { label: "Investment Details", completed: false },
    { label: "Review & Submit", completed: false },
    { label: "Download Memo", completed: false },
  ]);

  const currentStageIndex = layoutStage.findIndex(
    (stage) => stage.label === props.stage
  );

  const completedStages = layoutStage.map((stage, index) => {
    return {
      ...stage,
      completed: (index < currentStageIndex || props.stage === 'Download  Memo') ? true : false,
    };
  });

  useEffect(() => {
    setLayoutStage(completedStages);
  }, [props.stage]);

  const goToLogOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div className="w-full h-full relative">
        <div className="bg-[#083c6d] h-[113px] w-full">
          <div className="h-[69px] w-full pt-[22px] pl-3">
            <div
              className="h-[64] relative cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
                src={projectLogo}
                alt="Logo - SVG"
                width="64"
                height="64"
                className="logo-screen"
              />
              <div className="text-white font-bold text-sm md:text-lg lg:text-xl leading-[60px] absolute top-[12px] left-[20px] drop-in">
                INVESTPAIR
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-fit py-8 pl-5">
          {props.stage != "memoHistory" &&
            layoutStage &&
            layoutStage.map((value: any, index: number) => (
              <div
                key={index}
                className={`w-full h-fit flex justify-between items-center ${
                  value.label !== props.stage && value.completed
                    ? "pr-[8px] "
                    : "pr-[30px] "
                } ${
                  value.label === props.stage
                    ? "text-[#083c6d] border-l-[#083c6d] border-l-[3.5px] pl-[9px]"
                    : "text-[#0000006b] border-l-[#D9D9D9] border-l-[1.5px] pl-[11px]"
                } py-[11px]  `}
              >
                <div
                  className={`font-normal text-lg leading-none   pr-2  ${
                    value.label === props.stage ? "font-medium" : "font-normal"
                  }`}
                >
                  {value.label}
                </div>
                {value.label !== props.stage && value.completed && (
                  <div>
                    {" "}
                    <Progress
                      percent={100}
                      strokeColor="#083c6d"
                      trailColor="#D9D9D9"
                      size={[108, 7]}
                    />
                  </div>
                )}
                {value.label === props.stage && (
                  <div>
                    {" "}
                    <Progress
                      percent={props.calculatePercentage}
                      strokeColor="#083c6d"
                      trailColor="#D9D9D9"
                      size={[86, 7]}
                      showInfo={false}
                    />
                  </div>
                )}
                {value.label !== props.stage && !value.completed && (
                  <div>
                    {" "}
                    <Progress
                      percent={0}
                      strokeColor="#083c6d"
                      trailColor="#D9D9D9"
                      size={[86, 7]}
                      showInfo={false}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>

        <div className="absolute bottom-[24px] w-[324px] pl-[22px]">
          <div className="mt-4">
            <button
              className="text-[17px] bg-white hover:bg-[#ff090991] text-[#ff090991] hover:text-[#FFFFFF] border border-[#ff090991] px-3 py-[4px] h-[43px] w-fit flex justify-center items-center rounded-[14px]"
              onClick={() => goToLogOut()}
            >
              <LogoutOutlined className="mr-[8px]" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default forwardRef(Layout);
