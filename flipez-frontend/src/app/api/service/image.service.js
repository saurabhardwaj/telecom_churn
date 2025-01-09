import { apiInstance } from "@/app/api-utils";

export const getImageId = async (file) => {
    const data = new FormData();
    data.append("image", file);
    return apiInstance
        .post("/image", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}

export const uploadFile = async (file, folderId) => {
    const data = new FormData();
    data.append("image", file);
    data.append("folderId", folderId);
    return apiInstance
        .post("/image/file", data)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error;
        });
}