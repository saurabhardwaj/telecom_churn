"use client";
import Image from "next/image";
import { Button, Col, Progress, Row } from 'antd';
import Layout from "../components/layout";
import BorrowerInformation from "../components/borrowerInformation";
import RehabAssessment from "../components/rehabAssessment";
import InteriorExteriorRepairs from '../components/interiorExteriorRepairs';
import PropertyOverviewPage from "../components/PropertyOverviewPage";
import leftArrowCircle from './../public/images/leftArrowCircle.svg';
import React, { useRef, useState, useEffect } from "react";
import { createPropertyDetails, getPropertyDetails, updatePropertyDetails } from "@/app/api/service/property-overview.service"
import { getState } from "../api/service/auth.service";
import { useRouter } from "next/navigation";
import editInfo from '../public/images/edit-info.png';
import { CheckSquareFilled} from "@ant-design/icons";

export default function PropertyOverview() {
    const formRef = useRef<{ handleSubmit: () => void } | null>(null);
    const router = useRouter();
    const [step, setStep] = React.useState(1);
    const [isFinishSteps, setIsFinishSteps] = useState(false);

    const calculatePercentage = (currentStep: number) => {
        const totalSteps = 4;
        return (currentStep / totalSteps) * 100;
      };

    const [isNextClicked, setIsNextClicked] = useState(false);
    const loanDetails = {
        loanAmount: 0,
        loanPosition: '1st Lien',
    };
    const borrowerInformation = {
        fullName: '',
        ficoScore: 0,
        flipCompleteCount: '',
    };
    const rehabAssessment = {
        demolitionStatus: '',
        debrisRemovalStatus: '',
        waterDamageStatus: '',
        foundationStatus: '',
        roofStatus: '',
        electricalStatus: '',
        hvacUpdateStatus: '',
        willAddExtraBed: '',
    };
    const interiorDetails = {
        dryWallStatus: '',
        floorStatus: '',
        rePlaintStatus: '',
        bathroomUpdateStatus: '',
        landScrapingStatus: '',
        exteriorPaintingStatus: '',
    }
    const [propertyDetails, setPropertyDetails] = useState<any>({
        _id: '',
        propertyOverview: {
            address: '',
            isHaveLiesOrEncumbrances: '',
            initialPurchasePrice: '',
            equity: 0,
        },
        loanDetails: loanDetails,
        borrowerInformation: borrowerInformation,
        rehabAssessment: rehabAssessment,
        interiorDetails: interiorDetails,
        lastCompleteStep: '',
    });

    useEffect(() => {
       getData();
    }, []);



    const checkPropertyDetails = (res : any) => {
        if(!res.loanDetails) {
            res.loanDetails = loanDetails;
        }

        if(!res.borrowerInformation) {
            res.borrowerInformation = borrowerInformation;
        }

        if(!res.rehabAssessment) {
            res.rehabAssessment = rehabAssessment;
        }

        if(!res.interiorDetails) {
            res.interiorDetails = interiorDetails;
        }

        return res;
    }

    const getData = async () => {
        const res = await getPropertyDetails();
        if (res) {
            setPropertyDetails(checkPropertyDetails(res));
            // setStep(res.lastCompleteStepNumber + 1);
        }
    }

    const processNextStep = () => {
        if (step < 6) {
            setStep(step + 1);
        }
    };

    const createData = async () => {
        const res = await createPropertyDetails(propertyDetails);
        if (res) {
            processNextStep()
            getData();
        }
    }

    const updateData = async () => {
        const body = JSON.parse(JSON.stringify(propertyDetails));
        body.lastCompleteStepNumber = step;
        const res = await updatePropertyDetails(body, body._id);
        if (res) {
            processNextStep()
            getData();
        }
    }

    const nextStep = () => {
        setIsNextClicked(true);
        if (formRef.current) {
            const isValid: any = formRef.current.handleSubmit();
            if (isValid) {                
                if(propertyDetails._id) {
                    updateData();
                } else {
                    createData();
                }
            }
        }
    };

    const previousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
      <>
        <div className="bg-[#FFFFFF] w-full h-full">
          <div className="flex h-full w-full">
            <div className="border-r border-r-[#D9D9D9] w-[324px] min-w-fit">
              <Layout calculatePercentage={calculatePercentage(step)} stage={"Preview Questions"}></Layout>
            </div>
            <div style={{ width: "calc(100% - 324px)" }} className="h-full overflow-auto">
              <div className="bg-[#FFFFFF] w-full h-fit min-h-full p-6 relative">
                {step < 5 && <div className="text-[#000000] font-bold text-[40px] leading-none  border-b-2 border-b-[#000000] w-fit">Lets review your property</div>
                }
                {step < 5 && <div className="ml-[160px] w-fit h-fit my-[40px]">
                  <div className="flex flex-start items-start gap-5">
                    {step > 1 && (
                      <div className="mt-2 cursor-pointer" onClick={previousStep}>
                        <Image src={leftArrowCircle} alt="Logo - SVG" width="42" height="42" />
                      </div>
                    )}
                    {step == 1 && <div className="w-[42px]"></div>}
                    <div>
                      <div className="text-[#000000] font-normal text-[27px] leading-none  ">
                        {step === 1 && "Property Overview"}
                        {/* {step === 2 && "Loan Details"} */}
                        {step === 2 && "Borrower’s Information"}
                        {step === 3 && "Rehab Assessment"}
                        {step === 4 && "Interior & Exterior Repairs"}
                      </div>
                      <div>
                        {" "}
                        <Progress percent={calculatePercentage(step)} strokeColor="#EFAB2C" trailColor="#D9D9D9" size={[417, 6]} showInfo={false} />
                      </div>

                      <div className="mt-[22px] w-full">
                        {step === 1 && <PropertyOverviewPage ref={formRef} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} isNextClicked={isNextClicked} />}
                        {/* {step === 2 && <LoanDetails ref={formRef} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} isNextClicked={isNextClicked} />} */}
                        {step === 2 && <BorrowerInformation ref={formRef} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} isNextClicked={isNextClicked} />}
                        {step === 3 && <RehabAssessment ref={formRef} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} isNextClicked={isNextClicked} />}
                        {step === 4 && <InteriorExteriorRepairs ref={formRef} propertyDetails={propertyDetails} setPropertyDetails={setPropertyDetails} isNextClicked={isNextClicked} />}
                      </div>
                    </div>
                  </div>
                </div>}

                {step === 5 && (
                  <div className="w-[85%] h-[80%] absolute flex justify-center items-center flex-col">
                      <div className="flex flex-col justify-center items-center w-full">
                        <Image
                          src={editInfo}
                          alt="Logo - SVG"
                          width="64"
                          height="64"
                          className="logo-screen"
                        />
                      </div>
                      <div className="mt-4 text-4xl text-gray-600 font-semibold">Got the Basics</div>
                      <div className="mt-2 text-xl font-normal text-black">Just need a few more bits to Finish the Memo</div>
                      <div className="mt-7 w-[26%]"><hr className="text-gray-800" /></div>
                      <div className="mt-3 text-[#009900] text-2xl font-medium ">Draft’s good to go! <CheckSquareFilled /></div>
                  </div>
                )}

               {step > 0 && step < 5 && <div className="absolute bottom-[40px] right-[40px]">
                  <button onClick={nextStep} className="w-[109px] h-[36px] rounded-md bg-[#083c6d] hover:bg-[#083c6d] font-normal text-base   text-[#FFFFFF]">
                    {step > 0 && step < 4 ? "Next" : "Submit"}
                  </button>
                </div>}

                {step == 5 &&<div className="absolute bottom-[85px] left-auto w-[85%] flex justify-center items-center">
                  <button onClick={() =>router.push('/investment-details')} className="w-[109px] h-[36px] rounded-md bg-[#083c6d] hover:bg-[#083c6d] font-normal text-base   text-[#FFFFFF]">
                    {"Proceed"}
                  </button>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
