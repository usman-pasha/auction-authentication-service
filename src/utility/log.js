export const info = (message) => {
    console.log("INFO:", message);
}

export const data = (message, data) => {
    console.log("DATA:" + message);
    console.log(data);
}

export const error = (message, error) => {
    console.log("ERROR:" + message);
    console.log(error);
}