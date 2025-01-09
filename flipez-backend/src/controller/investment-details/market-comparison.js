const { getMarketComparisonData, getZillow4Address, getZillowRentEstimateData } = require("../third-party/helper")
const PropertyDetailsModel = require('../property-details/property-details.model');
const InvestmentDetailsModel = require('./investment-details.model');
const { getApiData, saveApiData } = require("../api-data/helper");

// const getLast5YearValue = (homeValueChartData) => {
//     let currentYear = new Date().getFullYear();
//     let price = 0
//     if(homeValueChartData && homeValueChartData.length) {
//         for (let index = homeValueChartData[0].points.length - 1; index >= 0; index--) {
//             const element = homeValueChartData[0].points[index];
//             let year = new Date(element.x).getFullYear();
//             if((currentYear - 5) <= year && !price) {
//                 price = element.y;
//                 break;
//             }
//         }
//     }
//     return price;
// }

const getLast5YearValue = (homeValueChartData) => {
    const currentYear = new Date().getFullYear();
    let price = 0;

    if (homeValueChartData && homeValueChartData.length) {
        for (const point of homeValueChartData[0].points) {
            const year = new Date(point.x).getFullYear();
            if (year >= currentYear - 5) {
                price = point.y;
                break; // Stop at the first match
            }
        }
    }

    return price;
};

const calculateLocationScore = (neighborhoodDetails, zillow4Address) => {
    const schoolScore = (((neighborhoodDetails?.primarySchoolRating || 0) + (neighborhoodDetails?.middleSchoolRating || 0) + (neighborhoodDetails?.highSchoolRating || 0)) / 3) * (30 / 100);
    const bikeScore = ((neighborhoodDetails?.bikeRating) ? neighborhoodDetails?.bikeRating / 10 : 0) * (10 / 100);
    const transportScore = ((neighborhoodDetails?.transportRating) ? neighborhoodDetails?.transportRating / 10 : 0) * (10 / 100);
    const walkScore = ((neighborhoodDetails?.walkRating) ? neighborhoodDetails?.walkRating / 10 : 0) * (10 / 100);
    const last5YearPrice = getLast5YearValue(zillow4Address.homeValueChartData);
    const currentPrice = zillow4Address.zestimate || zillow4Address.price || 0;
    const yearGrowthValue = (((currentPrice - last5YearPrice) / last5YearPrice) * 100);
    let yearScore = 0
    if(yearGrowthValue <= 3) {
        yearScore = 4
    } else if(yearGrowthValue <= 5) {
        yearScore = 7
    } else if(yearGrowthValue >= 6) {
        yearScore = 10
    }
    yearScore = yearScore * (40/100);
    const totalScore = (schoolScore || 0) + (bikeScore || 0) + (transportScore || 0) + (walkScore || 0) + (yearScore || 0);
    const totalPercentScore = totalScore * (15 / 100)
    return {
        totalScore: totalScore ? Number(totalScore.toFixed(0)) : 0,
        totalPercentScore: totalPercentScore ? totalPercentScore : 0,
        schoolScore: schoolScore ? Number(schoolScore.toFixed(0)) : 0,
        bikeScore: bikeScore ? Number(bikeScore.toFixed(0)) : 0,
        transportScore: transportScore ? Number(transportScore.toFixed(0)) : 0,
        walkScore: walkScore ? Number(walkScore.toFixed(0)) : 0,
        yearScore: yearScore ? Number(yearScore.toFixed(0)) : 0
    }
} 

const getBuildScore = (buildDiffYear) => {
    let buildAgeScore = 0
    if(buildDiffYear <= 10) {
        buildAgeScore = 10
    } else if(buildDiffYear <= 30) {
        buildAgeScore = 8
    } else if(buildDiffYear <= 51) {
        buildAgeScore = 6
    } else if(buildDiffYear > 51) {
        buildAgeScore = 4
    }
    return buildAgeScore
}

const calculatePropertyConditionScore = (zillowSearchAddressData) => {
    let buildDiffYear = new Date().getFullYear() - zillowSearchAddressData?.yearBuilt;
    let buildAgeScore = getBuildScore(buildDiffYear);
    let buildAgePercentScore = (buildAgeScore) * (50 / 100);
    let upgradeScore = buildAgeScore;
    let upgradePercentScore = buildAgePercentScore;
    if(zillowSearchAddressData?.resoFacts.yearBuiltEffective) {
       let upgradeDiffYear = new Date().getFullYear() - zillowSearchAddressData?.resoFacts.yearBuiltEffective;
        upgradeScore = getBuildScore(upgradeDiffYear);
        upgradePercentScore = upgradeScore * ( 50 / 100 )
    }

    let totalScore = buildAgePercentScore + upgradePercentScore;
    let totalPercentScore = (totalScore) * (10/100 );
    return {
        buildAgeScore: buildAgeScore ? Number(buildAgeScore.toFixed(0)) : 0,
        upgradeScore: upgradeScore ? Number(upgradeScore.toFixed(0)) : 0,
        totalScore: totalScore ? Number(totalScore.toFixed(0)) : 0,
        totalPercentScore: totalPercentScore ? totalPercentScore : 0
    }
}

const calculateMarketScore = (marketComparison) => {
    const averageDaysOnMarket = marketComparison.length ? marketComparison.reduce((a, b) => a + b.daysOnMarket, 0) / marketComparison.length : 0;
    let dayOnMarketScore = 0
    if(averageDaysOnMarket <= 10) {
        dayOnMarketScore = 10
    } else if(averageDaysOnMarket <= 20) {
        dayOnMarketScore = 8
    } else if(averageDaysOnMarket <= 31) {
        dayOnMarketScore = 7
    } else if(averageDaysOnMarket <= 51) {
        dayOnMarketScore = 6
    } else if(averageDaysOnMarket > 51) {
        dayOnMarketScore = 5
    }
    dayOnMarketScore = dayOnMarketScore * (50 / 100);

    const averageMarketSalePrice = marketComparison.length ? marketComparison.reduce((a, b) => a +(b.soldClosedPrice || 0), 0) / marketComparison.length : 0;
    const averageMarketListPrice = marketComparison.length ? marketComparison.reduce((a, b) => a + (b.listPrice || 0), 0) / marketComparison.length : 0;

    const averageMarketPriceDiffPercent = ((averageMarketSalePrice/averageMarketListPrice) * 100) - 100;
    let saleRatioScore = 0
    if(averageMarketPriceDiffPercent <= 0) {
        saleRatioScore = 1
    } else if(averageMarketPriceDiffPercent <= 10) {
        saleRatioScore = 4
    } else if(averageMarketPriceDiffPercent <= 20) {
        saleRatioScore = 6
    } else if(averageMarketPriceDiffPercent <= 40) {
        saleRatioScore = 7
    } else if(averageMarketPriceDiffPercent <= 61) {
        saleRatioScore = 8
    } else if(averageMarketPriceDiffPercent > 61) {
        saleRatioScore = 10
    }

    saleRatioScore = saleRatioScore * (50 / 100);

    let totalMarketValue = saleRatioScore + dayOnMarketScore;
    let totalMarketValuePercent = totalMarketValue * (30 / 100);
    return {
        totalMarketValuePercent: totalMarketValuePercent ? Number(totalMarketValuePercent) : 0,
        totalMarketValue: totalMarketValue ? Number(totalMarketValue.toFixed(0)) : 0,
        saleRatioScore: saleRatioScore ? Number(saleRatioScore.toFixed(0)) : 0,
        dayOnMarketScore: dayOnMarketScore ? Number(dayOnMarketScore.toFixed(0)) : 0
    }
}

const calculateRentalScore = (zillowRentEstimate, initialPurchasePrice) => {
    let zillowRentData = zillowRentEstimate.floorplans && zillowRentEstimate.floorplans.length ? zillowRentEstimate.floorplans[0].zestimate : {};
    let grossRentalScore = ((zillowRentData.rentZestimate * 12) / initialPurchasePrice) * 100;
    let grossRentalScorePercent = grossRentalScore * (70 / 100);

    let locationDemandScore = ((zillowRentData.rentZestimate * 12) > ((zillowRentData.rentZestimateRangeHigh * 12) * (90 / 100))) ? 10 : 5
    let locationDemandScorePercent = locationDemandScore * (30 / 100);

    let rentabilityScore = (grossRentalScorePercent + locationDemandScorePercent);
    let rentabilityScorePercent = rentabilityScore * (50 / 100);

    let capScore = (zillowRentData.rentZestimate) > (initialPurchasePrice * (1 / 100)) ? 10 : 5;
    let capScorePercent = capScore * (50 / 100);

    let totalRentalAndCapScore = (rentabilityScorePercent + capScorePercent);
    let totalRentalAndCapScorePercent = totalRentalAndCapScore * (20 / 100);

   return {
    grossRentalScore: grossRentalScore ? Number(grossRentalScore.toFixed(0)) : 0,
    grossRentalScorePercent: grossRentalScorePercent ? Number(grossRentalScorePercent.toFixed(0)) : 0,
    locationDemandScore: locationDemandScore ? Number(locationDemandScore.toFixed(0)) : 0,
    locationDemandScorePercent: locationDemandScorePercent ? Number(locationDemandScorePercent.toFixed(0)) : 0,
    rentabilityScore: rentabilityScore ? Number(rentabilityScore.toFixed(0)) : 0,
    rentabilityScorePercent: rentabilityScorePercent ? Number(rentabilityScorePercent.toFixed(0)) : 0,
    capScore: capScore ? Number(capScore.toFixed(0)) : 0,
    capScorePercent: capScorePercent ? Number(capScorePercent.toFixed(0)) : 0,
    totalRentalAndCapScore: totalRentalAndCapScore ? Number(totalRentalAndCapScore.toFixed(0)) : 0,
    totalRentalAndCapScorePercent: totalRentalAndCapScorePercent ? Number(totalRentalAndCapScorePercent) : 0
   }
}

const calculateCommunityAndLifestyleScore = (locationScoreData) => {
    const neighborhoodScore = (locationScoreData.schoolScore) * (50 / 100);
    const publicScore = ((locationScoreData.bikeScore + locationScoreData.transportScore + locationScoreData.walkScore) / 3) * (50 / 100);
    const totalCommunityAndLifestyleScore = (neighborhoodScore + publicScore);
    const totalCommunityAndLifestyleScorePercent = totalCommunityAndLifestyleScore * (15 / 100);
    return {
        neighborhoodScore: neighborhoodScore ? Number(neighborhoodScore.toFixed(0)) : 0,
        publicScore: publicScore ? Number(publicScore.toFixed(0)) : 0,
        totalCommunityAndLifestyleScore: totalCommunityAndLifestyleScore ? Number(totalCommunityAndLifestyleScore.toFixed(0)) : 0,
        totalCommunityAndLifestyleScorePercent: totalCommunityAndLifestyleScorePercent ? Number(totalCommunityAndLifestyleScorePercent) : 0
    }
}

const calculateRehabScore = (rehabAssessment) => {
    const statusCounts = { Moderate: 0, Minor: 0, Extensive: 0 };

    // Count each status occurrence
    for (const key in rehabAssessment) {
      const item = rehabAssessment[key];
      if (item.status && statusCounts.hasOwnProperty(item.status)) {
        statusCounts[item.status]++;
      }
    }
  
    // Find the status with the maximum count
    const mostFrequentStatus = Object.keys(statusCounts).reduce((a, b) =>
      statusCounts[a] > statusCounts[b] ? a : b
    );
    let rehabScore = 0;
    if(mostFrequentStatus === "Extensive") {
        rehabScore = 10;
    } else if(mostFrequentStatus === "Moderate") {
        rehabScore = 8
    } else if(mostFrequentStatus === "Minor") {
        rehabScore = 5;
    }

    let rehabScorePercent = rehabScore * (10 / 100);
    return {
        rehabScore: rehabScore ? Number(rehabScore.toFixed(0)) : 0,
        rehabScorePercent: rehabScorePercent ? Number(rehabScorePercent) : 0
    }
}

const calculateInvestmentPotentialScore = (zillowSearchAddressData, transitData, neighborhoodDetails, zillow4Address, marketComparison, zillowRentEstimate, initialPurchasePrice, rehabAssessment) => {
    const locationScoreData = calculateLocationScore(neighborhoodDetails, zillow4Address);
    const propertyScoreData = calculatePropertyConditionScore(zillowSearchAddressData);
    const marketScoreData = calculateMarketScore(marketComparison);
    const rentalScoreData = calculateRentalScore(zillowRentEstimate, initialPurchasePrice);
    const communityAndLifestyleScoreData = calculateCommunityAndLifestyleScore(locationScoreData);
    const rehabScoreData = calculateRehabScore(rehabAssessment);
    const finalScore = (locationScoreData.totalPercentScore + propertyScoreData.totalPercentScore + marketScoreData.totalMarketValuePercent + rentalScoreData.totalRentalAndCapScorePercent + communityAndLifestyleScoreData.totalCommunityAndLifestyleScorePercent + rehabScoreData.rehabScorePercent) * 10;
    return {
        locationScoreData,
        propertyScoreData,
        marketScoreData,
        rentalScoreData,
        communityAndLifestyleScoreData,
        rehabScoreData,
        finalScore: Number(finalScore.toFixed(0)),
    }
}



const getMarketComparison = async (req, res) => {
    try {
        const propertyDetails = await PropertyDetailsModel.findOne({ user: req.user._id, status: 'pending' }).select('propertyOverview loanDetails borrowerInformation rehabAssessment interiorDetails lastCompleteStepNumber').lean();
        const investmentDetails = await InvestmentDetailsModel.findOne({ user: req.user._id, status: 'pending' }).lean();
        const apiData = await getApiData(propertyDetails.propertyOverview.address)
        let marketComparison = [];
        if(apiData?.marketComparison && apiData.marketComparison.length) {
            marketComparison = apiData.marketComparison
        } else {
            marketComparison = await getMarketComparisonData(investmentDetails?.zillowSearchAddressData?.zpid, investmentDetails?.zillowSearchAddressData)
        }
        marketComparison = (marketComparison || []).splice(0, 4);
        let zillow4Address = {};
        let zillowRentEstimate = {};
        if(!investmentDetails.zillow4Address && !apiData?.zillow4Address) {
            zillow4Address = await getZillow4Address(propertyDetails.propertyOverview.address);
        } else if(apiData?.zillow4Address) {
            zillow4Address = apiData.zillow4Address
        } else {
            zillow4Address = investmentDetails.zillow4Address
        }
        if(!investmentDetails.zillowRentEstimate && !apiData?.zillowRentEstimate) {
            zillowRentEstimate = await getZillowRentEstimateData(propertyDetails.propertyOverview.address)
        } else if(apiData?.zillowRentEstimate) {
            zillowRentEstimate = apiData.zillowRentEstimate
        } else {
            zillowRentEstimate = investmentDetails.zillowRentEstimate
        }
        const investmentPotentialScore = calculateInvestmentPotentialScore(investmentDetails.zillowSearchAddressData, investmentDetails.transitData, investmentDetails.neighborhoodDetails, zillow4Address, marketComparison, zillowRentEstimate, propertyDetails.propertyOverview.initialPurchasePrice, investmentDetails.rehabAssessment);
        let updateData = { investmentPotentialScore, address: propertyDetails.propertyOverview.address };
        if(zillow4Address.price) {
            updateData.zillow4Address = zillow4Address;
        }
        if(zillowRentEstimate.floorplans) {
            updateData.zillowRentEstimate = zillowRentEstimate;
        }
        if(marketComparison.length) {
            updateData.marketComparison = marketComparison
        }
        await saveApiData(updateData)
        await InvestmentDetailsModel.findOneAndUpdate({ user: req.user._id, status: 'pending' }, { $set: updateData })
        return req.sendResponse(200, { investmentPotentialScore, marketComparison })
    } catch (error) {
        return req.sendResponse(500, error);
    }
   
}

module.exports = getMarketComparison