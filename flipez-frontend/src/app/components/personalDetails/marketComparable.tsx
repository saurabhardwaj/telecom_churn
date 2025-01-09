"use client";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import modal from "antd/es/modal";
import React, {
  forwardRef,
  use,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const MarketComparable = (
  props: {
    isNextClicked: boolean;
    personalDetails: any;
    setPersonalDetails: any;
  },
  ref: React.Ref<unknown> | undefined
) => {
  const [isAllowEdit, setIsAllowEdit] = useState(true);
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));
  const [marketComparison, setMarketComparison] = useState(
    props.personalDetails?.marketComparison || []
  );

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
    borderBottom: "1px solid #e8e8e8",
  };

  const inputStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid rgba(127, 128, 133, 0.44)",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px",
    width: "90%",
    color: "#5e5e5e",
  };

  const inputAddressStyle = {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: "400",
    border: "1px solid rgba(127, 128, 133, 0.44)",
    height: "31px",
    borderRadius: "5px",
    padding: "0px 12px",
    width: "90%",
    color: "#5e5e5e",
  };

  const tableInputDataStyle = {
    fontSize: "14px",
    color: "#5e5e5e",
    padding: "12px 10px",
    borderBottom: "1px solid #e8e8e8",
    textAlignLast: "center" as any,
  };

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    props.setPersonalDetails((prevState: any) => ({
      ...prevState,
      marketComparison: prevState.marketComparison.map(
        (item: any, i: number) => {
          if (i === index) {
            return { ...item, [name]: value };
          }
          return item;
        }
      ),
    }));
  };

  const config = {
    title: "Remove Investment Potential",
    content: (
      <>
        <div className="text-[#5e5e5e] text-lg">
          Are you sure you want to remove this investment potential?
        </div>
      </>
    ),
    onOk: () => {
      props.setPersonalDetails({
        ...props.personalDetails,
        isVisiblePotentialScore: false,
      });
      modal.destroyAll();
    },
    onCancel: () => {
      modal.destroyAll();
    },
  };

  return (
    <>
      <div className="max-w-full p-4">
        <div className="container">
          <div className="text-xl font-bold text-[#5e5e5e] mb-2">
            Market Comparisons
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th style={tableHeaderStyle}>Property Address</th>
                  <th style={tableHeaderStyle}>Beds</th>
                  <th style={tableHeaderStyle}>Baths</th>
                  <th style={tableHeaderStyle}>Area (Sq Ft)</th>
                  <th style={tableHeaderStyle}>Rate/Sqft</th>
                  <th style={tableHeaderStyle}>Distance (Miles)</th>
                  <th style={tableHeaderStyle}>Days on Market</th>
                  <th style={tableHeaderStyle}>Sold Date</th>
                  <th style={tableHeaderStyle}>Sold Price</th>
                </tr>
              </thead>
              {marketComparison?.length > 0 && (
                <tbody>
                  {(marketComparison?.length
                    ? marketComparison
                    : []
                  ).map((property: any, index: number) => (
                    <tr key={index} className="bg-white hover:bg-gray-50">
                      {property.propertyAddress ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.propertyAddress}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="text"
                            style={inputAddressStyle}
                            name="propertyAddress"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.beds ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.beds}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="text"
                            style={inputStyle}
                            name="beds"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.baths ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.baths}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="text"
                            style={inputStyle}
                            name="baths"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.area ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.area}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="text"
                            style={inputStyle}
                            name="area"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.rate ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.rate}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                           <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              className="input-style"
                              type="text"
                              style={inputStyle}
                              name="rate"
                              onChange={(e) => onChangeInput(e, index)}
                            />
                          </div>
                        </td>
                      )}

                      {property.distance ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.distance}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="text"
                            style={inputStyle}
                            name="distance"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.daysOnMarket ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.daysOnMarket}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="text"
                            style={inputStyle}
                            name="daysOnMarket"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.soldClosedDate ? (
                        <td style={tableDataStyle} className="text-center">
                          {property.soldClosedDate}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <input
                            className="input-style"
                            type="date"
                            style={inputStyle}
                            name="soldClosedDate"
                            onChange={(e) => onChangeInput(e, index)}
                          />
                        </td>
                      )}

                      {property.soldClosedPrice ? (
                        <td style={tableDataStyle} className="text-center">
                          ${Number(property.soldClosedPrice).toLocaleString("en-US")}
                        </td>
                      ) : (
                        <td style={tableInputDataStyle}>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              className="input-style"
                              type="text"
                              style={inputStyle}
                              name="soldClosedPrice"
                              onChange={(e) => onChangeInput(e, index)}
                            />
                          </div>
                        </td>
                      )}

                      {/* <td style={tableDataStyle} className="text-center">
                        {property.rate}
                      </td>
                      <td style={tableDataStyle} className="text-center">
                        {property.distance}
                      </td>
                      <td style={tableDataStyle} className="text-center">
                        {property.daysOnMarket}
                      </td>
                      <td style={tableDataStyle} className="text-center">
                        {property.soldClosedDate}
                      </td>
                      <td style={tableDataStyle} className="text-center">
                        {property.soldClosedPrice}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              )}
              {marketComparison?.length === 0 && (
                <tbody>
                  <tr className="bg-white hover:bg-gray-50">
                    <td
                      style={tableDataStyle}
                      className="text-center"
                      colSpan={9}
                    >
                      No Market Comparisons
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>

        {props.personalDetails?.isVisiblePotentialScore && (
          <>
            <div className="flex justify-between items-center mt-8 ">
              <div className="text-xl font-bold text-[#5e5e5e]">
                Investment Potential
              </div>

              <div>
                <Button
                  type="dashed"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={async () => {
                    await modal.confirm(config);
                  }}
                >
                  Investment Potential
                </Button>
              </div>
            </div>

            <div className="container mt-2">
              {/* Progress Bar */}
              <div className="flex items-center mb-1">
                <div className="w-full bg-gray-300 rounded h-6 relative">
                  <div
                    className="bg-green-600 h-6 rounded"
                    style={{
                      width: `${props.personalDetails?.investmentPotentialScore?.finalScore}%`,
                    }}
                  ></div>
                  <span className="absolute top-0 right-2 text-gray-700 font-normal">
                    Investment Score:{" "}
                    {props.personalDetails?.investmentPotentialScore
                      ?.finalScore ||
                      0 ||
                      0}{" "}
                    %
                  </span>
                </div>
              </div>

              {/* Investment Potential Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th style={tableHeaderStyle} className="text-left">
                        Category
                      </th>
                      <th style={tableHeaderStyle} className="text-left">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-gray-50">
                      <td style={tableDataStyle}>Location Score </td>
                      <td style={tableDataStyle}>
                        {(
                          props.personalDetails?.investmentPotentialScore
                            ?.locationScoreData?.totalScore * 10
                        ).toFixed(0) || 0}
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td style={tableDataStyle}>Property Condition Score </td>
                      <td style={tableDataStyle}>
                        {(
                          props.personalDetails?.investmentPotentialScore
                            ?.propertyScoreData?.totalScore * 10
                        ).toFixed(0) || 0}
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td style={tableDataStyle}>Market Value </td>
                      <td style={tableDataStyle}>
                        {(
                          props.personalDetails?.investmentPotentialScore
                            ?.marketScoreData?.totalMarketValue * 10
                        ).toFixed(0) || 0}
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td style={tableDataStyle}>Rental Outlook </td>
                      <td style={tableDataStyle}>
                        {(
                          props.personalDetails?.investmentPotentialScore
                            ?.rentalScoreData?.totalRentalAndCapScore * 10
                        ).toFixed(0) || 0}
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td style={tableDataStyle}>Rehab Score </td>
                      <td style={tableDataStyle}>
                        {(
                          props.personalDetails?.investmentPotentialScore
                            ?.rehabScoreData?.rehabScore * 10
                        ).toFixed(0) || 0}
                      </td>
                    </tr>
                    <tr className="bg-white hover:bg-gray-50">
                      <td style={tableDataStyle}>Community Score </td>
                      <td style={tableDataStyle}>
                        {(
                          props.personalDetails?.investmentPotentialScore
                            ?.communityAndLifestyleScoreData
                            ?.totalCommunityAndLifestyleScore * 10
                        ).toFixed(0) || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default forwardRef(MarketComparable);
