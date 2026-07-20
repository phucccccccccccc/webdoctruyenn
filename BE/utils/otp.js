export const generateOTP = () => {

    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();

};

export const getExpiredTime = () => {

    return new Date(
        Date.now() + 5 * 60 * 1000
    );

};