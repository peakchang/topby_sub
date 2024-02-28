<script>
    import { aosStyleList } from "$lib/const.js";

    let allSiteData = {};
    let imgList = [];
    let dataAosList = [];
    export let data;
    $: data, setData();
    function setData() {
        allSiteData = data.subView;
        if (allSiteData[`ld_pg${data.index}`]) {
            imgList = allSiteData[`ld_pg${data.index}`].split(",");
        }else{
            imgList = []
        }
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
