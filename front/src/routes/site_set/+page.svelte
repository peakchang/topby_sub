<script>
    import OneImageUpload from "$lib/components/OneImageUpload.svelte";
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import SortableImgMovie from "$lib/components/SortableImgMovie.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    export let data;

    $: data, setData();

    let getId = "";

    function setData() {
        getId = data.getId;
        console.log(data);
        if (data.ld_json_header) {
            logoObj = data.ld_json_header;
        }
        if (data.ld_json_menus) {
            menuObj = data.ld_json_menus;
        }

        if (data.ld_json_main) {
            mainContents = data.ld_json_main;
        }
    }

    // 섹션 창이 보여지게 하는 변수
    let sectionStatus = false;
    let sectionModifyStatus = false;
    let sectionIdx = 0;

    let contentModifyStatus = false; // 컨텐츠 수정시~
    let contentIdx = 0;

    let addContentStatus = undefined; // 컨텐츠 창이 보여지게 하는 함수 blank, text, image 등 부여되면 보여짐
    let addContentType = undefined; // blank, text, image 등 부여되게 임시 변수

    let toastArea; // toast 영역 변수 (클래스 부여할라고!)
    let toastText = ""; // toast 영역 텍스트

    // 헤더 부분!!!
    let logoObj = {
        logo_location: "center",
        logo_width: "",
        header_height: "50",
        header_padding: "15",
        header_color: "black",
    };

    // 메뉴 부분!!

    let menuObj = {
        color: "white",
        padding_y: "15",
        menus: [],
    };
    let menuName = "";
    let menuModify = undefined;

    // 메인 컨텐츠 주요 변수!
    let mainContents = []; // 전체 메인페이지 컨텐츠 총괄! sectionObj 객체가 내부 배열 요소로 들어가야함!!
    let sectionObj = { contentList: [] }; // 각 섹션을 보여줌! contentList 에는 배열 요소로 contentObj 가 들어가야함!
    let contentObj = {}; // 각각의 컨텐츠 요소! 바로바로 삭제하고 보여주고!

    // 컨텐츠 영역 임시 변수!
    // 여백
    let contentMarginHeight = "";
    // 텍스트
    let contentText = "";
    let contentFontSize = "";
    let contentFontColor = "";
    let contentTextAlign = "";
    let contentTextEffect = "on";
    let contentTextEffectDealy = "100";

    // 이미지
    let contentImagePath = "";
    let contentImageWidth = "";
    let contentImageAlign = "";
    let contentImageEffect = "on";
    let contentImageEffectDealy = "100";

    // ***********************************************

    function showToast(message) {
        toastText = message;
        toastArea.classList.remove("hidden"); // 토스트를 보이게 함

        setTimeout(() => {
            toastArea.classList.add("hidden"); // 2초 뒤에 hidden 클래스를 추가하여 사라지게 함
        }, 2000);
    }

    function logoUpdate(e) {
        const imgPath = e.detail.imgPath;
        logoObj["logo_img"] = imgPath;
        console.log(logoObj["logo_img"]);
    }

    async function deleteImage() {
        if (!confirm("이미지를 삭제 하시겠습니까?")) {
            return;
        }

        let imgUrlArr = [];
        if (this.value == "logo") {
            imgUrlArr = logoObj["logo_img"].split("/");
        } else if (this.value == "content") {
            imgUrlArr = contentImagePath.split("/");
        } else if (this.value == "background") {
            imgUrlArr = sectionObj["backgroundImg"].split("/");
        }
        const deleteImagePath = `subuploads/img/${imgUrlArr[4]}/${imgUrlArr[5]}`;

        try {
            const res = await axios.post(
                `${back_api}/delete_single_image_only`,
                {
                    deleteImagePath,
                },
            );
            console.log(res);

            if (res.status == 200) {
                if (this.value == "logo") {
                    logoObj["logo_img"] = "";
                } else if (this.value == "content") {
                    contentImagePath = "";
                } else {
                    sectionObj["backgroundImg"] = "";
                }
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    async function backgroundImageUpload(e) {
        const imgPath = e.detail.imgPath;
        sectionObj["backgroundImg"] = imgPath;
    }

    function contentImageUpload(e) {
        const imgPath = e.detail.imgPath;
        contentImagePath = imgPath;
    }

    function addContentFunc() {
        contentObj = {};
        console.log(addContentType);
        if (addContentType == "blank") {
            contentObj["marginHeight"] = contentMarginHeight;
        } else if (addContentType == "text") {
            contentObj["text"] = contentText.replace(/\r\n|\r|\n/g, "\n");
            contentObj["fontSize"] = contentFontSize;
            contentObj["fontColor"] = contentFontColor;
            contentObj["align"] = contentTextAlign;
            contentObj["effect"] = contentTextEffect;
            contentObj["delay"] = contentTextEffectDealy;
        } else if (addContentType == "image") {
            contentObj["imgPath"] = contentImagePath;
            contentObj["width"] = contentImageWidth;
            contentObj["align"] = contentImageAlign;
            contentObj["effect"] = contentImageEffect;
            contentObj["delay"] = contentImageEffectDealy;
        }

        if (!contentModifyStatus) {
            let tempArr = [...sectionObj.contentList];
            tempArr.push(contentObj);
            sectionObj.contentList = tempArr;
        } else {
            let tempArr = [...sectionObj.contentList];
            tempArr[contentIdx] = contentObj;
            sectionObj.contentList = tempArr;
            contentModifyStatus = false;
        }

        addContentStatus = undefined;

        // 임시 변수 전부 초기화!
        contentMarginHeight = "";
        contentText = "";
        contentFontSize = "";
        contentFontColor = "";
        contentTextAlign = "";
        contentTextEffect = "on";
        contentTextEffectDealy = "100";

        contentImagePath = "";
        contentImageWidth = "";
        contentImageAlign = "";
        contentImageEffect = "on";
        contentImageEffectDealy = "100";
    }

    function sectionUpdate() {
        if (!sectionModifyStatus) {
            const tempArr = [...mainContents];
            tempArr.push(sectionObj);
            mainContents = tempArr; // 메인 컨텐츠에 내용 담기
        } else {
            const tempArr = [...mainContents];
            tempArr[sectionIdx] = sectionObj; // 수정된 내용으로 교체!
            mainContents = tempArr;
            sectionModifyStatus = false;
        }
        sectionObj = { contentList: [] }; // 섹션 초기화
        sectionStatus = false; // 섹션 창 닫기
        console.log(mainContents);
    }

    function openSectionDetail() {
        sectionModifyStatus = true;

        const idx = this.value;
        sectionIdx = idx;
        console.log(idx);
        console.log(mainContents[idx]);

        console.log(sectionStatus);
        if (sectionStatus) {
            showToast("작업중인 섹션을 완료 해주세요");
            return;
        }
        sectionStatus = true;
        sectionObj = mainContents[idx];
    }

    function modifyContentFunc(e) {
        contentIdx = this.value;
        contentModifyStatus = true;
        console.log(this.value);
        console.log(e.target.getAttribute("data-type"));
        console.log(sectionObj.contentList[this.value]);
        let getSectionObj = sectionObj.contentList[this.value];
        const contentType = e.target.getAttribute("data-type");
        addContentStatus = contentType;
        if (contentType == "blank") {
            contentMarginHeight = getSectionObj["marginHeight"];
        } else if (contentType == "text") {
            contentText = getSectionObj["text"];
            contentFontSize = getSectionObj["fontSize"];
            contentFontColor = getSectionObj["fontColor"];
            contentTextAlign = getSectionObj["align"];
            contentTextEffect = getSectionObj["effect"];
            contentTextEffectDealy = getSectionObj["delay"];
        } else if (contentType == "image") {
            contentImagePath = getSectionObj["imgPath"];
            contentImageWidth = getSectionObj["width"];
            contentImageAlign = getSectionObj["align"];
            contentImageEffect = getSectionObj["effect"];
            contentImageEffectDealy = getSectionObj["delay"];
        }
    }

    function updateImgArr(imgArr, idx) {
        console.log(imgArr);
        console.log(idx);
        const imgList = imgArr.map((e) => e.src);
        menuObj.menus[idx]["imgArr"] = imgList;
        console.log(menuObj);
    }

    async function updateSiteSet() {
        const ld_json_header = JSON.stringify(logoObj);
        const ld_json_main = JSON.stringify(mainContents);
        const ld_json_menus = JSON.stringify(menuObj);

        try {
            const res = await axios.post(`${back_api}/update_site_set`, {
                get_id: getId,
                ld_json_header,
                ld_json_main,
                ld_json_menus,
            });
            console.log(res);
            if (res.status == 200) {
                showToast("업데이트가 완료 되었습니다.");
            } else {
                showToast("업데이트에 실패했습니다.");
            }
        } catch {}
    }
</script>

<div class="toasts hidden pretendard" bind:this={toastArea}>
    <div class="alert alert-error">
        <span class="text-white">{toastText}</span>
    </div>
</div>

<div class="fixed top-11 right-6 lg:right-1/4 pretendard">
    <button class="btn btn-primary btn-sm" on:click={updateSiteSet}
        >작업 업로드</button
    >
    <button
        class="btn btn-secondary btn-sm"
        on:click={() => {
            const jsonMainString = JSON.stringify(mainContents);
            const encodedMainJsonData = encodeURIComponent(jsonMainString);

            const jsonLogoString = JSON.stringify(logoObj);
            const encodedLogoJsonData = encodeURIComponent(jsonLogoString);

            const jsonMenuString = JSON.stringify(menuObj);
            const encodedMenuJsonData = encodeURIComponent(jsonMenuString);

            window.open(
                `/preview?mainData=${encodedMainJsonData}&logoData=${encodedLogoJsonData}&menuData=${encodedMenuJsonData}`,
                "_blank",
                "width=600,height=800",
            ); // 내부 라우트
        }}
    >
        미리보기
    </button>
</div>

<div class="container max-w-[900px] py-10 px-3 mx-auto pretendard">
    <div class="w-full flex items-center gap-4">
        <table class=" w-[350px]">
            <tr>
                <th class="border p-2.5 w-[100px]">도메인</th>
                <td class="border p-2.5 pl-5">{getId} </td>
            </tr>
        </table>
    </div>

    <div class="mt-3">
        <span class="text-sm font-semibold">※ 사이트 설명</span>
        <div class="mt-2">
            <textarea
                rows="3"
                class="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-blue-500 p-2"
            ></textarea>
        </div>
    </div>

    <div class="mt-3">
        <span class="text-sm font-semibold">※ 추가 스크립트 </span>
        <div class="mt-2">
            <textarea
                rows="3"
                class="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-blue-500 p-2"
            ></textarea>
        </div>
    </div>

    <div>
        <table class="w-full text-sm">
            <tr>
                <th class="border px-1 py-2 w-1/4">로고 이미지</th>
                <td class="border px-1 py-2 w-3/4">
                    {#if logoObj["logo_img"]}
                        <img src={logoObj["logo_img"]} alt="" class="mb-3" />
                    {/if}

                    {#if !logoObj["logo_img"]}
                        <OneImageUpload on:sendImgPath={logoUpdate}
                        ></OneImageUpload>
                    {/if}

                    {#if logoObj["logo_img"]}
                        <button
                            class="btn btn-error btn-sm text-white"
                            value="logo"
                            on:click={deleteImage}>로고 이미지 삭제</button
                        >
                    {/if}
                </td>
            </tr>
            <tr>
                <th class="border px-1 py-2">로고 위치</th>
                <td class="border px-1 py-2 w-3/4">
                    <label class="mr-3">
                        <input
                            type="radio"
                            class="radio radio-secondary radio-sm"
                            value="left"
                            bind:group={logoObj["logo_location"]}
                        />
                        왼쪽
                    </label>

                    <label>
                        <input
                            type="radio"
                            class="radio radio-secondary radio-sm"
                            value="center"
                            bind:group={logoObj["logo_location"]}
                        />
                        가운데
                    </label>
                </td>
            </tr>
            <tr>
                <th class="border px-1 py-2">로고 이미지 가로 사이즈</th>
                <td class="border px-1 py-2 w-3/4">
                    <input
                        type="text"
                        class="border p-1"
                        bind:value={logoObj["logo_width"]}
                    /> px
                </td>
            </tr>

            <tr>
                <th class="border px-1 py-2">헤더 높이 / 여백 / 배경색</th>
                <td class="border px-1 py-2 w-3/4">
                    헤더 높이 : <input
                        type="text"
                        class="border p-1 w-24"
                        bind:value={logoObj["header_height"]}
                    />
                    px / 위 아래 여백 :
                    <input
                        type="text"
                        class="border p-1 w-24"
                        bind:value={logoObj["header_padding"]}
                    />
                    px /
                    <input
                        type="text"
                        class="border p-1 w-24"
                        bind:value={logoObj["header_color"]}
                    />
                </td>
            </tr>
        </table>
    </div>

    <div class="mt-8 mb-4 border p-3">
        <div>
            ※ 메인 페이지 섹션!! <button
                class="btn btn-info btn-sm text-white ml-5"
                on:click={() => {
                    sectionStatus = true;
                    console.log(sectionObj);
                }}
            >
                섹션 추가
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </button>
        </div>

        {#if mainContents.length != 0}
            {#each mainContents as content, idx}
                <div class="border p-2 mb-1">
                    {idx + 1} 번째 섹션

                    {#if sectionModifyStatus == false}
                        <button
                            class="btn btn-soft btn-accent"
                            value={idx}
                            on:click={openSectionDetail}
                        >
                            자세히 보기
                        </button>
                    {:else}
                        <button
                            class="btn btn-soft btn-accent"
                            on:click={() => {
                                sectionObj = { contentList: [] }; // 섹션 요소 초기화
                                sectionStatus = false; // 섹션 창 닫기
                                sectionModifyStatus = false;
                            }}
                        >
                            닫기
                        </button>
                    {/if}
                </div>
            {/each}
        {/if}

        <div class:hidden={!sectionStatus}>
            <table class="w-full text-sm">
                <tr>
                    <th class="border px-1 py-2">백그라운드 이미지</th>
                    <td class="border px-1 py-2 w-3/4">
                        <img src={sectionObj["backgroundImg"]} alt="" />
                        {#if !sectionObj["backgroundImg"]}
                            <OneImageUpload
                                on:sendImgPath={backgroundImageUpload}
                            ></OneImageUpload>
                        {:else}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="background"
                                on:click={deleteImage}>이미지 삭제</button
                            >
                        {/if}
                    </td>
                </tr>
                <tr>
                    <th class="border px-1 py-2">섹션 높이</th>
                    <td class="border px-1 py-2 w-3/4">
                        <input
                            type="text"
                            class="border p-1 w-24"
                            bind:value={sectionObj["height"]}
                        /> px
                    </td>
                </tr>

                <tr>
                    <td class="border px-1 py-2" colspan="2">
                        {sectionObj.contentList.length}
                        {#if sectionObj.contentList.length != 0}
                            {#each sectionObj.contentList as content, idx}
                                {#if content.marginHeight}
                                    <div class="border p-2">
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-3"
                                            value={idx}
                                            data-type="blank"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>
                                        여백 : {content.marginHeight} px
                                    </div>
                                {:else if content.text}
                                    <div class="border p-2">
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-3"
                                            value={idx}
                                            data-type="text"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>
                                        <span>텍스트 : {content.text}</span> /
                                        <span>사이즈 : {content.fontSize}</span>
                                        /
                                        <span>정렬 : {content.align}</span> /
                                        <span>효과 : {content.effect}</span>
                                    </div>
                                {:else if content.imgPath}
                                    <div class="border p-2">
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-3"
                                            value={idx}
                                            data-type="image"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>
                                        이미지 :
                                        <img
                                            src={content.imgPath}
                                            alt=""
                                            width="150"
                                            height="150"
                                        />
                                        <span>가로값 : {content.width}</span> /
                                        <span>정렬 : {content.align}</span> /
                                        <span>효과 : {content.effect}</span>
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                        <div>
                            <button
                                class="btn btn-sm btn-success text-white mr-5"
                                on:click={() => {
                                    console.log(addContentType);
                                    // showToast
                                    if (!addContentType) {
                                        showToast("컨텐츠 타입을 선택하세요");
                                    }
                                    addContentStatus = addContentType;
                                }}
                            >
                                컨텐츠 추가
                                <i class="fa fa-plus-circle" aria-hidden="true"
                                ></i>
                            </button>

                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="blank"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">여백</span>
                            </label>

                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="text"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">텍스트</span>
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="image"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">이미지</span>
                            </label>
                        </div>

                        {#if addContentStatus == "blank"}
                            <div
                                class="my-3 py-2 text-center border border-green-500"
                            >
                                <div class="text-base">
                                    <span>여백 삽입</span>
                                </div>
                                <div class="mb-2">
                                    <span class="text-xs"
                                        >(여백 및 이미지의 합이 섹션 높이보다
                                        낮게 해주세요)</span
                                    >
                                </div>
                                <div>
                                    여백 높이 : <input
                                        type="text"
                                        class="border p-1 w-24"
                                        bind:value={contentMarginHeight}
                                    /> px
                                </div>
                            </div>
                        {/if}

                        {#if addContentStatus == "text"}
                            <div
                                class="my-3 py-2 text-center border border-green-500"
                            >
                                <div class="mb-2 text-base">
                                    <span>텍스트 삽입</span>
                                    <span class="text-xs"
                                        >(텍스트 넣을때만 입력 해주세요)</span
                                    >
                                </div>
                                <textarea
                                    class="border w-1/2"
                                    rows="3"
                                    bind:value={contentText}
                                ></textarea>
                                <div>
                                    폰트 사이즈 : <input
                                        type="text"
                                        class="border p-1 w-24"
                                        bind:value={contentFontSize}
                                    />
                                    px / 폰트 색상 :
                                    <input
                                        type="text"
                                        class="border p-1 w-24"
                                        bind:value={contentFontColor}
                                    />
                                </div>

                                <div class="my-3 text-center">
                                    정렬 기준 :

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="left"
                                            bind:group={contentTextAlign}
                                        />
                                        <span class="ml-0.5">왼쪽</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="center"
                                            bind:group={contentTextAlign}
                                        />
                                        <span class="ml-0.5">가운데</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="right"
                                            bind:group={contentTextAlign}
                                        />
                                        <span class="ml-0.5">오른쪽</span>
                                    </label>
                                </div>

                                <div>
                                    <span>효과 : </span>
                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="on"
                                            bind:group={contentTextEffect}
                                        />
                                        <span>켜기</span>
                                    </label>

                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="off"
                                            bind:group={contentTextEffect}
                                        />
                                        <span>끄기</span>
                                    </label>
                                </div>
                                <div class="mt-3">
                                    딜레이 : <input
                                        type="text"
                                        class="border p-1 w-24"
                                        bind:value={contentTextEffectDealy}
                                    /> (100 = 1초)
                                </div>
                            </div>
                        {/if}

                        {#if addContentStatus == "image"}
                            <div
                                class="my-3 py-2 text-center border border-blue-500"
                            >
                                <div class="text-base mb-3">
                                    <span>이미지 삽입</span>
                                    <span class="text-xs"
                                        >(이미지 사이즈는 섹션 높이보다 작게
                                        해주세요)</span
                                    >
                                </div>

                                <div>
                                    {#if contentImagePath}
                                        <img src={contentImagePath} alt="" />
                                    {/if}

                                    {#if !contentImagePath}
                                        <OneImageUpload
                                            on:sendImgPath={contentImageUpload}
                                        ></OneImageUpload>
                                    {:else}
                                        <button
                                            class="btn btn-error btn-sm text-white"
                                            value="content"
                                            on:click={deleteImage}
                                            >이미지 삭제</button
                                        >
                                    {/if}
                                </div>

                                <div class="mt-3">
                                    이미지 가로 사이즈 : <input
                                        type="text"
                                        class="border p-1 w-24"
                                        bind:value={contentImageWidth}
                                    /> %
                                </div>

                                <div class="my-3 text-center">
                                    정렬 기준 :

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="left"
                                            bind:group={contentImageAlign}
                                        />
                                        <span class="ml-0.5">왼쪽</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="center"
                                            bind:group={contentImageAlign}
                                        />
                                        <span class="ml-0.5">가운데</span>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            class="radio radio-success radio-xs"
                                            value="right"
                                            bind:group={contentImageAlign}
                                        />
                                        <span class="ml-0.5">오른쪽</span>
                                    </label>
                                </div>

                                <div>
                                    <span>효과 : </span>

                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="on"
                                            bind:group={contentImageEffect}
                                        />
                                        <span>켜기</span>
                                    </label>

                                    <label class="mr-3"
                                        ><input
                                            type="radio"
                                            class="radio radio-info radio-xs"
                                            value="off"
                                            bind:group={contentImageEffect}
                                        />
                                        <span>끄기</span>
                                    </label>
                                </div>
                                <div class="mt-3">
                                    딜레이 : <input
                                        type="text"
                                        class="border p-1 w-24"
                                        bind:value={contentImageEffectDealy}
                                    /> (100 = 1초)
                                </div>
                            </div>
                        {/if}

                        <div class="mt-3 text-center">
                            <button
                                class="btn btn-accent text-white"
                                on:click={addContentFunc}
                            >
                                {#if contentModifyStatus}
                                    컨텐츠 수정
                                {:else}
                                    컨텐츠 추가
                                {/if}
                            </button>

                            <button
                                class="btn btn-info text-white"
                                on:click={sectionUpdate}
                            >
                                {#if !sectionModifyStatus}
                                    섹션 완료
                                {:else}
                                    섹션 수정
                                {/if}
                            </button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="border p-3">
        <div>
            ※ 하부 메뉴들!! / <span class="text-sm">배경색상 :</span>
            <input
                type="text"
                class="border p-1 w-24 text-sm"
                bind:value={menuObj["color"]}
            />

            <span class="text-sm">/ 위아래 여백 :</span>
            <input
                type="text"
                class="border p-1 w-24 text-sm"
                bind:value={menuObj["padding_y"]}
            />

            <span class="text-sm">px / 메뉴 추가</span>
            <input
                type="text"
                class="border p-1 w-24 text-sm"
                bind:value={menuName}
            />
            <button
                class="btn btn-outline btn-success btn-sm"
                on:click={() => {
                    const menuSubObj = {
                        name: menuName,
                    };

                    const tempArr = [...menuObj["menus"]];
                    tempArr.push(menuSubObj);
                    menuObj["menus"] = tempArr;
                    console.log(menuObj);
                    menuName = "";
                }}
            >
                메뉴 추가
            </button>
        </div>

        <div class="mt-4">
            <table class="w-full">
                {#each menuObj["menus"] as menu, idx}
                    <tr>
                        <th class="border w-[100px] p-2">
                            {#if menuModify == undefined}
                                <div>{menu.name}</div>
                            {:else}
                                <div>
                                    <input
                                        type="text"
                                        class="border p-1 w-24 text-sm"
                                        bind:value={menuName}
                                    />
                                </div>
                            {/if}

                            {#if menuModify == undefined}
                                <div></div>

                                <button
                                    class="btn btn-soft btn-secondary btn-xs"
                                    >삭제</button
                                >
                                <button
                                    class="btn btn-soft btn-success btn-xs"
                                    on:click={() => {
                                        menuModify = idx;
                                    }}
                                >
                                    수정
                                </button>
                            {:else}
                                <button
                                    class="btn btn-soft btn-success btn-xs"
                                    on:click={() => {
                                        const tempArr = [...menuObj["menus"]];
                                        tempArr[menuModify]["name"] = menuName;
                                        menuObj["menus"] = tempArr;
                                        menuModify = undefined;
                                        menuName = "";
                                    }}
                                >
                                    반영
                                </button>
                            {/if}
                        </th>
                        <td class="border p-2">
                            <SortableImgMovie
                                on:updateImgeList={(e) => {
                                    const imgArr = e.detail.imgArr;
                                    updateImgArr(imgArr, idx);
                                }}
                                modifyImageList={menuObj["menus"][idx][
                                    "imgArr"
                                ]}
                            ></SortableImgMovie>
                        </td>
                    </tr>
                {/each}
            </table>
        </div>
    </div>
</div>

<style>
    .toasts-show {
        opacity: 1;
    }
    .toasts {
        /* 기본적인 토스트 스타일 */
        position: fixed;
        bottom: 20px;
        right: 20px;
        transform: translateX(-50%);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        /* 처음에는 보이도록 설정 (hidden 클래스가 없을 때) */
        z-index: 1000;
        transition: opacity 2s ease-in-out; /* 투명도 변화에 2초의 트랜지션 적용 */
    }

    .toasts.hidden {
        opacity: 0;
    }
</style>
