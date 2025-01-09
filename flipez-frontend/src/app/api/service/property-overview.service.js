import { apiInstance } from "@/app/api-utils";


export const getPropertyDetails = async () => {
    return apiInstance
        .get("/property-details")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const getAddressPrice = async (body) => {
    return apiInstance
        .post("/property-details/price", body)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const createPropertyDetails = async (data) => {
    return apiInstance
        .post("/property-details", { propertyOverview: data.propertyOverview })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const updatePropertyDetails = async (data, id) => {
    return apiInstance
        .patch(`/property-details/${id}`, data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const getAddress = async (address) => {
    return apiInstance
        .get("/address" ,{params: { address }})
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

