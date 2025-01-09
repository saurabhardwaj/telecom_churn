import { apiInstance } from "@/app/api-utils";

export const getInvestmentDetails = async (status = "pending") => {
  return apiInstance
    .get(`/investment-details?status=${status}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getMyCompletedInvestment = async () => {
  return apiInstance
    .get("/investment-details/completed")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getAllCompletedInvestment = async () => {
  return apiInstance
    .get("/investment-details/all")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getInitialInvestmentOpportunity = async () => {
  return apiInstance
    .get("/investment-details/initial-investment-opportunity")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const createPersonalDetails = async (data) => {
  return apiInstance
    .post("/investment-details", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const updatePersonalDetails = async (data, id) => {
  return apiInstance
    .patch(`/investment-details/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getMarketComparisonData = async () => {
  return apiInstance
    .get("/investment-details/market-comparison")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const processPDF = async (id) => {
    return apiInstance
      .get(`/investment-details/pdf/${id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };

export const updateLatestRehabValues = async (data, id) => {
  return apiInstance
    .patch(`/investment-details/update-rehab-value/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getNeighborhoodDetailsData = async () => {
  return apiInstance
    .get("/investment-details/neighborhood-details")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return {
        schools: [
          {
            assigned: null,
            distance: 0.8,
            grades: "PK-5",
            isAssigned: null,
            level: "Primary",
            link: "https://www.greatschools.org/maryland/ellicott-city/831-Waverly-Elementary-School/",
            name: "Waverly Elementary School",
            rating: 8,
            size: null,
            studentsPerTeacher: null,
            totalCount: null,
            type: "Public",
          },
          {
            assigned: null,
            distance: 3,
            grades: "6-8",
            isAssigned: null,
            level: "Middle",
            link: "https://www.greatschools.org/maryland/marriottsville/772-Mount-View-Middle-School/",
            name: "Mount View Middle School",
            rating: 9,
            size: null,
            studentsPerTeacher: null,
            totalCount: null,
            type: "Public",
          },
          {
            assigned: null,
            distance: 3,
            grades: "9-12",
            isAssigned: null,
            level: "High",
            link: "https://www.greatschools.org/maryland/marriottsville/2556-Marriotts-Ridge-High-School/",
            name: "Marriotts Ridge High School",
            rating: 10,
            size: null,
            studentsPerTeacher: null,
            totalCount: null,
            type: "Public",
          },
        ],
        primarySchoolRating: 8,
        middleSchoolRating: 9,
        highSchoolRating: 10,
        bikeRating: 17,
        transportRating: 0,
        walkRating: 25,
      };
      return error;
    });
};

export async function downloadFile(folderId) {
  try {
    const response = await apiInstance.get(
      `image/download?folderId=${folderId}`,
      {
        responseType: "arraybuffer",
      }
    );

    return new Blob([response.data], {
      type: response.headers["content-type"],
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
