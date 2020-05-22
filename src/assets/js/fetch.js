import { ajax } from "./ajax";

export function fetch (params) {
    return new Promise((resolve,reject) => {
        params.success = (res) => {
            if(res.status == 200 || res.error == 0){
                resolve(res)
            }else{
                reject(res)
            }
        }
        params.fail = (err) => {
            reject(err)
        }
        ajax(params)
    })
}
