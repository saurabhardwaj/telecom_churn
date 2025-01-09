const fs = require("fs");
const axios = require("axios");
const path = require("path");
const Handlebars = require("handlebars");
var html_to_pdf = require("html-pdf-node");
const puppeteer = require("puppeteer");
const InvestmentDetailsModel = require("./investment-details.model");

const loadImageAsBase64 = async (url) => {
  if (!url) return "";
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");
  return `data:image/jpg;base64,${buffer.toString("base64")}`;
};

async function processPdfFileGenerate(body) {
  const path = __dirname + "/pdf_file.html";
  const htmlString = fs.readFileSync(path, "utf8");
  if (body.investmentOpportunity.propertyPhoto) {
    body.investmentOpportunity.propertyPhoto = await loadImageAsBase64(
      body.investmentOpportunity.propertyPhoto
    );
  }
  for (let index = 0; index < body.marketComparison.length; index++) {
    const element = body.marketComparison[index];
    if (element.propertyPhoto) {
      body.marketComparison[index].propertyPhoto = await loadImageAsBase64(
        element.propertyPhoto
      );
    }
  }
  for (let index = 0; index < body.previousProjects.length; index++) {
    const element = body.previousProjects[index];
    body.previousProjects[index].propertyPhoto.data = body.previousProjects[
      index
    ].propertyPhoto.data.toString("base64");
  }
  body.marketComparison;
  for (let index = 0; index < body.marketComparison.length; index++) {
    const element = body.marketComparison[index];
    body.marketComparison[index].distance =
      (element.distance || "").indexOf("miles") === -1
        ? `${element.distance} miles`
        : element.distance;
  }

  Handlebars.registerHelper("formatCurrency", function(value) {
    if (value == null) return "0"; // Handle null or undefined values
    return `${Number(value).toLocaleString("en-US")}`;
  });
  var template = Handlebars.compile(htmlString);
  function calculateLandscapingStatus(
    landscapingStatus,
    hvacStatus,
    extraBedBath
  ) {
    const getStatusValue = (status) => {
      if (status === "Extensive") return 100;
      if (status === "Moderate") return 50;
      return 25;
    };

    const landscapingValue = getStatusValue(landscapingStatus);
    const hvacValue = getStatusValue(hvacStatus);
    const extraBedBathValue = getStatusValue(extraBedBath);
    return ((landscapingValue + hvacValue + extraBedBathValue) / 3).toFixed(0);
  }

  function calculateTwoValueStatus(status1, status2) {
    const getStatusValue = (value) => {
      if (value === "Extensive") return 100;
      if (value === "Moderate") return 50;
      return 25;
    };

    const status1Value = getStatusValue(status1);
    const status2Value = getStatusValue(status2);
    return ((status1Value + status2Value) / 2).toFixed(0);
  }

  var data = {
    projectTerm: `${
      body.investmentOpportunity?.loanTermYear
        ? body.investmentOpportunity?.loanTermYear
        : ""
    } ${
      body.investmentOpportunity?.loanTermYear > 1
        ? "Years"
        : body.investmentOpportunity?.loanTermYear
        ? "Year"
        : ""
    } ${
      body.investmentOpportunity?.loanTermMonth
        ? body.investmentOpportunity?.loanTermMonth
        : ""
    } ${
      body.investmentOpportunity?.loanTermMonth > 1
        ? "Months"
        : body.investmentOpportunity?.loanTermMonth
        ? "Month"
        : ""
    }`,
    loanToARV: parseInt(body.investmentOpportunity.loanToARV),
    loanToValue: parseInt(body.investmentOpportunity.loanToValue),
    propertyAddress: body.investmentOpportunity?.propertyAddress,
    bedrooms: body.investmentOpportunity?.bedrooms,
    bathrooms: body.investmentOpportunity?.bathrooms,
    area: body.investmentOpportunity?.area,
    loanAmount: body.investmentOpportunity?.loanAmount,
    loanPosition: body.investmentOpportunity?.loanPosition,
    loanPurpose: body.investmentOpportunity?.loanPurpose,
    purchasePrice: body.investmentOpportunity?.purchasePrice,
    rehabTotalCost: body.rehabAssessment?.totalCost,
    totalProjectCost:
      body.investmentOpportunity?.purchasePrice +
      body.rehabAssessment?.totalCost,
    contribution: body.investmentOpportunity?.contribution,
    estARV: body.investmentOpportunity?.estARV,
    totalCost: body.investmentOpportunity?.totalCost,
    margin:
      body.investmentOpportunity?.estARV -
      body.investmentOpportunity?.totalCost,
    finalScore: body.investmentPotentialScore?.finalScore,
    locationScore:
      body.investmentPotentialScore?.locationScoreData?.totalScore * 10,
    marketValue:
      body.investmentPotentialScore?.marketScoreData?.totalMarketValue * 10,
    rehabScore: body.investmentPotentialScore?.rehabScoreData?.rehabScore * 10,
    propertyScore:
      body.investmentPotentialScore?.propertyScoreData?.totalScore * 10,
    rentalOutlook:
      body.investmentPotentialScore?.rentalScoreData?.totalRentalAndCapScore *
      10,
    communityScore:
      body.investmentPotentialScore?.communityAndLifestyleScoreData
        ?.totalCommunityAndLifestyleScore * 10,
    bikeRating: body.neighborhoodDetails?.bikeRating,
    walkRating: body.neighborhoodDetails?.walkRating,
    transportRating: body.neighborhoodDetails?.transportRating,
    primarySchoolRating: body.neighborhoodDetails?.primarySchoolRating,
    middleSchoolRating: body.neighborhoodDetails?.middleSchoolRating,
    highSchoolRating: body.neighborhoodDetails?.highSchoolRating,
    rehabFoundation: body.rehabAssessment?.foundation?.cost,
    statusFoundation:
      body.rehabAssessment?.foundation?.status == "Extensive"
        ? "100"
        : body.rehabAssessment?.foundation?.status == "Moderate"
        ? "50"
        : "25",
    rehabKitchenAndBathRoom:
      body.rehabAssessment.bathRoom?.cost + body.rehabAssessment.kitchen?.cost,
    statusBathRoom: calculateTwoValueStatus(
      body.rehabAssessment?.bathRoom?.status,
      body.rehabAssessment?.kitchen?.status
    ),
    rehabInteriorPainting:
      body.rehabAssessment?.interiorPainting?.cost +
      body.rehabAssessment?.exteriorPainting?.cost,
    statusInteriorPainting: calculateTwoValueStatus(
      body.rehabAssessment?.interiorPainting?.status,
      body.rehabAssessment?.exteriorPainting?.status
    ),
    rehabRoofing: body.rehabAssessment?.roofing?.cost,
    statusRoofing:
      body.rehabAssessment?.roofing?.status == "Extensive"
        ? "100"
        : body.rehabAssessment?.roofing?.status == "Moderate"
        ? "50"
        : "25",
    rehabFlooring: body.rehabAssessment?.flooring?.cost,
    statusFlooring:
      body.rehabAssessment?.flooring?.status == "Extensive"
        ? "100"
        : body.rehabAssessment?.flooring?.status == "Moderate"
        ? "50"
        : "25",
    rehabPlumbingElectric:
      body.rehabAssessment?.electrical?.cost +
      body.rehabAssessment?.plumbing?.cost,
    statusPlumbingElectric: calculateTwoValueStatus(
      body.rehabAssessment?.electrical?.status,
      body.rehabAssessment?.plumbing?.status
    ),

    rehabDemolition: body.rehabAssessment?.demolition?.cost,
    statusDemolition:
      body.rehabAssessment?.demolition?.status == "Extensive"
        ? "100"
        : body.rehabAssessment?.demolition?.status == "Moderate"
        ? "50"
        : "25",
    rehabLandscaping:
      body.rehabAssessment?.landscaping?.cost +
      body.rehabAssessment?.hvac?.cost +
      body.rehabAssessment?.extraBedBath?.cost,
    statusLandscaping: calculateLandscapingStatus(
      body.rehabAssessment?.landscaping?.status,
      body.rehabAssessment?.hvac?.status,
      body.rehabAssessment?.extraBedBath?.status
    ),
    additionalRehab: body.investmentDetails?.additionalRehabs?.reduce(
      (total, rehab) => total + rehab.cost,
      0
    ),
    totalCostRehab: body.rehabAssessment?.totalCost,
    companyName: body.personalInformation?.companyName,
    descriptions: body.personalInformation?.descriptions,
    ficoScore: body.personalInformation?.ficoScore,
    totalProjectsLastYear: body.personalInformation?.totalProjectsLastYear,
    totalProjects: body.personalInformation?.totalProjects,
    rentEstimates:
      body.zillowRentEstimate.floorplans[0].zestimate.rentZestimate,
    ratePerSqft: (
      body.investmentOpportunity.purchasePrice / body.investmentOpportunity.area
    ).toFixed(0),
    lotSize: body.zillowSearchAddressData?.resoFacts?.lotSize,
    zoning: body.zillowSearchAddressData?.resoFacts?.zoning,
    yearBuild: body.zillowSearchAddressData?.resoFacts?.yearBuilt,
    ownerOccupied: body.zillowSearchAddressData?.isNonOwnerOccupied
      ? "No"
      : "Yes",
    propertyDescription: body.zillowSearchAddressData?.description,
    homeType: (body?.zillowSearchAddressData?.homeType || "").replace("_", " "),
    appliances: (
      body?.zillowSearchAddressData?.resoFacts.appliances || []
    ).join(", "),
    roofType: body?.zillowSearchAddressData?.resoFacts.roofType,
    flooring: body?.zillowSearchAddressData?.resoFacts.flooring,
    propertyFeature: body?.zillowSearchAddressData?.resoFacts.atAGlanceFacts
      .filter((a) => ["Heating", "Cooling", "Parking"].includes(a.factLabel))
      .map((a) => a.factLabel)
      .join(", "),
    parkingType: body?.zillowSearchAddressData?.resoFacts.atAGlanceFacts
      .filter((a) => ["Parking"].includes(a.factLabel))
      .map((a) => a.factValue)
      .join(", "),
    garageSpace: body?.zillowSearchAddressData?.resoFacts.garageSpaces,
    basement: body?.zillowSearchAddressData?.resoFacts.basement,
    heating: (body?.zillowSearchAddressData?.resoFacts.heating || []).join(
      ", "
    ),
    cooling: (body?.zillowSearchAddressData?.resoFacts.cooling || []).join(
      ", "
    ),
    pool: body?.zillowSearchAddressData?.resoFacts.hasPrivatePool
      ? "Yes"
      : "No",
    buildingInformation: (
      body.zillowSearchAddressData?.resoFacts.constructionMaterials || []
    ).join(", "),
    waterSupply: body.zillowSearchAddressData?.resoFacts.waterSource,
    sewer: (body.zillowSearchAddressData?.resoFacts.sewer || []).join(", "),
    longitude: body.zillowSearchAddressData?.longitude,
    latitude: body.zillowSearchAddressData?.latitude,
    schools: body.neighborhoodDetails?.schools,
    projects: body.previousProjects,
    marketComparison1: body.marketComparison[0],
    marketComparison2: body.marketComparison[1],
    marketComparison3: body.marketComparison[2],
    marketComparison4: body.marketComparison[3],
    propertyPhoto: body.investmentOpportunity?.propertyPhoto,
    profilePhotoContentType:
      body.personalInformation?.profilePicture?.contentType,
    profilePhotoData: body.personalInformation?.profilePicture?.data.toString(
      "base64"
    ),
    ImageBathroomContentType:
      body.investmentOpportunity?.bathRoomImage?.contentType,
    ImageBathroomData: body.investmentOpportunity?.bathRoomImage?.data.toString(
      "base64"
    ),
    ImageKitchenContentType:
      body.investmentOpportunity?.kitchenImage?.contentType,
    ImageKitchenData: body.investmentOpportunity?.kitchenImage?.data.toString(
      "base64"
    ),
    ImageBedroomContentType:
      body.investmentOpportunity?.bedRoomImage?.contentType,
    ImageBedroomData: body.investmentOpportunity?.bedRoomImage?.data.toString(
      "base64"
    ),
  };
  var result = template(data);
  return result;
}

const convertHtmlToPdf = async (htmlContent, id) => {
  try {
    const folderPath = path.join(__dirname, "../../../upload", id);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    // Save the PDF to a file (optional)
    const filePath = path.join(
      __dirname,
      "../../../upload",
      id,
      "investment-memo.pdf"
    );

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    // Generate the PDF
    await page.pdf({
      path: filePath, // Output file path
      format: "A4", // Paper size
      printBackground: true, // Include background colors
    });

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const getPdf = async (req) => {
  try {
    let query = { _id: req.params.id };
    const investmentDetails = await InvestmentDetailsModel.findOne(query)
      .populate(
        "personalInformation.profilePicture investmentOpportunity.kitchenImage investmentOpportunity.bathRoomImage investmentOpportunity.bedRoomImage previousProjects.propertyPhoto investmentPotentialScore"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Save the PDF to a file (optional)
    const filePath = path.join(
      __dirname,
      "../../../upload",
      investmentDetails._id.toString(),
      "investment-memo.pdf"
    );

    if (!fs.existsSync(filePath)) {
      const result = await processPdfFileGenerate(investmentDetails);
      await convertHtmlToPdf(result, investmentDetails._id.toString());
    }
    return req.sendResponse(200, "Success");
  } catch (error) {
    return req.sendResponse(500, error);
  }
};

module.exports = getPdf;
