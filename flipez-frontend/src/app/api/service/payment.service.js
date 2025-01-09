import { apiInstance } from "@/app/api-utils";


export const getCheckoutSession = async () => {
    return apiInstance
        .post("/payment/session")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

