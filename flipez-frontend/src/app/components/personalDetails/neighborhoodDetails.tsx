"use client";
import React, {
  forwardRef,
  useImperativeHandle,
} from "react";
import chart from "./../../public/images/neighborhoodChart.svg";
import Image from "next/image";

const NeighborhoodDetails = (
  props: {
    neighborhoodDetails: any;
    isNextClicked: boolean;
    personalDetails: any;
    setPersonalDetails: any;
  },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    return true;
  };

  const tableHeaderStyle = {
    backgroundColor: "#f8f8f8",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#083c6d",
    padding: "12px 10px",
    borderBottom: "1px solid #e8e8e8",
  };

  const tableDataStyle = {
    fontSize: "14px",
    color: "#5e5e5e",
    padding: "12px 10px",
    borderBottom: "1px solid #5e5e5e",
  };

  return (
    <>
      <div className="max-w-full p-4">
        <div className="container">
          <div className="text-xl mb-4 font-bold text-[#5e5e5e]">
            Neighborhood Schools
          </div>

          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th style={tableHeaderStyle} className="text-left">
                  School Name
                </th>
                <th style={tableHeaderStyle}>Rating</th>
                <th style={tableHeaderStyle}>Grades</th>
                <th style={tableHeaderStyle}>Distance</th>
              </tr>
            </thead>
            {props.personalDetails?.neighborhoodDetails.schools &&
              props.neighborhoodDetails?.schools && (
                <tbody>
                  {(props.personalDetails?.neighborhoodDetails.schools
                    ? props.personalDetails?.neighborhoodDetails.schools
                    : props.neighborhoodDetails?.schools
                  ).map((item: any, index: number) => (
                    <tr key={index}>
                      <td style={tableDataStyle}>{item.name}</td>
                      <td style={tableDataStyle} className="text-center">
                        {item.rating}
                      </td>
                      <td style={tableDataStyle} className="text-center">
                        {item.grades}
                      </td>
                      <td style={tableDataStyle} className="text-center">
                        {item.distance} {item.distance > 1 ? "miles" : "mile"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            {!props.personalDetails?.neighborhoodDetails?.schools &&
              !props.neighborhoodDetails?.schools && (
                <tbody>
                  <tr>
                    <td
                      style={tableDataStyle}
                      className="text-center"
                      colSpan={4}
                    >
                      No data available
                    </td>
                  </tr>
                </tbody>
              )}
          </table>

          <div className="mt-4 max-w-[847px] w-full flex justify-center items-center">
            <div className="relative w-full max-w-[847px]">
              <div className="w-full">
                <Image src={chart} alt="Logo - SVG" className="max-w-[847px] w-full" />
              </div>
              <div className="absolute top-[16%] left-[18%]  font-medium text-[#5e5e5e]">
                {props.personalDetails?.neighborhoodDetails?.bikeRating ||
                  props.neighborhoodDetails?.bikeRating}
                /100
              </div>
              <div className="absolute top-[52%] left-[12%]  font-medium text-[#5e5e5e]">
                {props.personalDetails?.neighborhoodDetails?.walkRating ||
                  props.neighborhoodDetails?.walkRating}
                /100
              </div>
              <div className="absolute top-[88%] left-[18%]  font-medium text-[#5e5e5e]">
                {props.personalDetails?.neighborhoodDetails?.transportRating ||
                  props.neighborhoodDetails?.transportRating}
                /100
              </div>
              <div className="absolute top-[20%] right-[22%]  font-medium text-[#5e5e5e]">
                {props.personalDetails?.neighborhoodDetails
                  ?.primarySchoolRating ||
                  props.neighborhoodDetails?.primarySchoolRating}
                /10
              </div>
              <div className="absolute top-[56%] right-[20%]  font-medium text-[#5e5e5e]">
                {props.personalDetails?.neighborhoodDetails
                  ?.middleSchoolRating ||
                  props.neighborhoodDetails?.middleSchoolRating}
                /10
              </div>
              <div className="absolute top-[92%] right-[28%]  font-medium text-[#5e5e5e]">
                {props.personalDetails?.neighborhoodDetails?.highSchoolRating ||
                  props.neighborhoodDetails?.highSchoolRating}
                /10
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default forwardRef(NeighborhoodDetails);
