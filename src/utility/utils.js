// otp
export const generateOTP = (digits = 5) => {
    const num = Math.pow(10, digits - 1);
    return Math.floor(num + Math.random() * 9 * num);
};

// trimFields
export const trimFields = (body) => {
    for (const [key, value] of Object.entries(body)) {
        // Check if the value is a string before calling trim
        if (typeof value === "string") {
            body[key] = value.trim();
        }
    }
};

// isPhone Format
export const isPhone = (phoneNum) => {
    const regex = /^\d{8,10}$/; // minimum:8 or maximum:10 digit validation
    if (String(Number(phoneNum)).match(regex)) {
        return true;
    }
    return false;
};

// isEmail Format
export const isEmail = (email) => {
    if (
        email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    ) {
        return true;
    }
    return false;
};


// const now = new Date()
// const generateDateFormat = (date, type) => {
//     if (type === "timestamp") {
//         return (
//             ("0" + date.getDate()).slice(-2) +
//             ("0" + (date.getMonth() + 1)).slice(-2) +
//             date.getFullYear().toString()
//         );
//     } else if (type === "yyyy-mm-dd hh:mm:ss") {
//         return (
//             date.getFullYear().toString() +
//             "-" +
//             ("0" + (date.getMonth() + 1)).slice(-2) +
//             "-" +
//             ("0" + date.getDate()).slice(-2) +
//             " " +
//             ("0" + date.getHours()).slice(-2) +
//             ":" +
//             ("0" + date.getMinutes()).slice(-2) +
//             ":" +
//             ("0" + date.getSeconds()).slice(-2)
//         );
//     } else if (type === "custom") {
//         return (
//             ("0" + date.getDate()).slice(-2) +
//             //"/" +
//             ("0" + (date.getMonth() + 1)).slice(-2) +
//             // "/" +
//             date.getFullYear().toString()
//         );
//     }
// };

// console.log(generateDateFormat(now, "yyyy-mm-dd hh:mm:ss"));
