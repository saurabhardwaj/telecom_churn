import { apiInstance } from "@/app/api-utils";


export const signUp = async (data) => {
    return apiInstance
        .post("/signup",  data )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const logOut = async () => {
    return apiInstance
        .post("/logout" )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}
export const getVerificationCode = async (data) => {
    return apiInstance
        .patch("/verify-code",  data )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const resendVerificationCode = async (data) => {
    return apiInstance
        .patch("/resend-verification-code",  data )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const getForgotPassword = async (data) => {
    return apiInstance
        .post("/forgot-password",  data )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const getResetPassword = async (data) => {
    return apiInstance
        .post("/reset-password",  data )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const getState = async () => {
    return apiInstance
        .get("/state")
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const getCityList = async (stateCode) => {
    return apiInstance
        .get(`/city/${stateCode}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

