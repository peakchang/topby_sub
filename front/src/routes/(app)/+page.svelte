<script>
    import { page } from "$app/stores";
    import { aosStyleList } from "$lib/const.js";

    import Swiper from "swiper";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";
    // import Swiper and modules styles
    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/pagination";
    import { onMount } from "svelte";

    let loading = true;
    let siteData = {};
    let mainImgList = [];
    let dataAosList = [];
    let bannerSwiper;
    export let data;
    console.log(data);

    onMount(() => {
        loading = false;

        // HERO SLIDER
        var menu = [];
        const swiper = new Swiper(bannerSwiper, {
            // configure Swiper to use modules

            modules: [Autoplay, Navigation, Pagination],
            // centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },

            navigation: {
                nextEl: ".right-btn",
                prevEl: ".left-btn",
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });
    });

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

<svelte:head></svelte:head>

<section>
    <div class="swiper mb-10 relative" bind:this={bannerSwiper}>
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper relative">
            <div class="swiper-slide">
                <img src="/temp/main1.JPG" alt="" />
            </div>
            <div class="swiper-slide">
                <img src="/temp/main2.JPG" alt="" />
            </div>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>

        <div class="left-btn top-1/2 z-20 left-7">
            <button
                class="w-7 h-7 md:w-10 md:h-10 text-sm md:text-base bg-white flex justify-center items-center rounded-full text-gray-500"
            >
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
        </div>
        <div class="right-btn top-1/2 z-20 right-7">
            <button
                class="w-7 h-7 md:w-10 md:h-10 text-sm md:text-base bg-white flex justify-center items-center rounded-full text-gray-500"
            >
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
        <div class="swiper-scrollbar"></div>
    </div>
</section>

<!-- end of hero slider -->
<img src="/temp/main1.JPG" alt="" />

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

<style>
    .right-btn {
        position: absolute;
        transform: translate(50%, -50%);
    }

    .left-btn {
        position: absolute;
        transform: translate(-50%, -50%);
    }
</style>
