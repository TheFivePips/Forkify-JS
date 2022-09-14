// contain reuseable functions that we can use all over the project


import { TIMEOUT_SECONDS } from "./config";


// this will reject a promise after some specified amount of seconds
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};

export const getJSON = async function(url){
    try{
        // promise.race returns a promise that fulfills or rejects as soon as on of the promises fulfills or rejects
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
        const data = await res.json()
        if(!res.ok) throw new Error(`${data.message} (${res.status})`)
        return data
    }catch(err){
        // must throw a new error here to properly handle the error in modle.js
        throw err
    }
}
