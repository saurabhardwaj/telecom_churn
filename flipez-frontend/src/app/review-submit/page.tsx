"use client";
import { Button, Col, Descriptions, Progress, Row, Spin, Steps } from "antd";
import Layout from "../components/layout";
import React, { useRef, useState, useEffect } from "react";
import { getInvestmentDetails } from "@/app/api/service/investment-details.service";

import { useRouter } from "next/navigation";
import { getPropertyDetails } from "../api/service/property-overview.service";

export default function ReviewSubmit() {
  const [step, setStep] = React.useState(1);
  const router = useRouter();

  const toTitleCase = (str: string) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const calculatePercentage = (currentStep: number) => {
    const totalSteps = 1;
    return (currentStep / totalSteps) * 100;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [investmentDetails, setInvestmentDetails] = useState<any>(null);
  const [personalDetails, setPersonalDetails] = useState<any>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);

    const [investmentData, personalData] = await Promise.all([
      getInvestmentDetails(),
      getPropertyDetails(),
    ]);
    if (investmentData) {
      setInvestmentDetails(investmentData);
    }

    if (personalData) {
      setPersonalDetails(personalData);
    }
    setIsLoading(false);
  };

  const editPage = () => {
    router.push("/property-overview");
  };

  const nextStep = () => {
    router.push("/pay-download");
  };

  const labelStyle = {
    fontSize: '16px',
    lineHeight: 'normal',
    fontWeight: '400',
    color: '#083c6d',
    marginBottom: '8px '
  };

  const valueStyle = {
    fontSize: '14px',
    lineHeight: 'normal',
    fontWeight: '400',
    color: '#5e5e5e',
  };

  return (
    <>
      <div className="bg-[#FFFFFF] h-full">
        <div className="flex h-full w-full">
          <div className="border-r border-r-[#D9D9D9] w-[324px] min-w-fit">
            <Layout
              calculatePercentage={calculatePercentage(step)}
              stage={"Review & Submit"}
            ></Layout>
          </div>
          <div style={{ width: "calc(100% - 324px)" }}>
            <div
              style={{ height: "calc(100vh - 10px)" }}
              className="overflow-y-auto w-full"
            >
              <div className="bg-[#FFFFFF] w-[90%] h-fit min-h-full relative">
                <div className="w-full min-h-[90%] h-full pl-[47px] pr-[40px] py-[8px]">
                  <div className="flex justify-between items-center h-fit">
                    <div className="text-[32px] text-[#000000]  ">Your Investment Memo Is Locked And Loaded! Ready For A Quick Preview?</div>
                  </div>

                  <div className="bg-[#F8F8F8] w-full h-full mt-11 px-6 py-4  ">
                    <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4">
                      <div className="w-full">
                        <div className="text-lg font-bold text-[#374153]">
                          Borrower's Information
                        </div>

                        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between">
                          <div>
                            <div style={labelStyle}>
                              Full Name
                            </div>
                            <div style={valueStyle}>
                              {personalDetails?.borrowerInformation?.fullName}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Company Name
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.personalInformation
                                  ?.companyName
                              }
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              FicoScore
                            </div>
                            <div style={valueStyle}>
                              {personalDetails?.borrowerInformation?.ficoScore}
                            </div>
                          </div>

                          <div className="min-w-max w-full">
                            <div style={labelStyle}>
                              Email
                            </div>
                            <div className="min-w-max" style={valueStyle}>
                              {investmentDetails?.personalInformation?.emailId}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Phone Number
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.personalInformation
                                  ?.phoneNumber
                              }
                            </div>
                          </div>

                          <div className="min-w-max w-full">
                            <div style={labelStyle}>
                              Project Completed
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.personalInformation
                                  ?.totalProjects
                              }{" "}
                              {investmentDetails?.personalInformation
                                ?.totalProjects > 1
                                ? "Projects"
                                : "Project"}
                            </div>
                          </div>

                          <div className="w-full justify-items-center">
                            <div className="rounded-sm w-[52px] h-[52px]">
                              <img
                                src={`data:${investmentDetails?.personalInformation?.profilePicture?.contentType};base64,${investmentDetails?.personalInformation?.profilePicture?.data}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4 mt-4">
                      <div className="w-full">
                        <div className="text-lg font-bold text-[#374153]">
                          Investment Opportunity
                        </div>

                        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between">
                          <div>
                            <div style={labelStyle}>
                              Address
                            </div>
                            <div style={valueStyle}>
                              {personalDetails?.propertyOverview?.address}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Area
                            </div>
                            <div style={valueStyle}>
                              {investmentDetails?.investmentOpportunity?.area}{" "}
                              sq.ft
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Bathrooms/Bedrooms
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.bathrooms
                              }
                              /
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.bedrooms
                              }
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Contribution
                            </div>
                            <div style={valueStyle}>
                              $
                              {(investmentDetails?.investmentOpportunity?.contribution || 0).toLocaleString(
                                "en-US"
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Purchase Price
                            </div>
                            <div style={valueStyle}>
                              $
                              {(investmentDetails?.investmentOpportunity?.purchasePrice || 0).toLocaleString(
                                "en-US"
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan Amount
                            </div>
                            <div style={valueStyle}>
                              $
                              {(investmentDetails?.investmentOpportunity?.loanAmount || 0).toLocaleString(
                                "en-US"
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan Position
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanPosition
                              }
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan Purpose
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanPurpose
                              }
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan Term
                            </div>
                            <div style={valueStyle}>
                              {investmentDetails?.investmentOpportunity
                                  ?.loanTermYear && <span>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanTermYear
                              }{" "}
                              {investmentDetails?.investmentOpportunity
                                ?.loanTermYear > 1
                                ? "Years"
                                : "0 Year"}{" "}
                              </span>}
                              {investmentDetails?.investmentOpportunity
                                  ?.loanTermMonth && <span>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanTermMonth
                              }{" "}
                              {investmentDetails?.investmentOpportunity
                                ?.loanTermMonth > 1
                                ? "Months"
                                : "Month"}
                              </span>}
                             
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan To ARV
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanToARV
                              }
                              %
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan To Value
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanToValue
                              }
                              %
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Loan Type
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.investmentOpportunity
                                  ?.loanType
                              }
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              ARV
                            </div>
                            <div style={valueStyle}>
                              $
                              {(investmentDetails?.investmentOpportunity?.estARV || 0).toLocaleString(
                                "en-US"
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Total Rehab Cost
                            </div>
                            <div style={valueStyle}>
                              $
                              {(investmentDetails?.rehabAssessment?.totalCost || 0).toLocaleString(
                                "en-US"
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Total Project Cost
                            </div>
                            <div style={valueStyle}>
                              $
                              {(investmentDetails?.investmentOpportunity?.totalCost || 0).toLocaleString(
                                "en-US"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {investmentDetails?.marketComparison?.length > 0 && (    
                    <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4 mt-4">
                      <div className="w-full">
                        <div className="text-lg font-bold text-[#374153]">
                          Market Comparison
                        </div>

                        {investmentDetails?.marketComparison?.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className={`${
                                index <
                                investmentDetails?.marketComparison?.length - 1
                                  ? "border-b-[2px] border-b-gray-200 pb-4"
                                  : ""
                              }`}
                            >
                              <div className="text-base font-semibold text-[#083c6d] mt-4 mb-4">
                                <span>{item?.propertyAddress}</span>
                              </div>

                              <div className="mt-1 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between">
                                <div>
                                  <div style={labelStyle}>
                                    Area
                                  </div>
                                  <div style={valueStyle}>
                                    {item.area} sqft
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Baths/Beds
                                  </div>
                                  <div style={valueStyle}>
                                    {item.baths}/{item.beds}{" "}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Distance
                                  </div>
                                  <div style={valueStyle}>
                                    {item?.distance.indexOf("miles") === -1 ? `${item?.distance} miles` : item?.distance}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Rate
                                  </div>
                                  <div style={valueStyle}>
                                    {item.rate}{" "}
                                  </div>
                                </div>

                                <div className="min-w-max">
                                  <div style={labelStyle}>
                                    Closed Date
                                  </div>
                                  <div style={valueStyle}>
                                    {item.soldClosedDate}{" "}
                                  </div>
                                </div>

                                <div className="min-w-max">
                                  <div style={labelStyle}>
                                    Closed Price
                                  </div>
                                  <div style={valueStyle}>
                                    ${(item.soldClosedPrice || 0).toLocaleString(
                                      "en-US"
                                    )}{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    )}

                    {investmentDetails?.neighborhoodDetails?.schools?.length > 0 && (    
                    <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4 mt-4">
                      <div className="w-full">
                        <div className="text-lg font-bold text-[#374153]">
                          Neighborhood Details
                        </div>

                        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between">
                          <div>
                            <div style={labelStyle}>
                              Bike Score
                            </div>
                            <div className="min-w-max" style={valueStyle}>
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.bikeRating
                              }
                            </div>
                          </div>

                          <div>
                            <div style={labelStyle}>
                              Transport Score
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.transportRating
                              }{" "}
                            </div>
                          </div>

                          <div className="min-w-max">
                            <div style={labelStyle}>
                              Walk Score
                            </div>
                            <div style={valueStyle}>
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.walkRating
                              }{" "}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm font-bold text-gray-600 mt-4">
                          {investmentDetails?.neighborhoodDetails?.schools
                            ?.length > 1
                            ? "Schools"
                            : "School"}
                        </div>

                        {investmentDetails?.neighborhoodDetails?.schools?.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className={`${
                                index <
                                investmentDetails?.neighborhoodDetails?.schools
                                  ?.length -
                                  1
                                  ? "border-b-[2px] border-b-gray-200 pb-4"
                                  : ""
                              }`}
                            >
                              <div className="mt-1 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between">
                                <div>
                                  <div style={labelStyle}>
                                    Name
                                  </div>
                                  <div className="text-sm font-semibold text-black min-w-max">
                                    <a
                                      className="underline text-[#083c6d]"
                                      href={item?.link}
                                      target="_blank"
                                    >
                                      {item?.name}
                                    </a>
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Level
                                  </div>
                                  <div style={valueStyle}>
                                    {item.level}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Distance
                                  </div>
                                  <div style={valueStyle}>
                                    {item.distance}{" "}
                                    {item.distance <= 1 ? "mile" : "miles"}{" "}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Grades
                                  </div>
                                  <div style={valueStyle}>
                                    {item.grades}{" "}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Rating
                                  </div>
                                  <div style={valueStyle}>
                                    {item.rating}{" "}
                                  </div>
                                </div>

                                <div className="min-w-max">
                                  <div style={labelStyle}>
                                    Type
                                  </div>
                                  <div style={valueStyle}>
                                    {item.type}{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    )}


                    {(investmentDetails?.investmentPotentialScore && investmentDetails?.personalDetails
                                      ?.investmentPotentialScore
                                      ?.locationScoreData?.totalPercentScore &&
                        <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4 mt-4">
                          <div className="w-full">
                            <div className="text-lg font-bold text-[#374153]">
                              Investment Potential Score
                            </div>

                            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between">
                              <div>
                                <div style={labelStyle}>
                                  Location Score
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore
                                      ?.locationScoreData?.totalPercentScore *
                                    10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>

                              <div>
                                <div style={labelStyle}>
                                  Property Condition Score
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore
                                      ?.propertyScoreData?.totalPercentScore *
                                    10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>

                              <div>
                                <div style={labelStyle}>
                                  Market Value
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore
                                      ?.marketScoreData
                                      ?.totalMarketValuePercent * 10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>

                              <div>
                                <div style={labelStyle}>
                                  Rental Outlook
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore
                                      ?.rentalScoreData
                                      ?.totalRentalAndCapScorePercent * 10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>

                              <div>
                                <div style={labelStyle}>
                                  Rehab Score
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore?.rehabScoreData
                                      ?.rehabScorePercent * 10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>

                              <div>
                                <div style={labelStyle}>
                                  Community Score
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore
                                      ?.communityAndLifestyleScoreData
                                      ?.totalCommunityAndLifestyleScorePercent *
                                    10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>

                              <div>
                                <div style={labelStyle}>
                                  Final Score
                                </div>
                                <div style={valueStyle}>
                                  {(
                                    investmentDetails?.personalDetails
                                      ?.investmentPotentialScore?.finalScore *
                                    10
                                  ).toFixed(2) || 0.0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {investmentDetails?.previousProjects?.length > 0 && (
                      
                    <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4 mt-4">
                      <div className="w-full">
                        <div className="text-lg font-bold text-[#374153]">
                          Previous Project
                          {investmentDetails?.previousProjects?.length > 1
                            ? "s"
                            : ""}
                        </div>

                        {investmentDetails?.previousProjects?.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className={`${
                                index <
                                investmentDetails?.previousProjects?.length - 1
                                  ? "border-b-[2px] border-b-gray-200 pb-4"
                                  : ""
                              }`}
                            >
                              <div className=" grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between h-fit min-h-[52px] mt-4">
                                <div>
                                  <div style={labelStyle}>
                                    Property Address
                                  </div>
                                  <div style={valueStyle}>
                                    {item?.propertyAddress}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Purchase Price
                                  </div>
                                  <div style={valueStyle}>
                                    $
                                    {item?.purchasePrice
                                      ? (Number(item.purchasePrice) || 0).toLocaleString(
                                          "en-US"
                                        )
                                      : "N/A"}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Rehab Cost
                                  </div>
                                  <div style={valueStyle}>
                                    $
                                    {item?.rehabCost
                                      ? (Number(item.rehabCost) || 0).toLocaleString("en-US")
                                      : "N/A"}
                                  </div>
                                </div>

                                <div>
                                  <div style={labelStyle}>
                                    Sold Price
                                  </div>
                                  <div style={valueStyle}>
                                    $
                                    {item?.soldPrice
                                      ? (Number(item.soldPrice) || 0).toLocaleString("en-US")
                                      : "N/A"}
                                  </div>
                                </div>

                                <div className="w-full justify-items-center">
                                  <div className="rounded-sm w-[102px] h-[52px]">
                                    <img
                                      className="h-[52px] w-[102px]"
                                      src={`data:${item?.propertyPhoto?.contentType};base64,${item?.propertyPhoto?.data}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                      )}

                    {investmentDetails?.rehabAssessment && (
                    <div className="shadow-lg w-full bg-white rounded-lg px-6 py-4 mt-4">
                      <div className="w-full">
                        <div className="text-lg font-bold text-[#374153]">
                          Rehab Assessment
                        </div>
                      </div>

                     
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between mt-4">
                          {Object?.entries(
                            investmentDetails?.rehabAssessment
                          )?.map(([key, value]) => {
                            if (
                              value &&
                              typeof value === "object" &&
                              "status" in value &&
                              "cost" in value
                            ) {
                              const rehabItem = value as {
                                status: string;
                                cost: number;
                              };
                              return (
                                <div
                                  key={key}
                                  className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between mt-1"
                                >
                                  <div>
                                    <div style={labelStyle}>{toTitleCase(key)}</div>
                                    <div style={valueStyle}>
                                      <div>{rehabItem?.status}</div>
                                      <div className="mt-1">
                                        ${(rehabItem?.cost || 0).toLocaleString("en-US")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full justify-between mt-1">
                            <div>
                            <div className="text-sm font-semibold text-[#374153] mb-2">
                              Total Cost
                            </div>
                            <div className="text-sm font-normal text-[#000]">
                              $
                              {investmentDetails?.rehabAssessment?.totalCost
                                ? investmentDetails?.rehabAssessment?.totalCost.toLocaleString(
                                    "en-US"
                                  )
                                : "N/A"}
                            </div>
                              </div>
                          </div>
                        </div>
                     
                    </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-end items-center">
                      <button
                        className="w-[109px] h-[36px] rounded-md border-[#083c6d] border hover:bg-[#ffffff] bg-white font-normal text-base   text-[#083c6d]"
                        onClick={editPage}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-[20px] w-[109px] h-[36px] rounded-md border-[#083c6d] border bg-[#083c6d] hover:bg-[#083c6d] font-normal text-base   text-[#FFFFFF]"
                        onClick={nextStep}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-[20px] w-full h-full mt-4">
                    <div className="w-full h-fit min-h-full bg-[#F8F8F8] ">
                      <div className="px-6 py-4 grid gap-2">
                        <h2 className="text-lg font-medium text-green-700">Borrower Information</h2>
                        <div>
                          <label style={labelStyle}>Borrower Name(s)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={personalDetails?.borrowerInformation?.fullName}
                            className="input-style"
                            type="text"
                            name="borrowerName"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Company Name</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.personalInformation?.companyName}
                            className="input-style"
                            type="text"
                            name="companyName"
                            readOnly
                          />
                        </div>

                        {investmentDetails?.personalInformation?.descriptions != '' && <div>
                          <label style={labelStyle}>Summary</label>
                          <textarea
                            style={false ? errorTextareaInputStyle : textareaInputStyle}
                            value={investmentDetails?.personalInformation?.descriptions}
                            rows={4}
                            className="input-style"
                            name="summary"
                            readOnly
                          />
                        </div>}
                      </div>

                      <div className="px-6 grid gap-2">
                        <h2 className="text-lg font-medium text-green-700">Metrics Information</h2>
                        <div>
                          <label style={labelStyle}>On Time Payments (%)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            className="input-style"
                            type="text"
                            name="onTimePayments"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>FICO Score</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.personalInformation?.ficoScore}
                            className="input-style"
                            type="text"
                            name="ficoScore"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Total Projects Completed</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.personalInformation?.totalProjects}
                            className="input-style"
                            type="text"
                            name="totalProjectsCompleted"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Average Project Time (Months)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            className="input-style"
                            type="text"
                            name="averageProjectTime"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Typical Gross Margin (%)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            className="input-style"
                            type="text"
                            name="typicalGrossMargin"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="px-6 py-4 grid gap-2">
                        <h2 className="text-lg font-medium text-green-700">Investment Opportunity</h2>
                        <div>
                          <label style={labelStyle}>Address</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={personalDetails?.propertyOverview?.address}
                            className="input-style"
                            type="text"
                            name="address"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Bedrooms</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.bedrooms}
                            className="input-style"
                            type="text"
                            name="bedrooms"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-fit bg-[#F8F8F8] min-h-full ">
                      <div className="px-6 pb-4 pt-4 grid gap-2">

                      <div>
                          <label style={labelStyle}>Bathrooms</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.bathrooms}
                            className="input-style"
                            type="text"
                            name="bathrooms"
                            readOnly
                          />
                        </div>
                        
                        <div>
                          <label style={labelStyle}>Area (sqft)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.area}
                            className="input-style"
                            type="text"
                            name="area"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Purchase Price ($)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.purchasePrice}
                            className="input-style"
                            type="text"
                            name="purchasePrice"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>ARV ($)</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.estARV}
                            className="input-style"
                            type="text"
                            name="arv"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Loan to ARV</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.loanToARV}
                            className="input-style"
                            type="text"
                            name="loanToArv"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Purpose</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.loanPurpose}
                            className="input-style"
                            type="text"
                            name="purpose"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Loan Position</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.loanPosition}
                            className="input-style"
                            type="text"
                            name="loanPosition"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Total Loan Amount</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            value={investmentDetails?.investmentOpportunity?.loanAmount}
                            className="input-style"
                            type="text"
                            name="totalLoanAmount"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Last 30 Days Change</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            className="input-style"
                            type="text"
                            name="last30DaysChange"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Est. Market Fluctuation</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            className="input-style"
                            type="text"
                            name="estMarketFluctuation"
                            readOnly
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Rent Estimates</label>
                          <input
                            style={false ? errorInputStyle : inputStyle}
                            className="input-style"
                            type="text"
                            name="rentEstimates"
                            readOnly
                          />
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-end items-center">
                            <button className="w-[109px] h-[36px] rounded-md border-[#083c6d] border hover:bg-[#ffffff] bg-white font-normal text-base   text-[#083c6d]" onClick={editPage}>
                              Edit
                            </button>
                            <button
                              className="ml-[20px] w-[109px] h-[36px] rounded-md border-[#083c6d] border bg-[#083c6d] hover:bg-[#083c6d] font-normal text-base   text-[#FFFFFF]"
                              onClick={nextStep}
                            >
                              Proceed
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {isLoading && (
                    <div className=" w-[80%] absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                      <div className="w-[100px] h-[100px]">
                        <Spin size="large" />
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="p-[25px] flex justify-end items-center" style={{ boxShadow: "4px 1px 11.1px 0px rgba(0, 0, 0, 0.25)" }}>
                <button className="w-[109px] h-[36px] rounded-md border-[#083c6d] border hover:bg-[#ffffff] bg-white font-normal text-base   text-[#083c6d]" onClick={previousStep}>
                  Previous
                </button>
                <button
                  className="ml-[20px] w-[109px] h-[36px] rounded-md border-[#083c6d] border bg-[#083c6d] hover:bg-[#083c6d] font-normal text-base   text-[#FFFFFF]"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
