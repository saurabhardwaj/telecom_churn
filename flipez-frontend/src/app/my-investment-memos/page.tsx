"use client";
import { Button, Col, Descriptions, Progress, Row, Spin, Steps, Table } from "antd";
import Layout from "../components/layout";
import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { on } from "events";
import { textDecorationLine } from "html2canvas/dist/types/css/property-descriptors/text-decoration-line";
import { downloadFile, getMyCompletedInvestment, processPDF } from "../api/service/investment-details.service";

export default function MyInvestmentMemos() {
  const [step, setStep] = React.useState(1);
  const [dataSource, setDataSource] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  const calculatePercentage = (currentStep: number) => {
    const totalSteps = 1;
    return (currentStep / totalSteps) * 100;
  };
  const router = useRouter();

  useEffect(() => {
    getData()
  }, []);

  const getData = async () => {
    const history = []
    const data = await getMyCompletedInvestment();
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      history.push({
        key: index + 1,
        sNo: index + 1,
        createdDate: moment(element.updatedAt).format('MM/DD/YYYY'),
        propertyAddress: element.investmentOpportunity.propertyAddress,
        pdfLink: element._id,
        _id: element._id,
      }) 
    }
    setDataSource(history);
  }

  const downloadPdf = async (row : any) => {
    setLoading(true);
    await processPDF(row._id);
    const blob = await downloadFile(row._id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investment-memo.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  }
  
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      key: 'sNo',
      onHeaderCell: () => ({
        style: { backgroundColor: '#083c6d', color: '#ffffff'},
      }),
    },
    {
      title: 'Download Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      onHeaderCell: () => ({
        style: { backgroundColor: '#083c6d', color: '#ffffff'},
      }),
    },
    {
      title: 'Property Address',
      dataIndex: 'propertyAddress',
      key: 'propertyAddress',
      onHeaderCell: () => ({
        style: { backgroundColor: '#083c6d', color: '#ffffff'},
      }),
    },
    {
      title: 'PDF Link',
      dataIndex: 'pdfLink',
      key: 'pdfLink',
      onHeaderCell: () => ({
        style: { backgroundColor: '#083c6d', color: '#ffffff'},
      }),
      onCell: () => ({
        style: { color: '#083c6d', textDecorationLine: 'underline' },
      }),
      render: (text:any, record: any) => <a onClick={() => downloadPdf(record)}>Download</a>,
    },
  ];

  return (
    <>
      <div className="bg-[#FFFFFF] h-full">
        <div className={`${loading ? "opacity-50" : ""} flex h-full w-full`}>
          <div className="border-r border-r-[#D9D9D9] w-[324px] min-w-fit">
            <Layout
              calculatePercentage={calculatePercentage(step)}
              stage={"memoHistory"}
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
                    <div className="text-[32px] text-[#000000]">
                      Your Investment Memo History
                    </div>
                  </div>
                    <div className=" w-full h-full mt-11 px-4 py-4">
                      <div className="shadow-lg w-full bg-[#F8F8F8] rounded-lg px-4 py-4">
                        <div className="w-full">
                            <Table dataSource={dataSource} columns={columns} pagination={false} bordered />;
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div className=" w-[100%] absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <div className="w-[100px] h-[100px]">
              <Spin size="large" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
