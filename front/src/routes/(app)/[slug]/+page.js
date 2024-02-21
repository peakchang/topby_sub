import axios from "axios";
import { back_api } from "$src/lib/const";
import { error } from '@sveltejs/kit';
import moment from "moment-timezone";

export const load = async ({ fetch, url, params }) => {

    const nowPage = params.slug;
    const menuList = ['overview', 'environ', 'premium', 'product']
    if (!menuList.includes(nowPage)) {
        return error('404', 'asjfaisjfilasjdf')
    }
    
    return { nowPage }
}


