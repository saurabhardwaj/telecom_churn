"use client";
import Image from "next/image";
import { Spin, Table } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "../components/layout";
import React, { useRef, useState, useEffect } from "react";
import { downloadFile, getInvestmentDetails, processPDF, updatePersonalDetails } from "@/app/api/service/investment-details.service";
import { useRouter, useSearchParams } from "next/navigation";
import { getPropertyDetails, updatePropertyDetails } from "../api/service/property-overview.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Sale from "../public/images/sale.png";
import ProjectManagement from "../public/images/project-management.png";
import CognitiveEducation from "../public/images/cognitive-education.png";
import UsaMap from "../public/images/usaMap.png";
import Scale from "../public/images/scale.png";
import chart from "../public/images/neighborhoodChart.svg";
import ficoScore from "../public/images/ficoScore.png";
import propertyVerified from "../public/images/propertyVerified.png";
import bathroom from "../public/images/bathroom.png";
import bedroom from "../public/images/bedroom.png";
import { getCheckoutSession } from "@/app/api/service/payment.service";
import { getImageId, uploadFile } from "../api/service/image.service";
import freeDownload from "../public/images/free-download.jpeg";
import { DownloadOutlined } from "@ant-design/icons";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PayAndDownload() {
  const formRef = useRef<{ handleSubmit: () => void } | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = React.useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const calculatePercentage = (currentStep: number) => {
    const totalSteps = 1;
    return (currentStep / totalSteps) * 100;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [investmentDetails, setInvestmentDetails] = useState<any>(null);
  const [personalDetails, setPersonalDetails] = useState<any>(null);
  const [isPayNow, setIsPayNow] = useState(false);

  useEffect(() => {
    const is_success = searchParams.get("is_success");
    if (is_success) {
      setIsPayNow(true);
    }
    getData(is_success);
  }, []);

  const [isPdfClass, setIsPdfClass] = useState(false);

  const getData = async (is_success: any) => {
    setIsLoading(true);

    const [investmentData, personalData] = await Promise.all([
      getInvestmentDetails(is_success === "true" ? "paid" : "pending"),
      getPropertyDetails(),
    ]);

    if (investmentData) {
      investmentData.investmentOpportunity.propertyPhoto =
        await loadImageAsBase64(
          investmentData.investmentOpportunity.propertyPhoto
        );
      for (
        let index = 0;
        index < investmentData.marketComparison.length;
        index++
      ) {
        const element = investmentData.marketComparison[index];
        if (element.propertyPhoto) {
          investmentData.marketComparison[index].propertyPhoto =
            await loadImageAsBase64(element.propertyPhoto);
        }
      }
      setInvestmentDetails(investmentData);
    }
    if (personalData) {
      setPersonalDetails(personalData);
    }
    setIsLoading(false);
  };

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  function base64ToFile(base64String: any, filename: any) {
    // Split the base64 string into two parts: the metadata and the actual data
    const [header, base64Data] = base64String.split(",");

    // Decode the base64 data into binary
    const binaryString = atob(base64Data);

    // Create an array buffer to hold the binary data
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    // Populate the buffer with the binary data
    for (let i = 0; i < binaryString.length; i++) {
      uintArray[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the array buffer
    const blob = new Blob([uintArray], { type: "application/pdf" }); // Adjust MIME type if necessary

    // Create a File object from the Blob
    const file = new File([blob], filename, { type: "application/pdf" }); // Adjust MIME type if necessary

    return file;
  }

  useEffect(() => {
    if (isPdfClass) {
      download();
    }
  }, [isPdfClass]);

  const downloadPdf = async () => {
    const blob = await downloadFile(investmentDetails._id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investment-memo.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const download = async () => {
    // const element = printRef.current;
    // if (!element) return;

    setIsLoading(true);
    await processPDF(investmentDetails._id)
    await downloadPdf()
    // const canvas = await html2canvas(element, { scale: 3 });
    // const imgData = canvas.toDataURL("image/png");

    // const pdf = new jsPDF("p", "mm", "a4");
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = pdf.internal.pageSize.getHeight();

    // // Calculate height ratio for the content
    // const imgWidth = canvas.width;
    // const imgHeight = canvas.height;
    // const ratio = imgWidth / pdfWidth;

    // let heightLeft = imgHeight / ratio;
    // let position = 0;

    // // Add first page
    // pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight / ratio);
    // heightLeft -= pdfHeight;

    // // Add additional pages if content overflows
    // while (heightLeft > 0) {
    //   position -= pdfHeight; // Move to next page
    //   pdf.addPage();
    //   pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight / ratio);
    //   heightLeft -= pdfHeight;
    // }

    // const base64String = pdf.output("datauristring"); // Get PDF as Blob
    // const file = base64ToFile(base64String, "investment-memo.pdf");
    // pdf.save("investment-memo.pdf");
    setIsPdfClass(false);
    setIsLoading(false);
    // const res = await uploadFile(file, investmentDetails._id);
  };

  const loadImageAsBase64 = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  };

  const getRehabPercentage = (status: any) => {
    let rehabPercentage = 0;
    if (status == "Extensive") {
      rehabPercentage = 100;
    } else if (status == "Moderate") {
      rehabPercentage = 50;
    } else if (status == "Minor") {
      rehabPercentage = 25;
    }
    return rehabPercentage;
  };
  const handleCheckout = async () => {
    // const stripe = await stripePromise;
    // const response = await getCheckoutSession();
    // if (stripe) {
    //   await stripe.redirectToCheckout({ sessionId: response.id });
    // }
    setIsLoading(true);
    const res = await updatePersonalDetails({ status: "paid" }, investmentDetails._id);
    await updatePropertyDetails({ status: "paid", _id: personalDetails._id }, personalDetails._id);
    if (res) {
      window.location.href = "/pay-download?is_success=true";
    }
  };

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <>
      <div className="bg-[#FFFFFF] h-full">
        <div className="flex h-full w-full">
          <div className="border-r border-r-[#D9D9D9] w-[324px] min-w-fit">
            <Layout
              calculatePercentage={calculatePercentage(step)}
              stage={"Download  Memo"}
            ></Layout>
          </div>
          <div
            style={{ width: "calc(100% - 324px)" }}
            className={`${isLoading ? "opacity-50" : ""} relative`}
          >
            <div
              style={{ height: "calc(100vh - 10px)" }}
              className="overflow-y-auto w-full"
            >
              <div className="bg-[#FFFFFF] xl:w-[100%] 2xl:w-[70%]  h-fit min-h-full relative">
                <div className="w-full min-h-[90%] h-full pl-[47px] pr-[80px] py-[8px]">
                  <div className="flex justify-between items-center h-fit w-full mb-4">
                    <div className="pl-4 xl:pr-12 text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-[#000000]  ">
                      Your Investment Memo Template Is Fired Up And Ready To
                      Roll! Let’s Dive In!
                    </div>
                  </div>

                  <div className="w-full" ref={printRef}>
                    <div className="w-full p-4">
                      <div className="mb-8 h-[30px] ">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          Investment{" "}
                          <span className="text-[#44546a]">Memorandum</span>
                        </span>
                      </div>

                      <div className="flex justify-between items-center gap-14">
                        <div className="min-w-fit w-[40%] max-w-[360px] h-fit px-6 py-4 border-[2px] border-[#848484]">
                          <div className="font-bold text-[#083c6d] text-lg">
                            SUMMARY
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between gap-4">
                              <div className="text-sm font-normal text-black">
                                PROJECT TERM
                              </div>
                              <div
                                className={`text-right text-base font-bold text-black `}
                              >
                                {investmentDetails?.investmentOpportunity
                                  ?.loanTermYear && (
                                  <>
                                    <span>
                                      {
                                        investmentDetails?.investmentOpportunity
                                          ?.loanTermYear
                                      }
                                    </span>
                                    &nbsp;
                                    {investmentDetails?.investmentOpportunity
                                      ?.loanTermYear > 1
                                      ? "Years"
                                      : "Year"}{" "}
                                    &nbsp;
                                  </>
                                )}
                                {investmentDetails?.investmentOpportunity
                                  ?.loanTermMonth && (
                                  <>
                                    <span>
                                      {
                                        investmentDetails?.investmentOpportunity
                                          ?.loanTermMonth
                                      }
                                    </span>
                                    &nbsp;
                                    {investmentDetails?.investmentOpportunity
                                      ?.loanTermMonth > 1
                                      ? "Months"
                                      : "Month"}
                                  </>
                                )}
                              </div>
                            </div>

                            <div
                              className={`h-3 w-full mt-1 bg-[#cee8d3] relative `}
                            >
                              <div
                                className={`absolute h-full  bg-[#038ca7]`}
                                style={{
                                  width: `${
                                    investmentDetails?.investmentOpportunity
                                      ?.loanTermYear ||
                                    investmentDetails?.investmentOpportunity
                                      ?.loanTermMonth
                                      ? "100"
                                      : "0"
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between">
                              <div className="text-sm font-normal text-black">
                                LOAN TO ARV
                              </div>
                              <div
                                className={`text-right text-base font-bold text-black `}
                              >
                                {parseInt(
                                  investmentDetails?.investmentOpportunity
                                    ?.loanToARV
                                )}
                                %
                              </div>
                            </div>

                            <div
                              className={`relative h-3 w-full mt-1 bg-[#cee8d3]`}
                            >
                              <div
                                className={`absolute h-full bg-[#038ca7]`}
                                style={{
                                  width: `${
                                    investmentDetails?.investmentOpportunity
                                      ?.loanToARV
                                      ? investmentDetails?.investmentOpportunity
                                          ?.loanToARV > 100
                                        ? 100
                                        : investmentDetails
                                            ?.investmentOpportunity?.loanToARV
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between">
                              <div className="text-sm font-normal text-black">
                                LOAN TO VALUE
                              </div>
                              <div
                                className={`text-right text-base font-bold text-black `}
                              >
                                {
                                  investmentDetails?.investmentOpportunity
                                    ?.loanToValue
                                }
                                %
                              </div>
                            </div>

                            <div
                              className={`relative h-3 w-full mt-1 bg-[#cee8d3]`}
                            >
                              <div
                                className={`absolute h-full bg-[#038ca7]`}
                                style={{
                                  width: `${
                                    investmentDetails?.investmentOpportunity
                                      ?.loanToValue
                                      ? investmentDetails?.investmentOpportunity
                                          ?.loanToValue > 100
                                        ? 100
                                        : investmentDetails
                                            ?.investmentOpportunity?.loanToValue
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="w-[60%]">
                          <div className="w-[100%] max-w-[646px] h-[227px] ">
                            <img
                              src={
                                investmentDetails?.investmentOpportunity
                                  ?.propertyPhoto
                              }
                              alt="Property Photo"
                              className="w-full h-full object-cover"
                              onLoad={() => setIsImageLoaded(true)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between gap-8">
                        <div className="w-full max-w-[500px] h-[240px]">
                          <Image
                            src={UsaMap}
                            alt="Company Logo"
                            className="w-full max-w-[500px] h-[260px] object-cover"
                          />
                        </div>

                        <div className="items-end text-end flex flex-col justify-items-end text-[#038ca7]">
                          <div className="font-bold text-2xl">Project</div>
                          <div>
                            {
                              investmentDetails?.investmentOpportunity
                                ?.propertyAddress
                            }
                          </div>

                          <div className="mt-4 flex justify-between items-center w-full">
                            <div className="text-center">
                              <Image
                                className="w-12 h-12"
                                src={bedroom}
                                alt="Verified"
                              />
                              <div className="text-[#818181] text-sm font-normal mt-1">
                                {
                                  investmentDetails?.investmentOpportunity
                                    ?.bedrooms
                                }
                              </div>
                            </div>
                            <div className="text-center">
                              <Image
                                className="w-12 h-12"
                                src={bathroom}
                                alt="Verified"
                              />
                              <div className="text-[#818181] text-sm font-normal mt-1">
                                {
                                  investmentDetails?.investmentOpportunity
                                    ?.bathrooms
                                }
                              </div>
                            </div>
                            <div className="text-center">
                              <Image
                                className="w-12 h-12"
                                src={propertyVerified}
                                alt="Verified"
                              />
                              <div className="text-[#818181] text-sm font-normal mt-1">
                                {investmentDetails?.investmentOpportunity?.area}{" "}
                                sq.ft
                              </div>
                            </div>
                          </div>

                          {/* <div className="font-bold text-2xl mt-2">Company</div> */}
                          {/* <div>
                            Fix and Flip: Buying low,
                            <br />
                            renovating properties and
                            <br />
                            selling them for profit
                          </div> */}
                        </div>
                      </div>

                      <div className="mb-2 h-[30px] mt-11">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          Investment{" "}
                          <span className="text-[#44546a]">Opportunity</span>
                        </span>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-4 mt-8">
                        <div className="w-full h-fit flex gap-2">
                          <div className="w-6 h-fit flex flex-col justify-center items-center">
                            <div className="w-6 h-6 border-[6px] border-[#ffccab] bg-transparent"></div>
                            <div className="w-2 h-16 border border-[#ffccab] bg-[#ffccab]"></div>
                          </div>
                          <div
                            className="h-[86px] bg-[#ffccab] rounded rounded-se-3xl rounded-ee-3xl p-3 relative"
                            style={{ width: "calc(100% - 70px)" }}
                          >
                            <div className="text-base font-bold text-black">
                              LOAN AMOUNT
                            </div>
                            <div className={`text-2xl font-normal text-black `}>
                              $
                              {(
                                Number(
                                  investmentDetails?.investmentOpportunity
                                 ?.loanAmount
                                ) || 0
                              ).toLocaleString("en-US")
                              }
                            </div>

                            <div className="absolute top-3 right-3 h-[60px] flex-center">
                              <Image
                                src={ProjectManagement}
                                alt="Logo - SVG"
                                className="h-[52px] w-[52px]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="w-full h-fit flex gap-2">
                          <div className="w-6 h-fit flex flex-col justify-center items-center">
                            <div className="w-6 h-6 border-[6px] border-[#a8d2d4] bg-transparent"></div>
                            <div className="w-2 h-16 border border-[#a8d2d4] bg-[#a8d2d4]"></div>
                          </div>
                          <div
                            className="h-[86px] bg-[#a8d2d4] rounded rounded-se-3xl rounded-ee-3xl p-3 relative"
                            style={{ width: "calc(100% - 70px)" }}
                          >
                            <div className="text-base font-bold text-black">
                              LOAN TERM
                            </div>
                            <div className={`text-2xl font-normal text-black `}>
                              {investmentDetails?.investmentOpportunity
                                ?.loanTermYear && (
                                <>
                                  <span>
                                    {
                                      investmentDetails?.investmentOpportunity
                                        ?.loanTermYear
                                    }
                                  </span>
                                  &nbsp;
                                  {investmentDetails?.investmentOpportunity
                                    ?.loanTermYear > 1
                                    ? "Years"
                                    : "Year"}{" "}
                                  &nbsp;
                                </>
                              )}
                              {investmentDetails?.investmentOpportunity
                                ?.loanTermMonth && (
                                <>
                                  <span>
                                    {
                                      investmentDetails?.investmentOpportunity
                                        ?.loanTermMonth
                                    }
                                  </span>
                                  &nbsp;
                                  {investmentDetails?.investmentOpportunity
                                    ?.loanTermMonth > 1
                                    ? " Months"
                                    : " Month"}{" "}
                                </>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 h-[60px] flex-center">
                              <Image
                                src={CognitiveEducation}
                                alt="Logo - SVG"
                                className="h-[52px] w-[52px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 h-[30px] mt-11">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          Financial{" "}
                          <span className="text-[#44546a]">Overview</span>
                        </span>
                      </div>

                      <div className="w-full mt-8">
                        <div className="border border-black  overflow-hidden">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#038ca7] text-white">
                                <th className="px-4 py-2 text-white border border-black">
                                  Loan Type
                                </th>
                                <th className="px-4 py-2 text-white border border-black">
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-[#e7e7e7]">
                                <td className="px-4 py-2 text-black border border-black">
                                  Total Loan Amount
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    $
                                    {(
                                      Number(
                                        investmentDetails?.investmentOpportunity
                                          ?.loanAmount
                                      ) || 0
                                    ).toLocaleString("en-US")}
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                              <tr className="bg-[#e7e7e7]">
                                <td className="px-4 py-2 text-black border border-black">
                                  Loan Position
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    {
                                      investmentDetails?.investmentOpportunity
                                        ?.loanPosition
                                    }
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                              <tr className="bg-[#e7e7e7]">
                                <td className="px-4 py-2 text-black border border-black">
                                  Purpose
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    {
                                      investmentDetails?.investmentOpportunity
                                        ?.loanPurpose
                                    }
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="w-fll mt-2">
                        <div className="border border-black  overflow-hidden">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#038ca7] text-white">
                                <th className="px-4 py-2 text-white border border-black">
                                  Returns
                                </th>
                                <th className="px-4 py-2 text-white border border-black">
                                  Costs
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-[#e7e7e7]">
                                <td className="px-4 py-2 text-black border border-black">
                                  Purchase Price
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    $
                                    {(
                                      Number(
                                        investmentDetails?.investmentOpportunity
                                          ?.purchasePrice
                                      ) || 0
                                    ).toLocaleString("en-US")}
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                              <tr className="bg-[#e7e7e7]">
                                <td className="px-4 py-2 text-black border border-black">
                                  Rehab Cost
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    $
                                    {Number(
                                      investmentDetails?.rehabAssessment
                                        ?.totalCost
                                    ).toLocaleString("en-US")}
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                              <tr className="bg-[#e7e7e7]">
                                <td className="px-4 py-2 text-black border border-black">
                                  Total Project Cost
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    $
                                    {Number(
                                      investmentDetails?.investmentOpportunity
                                        ?.purchasePrice +
                                        investmentDetails?.rehabAssessment
                                          ?.totalCost
                                    ).toLocaleString("en-US")}
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                              <tr className="bg-white">
                                <td className="px-4 py-2 text-[#038ca7] border border-[#038ca7]">
                                  Owner Contribution
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-[#038ca7] border border-[#038ca7]">
                                    $
                                    {(
                                      Number(
                                        investmentDetails?.investmentOpportunity
                                          ?.contribution
                                      ) || 0
                                    ).toLocaleString("en-US")}
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                              <tr className="bg-white">
                                <td className="px-4 py-2 text-[#038ca7] border border-[#038ca7]">
                                  Loan Amount (First Lien Loan)
                                </td>
                                {isPayNow && (
                                  <td className="px-4 py-2 text-[#038ca7] border border-[#038ca7]">
                                    $
                                    {(
                                      Number(
                                        investmentDetails?.investmentOpportunity
                                          ?.loanAmount
                                      ) || 0
                                    ).toLocaleString("en-US")}
                                  </td>
                                )}
                                {!isPayNow && (
                                  <td className="px-4 py-2 text-black border border-black">
                                    <div className="w-20 h-6 bg-black"></div>
                                  </td>
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-4 mt-11">
                        <div className="w-full h-fit flex gap-2">
                          <div className="w-6 h-fit flex flex-col justify-center items-center">
                            <div className="w-6 h-6 border-[6px] border-[#ffccab] bg-transparent"></div>
                            <div className="w-2 h-16 border border-[#ffccab] bg-[#ffccab]"></div>
                          </div>
                          <div
                            className="h-[86px] bg-[#ffccab] rounded rounded-se-3xl rounded-ee-3xl p-3 relative"
                            style={{ width: "calc(100% - 70px)" }}
                          >
                            <div className="text-base font-bold text-black">
                              ARV
                            </div>
                            {isPayNow && (
                              <div className="text-2xl font-normal text-black">
                                $
                                {(
                                  Number(
                                    investmentDetails?.investmentOpportunity
                                      ?.estARV
                                  ) || 0
                                ).toLocaleString("en-US")}
                              </div>
                            )}
                            {!isPayNow && (
                              <div className="w-20 h-6 bg-black"></div>
                            )}

                            <div className="absolute top-3 right-3">
                              <svg
                                className="h-[60px] w-[52px]"
                                xmlns="http://www.w3.org/2000/svg"
                                enableBackground="new 0 0 24 24"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="undefined"
                              >
                                <g>
                                  <rect fill="none" height="24" width="24" />
                                </g>
                                <g>
                                  <g>
                                    <path d="M1,11v10h6v-5h2v5h6V11L8,6L1,11z M13,19h-2v-5H5v5H3v-6.97l5-3.57l5,3.57V19z" />
                                    <rect height="2" width="2" x="17" y="7" />
                                    <rect height="2" width="2" x="17" y="11" />
                                    <rect height="2" width="2" x="17" y="15" />
                                    <polygon points="10,3 10,4.97 12,6.4 12,5 21,5 21,19 17,19 17,21 23,21 23,3" />
                                  </g>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="w-full h-fit flex gap-2">
                          <div className="w-6 h-fit flex flex-col justify-center items-center">
                            <div className="w-6 h-6 border-[6px] border-[#a8d2d4] bg-transparent"></div>
                            <div className="w-2 h-16 border border-[#a8d2d4] bg-[#a8d2d4]"></div>
                          </div>
                          <div
                            className="h-[86px] bg-[#a8d2d4] rounded rounded-se-3xl rounded-ee-3xl p-3 relative"
                            style={{ width: "calc(100% - 70px)" }}
                          >
                            <div className="text-base font-bold text-black">
                              MARGIN
                            </div>
                            {isPayNow && (
                              <div className="text-2xl font-normal text-black">
                                $
                                {(
                                  Number(
                                    investmentDetails?.investmentOpportunity
                                      ?.estARV
                                  ) -
                                  Number(
                                    investmentDetails?.investmentOpportunity
                                      ?.totalCost
                                  )
                                ).toLocaleString("en-US")}
                              </div>
                            )}
                            {!isPayNow && (
                              <div className="w-20 h-6 bg-black"></div>
                            )}
                            <div className="absolute top-3 right-3 h-[60px] flex justify-center items-center">
                              <Image
                                src={Sale}
                                alt="Logo - SVG"
                                className="h-[52px] w-[52px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full min-h-fit h-[800px] mt-11">
                      <div className="relative h-full">
                        <Image
                          src={UsaMap}
                          alt="Logo - SVG"
                          className="w-full min-h-fit h-[800px] object-cover"
                        />
                        <div
                          className="absolute top-3 left-4 right-2"
                          style={{ width: "calc(100% - 30px)" }}
                        >
                          <div className="mb-6 h-[30px]">
                            <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                              Market{" "}
                              <span className="text-[#44546a]">
                                Comparisons
                              </span>
                            </span>
                          </div>

                          {investmentDetails?.marketComparison && (
                            <div className="grid grid-cols-[1fr_auto_auto_1fr] xl:gap-6 lg:gap-4 gap-2 justify-between w-full">
                              {investmentDetails?.marketComparison
                                .slice(0, 4)
                                .map((item: any, index: number) => {
                                  return (
                                    <>
                                      {index % 2 === 0 ? (
                                        <>
                                          <div
                                            className="w-full h-fit"
                                            key={`market - ${index}`}
                                          >
                                            {
                                              <div
                                                className={`${
                                                  index % 2 === 1 ? "mt-8" : ""
                                                } w-full h-fit`}
                                              >
                                                <div className="w-full  bg-[#024873] h-6 min-h-fit place-self-end pl-2 text-white">
                                                  {isPayNow
                                                    ? item?.propertyAddress
                                                    : ""}
                                                </div>

                                                <div className="border border-black w-full  overflow-hidden">
                                                  <table className="w-full text-left border-collapse">
                                                    <thead></thead>
                                                    <tbody>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Distance
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.distance.indexOf("miles") === -1 ? `${item?.distance} miles` : item?.distance}
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Bed/Bath
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.beds}/
                                                            {item?.baths}
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Area
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.area} sq.ft
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                           Closed Price
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            ${Number(
                                                              item?.soldClosedPrice).toLocaleString("en-US")
                                                            }
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                           Closed Date
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {
                                                              item?.soldClosedDate
                                                            }
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Days on Market
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.daysOnMarket}
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </div>
                                            }
                                          </div>
                                          {!isPayNow && (
                                            <div className="md:w-[72px] md:h-[50px] lg:w-[100px] lg:h-[75px] xl:w-[144px] xl:h-[100px]"></div>
                                          )}
                                          {isPayNow && (
                                            <div className="md:w-[72px] md:h-[50px] lg:w-[100px] lg:h-[75px] xl:w-[144px] xl:h-[100px]">
                                              {item?.propertyPhoto && (
                                                <div className="w-full flex justify-start">
                                                  <img
                                                    src={item?.propertyPhoto}
                                                    alt="Property Photo"
                                                    className="md:w-[72px] md:h-[50px] lg:w-[100px] lg:h-[75px] xl:w-[144px] xl:h-[100px] object-cover"
                                                    onLoad={() =>
                                                      setIsImageLoaded(true)
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {!isPayNow && (
                                            <div className="md:w-[72px] md:h-[50px] lg:w-[100px] lg:h-[75px] xl:w-[144px] xl:h-[100px]"></div>
                                          )}
                                          {isPayNow && (
                                            <div className="md:w-[72px] md:h-[50px] lg:w-[100px] lg:h-[75px] xl:w-[144px] xl:h-[100px] mt-8">
                                              {item?.propertyPhoto && (
                                                <div className="w-full flex justify-start">
                                                  <img
                                                    src={item?.propertyPhoto}
                                                    alt="Property Photo"
                                                    className="md:w-[72px] md:h-[50px] lg:w-[100px] lg:h-[75px] xl:w-[144px] xl:h-[100px] object-cover"
                                                    onLoad={() =>
                                                      setIsImageLoaded(true)
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          )}
                                          <div className="w-full h-fit">
                                            {
                                              <div
                                                className={`${
                                                  index % 2 === 1 ? "mt-8" : ""
                                                } w-full h-fit`}
                                              >
                                                <div className="w-full bg-[#024873] h-6 min-h-fit place-self-end pl-2 text-white">
                                                  {isPayNow
                                                    ? item?.propertyAddress
                                                    : ""}
                                                </div>

                                                <div className="border border-black overflow-hidden  w-full">
                                                  <table className="w-full text-left border-collapse">
                                                    <thead></thead>
                                                    <tbody>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Distance
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.distance.indexOf("miles") === -1 ? `${item?.distance} miles` : item?.distance}
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Bed/Bath
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.beds}/
                                                            {item?.baths}
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Area
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.area} sq.ft
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Closed Price
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            ${(Number (
                                                              item?.soldClosedPrice
                                                            ).toLocaleString("en-US"))
                                                            }
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Closed Date
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {
                                                              item?.soldClosedDate
                                                            }
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                      <tr className="bg-[#e3f0f8]">
                                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                                          Days on Market
                                                        </td>
                                                        {isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            {item?.daysOnMarket}
                                                          </td>
                                                        )}
                                                        {!isPayNow && (
                                                          <td className="px-2 py-2 text-black border border-black">
                                                            <div className="w-20 h-6 bg-black"></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </div>
                                            }
                                          </div>
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                            </div>
                          )}

                          {/* <div className="grid grid-cols-3 gap-2 mt-8 justify-between w-full">
                            {!isPayNow && <div></div>}
                            {isPayNow && (
                              <div>
                                {investmentDetails?.marketComparison[0]
                                  ?.propertyPhoto && (
                                  <div className="w-full flex justify-start">
                                    <img
                                      src={
                                        investmentDetails?.marketComparison[0]
                                          ?.propertyPhoto
                                      }
                                      alt="Property Photo"
                                      className="w-[144px] h-[100px] object-cover"
                                      onLoad={() => setIsImageLoaded(true)}
                                    />
                                  </div>
                                )}
                                {investmentDetails?.marketComparison[1]
                                  ?.propertyPhoto && (
                                  <div className=" w-full h-fit flex justify-end mt-8">
                                    <img
                                      src={
                                        investmentDetails?.marketComparison[1]
                                          ?.propertyPhoto
                                      }
                                      alt="Property Photo"
                                      className="w-[144px] h-[100px] object-cover"
                                      onLoad={() => setIsImageLoaded(true)}
                                    />
                                  </div>
                                )}
                                {investmentDetails?.marketComparison[2]
                                  ?.propertyPhoto && (
                                  <div className="w-full h-fit flex justify-start mt-3">
                                    <img
                                      src={
                                        investmentDetails?.marketComparison[2]
                                          ?.propertyPhoto
                                      }
                                      alt="Property Photo"
                                      className="w-[144px] h-[100px] object-cover"
                                      onLoad={() => setIsImageLoaded(true)}
                                    />
                                  </div>
                                )}
                                {investmentDetails?.marketComparison[3]
                                  ?.propertyPhoto && (
                                  <div className="w-full h-fit flex justify-end mt-12">
                                    <img
                                      src={
                                        investmentDetails?.marketComparison[3]
                                          ?.propertyPhoto
                                      }
                                      alt="Property Photo"
                                      className="w-[144px] h-[100px] object-cover"
                                      onLoad={() => setIsImageLoaded(true)}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="w-full h-fit justify-items-end">
                              <div>
                                <div className="w-[180px] bg-[#024873] h-6 place-self-start pl-2 text-white">
                                  {isPayNow
                                    ? investmentDetails?.marketComparison[2]
                                        ?.propertyAddress
                                    : ""}
                                </div>

                                <div className="border border-black w-fit  overflow-hidden">
                                  <table className="w-[250px] min-w-fit text-left border-collapse">
                                    <thead></thead>
                                    <tbody>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Distance
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[2]?.distance
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Bed/Bath
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[2]?.beds
                                            }
                                            /
                                            {
                                              investmentDetails
                                                ?.marketComparison[2]?.baths
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          sq. ft.
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[2]?.area
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Sold Price
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[2]
                                                ?.soldClosedPrice
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Days on Market
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[2]
                                                ?.daysOnMarket
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="w-fit h-fit mt-8">
                                <div className="w-[180px] bg-[#024873] h-6 place-self-start pl-2 text-white">
                                  {isPayNow
                                    ? investmentDetails?.marketComparison[3]
                                        ?.propertyAddress
                                    : ""}
                                </div>

                                <div className="border border-black  overflow-hidden">
                                  <table className="w-[250px] min-w-fit text-left border-collapse">
                                    <thead></thead>
                                    <tbody>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Distance
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[3]?.distance
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Bed/Bath
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[3]?.beds
                                            }
                                            /
                                            {
                                              investmentDetails
                                                ?.marketComparison[3]?.baths
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          sq. ft.
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[3]?.area
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Sold Price
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[3]
                                                ?.soldClosedPrice
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                      <tr className="bg-[#e3f0f8]">
                                        <td className="px-2 py-2 text-black border border-black font-semibold">
                                          Days on Market
                                        </td>
                                        {isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            {
                                              investmentDetails
                                                ?.marketComparison[3]
                                                ?.daysOnMarket
                                            }
                                          </td>
                                        )}
                                        {!isPayNow && (
                                          <td className="px-2 py-2 text-black border border-black">
                                            <div className="w-20 h-6 bg-black"></div>
                                          </td>
                                        )}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>

                    {investmentDetails?.isVisiblePotentialScore &&
                      investmentDetails?.investmentPotentialScore && (
                        <div className="w-full p-4 mt-11">
                          <div className="flex justify-center items-center w-fit">
                            <div className="text-black text-lg font-bold">
                              INVESTMENT POTENTIAL SCORE
                            </div>
                            <div
                              className={`ml-6 h-12 w-12 rounded-full flex  bg-[#6a9d88] text-white justify-center text-[24px] leading-none font-bold circle-container ${
                                isPdfClass ? "items-start " : "items-center"
                              }`}
                            >
                              {!isPayNow && <div className="h-6 w-6"></div>}
                              {isPayNow && (
                                <div className="h-6 w-fit">
                                  {investmentDetails?.investmentPotentialScore?.finalScore?.toFixed(
                                    0
                                  )}
                                  {!investmentDetails?.investmentPotentialScore
                                    ?.finalScore && "0"}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-full justify-center items-center flex mt-8">
                            <Image src={Scale} alt="progressBar" />
                          </div>

                          <div className="mt-8 w-full">
                            <div className="grid grid-cols-2 gap-8">
                              <div className="w-full">
                                <div className="flex items-center gap-3">
                                  <div className="text-black text-base font-normal">
                                    Location Score
                                  </div>
                                  <div
                                    className={`h-6 w-6 rounded-full flex justify-center bg-[#6a9d88] text-white text-[12px] leading-none font-bold ${
                                      isPdfClass
                                        ? "items-start "
                                        : "items-center"
                                    }`}
                                  >
                                    {isPayNow
                                      ? investmentDetails?.investmentPotentialScore?.locationScoreData?.totalScore?.toFixed(
                                          0
                                        ) * 10 || 0
                                      : ""}
                                  </div>
                                </div>
                                <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                                  <div
                                    className="h-4 bg-[#a4d164] absolute"
                                    style={{
                                      width: `${
                                        isPayNow
                                          ? investmentDetails?.investmentPotentialScore?.locationScoreData?.totalScore?.toFixed(
                                              0
                                            ) * 10
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="w-full place-items-end">
                                <div className="flex items-center gap-3">
                                  <div className="text-black text-base font-normal">
                                    Property Condition Score
                                  </div>
                                  <div
                                    className={`h-6 w-6 rounded-full flex justify-center bg-[#6a9d88] text-white text-[12px] leading-none font-bold ${
                                      isPdfClass
                                        ? "items-start "
                                        : "items-center"
                                    }`}
                                  >
                                    {isPayNow
                                      ? investmentDetails?.investmentPotentialScore?.propertyScoreData?.totalScore?.toFixed(
                                          0
                                        ) * 10 || 0
                                      : ""}
                                  </div>
                                </div>
                                <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                                  <div
                                    className="h-4 bg-[#a4d164] absolute"
                                    style={{
                                      width: `${
                                        isPayNow
                                          ? investmentDetails
                                              ?.investmentPotentialScore
                                              ?.propertyScoreData?.totalScore *
                                              10 || 0
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="w-full">
                                <div className="flex items-center gap-3">
                                  <div className="text-black text-base font-normal">
                                    Market Value
                                  </div>
                                  <div
                                    className={`h-6 w-6 rounded-full flex justify-center bg-[#6a9d88] text-white text-[12px] leading-none font-bold ${
                                      isPdfClass
                                        ? "items-start "
                                        : "items-center"
                                    }`}
                                  >
                                    {isPayNow
                                      ? investmentDetails?.investmentPotentialScore?.marketScoreData?.totalMarketValue?.toFixed(
                                          0
                                        ) * 10 || 0
                                      : ""}
                                  </div>
                                </div>
                                <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                                  <div
                                    className="h-4 bg-[#a4d164] absolute"
                                    style={{
                                      width: `${
                                        isPayNow
                                          ? investmentDetails
                                              ?.investmentPotentialScore
                                              ?.marketScoreData
                                              ?.totalMarketValue * 10 || 0
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="w-full place-items-end">
                                <div className="flex items-center gap-3">
                                  <div className="text-black text-base font-normal">
                                    Rental Outlook
                                  </div>
                                  <div
                                    className={`h-6 w-6 rounded-full flex justify-center bg-[#6a9d88] text-white text-[12px] leading-none font-bold ${
                                      isPdfClass
                                        ? "items-start "
                                        : "items-center"
                                    }`}
                                  >
                                    {isPayNow
                                      ? investmentDetails?.investmentPotentialScore?.rentalScoreData?.totalRentalAndCapScore?.toFixed(
                                          0
                                        ) * 10 || 0
                                      : ""}
                                  </div>
                                </div>
                                <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                                  <div
                                    className="h-4 bg-[#a4d164] absolute"
                                    style={{
                                      width: `${
                                        isPayNow
                                          ? investmentDetails?.investmentPotentialScore?.rentalScoreData?.totalRentalAndCapScore?.toFixed(
                                              0
                                            ) * 10
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="w-full">
                                <div className="flex items-center gap-3">
                                  <div className="text-black text-base font-normal">
                                    Rehab Score
                                  </div>
                                  <div
                                    className={`h-6 w-6 rounded-full flex justify-center bg-[#6a9d88] text-white text-[12px] leading-none font-bold ${
                                      isPdfClass
                                        ? "items-start "
                                        : "items-center"
                                    }`}
                                  >
                                    {isPayNow
                                      ? investmentDetails?.investmentPotentialScore?.rehabScoreData?.rehabScore?.toFixed(
                                          0
                                        ) * 10 || 0
                                      : ""}
                                  </div>
                                </div>
                                <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                                  <div
                                    className="h-4 bg-[#a4d164] absolute"
                                    style={{
                                      width: `${
                                        isPayNow
                                          ? investmentDetails
                                              ?.investmentPotentialScore
                                              ?.rehabScoreData?.rehabScore *
                                              10 || 0
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              <div className="w-full place-items-end">
                                <div className="flex items-center gap-3">
                                  <div className="text-black text-base font-normal">
                                    Community Score
                                  </div>
                                  <div
                                    className={`h-6 w-6 rounded-full flex justify-center bg-[#6a9d88] text-white text-[12px] leading-none font-bold ${
                                      isPdfClass
                                        ? "items-start "
                                        : "items-center"
                                    }`}
                                  >
                                    {isPayNow
                                      ? investmentDetails?.investmentPotentialScore?.communityAndLifestyleScoreData?.totalCommunityAndLifestyleScore?.toFixed(
                                          0
                                        ) * 10 || 0
                                      : ""}
                                  </div>
                                </div>
                                <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                                  <div
                                    className="h-4 bg-[#a4d164] absolute"
                                    style={{
                                      width: `${
                                        isPayNow
                                          ? investmentDetails
                                              ?.investmentPotentialScore
                                              ?.communityAndLifestyleScoreData
                                              ?.totalCommunityAndLifestyleScore *
                                              10 || 0
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    <div
                      className={`w-full p-4  ${
                        isPdfClass && investmentDetails?.isVisiblePotentialScore
                          ? "mt-[400px]"
                          : "mt-11"
                      }`}
                    >
                      <div className="mb-2 h-[30px]">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          Neighborhood{" "}
                          <span className="text-[#44546a]">Data</span>
                        </span>
                      </div>

                      {isPayNow && (
                        <div className="flex gap-8 mt-2">
                          <div className="grid grid-cols-3 gap-2">
                            {investmentDetails?.neighborhoodDetails?.schools?.map(
                              (school: any, index: number) => (
                                <div
                                  key={`scholld-${index}`}
                                  className="font-bold text-base text-[#737373] w-full"
                                >
                                  <div>{school.name}</div>
                                  <div>Grades: {school.grades}</div>
                                  <div>Distance: {school.distance} mi</div>
                                  <div>Rating: {school.rating}</div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-8 w-full max-w-[847px] flex justify-center items-center">
                        <div className="relative w-full">
                          <div className="w-full">
                            <Image
                              src={chart}
                              alt="Logo - SVG"
                              className="w-full max-w-[847px]"
                            />
                          </div>
                          {isPayNow && (
                            <div className="absolute top-[16%] left-[18%] font-medium text-[#5e5e5e]">
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.bikeRating
                              }
                              /100
                            </div>
                          )}
                          {!isPayNow && (
                            <div className="absolute top-[16%] left-[18%] flex justify-center items-center gap-1   font-medium text-[#5e5e5e]">
                              <div className="w-[20px] h-[18px] bg-black"></div>{" "}
                              <div>/100</div>
                            </div>
                          )}
                          {isPayNow && (
                            <div className="absolute top-[52%] left-[12%] font-medium text-[#5e5e5e]">
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.walkRating
                              }
                              /100
                            </div>
                          )}
                          {!isPayNow && (
                            <div className="absolute top-[52%] left-[12%] flex justify-center items-center gap-1   font-medium text-[#5e5e5e]">
                              <div className="w-[20px] h-[18px] bg-black"></div>{" "}
                              <div>/100</div>
                            </div>
                          )}
                          {isPayNow && (
                            <div className="absolute top-[88%] left-[18%]   font-medium text-[#5e5e5e]">
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.transportRating
                              }
                              /100
                            </div>
                          )}
                          {!isPayNow && (
                            <div className="absolute top-[88%] left-[18%] flex justify-center items-center gap-1   font-medium text-[#5e5e5e]">
                              <div className="w-[20px] h-[18px] bg-black"></div>{" "}
                              <div>/100</div>
                            </div>
                          )}
                          {isPayNow && (
                            <div className="absolute top-[20%] right-[22%]  font-medium text-[#5e5e5e]">
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.primarySchoolRating
                              }
                              /10
                            </div>
                          )}
                          {!isPayNow && (
                            <div className="absolute top-[20%] right-[22%] flex justify-center items-center gap-1   font-medium text-[#5e5e5e]">
                              <div className="w-[20px] h-[18px] bg-black"></div>{" "}
                              <div>/10</div>
                            </div>
                          )}
                          {isPayNow && (
                            <div className="absolute top-[56%] right-[20%] font-medium text-[#5e5e5e]">
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.middleSchoolRating
                              }
                              /10
                            </div>
                          )}
                          {!isPayNow && (
                            <div className="absolute top-[56%] right-[20%] flex justify-center items-center gap-1   font-medium text-[#5e5e5e]">
                              <div className="w-[20px] h-[18px] bg-black"></div>{" "}
                              <div>/10</div>
                            </div>
                          )}
                          {isPayNow && (
                            <div className="absolute top-[92%] right-[28%] font-medium text-[#5e5e5e]">
                              {
                                investmentDetails?.neighborhoodDetails
                                  ?.highSchoolRating
                              }
                              /10
                            </div>
                          )}
                          {!isPayNow && (
                            <div className="absolute top-[92%] right-[28%] flex justify-center items-center gap-1   font-medium text-[#5e5e5e]">
                              <div className="w-[20px] h-[18px] bg-black"></div>{" "}
                              <div>/10</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-full p-4  ${
                        !investmentDetails?.isVisiblePotentialScore &&
                        isPdfClass
                          ? "mt-[150px]"
                          : investmentDetails?.isVisiblePotentialScore &&
                            isPdfClass &&
                            false
                          ? "mt-[100px]"
                          : "mt-11"
                      }`}
                    >
                      <div className="mb-2 h-[30px]">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          Rehab <span className="text-[#44546a]">Grading</span>
                        </span>
                      </div>

                      <div className="w-fit h-fit px-8 py-4 border-[2px] border-black mt-8">
                        <div className="w-fit grid grid-cols-2 gap-8">
                          <div className="w-full">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Foundation Repairs
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                  investmentDetails?.rehabAssessment?.foundation
                                    ?.cost
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.foundation?.status
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full ml-8">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Kitchen and Bathroom
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                 ( investmentDetails?.rehabAssessment.bathRoom?.cost + investmentDetails?.rehabAssessment?.kitchen?.cost)
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? ((getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.bathRoom?.status
                                        ) + getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.kitchen?.status
                                        ))/ 2).toFixed(0)
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Painting (Interior/Exterior)
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                  (investmentDetails?.rehabAssessment
                                    ?.interiorPainting?.cost + investmentDetails?.rehabAssessment?.exteriorPainting?.cost)
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? ((getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.interiorPainting?.status
                                        ) + getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.exteriorPainting?.status
                                        ))/ 2).toFixed(0)
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full ml-8">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Roof Repair/Replacement
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                  investmentDetails?.rehabAssessment?.roofing
                                    ?.cost
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.roofing?.status
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Flooring Replacement
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                  investmentDetails?.rehabAssessment?.flooring
                                    ?.cost
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.flooring?.status
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full ml-8">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Plumbing and Electrical
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                  investmentDetails?.rehabAssessment?.electrical
                                    ?.cost +
                                    investmentDetails?.rehabAssessment?.plumbing
                                      ?.cost
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? ((getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.electrical?.status
                                        ) + getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.plumbing?.status
                                        ))/2).toFixed(0)
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Demolition and Cleanout
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                   investmentDetails?.rehabAssessment?.demolition?.cost
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.demolition?.status
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>

                          <div className="w-full ml-8">
                            <div className="w-[300px] flex items-center justify-between gap-3">
                              <div className="text-black text-base font-semibold">
                                Landscaping and Exterior
                              </div>
                              <div
                                className={`text-black text-base font-bold ${
                                  !isPayNow ? "w-fit min-w-8 h-6 bg-black" : ""
                                }`}
                              >
                                ${" "}
                                {Number(
                                 ( investmentDetails?.rehabAssessment?.landscaping?.cost
                                  + investmentDetails?.rehabAssessment?.hvac?.cost + investmentDetails?.rehabAssessment?.extraBedBath?.cost
                                 )
                                ).toLocaleString("en-US")}
                              </div>
                            </div>
                            <div className="w-[300px] bg-[#d5ff99] h-4 relative mt-2">
                              <div
                                className="h-4 bg-[#a4d164] absolute"
                                style={{
                                  width: `${
                                    isPayNow
                                      ? ((getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.landscaping?.status
                                        ) + getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.hvac?.status
                                        ) + getRehabPercentage(
                                          investmentDetails?.rehabAssessment
                                            ?.extraBedBath?.status
                                        )
                                        )/3).toFixed(0)
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-[300px] flex justify-between items-center text-black text-xs font-normal">
                              <div>Minor</div>
                              <div>Moderate</div>
                              <div>Extensive</div>
                            </div>
                          </div>
                        </div>

                        <div className="text-black text-lg font-semibold mt-4">
                          Miscellaneous :{" "}
                          <span className="font-bold">
                            ${" "}
                            {!investmentDetails?.additionalRehabs?.length &&
                              "0.00"}
                            {investmentDetails?.additionalRehabs &&
                              investmentDetails?.additionalRehabs?.length > 1 &&
                              investmentDetails?.additionalRehabs?.reduce(
                                (total: number, rehab: any) =>
                                  total + rehab.cost,
                                0
                              )}
                            {investmentDetails?.additionalRehabs &&
                              investmentDetails?.additionalRehabs?.length ===
                                1 &&
                              investmentDetails?.additionalRehabs[0].cost}
                          </span>
                        </div>

                        <div className="w-full flex justify-center items-center h-fit mt-8">
                          <div className="px-6 py-3 border border-black text-black font-semibold text-base w-fit h-t flex justify-center items-center gap-1">
                            REHAB COST:{" "}
                            <div
                              className={`font-bold text-xl text-[#6a9d88] ml-4 ${
                                !isPayNow
                                  ? "w-fit min-w-8 h-6 bg-black text-black"
                                  : ""
                              }`}
                            >
                              ${" "}
                              {Number(
                                investmentDetails?.rehabAssessment?.totalCost
                              ).toLocaleString("en-US")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(investmentDetails?.investmentOpportunity?.bathRoomImage ||
                      investmentDetails?.investmentOpportunity?.bedRoomImage ||
                      investmentDetails?.investmentOpportunity
                        ?.kitchenImage) && (
                      <div
                        className={`w-full p-4  ${
                          isPdfClass &&
                          investmentDetails?.isVisiblePotentialScore
                            ? "mt-[230px]"
                            : "mt-11"
                        }`}
                      >
                        <div className="mb-2 h-[30px]">
                          <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                            Property{" "}
                            <span className="text-[#44546a]">Photos</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-8">
                          {investmentDetails?.investmentOpportunity
                            ?.bathRoomImage?.contentType && (
                            <div className="w-full">
                              <div className="w-full h-[200px]">
                                {investmentDetails?.investmentOpportunity
                                  ?.bathRoomImage && (
                                  <img
                                    className="w-full h-full rounded-t-lg"
                                    src={`data:${investmentDetails?.investmentOpportunity?.bathRoomImage?.contentType};base64,${investmentDetails?.investmentOpportunity?.bathRoomImage?.data}`}
                                  />
                                )}
                              </div>
                              <div className="p-2 bg-[#e5e9e5] h-fit w-full text-black font-medium text-lg">
                                Bathroom
                              </div>
                            </div>
                          )}

                          {investmentDetails?.investmentOpportunity
                            ?.bedRoomImage?.contentType && (
                            <div className="w-full">
                              <div className="w-full h-[200px]">
                                {investmentDetails?.investmentOpportunity
                                  ?.bedRoomImage && (
                                  <img
                                    className="w-full h-full rounded-t-lg"
                                    src={`data:${investmentDetails?.investmentOpportunity?.bedRoomImage?.contentType};base64,${investmentDetails?.investmentOpportunity?.bedRoomImage?.data}`}
                                  />
                                )}
                              </div>
                              <div className="p-2 bg-[#e5e9e5] h-fit w-full text-black font-medium text-lg">
                                Bedroom
                              </div>
                            </div>
                          )}

                          {investmentDetails?.investmentOpportunity
                            ?.kitchenImage?.contentType && (
                            <div className="w-full">
                              <div className="w-full h-[200px]">
                                {investmentDetails?.investmentOpportunity
                                  ?.kitchenImage && (
                                  <img
                                    className="w-full h-full rounded-t-lg"
                                    src={`data:${investmentDetails?.investmentOpportunity?.kitchenImage?.contentType};base64,${investmentDetails?.investmentOpportunity?.kitchenImage?.data}`}
                                  />
                                )}
                              </div>
                              <div className="p-2 bg-[#e5e9e5] h-fit w-full text-black font-medium text-lg">
                                Kitchen
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className={`w-full p-4 ${
                        isPdfClass &&
                        !investmentDetails?.isVisiblePotentialScore
                          ? "mt-[220px]"
                          : "mt-11"
                      }`}
                    >
                      <div className="mb-2 h-[30px]">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          Borrower{" "}
                          <span className="text-[#44546a]">Summary</span>
                        </span>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <div className="h-28 w-28 rounded-s-2xl">
                          {investmentDetails?.personalInformation
                            ?.profilePicture && (
                            <img
                              className="h-28 w-28 rounded-s-2xl"
                              src={`data:${investmentDetails?.personalInformation?.profilePicture?.contentType};base64,${investmentDetails?.personalInformation?.profilePicture?.data}`}
                            />
                          )}
                        </div>

                        <div className="w-[760px] flex flex-col justify-start border border-gray-200 rounded-e-2xl">
                          <div
                            className={`font-semibold text-[#6a9d88] text-lg h-[36px] px-3 text-start flex justify-start" ${
                              isPdfClass ? "items-start " : "items-center"
                            }`}
                          >
                            {
                              investmentDetails?.personalInformation
                                ?.companyName
                            }
                          </div>
                          <div className="w-full bg-gray-200 p-4 min-h-[74px] rounded-ee-2xl">
                            <div
                              className={`font-normal text-black text-base mt-1 `}
                            >
                              {
                                investmentDetails?.personalInformation
                                  ?.descriptions
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-9">
                        <div className="w-[35%] mt-8">
                          <div className="border border-black w-full rounded-lg px-4 py-4">
                            <div className="w-full text-black font-medium text-lg">
                              BORROWER CREDIT HISTORY
                            </div>

                            <div className="flex w-full justify-center items-center mt-4 mb-4">
                              <Image src={ficoScore} alt="Fico Score" />
                            </div>

                            <div className="m-auto border border-[#6a9d88] px-3 py-2 w-fit text-black font-normal text-lg mt-4 flex justify-center items-center gap-4 ">
                              Credit Range:{" "}
                              <div
                                className={`font-bold ${
                                  !isPayNow
                                    ? "w-fit min-w-8 h-6 bg-black text-black"
                                    : ""
                                }`}
                              >
                                {
                                  investmentDetails?.personalInformation
                                    ?.ficoScore
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-[65%] mt-8">
                          <div className="border border-black w-full rounded-lg px-4 py-4">
                            <div className="flex border-b border-gray-700 gap-4 pb-6">
                              <div className="h-6 decoration-dashed underline decoration-blue-400 underline-offset-8  w-10 text-blue-600 flex justify-center items-center pb-1 text-2xl font-bold">
                                {isPayNow
                                  ? investmentDetails?.personalInformation
                                      ?.totalProjectsLastYear
                                    ? investmentDetails?.personalInformation
                                        ?.totalProjectsLastYear
                                    : ""
                                  : ""}
                              </div>
                              <div className="text-black font-medium text-2xl">
                                Completed Projects YTD
                              </div>
                            </div>
                            <div className="flex gap-4 pb-2 mt-6">
                              <div className="h-6 decoration-dashed underline decoration-yellow-400 underline-offset-8 w-10 text-yellow-500 flex justify-center items-center pb-1 text-2xl font-bold">
                                {isPayNow
                                  ? investmentDetails?.personalInformation
                                      ?.totalProjects
                                    ? investmentDetails?.personalInformation
                                        ?.totalProjects
                                    : ""
                                  : ""}
                              </div>
                              <div className="text-black font-medium text-2xl">
                                Total Project Completed till Date
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {investmentDetails?.previousProjects.length > 0 && (
                      <div
                        className={`w-full p-4  ${
                          isPdfClass &&
                          investmentDetails?.isVisiblePotentialScore
                            ? "mt-[350px]"
                            : "mt-11"
                        }`}
                      >
                        <div className="mb-2 h-[30px]">
                          <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                            Completed{" "}
                            <span className="text-[#44546a]">
                              Projects (2023 - 2024)
                            </span>
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-8 mt-8">
                          {investmentDetails?.previousProjects?.map(
                            (project: any, index: number) => (
                              <div
                                className="w-full h-fit border border-black"
                                key={`in-${index}`}
                              >
                                <div className="p-2 w-full border border-black">
                                  <div className="bg-gradient-to-r from-green-200 to-gray-100 w-full h-fit min-h-10 text-black px-4 py-2">
                                    {project?.propertyAddress}
                                  </div>

                                  <div>
                                    {isPayNow && (
                                      <img
                                        className="w-full h-full mt-2"
                                        src={`data:${project?.propertyPhoto?.contentType};base64,${project?.propertyPhoto?.data}`}
                                      />
                                    )}
                                    {!isPayNow && (
                                      <div className="w-full h-40 mt-2 bg-black"></div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-full">
                                  <table className="border-collapse w-full">
                                    <tbody>
                                      <tr className="bg-[#FFF]">
                                        <td className="px-2 text-xs py-2 text-black border border-black">
                                          Purchase price
                                        </td>
                                        <td className="px-2 text-xs py-2 text-black border border-black">
                                          Sold Price
                                        </td>
                                        <td className="px-2 text-xs py-2 text-black border border-black">
                                          Rehab Cost
                                        </td>
                                      </tr>
                                      {isPayNow && (
                                        <tr className="bg-[#FFF]">
                                          <td className="px-2 text-xs py-2 text-black border border-black">
                                            ${" "}
                                            {Number(
                                              project?.purchasePrice
                                            ).toLocaleString("en-US")}
                                          </td>
                                          <td className="px-2 text-xs py-2 text-black border border-black">
                                            ${" "}
                                            {Number(
                                              project?.soldPrice
                                            ).toLocaleString("en-US")}
                                          </td>
                                          <td className="px-2 text-xs py-2 text-black border border-black">
                                            ${" "}
                                            {Number(
                                              project?.rehabCost
                                            ).toLocaleString("en-US")}
                                          </td>
                                        </tr>
                                      )}
                                      {!isPayNow && (
                                        <tr className="bg-[#FFF]">
                                          <td className="px-2 text-xs py-2 text-black border border-black">
                                            <div className="w-full h-6 bg-black"></div>
                                          </td>
                                          <td className="px-2 text-xs py-2 text-black border border-black">
                                            <div className="w-full h-6 bg-black"></div>
                                          </td>
                                          <td className="px-2 text-xs py-2 text-black border border-black">
                                            <div className="w-full h-6 bg-black"></div>
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-11 mb-11">
                      <div className="mb-2 h-[30px]">
                        <span className="text-3xl font-bold leading-[28px] text-[#038ca7] ">
                          <span className="text-[#44546a]">Appendix</span>
                        </span>
                      </div>

                      <div>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Rent Estimates
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                ${
                                  investmentDetails?.zillowRentEstimate?.floorplans[0].zestimate.rentZestimate
                                }{" "}
                                / monthly
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Rate per Sqft
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                ${(
                                  investmentDetails?.investmentOpportunity
                                    .purchasePrice /
                                  investmentDetails?.investmentOpportunity.area
                                ).toFixed(0)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Lot Size: Size of the property lot.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts?.lotSize
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Zoning: Zoning classification of the property.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts?.zoning
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Year Built: Year the property was constructed.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts?.yearBuilt
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Owner Occupied: Check whether occupied by Owner
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {investmentDetails?.zillowSearchAddressData
                                  ?.isNonOwnerOccupied
                                  ? "No"
                                  : "Yes"}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Property Description: Detailed description of
                                the property.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.description
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Home Type: Home Type Description
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {(
                                  investmentDetails?.zillowSearchAddressData
                                    ?.homeType || ""
                                ).replace("_", " ")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Map Link: Link to the property’s location on a
                                map.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                <a
                                  style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                  }}
                                  href={`https://www.google.com/maps?q=${Number(
                                    investmentDetails?.zillowSearchAddressData
                                      ?.latitude
                                  )},${Number(
                                    investmentDetails?.zillowSearchAddressData
                                      ?.longitude
                                  )}`}
                                  target="_blank"
                                >{`https://www.google.com/maps?q=${Number(
                                  investmentDetails?.zillowSearchAddressData
                                    ?.latitude
                                )},${Number(
                                  investmentDetails?.zillowSearchAddressData
                                    ?.longitude
                                )}`}</a>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Property Appliances & Features
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                <div><b>Appliances:-</b>{(investmentDetails?.zillowSearchAddressData?.resoFacts.appliances || []).join(", ")}</div>
                                <div><b>Feature:-</b></div>
                                <div>Roof Types:- {investmentDetails?.zillowSearchAddressData?.resoFacts.roofType}</div>
                                <div>Flooring:- {investmentDetails?.zillowSearchAddressData?.resoFacts.flooring}</div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Parking Type: Type of parking (e.g., garage,
                                street).
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {investmentDetails?.zillowSearchAddressData?.resoFacts.atAGlanceFacts
                                  .filter((a: any) =>
                                    ["Parking"].includes(a.factLabel)
                                  )
                                  .map((a: any) => a.factValue)
                                  .join(", ")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Garage Space: Number of garage spaces available.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts.garageSpaces
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Basement: Information about the basement (e.g.,
                                finished, size).
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts.basement
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Heating: Type of heating system.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {(
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts.heating || []
                                ).join(", ")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Cooling: Type of cooling system.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {(
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts.cooling || []
                                ).join(", ")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Pool: Pool availability and details.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {investmentDetails?.zillowSearchAddressData
                                  ?.resoFacts.hasPrivatePool
                                  ? "Yes"
                                  : "No"}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Building Information: Additional building
                                details (e.g., construction materials).
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {(
                                  investmentDetails?.zillowSearchAddressData?.resoFacts?.constructionMaterials?.map(
                                    capitalizeFirstLetter
                                  ) || []
                                ).join(", ")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Water: Water supply details.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts.waterSource
                                }
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                Sewer: Sewer system details.
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "10px",
                                  color: "#000",
                                  width: "50%",
                                }}
                              >
                                {(
                                  investmentDetails?.zillowSearchAddressData
                                    ?.resoFacts.sewer || []
                                ).join(", ")}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-center mt-8">
                    {isPayNow && (
                      <button
                        className="w-[109px] h-[36px] rounded-md border-[#083c6d] border hover:bg-[#ffffff] bg-white font-normal text-base   text-[#083c6d]"
                        onClick={() => setIsPdfClass(true)}
                      >
                        Download
                      </button>
                    )}
                    {!isPayNow && (
                      <button
                        className="w-[150px] h-[36px] rounded-md border-[#083c6d] border hover:bg-[#083c6d] bg-[#083c6d] font-normal text-base   text-[#FFFFFF]"
                        onClick={handleCheckout}
                      > 
                        <DownloadOutlined style={{ marginRight: '5px'}}/>
                        <span>

                        Free Download
                        </span>
                      </button>
                    )}
                  </div>
                </div>
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
        </div>
      </div>
    </>
  );
}
