<script>
    import { page } from "$app/stores";
    import { aosStyleList } from "$lib/const.js";

    let siteData = {};
    let mainImgList = [];
    let dataAosList = [];
    export let data;
    console.log(data);

    $: data, setData();

    function setData() {
        siteData = data.subView;
        mainImgList = siteData.ld_main_img
            ? siteData.ld_main_img.split(",")
            : [];

        console.log(mainImgList);

        let aosTemp = [];
        if (mainImgList) {
            for (let i = 0; i < mainImgList.length; i++) {
                const randomIndex = Math.floor(
                    Math.random() * aosStyleList.length,
                );
                aosTemp.push(aosStyleList[randomIndex]);
            }
        }

        dataAosList = aosTemp;
    }
</script>

{#each mainImgList as mainImg, idx}
    {#if idx == 0}
        <div class="mb-5">
            <img src={mainImg} alt="" class="w-full" />
        </div>
    {:else}
        <div class="mb-5" data-aos={dataAosList[idx]}>
            <img src={mainImg} alt="" class="w-full" />
        </div>
    {/if}
{/each}
