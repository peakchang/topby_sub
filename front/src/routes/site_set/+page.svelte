<script>
    import OneImageUpload from "$lib/components/OneImageUpload.svelte";
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import SortableImgMovie from "$lib/components/SortableImgMovie.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let data;

    $: data, setData();

    let getId = "";

    function setData() {
        getId = data.getId;

        if (data.ld_json_header) {
            logoObj = data.ld_json_header;
        }
        if (data.ld_json_menus) {
            menuObj = data.ld_json_menus;
            // e-모델하우스가 있으면 e-모델하우스 추가 버튼 없애기
            for (let i = 0; i < menuObj["menus"].length; i++) {
                const data = menuObj["menus"][i];
                if (data["link"] == "emodel") {
                    eModelBool = true;
                }
            }
        }

        if (data.ld_json_main) {
            mainContents = data.ld_json_main;
        }

        console.log(data.allData);
        console.log(data.allData.ld_phone_num);

        popupImg = data.allData.ld_popup_img;
        eventImg = data.allData.ld_event_img;
        phoneNumber = data.allData.ld_phone_num;
        console.log(phoneNumber);

        smsNumber = data.allData.ld_sms_num;
        smsContent = data.allData.ld_sms_content;
        personalInfoView = data.allData.ld_personal_info_view;
        footer = data.allData.ld_footer;

        siteName = data.allData.ld_name;
        phoneBottomImg = data.allData.ld_mobile_bt_phone_img;
        eventBottomImg = data.allData.ld_mobile_bt_event_img;
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
    let visible = false;

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
    let menuLink = "";
    let eModelBool = false;
    let eModelType = "";
    let eModelLink = "";

    // 메인 컨텐츠 주요 변수!
    let mainContents = []; // 전체 메인페이지 컨텐츠 총괄! sectionObj 객체가 내부 배열 요소로 들어가야함!!
    let sectionObj = { contentList: [] }; // 각 섹션을 보여줌! contentList 에는 배열 요소로 contentObj 가 들어가야함!
    let contentObj = {}; // 각각의 컨텐츠 요소! 바로바로 삭제하고 보여주고!

    // 컨텐츠 영역 임시 변수!
    let insertIdx = undefined;
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

    // 기타 정보 변수!!
    let popupImg = "";
    let phoneNumber = "";
    let smsNumber = "";
    let smsContent = "";
    let eventImg = "";
    let personalInfoView = "on";
    let footer = "";

    // 변수 추가!!
    let siteName = "";
    let phoneBottomImg = "";
    let eventBottomImg = "";

    // ***********************************************

    function showToast(message) {
        toastText = message;
        visible = true;

        setTimeout(() => {
            visible = false;
        }, 2000);
    }

    function logoUpdate(e) {
        const imgPath = e.detail.imgPath;
        logoObj["logo_img"] = imgPath;
    }
    function popupUpdate(e) {
        popupImg = e.detail.imgPath;
    }
    function eventUpdate(e) {
        eventImg = e.detail.imgPath;
    }
    function phoneBottomImgUpdate(e) {
        phoneBottomImg = e.detail.imgPath;
    }
    function eventBottomImgUpdate(e) {
        eventBottomImg = e.detail.imgPath;
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
        } else if (this.value == "popup") {
            imgUrlArr = popupImg.split("/");
        } else if (this.value == "event") {
            imgUrlArr = eventImg.split("/");
        } else if (this.value == "ph_bt_img") {
            imgUrlArr = phoneBottomImg.split("/");
        } else if (this.value == "event_bt_img") {
            imgUrlArr = eventBottomImg.split("/");
        }
        const deleteImagePath = `subuploads/img/${imgUrlArr[4]}/${imgUrlArr[5]}`;

        try {
            const res = await axios.post(
                `${back_api}/delete_single_image_only`,
                {
                    deleteImagePath,
                },
            );

            if (res.status == 200) {
                if (this.value == "logo") {
                    logoObj["logo_img"] = "";
                } else if (this.value == "content") {
                    contentImagePath = "";
                } else if (this.value == "background") {
                    sectionObj["backgroundImg"] = "";
                } else if (this.value == "popup") {
                    popupImg = "";
                } else if (this.value == "event") {
                    eventImg = "";
                } else if (this.value == "ph_bt_img") {
                    phoneBottomImg = "";
                } else if (this.value == "event_bt_img") {
                    eventBottomImg = "";
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

        if (contentModifyStatus && insertIdx != undefined) {
            contentModifyStatus = false;
            insertIdx = undefined;
            showToast("수정과 삽입을 동시에 수행할수 없습니다.");
        }

        if (!contentModifyStatus && insertIdx == undefined) {
            let tempArr = [...sectionObj.contentList];
            tempArr.push(contentObj);
            sectionObj.contentList = tempArr;
        } else if (contentModifyStatus && insertIdx == undefined) {
            let tempArr = [...sectionObj.contentList];
            tempArr[contentIdx] = contentObj;
            sectionObj.contentList = tempArr;
            contentModifyStatus = false;
        } else if (insertIdx != undefined) {
            let tempArr = [...sectionObj.contentList];
            tempArr.splice(insertIdx, 0, contentObj);
            sectionObj.contentList = tempArr;
            insertIdx = undefined;
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
    }

    function openSectionDetail() {
        sectionModifyStatus = true;

        const idx = this.value;
        sectionIdx = idx;
        if (sectionStatus) {
            showToast("작업중인 섹션을 완료 해주세요");
            return;
        }
        sectionStatus = true;
        sectionObj = mainContents[idx];
    }

    async function deleteSection() {
        if (
            !confirm(
                "삭제하시겠습니까? 이미지는 바로 삭제되므로 삭제 후 반드시 작업 업로드를 해주세요",
            )
        ) {
            return;
        }
        sectionIdx = this.value;

        // deleteImgArr 에 backgroundImg / contentList 돌면서 imgPath 있으면 넣기
        const deleteImgArrTemp = [];
        if (mainContents[sectionIdx]["backgroundImg"]) {
            deleteImgArrTemp.push(mainContents[sectionIdx]["backgroundImg"]);
        }

        for (
            let i = 0;
            i < mainContents[sectionIdx]["contentList"].length;
            i++
        ) {
            const data = mainContents[sectionIdx]["contentList"][i];
            if (data["imgPath"]) {
                deleteImgArrTemp.push(data["imgPath"]);
            }
        }

        if (deleteImgArrTemp.length > 0) {
            const deleteImgArr = deleteImgArrTemp.map((e) => {
                const imgUrlArr = e.split("/");
                return `subuploads/img/${imgUrlArr[4]}/${imgUrlArr[5]}`;
            });

            try {
                const res = await axios.post(`${back_api}/delete_many_image`, {
                    deleteImgArr,
                });
            } catch (error) {}
        }

        const tempArr = [...mainContents];

        tempArr.splice(sectionIdx, 1);
        mainContents = tempArr;

        showToast("섹션이 삭제 되었습니다. 작업 업로드를 해주세요");
    }

    function modifyContentFunc(e) {
        contentIdx = this.value;
        contentModifyStatus = true;

        addContentType = e.target.getAttribute("data-type");
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

    async function deleteContentFunc(e) {
        const dataType = e.target.getAttribute("data-type");
        if (dataType == "image") {
            const imgPath = sectionObj.contentList[this.value]["imgPath"];
            const imgUrlArr = imgPath.split("/");
            const deleteImagePath = `subuploads/img/${imgUrlArr[4]}/${imgUrlArr[5]}`;

            try {
                const res = await axios.post(
                    `${back_api}/delete_single_image_only`,
                    {
                        deleteImagePath,
                    },
                );
            } catch (err) {
                console.error(err.message);
            }
        }
        const tempArr = [...sectionObj.contentList];
        tempArr.splice(this.value, 1);
        sectionObj.contentList = tempArr;
    }

    function updateImgArr(imgArr, idx) {
        const imgList = imgArr.map((e) => e.src);
        menuObj.menus[idx]["imgArr"] = imgList;
    }

    async function updateSiteSet() {
        console.log(menuObj);

        for (let i = 0; i < menuObj.menus.length; i++) {
            let imgArr = menuObj.menus[i].imgArr;
            console.log(imgArr);
            if (imgArr) {
                menuObj.menus[i].imgArr = removeNulls(imgArr);
            }

            console.log(menuObj.menus[i].imgArr);
        }

        for (let l = 0; l < mainContents.length; l++) {
            let tempArr = mainContents[l]['contentList'];
            if(tempArr){
                mainContents[l]['contentList'] = removeNulls(tempArr);
            }
            
        }

        const ld_json_header = JSON.stringify(logoObj);
        const ld_json_main = JSON.stringify(mainContents);
        const ld_json_menus = JSON.stringify(menuObj);

        try {
            const res = await axios.post(`${back_api}/update_site_set`, {
                get_id: getId,
                ld_json_header,
                ld_json_main,
                ld_json_menus,
                popupImg,
                eventImg,
                phoneNumber,
                smsNumber,
                smsContent,
                personalInfoView,
                footer,
                siteName,
                phoneBottomImg,
                eventBottomImg,
            });
            if (res.status == 200) {
                showToast("업데이트가 완료 되었습니다.");
            } else {
                showToast("업데이트에 실패했습니다.");
            }
        } catch {}
    }

    function add_eModel() {
        // eModelBool
        console.log(menuObj.menus);
        const tempArr = [...menuObj.menus];
        tempArr.push({ name: "e-모델하우스", link: "emodel", emenu: [] });
        menuObj.menus = tempArr;
        eModelBool = true;
    }

    function add_emodel_ele() {
        console.log(this.value);

        console.log(menuObj.menus);
        // menuObj.menus[this.value]['emenu']
        const emodelObj = { type: eModelType, iframe_link: eModelLink };
        const tempArr = [...menuObj.menus[this.value]["emenu"]];
        tempArr.push(emodelObj);
        menuObj.menus[this.value]["emenu"] = tempArr;
        eModelType = "";
        eModelLink = "";
    }

    function removeNulls(arr) {
        return arr.filter((item) => item !== null);
    }
</script>

{#if visible}
    <div class="toasts pretendard" bind:this={toastArea} transition:fade>
        <div class="alert alert-error">
            <span class="text-white">{toastText}</span>
        </div>
    </div>
{/if}

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
                        <div class="m-2 p-2 bg-gray-400">
                            <img src={logoObj["logo_img"]} alt="" />
                        </div>
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
        <div class="mb-3">
            ※ 메인 페이지 섹션!! <button
                class="btn btn-info btn-sm text-white ml-5"
                on:click={() => {
                    sectionStatus = true;
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
                            class="btn btn-soft btn-accent btn-sm"
                            value={idx}
                            on:click={openSectionDetail}
                        >
                            자세히 보기
                        </button>

                        <button
                            class="btn btn-soft btn-error btn-sm"
                            value={idx}
                            on:click={deleteSection}
                        >
                            섹션 삭제
                        </button>
                    {:else if sectionIdx == idx}
                        <button
                            class="btn btn-soft btn-accent btn-sm"
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
                        <!-- 여기가 컨텐츠 리스트 부분! -->
                        {#if sectionObj.contentList.length != 0}
                            {#each sectionObj.contentList as content, idx}
                                {#if content.marginHeight}
                                    <div class="border p-2">
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="blank"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="blank"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>
                                        여백 : {content.marginHeight} px
                                    </div>
                                {:else if content.text}
                                    <div class="border p-2">
                                        <button
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="text"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="text"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
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
                                            class="btn btn-outline btn-info btn-sm mr-1"
                                            value={idx}
                                            data-type="image"
                                            on:click={modifyContentFunc}
                                        >
                                            수정
                                        </button>

                                        <button
                                            class="btn btn-outline btn-error btn-sm mr-3"
                                            value={idx}
                                            data-type="image"
                                            on:click={deleteContentFunc}
                                        >
                                            삭제
                                        </button>
                                        이미지 :

                                        <div class="m-2 p-2 bg-gray-400">
                                            <img
                                                src={content.imgPath}
                                                alt=""
                                                width="150"
                                                height="150"
                                            />
                                        </div>

                                        <span>가로값 : {content.width}</span> /
                                        <span>정렬 : {content.align}</span> /
                                        <span>효과 : {content.effect}</span>
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                        <div class="p-2">
                            <button
                                class="btn btn-sm btn-success text-white mr-5"
                                on:click={() => {
                                    // showToast
                                    if (!addContentType) {
                                        showToast("컨텐츠 타입을 선택하세요");
                                    }
                                    addContentStatus = addContentType;
                                }}
                            >
                                컨텐츠 선택
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

                            <label class="mr-5">
                                <input
                                    type="radio"
                                    value="image"
                                    class="radio radio-success radio-xs"
                                    bind:group={addContentType}
                                />
                                <span class="ml-0.5">이미지</span>
                            </label>

                            <input
                                type="text"
                                class="border p-1 w-16"
                                bind:value={insertIdx}
                            />
                            <span class="text-xs"
                                >(중간에 삽입하려면 입력하세요 맨처음 : 0 /
                                마지막 전 : {sectionObj.contentList.length - 1})
                            </span>
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
                                        <div class="m-1 p-1 bg-gray-400">
                                            <img
                                                src={contentImagePath}
                                                alt=""
                                            />
                                        </div>
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

            <span class="text-sm">px / 메뉴</span>
            <input
                type="text"
                class="border py-1.5 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                placeholder="메뉴이름(한글)"
                bind:value={menuName}
            />
            <input
                type="text"
                class="border py-1.5 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                placeholder="링크주소(영어)"
                bind:value={menuLink}
            />
            <button
                class="btn btn-outline btn-success btn-sm"
                on:click={() => {
                    const menuSubObj = {
                        name: menuName,
                        link: menuLink,
                    };

                    const tempArr = [...menuObj["menus"]];
                    tempArr.push(menuSubObj);
                    menuObj["menus"] = tempArr;
                    menuName = "";
                    menuLink = "";
                }}
            >
                메뉴 추가
            </button>

            {#if !eModelBool}
                <button
                    class="btn btn-outline btn-secondary btn-sm"
                    on:click={add_eModel}
                >
                    e-모델하우스
                </button>
            {/if}
        </div>

        <div class="mt-4">
            <table class="w-full">
                {#each menuObj["menus"] as menu, idx}
                    <tr>
                        <!-- e모델하우스 관련 -->
                        {#if menu.link == "emodel"}
                            <td
                                class="border w-[120px] p-2 text-center text-sm"
                            >
                                <div>{menu.name}</div>
                                <button
                                    class="btn btn-soft btn-secondary btn-xs"
                                    on:click={() => {
                                        const tempArr = [...menuObj["menus"]];
                                        tempArr.splice(idx, 1);
                                        menuObj["menus"] = tempArr;
                                        eModelBool = false;
                                    }}
                                >
                                    삭제
                                </button>
                            </td>
                            <td class="border p-2">
                                <div class="text-xs flex items-center gap-3">
                                    <label>
                                        타입 :
                                        <input
                                            type="text"
                                            class="py-1 px-2 border focus:outline-none focus:border-blue-500 w-28"
                                            bind:value={eModelType}
                                        />
                                    </label>
                                    /
                                    <label>
                                        링크 :
                                        <input
                                            type="text"
                                            class="py-1 px-2 border focus:outline-none focus:border-blue-500"
                                            bind:value={eModelLink}
                                        />
                                    </label>

                                    <button
                                        class="btn btn-info btn-xs text-white"
                                        value={idx}
                                        on:click={add_emodel_ele}
                                    >
                                        추가하기
                                    </button>
                                </div>

                                <div>
                                    {#each menu["emenu"] as emenu, idx}
                                        <div class="p-1 text-xs">
                                            <span>{idx + 1}</span> -
                                            <span>타입 : {emenu.type}</span>
                                            /
                                            <span
                                                >링크 : {emenu.iframe_link}</span
                                            >
                                        </div>
                                    {/each}
                                </div>
                            </td>
                        {:else}
                            <!-- 기타 일반 -->
                            <td class="border w-[100px] text-center text-sm">
                                <div class="relative">
                                    <div
                                        class=" absolute top-0 left-0 w-full h-full bg-white hidden z-50"
                                    >
                                        <input
                                            type="text"
                                            class="border py-1 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                                            placeholder="메뉴이름(한글)"
                                            bind:value={
                                                menuObj["menus"][idx]["name"]
                                            }
                                        />
                                        <input
                                            type="text"
                                            class="border py-1 px-2 w-24 text-xs focus:outline-none focus:border-blue-500 rounded-sm"
                                            placeholder="링크주소(영어)"
                                            bind:value={
                                                menuObj["menus"][idx]["link"]
                                            }
                                        />
                                        <button
                                            class="btn btn-success btn-xs"
                                            on:click={(e) => {
                                                e.target.parentNode.classList.add(
                                                    "hidden",
                                                );
                                            }}
                                        >
                                            적용
                                        </button>
                                    </div>

                                    <div class="p-2">
                                        <div>{menu.name}</div>
                                        <button
                                            class="btn btn-soft btn-secondary btn-xs"
                                            on:click={() => {
                                                const tempArr = [
                                                    ...menuObj["menus"],
                                                ];
                                                tempArr.splice(idx, 1);
                                                menuObj["menus"] = tempArr;
                                            }}
                                        >
                                            삭제
                                        </button>
                                        <button
                                            class="btn btn-soft btn-success btn-xs"
                                            on:click={(e) => {
                                                e.target.parentNode.parentNode.firstChild.classList.remove(
                                                    "hidden",
                                                );
                                            }}
                                        >
                                            수정
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td class="border">
                                <div
                                    class="p-2 text-xs flex items-center gap-2"
                                >
                                    <span>해당 메뉴 효과 :</span>
                                    <label class="mr-2">
                                        <input
                                            type="radio"
                                            value="on"
                                            class="radio radio-error radio-xs mr-1"
                                            bind:group={
                                                menuObj["menus"][idx]["effect"]
                                            }
                                        />
                                        <span>켜기</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="off"
                                            class="radio radio-error radio-xs mr-1"
                                            bind:group={
                                                menuObj["menus"][idx]["effect"]
                                            }
                                        />
                                        <span>끄기</span>
                                    </label>

                                    <span>(미선택시 자동 켜짐)</span>
                                </div>
                                <div class="p-2">
                                    <SortableImgMovie
                                        on:updateImgeList={(e) => {
                                            const imgArr = e.detail.imgArr;
                                            updateImgArr(imgArr, idx);
                                        }}
                                        modifyImageList={menuObj["menus"][idx][
                                            "imgArr"
                                        ]}
                                    ></SortableImgMovie>
                                </div>
                            </td>
                        {/if}
                    </tr>
                {/each}
            </table>
        </div>
    </div>

    <div class="border p-3 mt-5">
        <div>※팝업 이미지</div>
        <div class="mt-5">
            <div class="mb-3">
                {#if popupImg}
                    <img src={popupImg} alt="" class=" max-w-full" />
                {/if}
            </div>
            {#if popupImg}
                <button
                    class="btn btn-error btn-sm text-white"
                    value="popup"
                    on:click={deleteImage}
                >
                    이미지 삭제
                </button>
            {:else}
                <OneImageUpload on:sendImgPath={popupUpdate}></OneImageUpload>
            {/if}
        </div>
    </div>

    <div class="border p-3 mt-5">
        <div>
            ※이벤트 이미지 <span class=" text-xs text-red-600">
                (이벤트 이미지 사이즈는 900 X 900!!!!)</span
            >
        </div>
        <div class="mt-5">
            <div class="mb-3">
                {#if eventImg}
                    <img src={eventImg} alt="" class=" max-w-full" />
                {/if}
            </div>
            {#if eventImg}
                <button
                    class="btn btn-error btn-sm text-white"
                    value="event"
                    on:click={deleteImage}
                >
                    이미지 삭제
                </button>
            {:else}
                <OneImageUpload on:sendImgPath={eventUpdate}></OneImageUpload>
            {/if}
        </div>
    </div>

    <div class="border p-3 mt-5">
        <div>※기타 정보</div>
        <div>
            <table class="w-full">
                <tr>
                    <th class="border p-2 text-sm" style="width:15%"
                        >사이트명</th
                    >
                    <td class="border p-1 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={siteName}
                        />
                    </td>
                    <td colspan="2" class="border"></td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm" style="width:15%"
                        >전화번호</th
                    >
                    <td class="border p-1 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={phoneNumber}
                        />
                    </td>
                    <th class="border p-2 text-sm" style="width:15%">
                        문자 전화번호
                    </th>
                    <td class="border p-2 text-sm" style="width:35%">
                        <input
                            type="text"
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={smsNumber}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="border p-2 text-sm" style="width:15%"
                        >문자내용</th
                    >
                    <td class="border p-2 text-sm" style="width:35%">
                        <textarea
                            class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                            bind:value={smsContent}
                        ></textarea>
                    </td>
                    <th class="border p-2 text-sm" style="width:15%">
                        개인정보 유무
                    </th>
                    <td class="border p-2 text-sm" style="width:35%">
                        <div class="text-center">
                            <label class="mr-3">
                                <input
                                    type="radio"
                                    value="on"
                                    class="radio radio-info"
                                    bind:group={personalInfoView}
                                />
                                있음
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    value="off"
                                    class="radio radio-info"
                                    bind:group={personalInfoView}
                                />
                                없음
                            </label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th class="border p-1 text-xs md:text-sm">
                        <span class="font-normal"> 모바일 하단 </span>
                        <br />
                        <span class="font-normal"> 전화번호 이미지 </span>
                        <br />
                        <span class="text-xs text-red-600">
                            (384px X 80px 추천)
                        </span>
                    </th>
                    <td class="border">
                        {#if phoneBottomImg}
                            <img src={phoneBottomImg} alt="" />
                        {/if}

                        {#if phoneBottomImg}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="ph_bt_img"
                                on:click={deleteImage}
                            >
                                이미지 삭제
                            </button>
                        {:else}
                            <OneImageUpload
                                on:sendImgPath={phoneBottomImgUpdate}
                            ></OneImageUpload>
                        {/if}
                    </td>
                    <th class="border p-1 text-xs md:text-sm">
                        <span class="font-normal"> 모바일 하단 </span>
                        <br />
                        <span class="font-normal"> 이벤트 이미지 </span>
                        <br />
                        <span class="text-xs text-red-600">
                            (384px X 80px 추천)
                        </span>
                    </th>
                    <td class="border">
                        {#if eventBottomImg}
                            <img src={eventBottomImg} alt="" />
                        {/if}

                        {#if eventBottomImg}
                            <button
                                class="btn btn-error btn-sm text-white"
                                value="event_bt_img"
                                on:click={deleteImage}
                            >
                                이미지 삭제
                            </button>
                        {:else}
                            <OneImageUpload
                                on:sendImgPath={eventBottomImgUpdate}
                            ></OneImageUpload>
                        {/if}
                    </td>
                </tr>
            </table>

            <div class="p-3 border">
                <div>푸터 내용</div>
                <div>
                    <textarea
                        class="p-2 border border-gray-400 w-full rounded-md focus:outline-none focus:border-blue-500"
                        rows="4"
                        bind:value={footer}
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .toasts {
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 1000;
    }
</style>
