import CryptoJS from "crypto-js";

export function decryptData(data: string){
  const decryptedData = CryptoJS.AES.decrypt(data, import.meta.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
  return decryptedData;
}

