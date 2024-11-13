import CryptoJS from "crypto-js";

export function encryptData(data:string) {
    const encryptedData = CryptoJS.AES.encrypt(data, import.meta.env.CRYPTO_KEY).toString();
    return encryptedData
  };