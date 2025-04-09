<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { aosStyleList } from "$lib/const.js";

    import Swiper from "swiper";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";
    // import Swiper and modules styles
    import "swiper/css";
    import "swiper/css/navigation";
    import "swiper/css/pagination";
    import { onMount } from "svelte";
    import { customerSubmit } from "$lib/lib";

    // 공통 변수
    let siteData = {};

    // 구버전 변수
    let mainImgList = [];
    let dataAosList = [];
    let bannerImgList = [];
    let bannerSwiper;
    let customerName = "";
    let customerPhone = "";

    // 신버전 변수
    let observer;
    let elementsToObserve;
    let mainContents = [];

    export let data;

    $: data, setData();

    function setData() {
        // 공통
        siteData = data.subView;

        // 구버전 코드
        if (!siteData["ld_view_type"] || siteData["ld_view_type"] == "old") {
            mainImgList = siteData.ld_main_img
                ? siteData.ld_main_img.split(",")
                : [];

            if (siteData.ld_banner_img) {
                bannerImgList = siteData.ld_banner_img.split(",");
            }
        } else {
            // 신버전 코드
            try {
                mainContents = JSON.parse(siteData.ld_json_main);
                console.log(mainContents);

                // 받은 JSON 데이터 처리
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
            }
        }
    }

    onMount(() => {
        if (!siteData["ld_view_type"] || siteData["ld_view_type"] == "old") {
        } else {
            if (browser) {
                elementsToObserve =
                    document.querySelectorAll(".observe-fade-up");
            }
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("observe-hidden");
                        entry.target.classList.add("fade-up-active");
                    } else {
                        entry.target.classList.remove("fade-up-active");
                        entry.target.classList.add("observe-hidden");
                    }
                });
            });

            elementsToObserve.forEach((element) => {
                // 초기 숨김 클래스 추가
                element.classList.add("observe-hidden");
                observer.observe(element);

                // data-delay 속성이 있는 경우 CSS 변수로 전달
                const delay = element.dataset.delay;
                if (delay) {
                    element.style.setProperty("--fade-up-delay", `${delay}ms`);
                }
            });
        }
    });
</script>

{#if !siteData["ld_view_type"] || siteData["ld_view_type"] == "old"}
    {#if siteData.ld_banner_img}
        <section>
            <div class="swiper mb-10 relative" bind:this={bannerSwiper}>
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper relative">
                    {#each bannerImgList as bannerImg}
                        <div class="swiper-slide">
                            <img src={bannerImg} alt="" />
                        </div>
                    {/each}
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
    {/if}

    {#each mainImgList as mainImg, idx}
        <div class="mb-5">
            <img src={mainImg} alt="" class="w-full" />
        </div>
    {/each}
{:else}
    <div class="mb-5">
        {#each mainContents as mainContent}
            <div
                style="background-image: url({mainContent[
                    'backgroundImg'
                ]}); height:{mainContent[
                    'height'
                ]}px; background-repeat: no-repeat; background-size: 100% auto;"
            >
                {#each mainContent.contentList as content}
                    {#if content.text}
                        <div
                            class="px-3 pretendard"
                            class:observe-hidden={content.effect == "on"}
                            class:observe-fade-up={content.effect == "on"}
                            data-delay={content.delay}
                            style="text-align : {content.align}; color :{content.fontColor};  font-size : {content.fontSize}px; white-space: pre-line;"
                        >
                            {content.text}
                        </div>
                    {:else if content.imgPath}
                        <div
                            class="flex"
                            class:justify-center={content.align == "center"}
                            class:justify-start={content.align == "left"}
                            class:justify-end={content.align == "right"}
                            class:observe-hidden={content.effect == "on"}
                            class:observe-fade-up={content.effect == "on"}
                            data-delay={content.delay}
                        >
                            <div style="width:{content.width}%;">
                                <img src={content.imgPath} alt="" />
                            </div>
                        </div>
                    {:else if content.marginHeight}
                        <div style="height: {content.marginHeight}px;"></div>
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
{/if}



<style>
    /* 구버전 CSS */
    .right-btn {
        position: absolute;
        transform: translate(50%, -50%);
    }

    .left-btn {
        position: absolute;
        transform: translate(-50%, -50%);
    }

    /* 신버전 CSS */
    .observe-hidden {
        opacity: 0;
        transform: translateY(40px); /* 초기 위치를 아래로 10px 이동 */
    }
    .observe-fade-up {
        transition:
            opacity 0.8s ease-out,
            /* opacity 애니메이션 속도 조절 (더 짧게) */ transform 0.8s ease-out; /* transform 애니메이션 속도 조절 (더 짧게) */
        transition-delay: var(--fade-up-delay, 0ms);
    }
    .fade-up-active {
        opacity: 1;
        transform: translateY(0);
    }
</style>
