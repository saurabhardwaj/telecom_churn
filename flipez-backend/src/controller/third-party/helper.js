const axios = require("axios");
const moment = require("moment");
const ConfigModel = require("../config/config.modal");

const getRapidAPIKey = async () => {
  const data = await ConfigModel.findOne({ key: "RAPID_API_KEY" }).lean();
  return data.value;
}

const getAutoCompleteAPIKey = async () => {
  const data = await ConfigModel.findOne({ key: "RAPID_API_AUTO_COMPLETE_KEY" }).lean();
  return data.value;
}

const getChatgptAPIKey = async () => {
  const data = await ConfigModel.findOne({ key: "CHATGPT_API_KEY" }).lean();
  return data.value;
}

const getZillowRentEstimateData = async (address) => {
  try {
    const querystring = { address: address };
    const headers = {
      "x-rapidapi-key": await getRapidAPIKey(),
      "x-rapidapi-host": process.env.ZILLOW_SEARCH_API_HOST,
    };
    const response = await axios.get(process.env.ZILLOW_RENT_ESTIMATE_API_URL, {
      headers: headers,
      params: querystring,
    });
    return response.data.data;
  } catch (err) {
    return err;
  }
};

const getZillowSearchAddressData = async (address) => {
  try {
    const querystring = { address: address };
    const headers = {
      "x-rapidapi-key": await getRapidAPIKey(),
      "x-rapidapi-host": process.env.ZILLOW_SEARCH_API_HOST,
    };
    const response = await axios.get(
      process.env.ZILLOW_SEARCH_ADDRESS_API_URL,
      {
        headers: headers,
        params: querystring,
      }
    );
    return response.data;
  } catch (err) {
    console.log("🚀 ~ getZillowSearchAddressData ~ err:", err);
    return err;
  }
};

const getZillowSimilarPropertyData = async (zpid) => {
  try {
    const querystring = { zpid: zpid };
    const headers = {
      "x-rapidapi-key": await getRapidAPIKey(),
      "x-rapidapi-host": process.env.ZILLOW_SEARCH_API_HOST,
    };
    const response = await axios.get(
      process.env.ZILLOW_SIMILAR_SOLD_API_URL,
      {
        headers: headers,
        params: querystring,
      }
    );
    return response.data;
  } catch (err) {
    console.log("🚀 ~ getZillowSearchAddressData ~ err:", err);
    return err;
  }
};

const getZillowWalkTransitData = async (zpid) => {
  try {
    const querystring = { zpid };
    const headers = {
      "x-rapidapi-key": await getRapidAPIKey(),
      "x-rapidapi-host": process.env.ZILLOW_SEARCH_API_HOST,
    };
    const response = await axios.get(process.env.ZILLOW_TRANSIT_API, {
      headers: headers,
      params: querystring,
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

const parseCostRange = (text) => {
  const regex = /\$(\d+),?(\d*)\s*-\s*\$(\d+),?(\d*)/;
  const match = text.match(regex);
  if (match) {
    const min = parseInt(match[1] + (match[2] || "0"), 10);
    const max = parseInt(match[3] + (match[4] || "0"), 10);
    return [min, max];
  }
  return [0, 0];
};

const mapAndCalculateCosts = (response, rehabAssessment) => {
  let totalCost = 0;
  const costFactors = {
    Extensive: (min, max) => max,
    Moderate: (min, max) => (min + max) / 2,
    Minor: (min, max) => min,
  };

  const componentMapping = {
    Demolition: "demolition",
    Kitchen: "kitchen",
    Bathroom: "bathRoom",
    Roofing: "roofing",
    Foundation: "foundation",
    Plumbing: "plumbing",
    Electrical: "electrical",
    Flooring: "flooring",
    HVAC: "hvac",
    "Extra bed and Bath": "extraBedBath",
    Exterior: "exteriorPainting",
    Interior: "interiorPainting",
    Landscaping: "landscaping",
  };

  response.split("\n").forEach((line) => {
    for (const [component, key] of Object.entries(componentMapping)) {
      if (line.includes(component)) {
        const [min, max] = parseCostRange(line);
        if (key === "extraBedBath") {
          rehabAssessment[key].cost =
            rehabAssessment[key].status === "Yes" ? max : 0;
        } else {
          const status = rehabAssessment[key].status;

          const calculateCost = costFactors[status] || (() => 0);
          const cost = calculateCost(min, max);
          rehabAssessment[key].cost = cost;
        }
        totalCost += rehabAssessment[key].cost;
      }
    }
  });
  rehabAssessment["totalCost"] = totalCost;
  return rehabAssessment;
};

const mapRehabDataWithPreviewQuestion = (rehabAssessment, interiorDetails) => {
  const obj = {
    kitchen: {
      status: interiorDetails.bathroomUpdateStatus,
      cost: 0,
    },
    bathRoom: {
      status: interiorDetails.bathroomUpdateStatus,
      cost: 0,
    },
    flooring: {
      status: interiorDetails.floorStatus,
      cost: 0,
    },
    interiorPainting: {
      status: interiorDetails.rePlaintStatus,
      cost: 0,
    },
    exteriorPainting: {
      status: interiorDetails.exteriorPaintingStatus,
      cost: 0,
    },
    plumbing: {
      status: rehabAssessment.electricalStatus,
      cost: 0,
    },
    electrical: {
      status: rehabAssessment.electricalStatus,
      cost: 0,
    },
    landscaping: {
      status: interiorDetails.landScrapingStatus,
      cost: 0,
    },
    hvac: {
      status: rehabAssessment.hvacUpdateStatus,
      cost: 0,
    },
    demolition: {
      status: rehabAssessment.demolitionStatus,
      cost: 0,
    },
    roofing: {
      status: rehabAssessment.roofStatus,
      cost: 0,
    },
    foundation: {
      status: rehabAssessment.foundationStatus,
      cost: 0,
    },
    extraBedBath: {
      status: rehabAssessment.willAddExtraBed,
      cost: 0,
    },
  };
  return obj;
};

const getRehabData = async (address, rehabAssessment, rehabResponse) => {
  try {
    const payload = {
      messages: [
        {
          role: "user",
          content: `What would be the rehab cost estimate of this property ${address} for the following rehab work components?
"Demolition & CleanOut
Kitchen 
Bathroom
Roofing 
Foundation 
Landscaping 
Drywall and insulations
Exterior Painting 
Interior Painting
Plumbing
Electrical
Flooring
Mold Remediation
HVAC
Extra bed and Bath". Give me the rehab cost estimation numbers in USD.`,
        },
      ],
      web_access: false,
    };

    const headers = {
      "x-rapidapi-key": await getChatgptAPIKey(),
      "x-rapidapi-host": process.env.CHAT_GPT_HOST,
      "Content-Type": "application/json",
    };

    let responseText = rehabResponse;
    if (!responseText) {
      const response = await axios.post(process.env.CHAT_GPT_URL, payload, {
        headers,
      });
      responseText = response.data.result;
    }

    const result = mapAndCalculateCosts(responseText, rehabAssessment);
    return { rehabData: result, rehabResponse: responseText };
  } catch (err) {
    console.log("🚀 ~ getRehabData ~ err:", err);
    return err;
  }
};

const getZillow4Address = async (address) => {
  const querystring = { address: address };
  const headers = {
    "x-rapidapi-key": await getAutoCompleteAPIKey(),
    "x-rapidapi-host": process.env.RAPID_API_HOST,
  };
  const response = await axios.get(
    `${process.env.RAPID_API_URL}/properties/search-address`,
    {
      headers: headers,
      params: querystring,
    }
  );
  return response.data.data;
};

function getFormattedMarketComparisonData(responseText) {
  const comparables = [];
  const lines = responseText.split("\n");
  let currentComparable = {};

  lines.forEach((line) => {
    if (line.trim().startsWith("Comparable")) {
      if (Object.keys(currentComparable).length > 0) {
        comparables.push(currentComparable);
      }
      currentComparable = {};
    }

    if (line.includes("Property Address:")) {
      currentComparable.propertyAddress = line
        .split("Property Address:")[1]
        .trim();
    } else if (line.includes("Beds:")) {
      currentComparable.beds = parseInt(line.split("Beds:")[1].trim());
    } else if (line.includes("Baths:")) {
      currentComparable.baths = parseInt(line.split("Baths:")[1].trim());
    } else if (line.includes("Area:")) {
      currentComparable.area = line.split("Area:")[1].trim();
    } else if (line.includes("Rate:")) {
      currentComparable.rate = line.split("Rate:")[1].trim();
    } else if (line.includes("Distance:")) {
      currentComparable.distance = line.split("Distance:")[1].trim();
    } else if (line.includes("Sold/Closed Date:")) {
      currentComparable.soldClosedDate = line
        .split("Sold/Closed Date:")[1]
        .trim();
    } else if (line.includes("Sold/Closed Price:")) {
      currentComparable.soldClosedPrice = line
        .split("Sold/Closed Price:")[1]
        .trim();
    } else if (line.includes("Days on Market:")) {
      currentComparable.daysOnMarket = parseInt(
        line.split("Days on Market:")[1].trim()
      );
    } else if (line.includes("List Price:")) {
      currentComparable.listPrice = line.split("List Price:")[1].trim();
    }
  });

  if (Object.keys(currentComparable).length > 0) {
    comparables.push(currentComparable);
  }

  return comparables;
}

function extractPropertyDetailsFromString(inputString) {
  try {
    // Extract table content
    const tableString = inputString.match(/```([\s\S]*?)```/)[1]; // Extract content inside triple backticks

    // Split rows by line breaks
    const rows = tableString
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row);

    // Extract the header and the data rows
    const headers = rows[0]
      .split("|")
      .map((header) => header.trim())
      .filter((header) => header); // Get headers
    const dataRows = rows.slice(2); // Skip the separator line and header

    // Convert each data row into an object
    const result = dataRows.map((row) => {
      const rowValues = row
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell); // Split each row by '|'
      let rowObject = {};

      // Map each value in the row to the corresponding header
      headers.forEach((header, index) => {
        rowObject[header] = rowValues[index];
      });

      return {
        propertyAddress: rowObject["Property Address"],
        beds: parseInt(rowObject["Beds"]),
        baths: parseInt(rowObject["Baths"]),
        area: rowObject["Area (sqft)"],
        rate: rowObject["Rate ($/sqft)"],
        distance: rowObject["Distance (miles)"],
        soldClosedDate: rowObject["Sold/Closed Date"],
        soldClosedPrice: rowObject["Sold/Closed Price"],
        daysOnMarket: parseInt(rowObject["Days on Market"]),
      };
    });

    return result;
  } catch (error) {
    console.error("Error processing the input string:", error);
    return [];
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const R = 3958.8; // Radius of the Earth in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in miles
}

const getMarketComparisonData = async (zpid, zillowSearchAddressData) => {
  try {
    const data = await getZillowSimilarPropertyData(zpid);
    const marketData = [];
    for (let index = 0; index < data.results.length; index++) {
      const element = data.results[index];
      marketData.push({
        propertyAddress: `${element.property.address.streetAddress}, ${element.property.address.city}, ${element.property.address.state}, ${element.property.address.zipcode}`,
        beds: element.property.bedrooms,
        baths: element.property.bathrooms,
        area: element.property.livingAreaValue,
        rate: (element.property.zestimate / element.property.livingAreaValue).toFixed(0),
        distance: `${calculateDistance(zillowSearchAddressData.latitude, zillowSearchAddressData.longitude, element.property.latitude, element.property.longitude).toFixed(0)} miles`,
        soldClosedDate: moment(element.property.dateSold).format("MM/DD/YYYY"),
        soldClosedPrice: element.property.lastSoldPrice || element.property.zestimate,
        daysOnMarket: element.property.daysOnZillow,
        propertyPhoto: element.imgSrc
      })
    }
    for (let i = 0; i < marketData.length; i++) {
      const element = marketData[i];
      const zillowData = await getZillowSearchAddressData(
        element.propertyAddress
      );
      marketData[i].propertyPhoto = zillowData.hiResImageLink;
    }
    return marketData;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getZillowSearchAddressData,
  getRehabData,
  getMarketComparisonData,
  getZillowWalkTransitData,
  mapRehabDataWithPreviewQuestion,
  getZillow4Address,
  getZillowRentEstimateData,
  getZillowSimilarPropertyData
};
