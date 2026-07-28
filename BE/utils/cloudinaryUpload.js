import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {

        console.log("Cloudinary config:", cloudinary.config());

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {

                console.log("Callback chạy");

                if (error) {
                    console.error(error);
                    return reject(error);
                }

                console.log(result);

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};