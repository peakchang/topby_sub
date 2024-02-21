<script>
    import { aosStyleList } from "$lib/const.js";

    let siteData = {};
    let imgList = [];
    let dataAosList = [];
    export let data;
    $: data, setData();
    function setData() {
        const nowPage = data.nowPage;
        siteData = data.subView;

        if (nowPage == "overview") {
            imgList = siteData.ld_overview_img
                ? siteData.ld_overview_img.split(",")
                : [];
        } else if (nowPage == "environ") {
            imgList = siteData.ld_environ_img
                ? siteData.ld_environ_img.split(",")
                : [];
        } else if (nowPage == "premium") {
            imgList = siteData.ld_premium_img
                ? siteData.ld_premium_img.split(",")
                : [];
        } else if (nowPage == "product") {
            imgList = siteData.ld_product_img
                ? siteData.ld_product_img.split(",")
                : [];
        }

        let aosTemp = [];
        for (let i = 0; i < imgList.length; i++) {
            const randomIndex = Math.floor(Math.random() * aosStyleList.length);
            aosTemp.push(aosStyleList[randomIndex]);
        }
        dataAosList = aosTemp;
    }
</script>

{#each imgList as img, idx}
    {#if idx == 0}
        <div class="mb-5">
            <img src={img} alt="" class="w-full" />
        </div>
    {:else}
        <div class="mb-5" data-aos={dataAosList[idx]}>
            <img src={img} alt="" class="w-full" />
        </div>
    {/if}
{/each}
