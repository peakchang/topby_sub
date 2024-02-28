import axios from "axios";
import { back_api } from "$lib/const";
// import Cookies from "js-cookie";
// import { user_info } from "$lib/store";

export const load = (async ({ url }) => {

    console.log('에러 부분111111111111');

    const getId = url.host.split('.')[0]
    console.log(getId);
    let modifyVal = {}
    try {
        const res = await axios.post(`${back_api}/load_land_modify`, { getId })
        console.log(res.data);
        if (res.data.status) {
            modifyVal = res.data.land_modify_val
        }
    } catch (error) {

    }

    console.log(modifyVal);
    return { modifyVal, getId };
}) 