"use client";
import { Button, Col, Descriptions, Progress, Row, Spin, Steps } from "antd";
import Layout from "../components/layout";
import React, { useRef, useState, useEffect } from "react";
import { createPersonalDetails, getInitialInvestmentOpportunity, getInvestmentDetails, getMarketComparisonData, getNeighborhoodDetailsData, updatePersonalDetails } from "@/app/api/service/investment-details.service";
import { getUser } from "../api/service/user.service";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import PersonalInformation from "../components/personalDetails/personalInformation";
import InvestmentOpportunity from "../components/personalDetails/investmentOpportunity";
import Rehab from "../components/personalDetails/rehab";
import { useRouter } from "next/navigation";
import NeighborhoodDetails from "../components/personalDetails/neighborhoodDetails";
import PreviousProject from "../components/personalDetails/previousProject";
import MarketComparable from "../components/personalDetails/marketComparable";
import { getPropertyDetails } from "../api/service/property-overview.service";

export default function InvestmentDetails() {
  const formRef = useRef<{ handleSubmit: () => void } | null>(null);

  const [step, setStep] = React.useState(1);
  const router = useRouter();

  const calculatePercentage = (currentStep: number) => {
    const totalSteps = 5;
    return (currentStep / totalSteps) * 100;
  };

  const calculatePercentagePersonalDetails = (currentStep: number) => {
    const totalSteps = 1;
    return (currentStep / totalSteps) * 100;
  };

  const [isNextClicked, setIsNextClicked] = useState(false);

  const getIcon = (value: number) => {
    if (step === value) {
      return <ExclamationCircleOutlined style={{ color: "red", height: "16px" }} />;
    } else if (step > value) {
      return <CheckCircleOutlined style={{ color: "green", height: "16px" }} />;
    } else if (step < value) {
      return <div className="w-[20px] h-[16px] border border-[#0C1D35] rounded-sm"></div>;
    }
  };

  const [dynamicWidth, setDynamicWidth] = useState<string>("max-content");

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth <= 1620 ? "100%" : "max-content";
      setDynamicWidth(width);
    };

    // Initialize on component mount
    updateWidth();

    // Update on resize
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);


  const stepsItemsTitleStyle = {
    fontSize: "14px",
    lineHeight: "16px",
    fontWeight: "400",
    color: "#083c6d",
    marginTop: "-6px",
    width: dynamicWidth,
  };

  const personalDetailsStepsItems = [
    {
      title: <div style={stepsItemsTitleStyle}>Personal Information</div>,
      icon: getIcon(1),
    },
    {
      title: <div style={stepsItemsTitleStyle}>Rehab Assessment</div>,
      icon: getIcon(2),
    },
    {
      title: <div style={stepsItemsTitleStyle}>Investment Opportunity</div>,
      icon: getIcon(3),
    },
    {
      title: <div style={stepsItemsTitleStyle}>Market Comparable</div>,
      icon: getIcon(4),
    },
    {
      title: <div style={stepsItemsTitleStyle}>Neighborhood Details</div>,
      icon: getIcon(5),
    },
    {
      title: <div style={stepsItemsTitleStyle}>Previous Projects</div>,
      icon: getIcon(6),
    },
  ];

  const [personalDetails, setPersonalDetails] = useState<any>({
    _id: "",
    additionalRehabs: [],
    isVisiblePotentialScore: true,
    personalInformation: {
      firstName: "",
      lastName: "",
      companyName: "",
      ficoScore: "",
      totalProjects: "",
      totalProjectsLastYear: "",
      descriptions: "",
      emailId: "",
      phoneNumber: "",
      profilePicture: null,
    },
    investmentOpportunity: {
      propertyAddress: "",
      bedrooms: null,
      bathrooms: null,
      area: null,
      purchasePrice: null,
      contribution: null,
      estARV: null,
      loanAmount: null,
      totalCost: null,
      loanToValue: null,
      loanTermYear: null,
      loanTermMonth: null,
      loanType: "",
      loanPurpose: "",
      loanPosition: "",
      loanToARV: null,
      kitchenImage: null as File | null | string,
      bathRoomImage: null as File | null | string,
      bedRoomImage: null as File | null | string,
      // propertyPhoto: null as File | null,
    },
    rehabAssessment: {
      "kitchen": {
          "status": "",
          "cost": 0
      },
      "bathRoom": {
          "status": "",
          "cost": 0
      },
      "flooring": {
          "status": "",
          "cost": 0
      },
      "interiorPainting": {
          "status": "",
          "cost": 0
      },
      "exteriorPainting": {
          "status": "",
          "cost": 0
      },
      "plumbing": {
          "status": "",
          "cost": 0
      },
      "electrical": {
          "status": "",
          "cost": 0
      },
      "landscaping": {
          "status": "",
          "cost": 0
      },
      "hvac": {
          "status": "",
          "cost": 0
      },
      "demolition": {
          "status": "",
          "cost": 0
      },
      "roofing": {
          "status": "",
          "cost": 0
      },
      "foundation": {
          "status": "",
          "cost": 0
      },
      "extraBedBath": {
          "status": "",
          "cost": 0
      },
      "totalCost": 0,
    },
    previousProjects: [],
    marketComparison: [],
    neighborhoodDetails: {},
    investmentPotentialScore: {},
  });

  const [isLoading , setIsLoading] = useState(false);


  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
      console.log("🚀 ~ useEffect ~ personalDetails:", personalDetails)
  },[personalDetails])

  const getData = async () => {
    setIsLoading(true);
    const res = await getInvestmentDetails();
    if (res) {
      setPersonalDetails(checkPersonalDetails(res));
    } else {
      getUserDetails();
    }
    setIsLoading(false);
  };

  const checkPersonalDetails = (res: any) => {
    if(!res.additionalRehabs) {
      res.additionalRehabs = []
    }
    if (!res.personalInformation) {
      res.personalInformation = personalDetails.personalInformation;
    }
    if (!res.investmentOpportunity) {
      res.investmentOpportunity = personalDetails.investmentOpportunity;
    }
    if (!res.rehabAssessment) {
      res.rehabAssessment = personalDetails.rehabAssessment;
    }
    if (!res.marketComparison?.length) {
      res.marketComparison = personalDetails.marketComparison;
    }
    if(!res.investmentPotentialScore) {
      res.investmentPotentialScore = personalDetails.marketComparison;
    }
    if (!res.neighborhoodDetails) {
      res.neighborhoodDetails = personalDetails.neighborhoodDetails;
    }
    if (!res.previousProjects) {
      res.previousProjects = personalDetails.previousProjects;
    }
    return res;
  };
  const getInitialInvestmentOpportunityData = async () => {
    setIsLoading(true);
    const res = await getInitialInvestmentOpportunity();
    setPersonalDetails({
      ...personalDetails,
      investmentOpportunity: {
        ...personalDetails.investmentOpportunity,
        ...res,
      },
      rehabAssessment: res.rehabData,
      neighborhoodDetails: res.neighborhoodDetails
    })
    setIsLoading(false);
  };

  const getUserDetails = async () => {
    const res = await getUser();
    const propertyDetails = await getPropertyDetails();
    const names = (propertyDetails?.borrowerInformation?.fullName || '').split(' ')
    setPersonalDetails({
      ...personalDetails,
      personalInformation: {
        ...personalDetails.personalInformation,
        firstName: (names && names.length > 0) ? names[0] : '',
        lastName: (names && names.length > 0) ? names.slice(1, names.length).join(' ') : '',
        emailId: res.email,
        phoneNumber: res.phone,
        ficoScore: propertyDetails?.borrowerInformation?.ficoScore,
      },
    });
  };

  const checkStepInitializedApi = (currentStep: number , personalDetailsData: any) => {
    if (currentStep == 2 && !personalDetailsData?.investmentOpportunity?.area) {
      getInitialInvestmentOpportunityData();
    }
    if(currentStep == 3 && (personalDetailsData?.marketComparison?.length == 0)){
      getMarketComparison();
    }
    if(currentStep == 4 && !personalDetailsData?.neighborhoodDetails?.schools){
      getNeighborhoodData();
    }
  }

  const [neighborhoodDetails, setNeighborhoodDetails] = useState<any>();

  const getNeighborhoodData = async() => {
    setIsLoading(true);
    const res = await getNeighborhoodDetailsData();
    if(res){
      setNeighborhoodDetails(res);
      setPersonalDetails({
        ...personalDetails,
        neighborhoodDetails: res
      });
    }
    setIsLoading(false);
  }

  const getMarketComparison = async() => {
    setIsLoading(true);
    const res = await getMarketComparisonData();
    if (res) {
      setPersonalDetails({
        ...personalDetails,
        marketComparison: res.marketComparison,
        investmentPotentialScore: res.investmentPotentialScore
      });
    }
    setIsLoading(false);
  };

  const createData = async () => {
    const res = await createPersonalDetails(personalDetails);
    if (res) {
      setPersonalDetails({
        ...personalDetails,
        _id: res._id,
      });
      processNextStep();
    }
  };

  const updateData = async () => {
    const body = JSON.parse(JSON.stringify(personalDetails));
    body.lastCompleteStepNumber = step;
    let updateBody = {}
    if(step == 1) {
      updateBody = {
        personalInformation: body.personalInformation,
      }
    }
    if(step == 2) {
      body.investmentOpportunity.estARV = body.investmentOpportunity.purchasePrice + body.rehabAssessment.totalCost + (body.investmentOpportunity.purchasePrice  + body.rehabAssessment.totalCost) * (30 / 100);
      body.investmentOpportunity.loanToARV = Number(((body.investmentOpportunity.loanAmount / body.investmentOpportunity.estARV) * 100).toFixed(2));
      body.investmentOpportunity.totalCost = body.investmentOpportunity.purchasePrice + body.rehabAssessment.totalCost;
      body.investmentOpportunity.loanAmount = body.investmentOpportunity.totalCost - body.investmentOpportunity.contribution;
      body.investmentOpportunity.loanToValue = Number(((body.investmentOpportunity.loanAmount / body.investmentOpportunity.totalCost) * 100).toFixed(0));
      updateBody = {
        rehabAssessment: body.rehabAssessment,
        additionalRehabs: body.additionalRehabs,
        investmentOpportunity: body.investmentOpportunity
      }
      setPersonalDetails({
        ...personalDetails,
        rehabAssessment: body.rehabAssessment,
        additionalRehabs: body.additionalRehabs,
        investmentOpportunity: body.investmentOpportunity,
      });
    }
    if(step == 3) {
      updateBody = {
        investmentOpportunity: body.investmentOpportunity,
      }
    }
    if(step == 4) {
      updateBody = {
        marketComparison: body.marketComparison,
        investmentPotentialScore: body.investmentPotentialScore,
        isVisiblePotentialScore: body.isVisiblePotentialScore
      }
    }
    if(step == 5) {
      updateBody = {
        neighborhoodDetails: body.neighborhoodDetails,
      }
    }
    if(step == 6) {
      updateBody = {
        previousProjects: body.previousProjects,
      }
    }
    const res = await updatePersonalDetails(updateBody, body._id);
    if (res) {
      processNextStep();
    }
  };

  const nextStep = () => {
    setIsNextClicked(true);
    if (formRef.current) {
      const isValid: any = formRef.current.handleSubmit();
      if (isValid) {
        if (personalDetails._id) {
          updateData();
        } else {
          createData();
        }
      }
    }
  };

  const processNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      router.push("/review-submit");
    }
  };

  useEffect(() => {
    if (step < 6) {
      checkStepInitializedApi(step, personalDetails);
    }
  }, [step]);


  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/property-overview");
    }
  };

  return (
    <>
      <div className="bg-[#FFFFFF] w-full h-full">
        <div className="flex h-full w-full">
          <div className="border-r border-r-[#D9D9D9] w-[324px] min-w-fit">
            {step === 1 && <Layout calculatePercentage={calculatePercentagePersonalDetails(step)} stage={"Personal Details"}></Layout>}
            {step > 1 && <Layout calculatePercentage={calculatePercentage(step - 1)} stage={"Investment Details"}></Layout>}
          </div>
          <div style={{ width: "calc(100% - 324px)" }} className="h-full overflow-auto">
            <div className="bg-[#FFFFFF] w-full h-fit min-h-full relative">
              <div className="w-full h-full px-[47px] py-[8px]">
                <div className="flex justify-between items-center w-full h-fit">
                  {step === 1 && <div className="text-[32px] text-[#083c6d] font-medium">Personal Information</div>}
                  {step === 2 && <div className="text-[32px] text-[#083c6d] font-medium">Rehab Assessment</div>}
                  {step === 3 && <div className="text-[32px] text-[#083c6d] font-medium">Investment Opportunity</div>}
                  {step === 4 && <div className="text-[32px] text-[#083c6d] font-medium">Market Comparable</div>}
                  {step === 5 && <div className="text-[32px] text-[#083c6d] font-medium">Neighborhood Details</div>}
                  {step === 6 && <div className="text-[32px] text-[#083c6d] font-medium">Previous Projects</div>}
                  <div>
                    <button className="text-[17px] bg-white hover:bg-[#ff090991] text-[#ff090991] hover:text-[#FFFFFF]   border border-[#ff090991] px-[8px] py-[4px] h-[43px] w-[160px] flex justify-center items-center rounded-[14px]">
                      Save to draft
                    </button>
                  </div>
                </div>

                <div className="pt-[22px] max-w-[80%] w-full pr-[30px]">
                  <Steps current={step} size="small" labelPlacement="vertical" items={personalDetailsStepsItems} />
                </div>

                <div
                  className={`w-[90%] mt-11 mb-8 border-t-[#0A1E37] border-t-[3.5px] overflow-auto ${isLoading ? "opacity-50" : ""}`}
                  style={{ boxShadow: "0px 0px 21.9px -6px rgba(0, 0, 0, 0.16)", minHeight: "calc(100vh - 294px)" }}
                >
                  {/* <div className="pl-[30px] text-[#374153] text-1g font-normal  ">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Investment Opportunity"}
                    {step === 3 && "Market Comparable"}
                    {step === 4 && "Neighborhood Details"}
                    {step === 5 && "Rehab Assessment"}
                    {step === 6 && "Previous Projects"}
                  </div> */}
                  <div className="px-[30px] py-2">
                    {step === 1 && <PersonalInformation ref={formRef} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} isNextClicked={isNextClicked}></PersonalInformation>}
                    {step === 2 && <Rehab ref={formRef} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} isNextClicked={isNextClicked}></Rehab>}
                    {step === 3 && (
                      <InvestmentOpportunity ref={formRef} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} isNextClicked={isNextClicked}></InvestmentOpportunity>
                    )}
                    {step === 4 && <MarketComparable ref={formRef}  personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} isNextClicked={isNextClicked}></MarketComparable>}
                    {step === 5 && <NeighborhoodDetails ref={formRef} neighborhoodDetails={personalDetails?.neighborhoodDetails} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} isNextClicked={isNextClicked}></NeighborhoodDetails>}
                    {step === 6 && <PreviousProject ref={formRef} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} isNextClicked={isNextClicked}></PreviousProject>}
                  </div>
                </div>

                {isLoading && (
                  <div className=" w-[80%] absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                    <div className="w-[100px] h-[100px]">
                      <Spin size="large" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-[25px] flex justify-end items-center" style={{ boxShadow: "4px 1px 11.1px 0px rgba(0, 0, 0, 0.25)" }}>
                <button className="w-[109px] h-[36px] rounded-md border-[#083c6d] border hover:bg-[#ffffff] bg-white font-normal text-base   text-[#083c6d]" onClick={previousStep}>
                  Previous
                </button>
                <button
                  className="ml-[20px] w-[109px] h-[36px] rounded-md border-[#083c6d] border bg-[#083c6d] hover:bg-[#083c6d] font-normal text-base   text-[#FFFFFF]"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
