import { apiInstance } from "@/app/api-utils";


export const getUser = async () => {
    return apiInstance
        .get("/user/me")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const clearSession = async () => {
    return apiInstance
        .put("/user/me/clear")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}