<script>
    import axios from "axios";
    import { back_api } from "$src/lib/const";
    import SortableImg from "$components/SortableImg.svelte";
    import { dataURItoBlob } from "$src/lib/lib";
    import _remove from "lodash/remove";
    import _some from "lodash/some";
    import _pullAt from "lodash/pullAt";
    import { page } from "$app/stores";
    import { goto, invalidateAll } from "$app/navigation";

    let ld_id = "";
    let allData = {};

    let nowIdx = 0;

    let menuArr = [
        { pgName: "사업소개", pgLink: "introduction" },
        { pgName: "입지환경", pgLink: "environ" },
        { pgName: "프리미엄", pgLink: "premium" },
        { pgName: "상품안내", pgLink: "product" },
        {},
    ];
    let tempSaveImgs = []; // 임시저장 이미지 리스트, 새로고침 / 뒤로가기시 싹 삭제됨
    let mainImgs = [];
    let bannerImgs = [];

    let modifyVal = {};
    let getId = "";
    export let data;

    $: data, setData();
    function setData() {
        console.log("셋 데이터~!!!!!!!!!!!!");
        modifyVal = data.modifyVal;
        console.log(modifyVal);
        getId = data.getId;
        if (data.modifyVal) {
            ld_id = modifyVal.ld_id;
            allData = data.modifyVal;
            console.log(allData);
            if (!allData["ld_db_location"]) {
                allData["ld_db_location"] = "";
            }
            if (allData["ld_menu"]) {
                menuArr = JSON.parse(allData["ld_menu"]);
            }

            mainImgs = modifyVal.ld_main_img
                ? modifyVal.ld_main_img.split(",")
                : [];

            bannerImgs = modifyVal.ld_banner_img
                ? modifyVal.ld_banner_img.split(",")
                : [];
            for (let i = 0; i < 5; i++) {
                if (allData[`ld_pg${i}`]) {
                    allData[`ld_pg${i}_img`] = allData[`ld_pg${i}`].split(",");
                }
            }
        }
    }

    async function updateData() {
        console.log("asl;djflaijsdfijasfdj");
    }

    async function deleteLogoAct() {
        const logoUrlArr = allData["ld_logo"].split("/");
        const logoUrlPath = `subuploads/img/${logoUrlArr[4]}/${logoUrlArr[5]}`;

        try {
            const res = await axios.post(`${back_api}/delete_logo`, {
                logoUrlPath,
                ld_id,
            });
            if (res.data.status) {
                alert("로고가 삭제 되었습니다.");
                invalidateAll();
                allData["ld_logo"] = "";
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    async function deletePhimgAct() {
        const phimgUrlArr = allData["ld_ph_img"].split("/");
        const phimgUrlPath = `subuploads/img/${phimgUrlArr[4]}/${phimgUrlArr[5]}`;

        try {
            const res = await axios.post(`${back_api}/delete_phimg`, {
                phimgUrlPath,
                ld_id,
            });
            if (res.data.status) {
                alert("번호 이미지가 삭제 되었습니다.");
                invalidateAll();
                allData["ld_ph_img"] = "";
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    async function deletePopupimgAct() {
        const phimgUrlArr = allData["ld_popup_img"].split("/");
        const phimgUrlPath = `subuploads/img/${phimgUrlArr[4]}/${phimgUrlArr[5]}`;

        try {
            const res = await axios.post(`${back_api}/delete_popupimg`, {
                phimgUrlPath,
                ld_id,
            });
            if (res.data.status) {
                alert("팝업 이미지가 삭제 되었습니다.");
                invalidateAll();
                allData["ld_popup_img"] = "";
            }
        } catch (error) {
            alert("에러가 발생 했습니다.");
        }
    }

    async function uploadData(e) {
        allData["ld_main_img"] = mainImgs.join(",");
        allData["ld_banner_img"] = bannerImgs.join(",");

        for (let i = 0; i < 5; i++) {
            if (allData[`ld_pg${i}_img`]) {
                allData[`ld_pg${i}`] = allData[`ld_pg${i}_img`].join(",");
            }
            delete allData[`ld_pg${i}_img`];
        }

        allData["ld_menu"] = JSON.stringify(menuArr);

        const type = e.target.value;
        console.log(type);
        const res = await axios.post(`${back_api}/upload_data`, {
            allData,
            type,
        });
        if (res.data.status) {
            let alertMessage = "";
            if (e.target.value == "upload") {
                alertMessage = "업로드가 완료 되었습니다.";
            } else {
                alertMessage = "업데이트가 완료 되었습니다.";
            }

            alert(alertMessage);
            invalidateAll();
        } else {
            alert("에러 발생 다시 시도해주세요 (중복된 도메인)");
        }
    }

    function updateMainImgList(e) {
        const imgList = e.detail.imgArr;
        mainImgs = setImgArr(imgList);
    }

    function updateBannerImgList(e) {
        const imgList = e.detail.imgArr;
        bannerImgs = setImgArr(imgList);
    }

    function updateImgList(e) {
        const imgList = e.detail.imgArr;
        allData[`ld_pg${nowIdx}_img`] = setImgArr(imgList);
    }

    function setImgArr(imgList) {
        const imgArr = imgList;
        let tempImgArr = [];

        let tempSaveImgsTemp = [...tempSaveImgs];
        for (let i = 0; i < imgArr.length; i++) {
            const imgObj = imgArr[i];
            tempImgArr.push(imgObj["src"]);
            if (!tempSaveImgsTemp.includes(imgObj["src"])) {
                tempSaveImgsTemp.push(imgObj["src"]);
            }
        }
        tempSaveImgs = tempSaveImgsTemp;
        return tempImgArr;
    }

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const uploadLogoAct = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const maxWidth = 1200;
            const img_file = e.target.files[0];
            const options = {
                maxSizeMB: 0.7,
                // maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const reader = new FileReader();
            reader.readAsDataURL(img_file);
            reader.onload = function (r) {
                let setWidth = 0;
                let setHeight = 0;
                const img = new Image();
                img.src = r.target.result;
                img.onload = async function (e) {
                    if (img.width >= maxWidth) {
                        var share = img.width / maxWidth;
                        var setHeight = Math.floor(img.height / share);
                        var setWidth = maxWidth;
                    } else {
                        setWidth = img.width;
                        setHeight = img.height;
                    }

                    var canvas = document.createElement("canvas");
                    canvas.width = setWidth;
                    canvas.height = setHeight;
                    canvas.display = "inline-block";
                    canvas
                        .getContext("2d")
                        .drawImage(img, 0, 0, setWidth, setHeight);

                    var getReImgUrl = canvas.toDataURL("image/webp");

                    const resultImage = dataURItoBlob(getReImgUrl);

                    let imgForm = new FormData();

                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.webp`;
                    imgForm.append("onimg", resultImage, fileName);

                    console.log(back_api);
                    axios
                        .post(`${back_api}/img_upload`, imgForm, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            console.log(res.data);
                            allData["ld_logo"] = res.data.baseUrl;
                        })
                        .catch((err) => {
                            console.error();
                            alert(`${err.message} 에러가 발생 했습니다.`);
                        });
                };
            };
        };
    };

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const uploadPhimgAct = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const maxWidth = 1200;
            const img_file = e.target.files[0];
            const options = {
                maxSizeMB: 0.7,
                // maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const reader = new FileReader();
            reader.readAsDataURL(img_file);
            reader.onload = function (r) {
                let setWidth = 0;
                let setHeight = 0;
                const img = new Image();
                img.src = r.target.result;
                img.onload = async function (e) {
                    if (img.width >= maxWidth) {
                        var share = img.width / maxWidth;
                        var setHeight = Math.floor(img.height / share);
                        var setWidth = maxWidth;
                    } else {
                        setWidth = img.width;
                        setHeight = img.height;
                    }

                    var canvas = document.createElement("canvas");
                    canvas.width = setWidth;
                    canvas.height = setHeight;
                    canvas.display = "inline-block";
                    canvas
                        .getContext("2d")
                        .drawImage(img, 0, 0, setWidth, setHeight);

                    var getReImgUrl = canvas.toDataURL("image/webp");

                    const resultImage = dataURItoBlob(getReImgUrl);

                    let imgForm = new FormData();

                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.webp`;
                    imgForm.append("onimg", resultImage, fileName);

                    console.log(back_api);
                    axios
                        .post(`${back_api}/img_upload`, imgForm, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            console.log(res.data);
                            allData["ld_ph_img"] = res.data.baseUrl;
                        })
                        .catch((err) => {
                            console.error();
                            alert(`${err.message} 에러가 발생 했습니다.`);
                        });
                };
            };
        };
    };

    const popupImgUpload = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg");
        input.click();

        // input change
        input.onchange = async (e) => {
            const maxWidth = 1200;
            const img_file = e.target.files[0];
            const options = {
                maxSizeMB: 0.7,
                // maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const reader = new FileReader();
            reader.readAsDataURL(img_file);
            reader.onload = function (r) {
                let setWidth = 0;
                let setHeight = 0;
                const img = new Image();
                img.src = r.target.result;
                img.onload = async function (e) {
                    if (img.width >= maxWidth) {
                        var share = img.width / maxWidth;
                        var setHeight = Math.floor(img.height / share);
                        var setWidth = maxWidth;
                    } else {
                        setWidth = img.width;
                        setHeight = img.height;
                    }

                    var canvas = document.createElement("canvas");
                    canvas.width = setWidth;
                    canvas.height = setHeight;
                    canvas.display = "inline-block";
                    canvas
                        .getContext("2d")
                        .drawImage(img, 0, 0, setWidth, setHeight);

                    var getReImgUrl = canvas.toDataURL("image/webp");

                    const resultImage = dataURItoBlob(getReImgUrl);

                    let imgForm = new FormData();

                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.webp`;
                    imgForm.append("onimg", resultImage, fileName);
                    axios
                        .post(`${back_api}/img_upload`, imgForm, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((res) => {
                            console.log(res.data);
                            allData["ld_popup_img"] = res.data.baseUrl;
                        })
                        .catch((err) => {
                            console.error();
                            alert(`${err.message} 에러가 발생 했습니다.`);
                        });
                };
            };
        };
    };
</script>

<div class="container max-w-[900px] py-10 px-3 mx-auto pretendard">
    <div class="w-full flex items-center gap-4">
        <table class=" w-[350px]">
            <tr>
                <th class="border p-2.5 w-[100px]">도메인</th>
                <td class="border p-2.5 pl-5">
                    <span>{allData["ld_domain"]}</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="mt-3">
        <span class="text-sm font-semibold">※ 사이트 설명</span>
        <div class="mt-2">
            <textarea
                rows="3"
                class="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-blue-500 p-2"
                bind:value={allData["ld_description"]}
            ></textarea>
        </div>
    </div>

    <div class="mt-3">
        <span class="text-sm font-semibold">※ 추가 스크립트 </span>
        <div class="mt-2">
            <textarea
                rows="3"
                class="w-full border border-gray-300 rounded-md focus:ring-0 focus:border-blue-500 p-2"
                bind:value={allData["ld_add_scripts"]}
            ></textarea>
        </div>
    </div>

    <div class="w-full mt-5">
        <div class="mb-3">
            <span class="text-sm font-semibold">※ 기본 정보</span>
        </div>

        <table class="w-full">
            <tr>
                <th class="border p-1 w-1/6 text-xs md:text-sm">사이트명</th>
                <td class="border p-1 w-2/6">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_name"]}
                    />
                </td>

                <th class="border p-1 w-1/6 text-xs md:text-sm">카톡 링크</th>
                <td class="border p-1 w-2/6">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_kakao"]}
                    />
                </td>
            </tr>
            <tr>
                <th class="border p-1 text-xs md:text-sm">상담 전화번호</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_phone_num"]}
                    />
                </td>
                <th class="border p-1 text-xs md:text-sm">상담 문자번호</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_sms_num"]}
                    />
                </td>
            </tr>

            <tr>
                <th class="border p-1 text-xs md:text-sm">DB 접수 위치</th>
                <td class="border p-1">
                    <select
                        bind:value={allData["ld_db_location"]}
                        class="text-sm border py-2 w-full rounded-md border-gray-300"
                    >
                        <option value="">선택하세요</option>
                        <option value="up">상단</option>
                        <option value="down">하단</option>
                        <option value="both">둘다</option>
                    </select>
                </td>
            </tr>

            <!-- <tr>
                <th class="border p-1 text-xs md:text-sm"> 헤더 배경색 </th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_bgcolor"]}
                    />
                </td>
                <th class="border p-1 text-xs md:text-sm"> 헤더 글자색 </th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_txtcolor"]}
                    />
                </td>
            </tr> -->
            <tr>
                <th class="border p-1 text-xs md:text-sm">로고이미지</th>
                <td class="border p-1">
                    <div>
                        {#if allData["ld_logo"]}
                            <div class="mb-3 border p-1 rounded-md">
                                <img src={allData["ld_logo"]} alt="" />
                            </div>
                        {:else}
                            <div class="mb-3">이미지를 추가해주세요</div>
                        {/if}

                        {#if allData["ld_logo"]}
                            <button
                                class="py-1 px-3 text-xs text-white rounded-md bg-red-500 active:bg-red-600"
                                on:click={deleteLogoAct}
                            >
                                로고 삭제
                            </button>
                        {:else}
                            <button
                                class="py-1 px-3 text-xs text-white rounded-md bg-blue-500 active:bg-blue-600"
                                on:click={uploadLogoAct}
                            >
                                로고 업로드
                            </button>
                        {/if}
                    </div>
                </td>

                <th class="border p-1 text-xs md:text-sm">전화번호 이미지</th>
                <td class="border p-1">
                    <div>
                        {#if allData["ld_ph_img"]}
                            <div class="mb-3 border p-1 rounded-md">
                                <img src={allData["ld_ph_img"]} alt="" />
                            </div>
                        {:else}
                            <div class="mb-3">이미지를 추가해주세요</div>
                        {/if}

                        {#if allData["ld_ph_img"]}
                            <button
                                class="py-1 px-3 text-xs text-white rounded-md bg-red-500 active:bg-red-600"
                                on:click={deletePhimgAct}
                            >
                                로고 삭제
                            </button>
                        {:else}
                            <button
                                class="py-1 px-3 text-xs text-white rounded-md bg-blue-500 active:bg-blue-600"
                                on:click={uploadPhimgAct}
                            >
                                로고 업로드
                            </button>
                        {/if}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="w-full mt-5">
        <div class="mb-3">
            <span class="text-sm font-semibold">※ 푸터 정보</span>
        </div>

        <table class="w-full">
            <tr>
                <th class="border p-1 w-1/6 text-xs md:text-sm">이름</th>
                <td class="border p-1 w-2/6">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_ft_name"]}
                    />
                </td>

                <th class="border p-1 w-1/6 text-xs md:text-sm">연락처</th>
                <td class="border p-1 w-2/6">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_ft_phone"]}
                    />
                </td>
            </tr>
            <tr>
                <th class="border p-1 text-xs md:text-sm">주소</th>
                <td class="border p-1">
                    <input
                        type="text"
                        class="border text-sm border-gray-300 w-full py-2 px-2 rounded-md focus:ring-0 focus:border-blue-500"
                        bind:value={allData["ld_ft_address"]}
                    />
                </td>
            </tr>
        </table>
    </div>

    <div class="mt-5">
        <div class="text-sm font-semibold mb-3">※ 팝업 이미지</div>
        {#if allData["ld_popup_img"]}
            <div>
                <img src={allData["ld_popup_img"]} alt="" />
            </div>
        {/if}

        <div>
            {#if allData["ld_popup_img"]}
                <button
                    class="py-1 px-3 text-xs text-white rounded-md bg-red-500 active:bg-red-600"
                    on:click={deletePopupimgAct}
                >
                    팝업 이미지 삭제
                </button>
            {:else}
                <button
                    class="py-1 px-3 text-xs text-white rounded-md bg-blue-500 active:bg-blue-600"
                    on:click={popupImgUpload}
                >
                    팝업 이미지 업로드
                </button>
            {/if}
        </div>
    </div>

    <div class="mt-5">
        <div class="text-sm font-semibold mb-3">
            ※ 메뉴
            <span class=" font-light text-xs">
                (기본 5개 / 이름과 링크를 넣으면 아래 이미지란 자동 생성)
            </span>
        </div>
        <table class="w-full text-xs md:text-sm">
            <tr>
                <th class="border p-2">메뉴이름</th>
                <th class="border p-2">링크</th>
            </tr>

            {#each menuArr as menu, idx}
                <tr>
                    <td class="border p-1">
                        <input
                            type="text"
                            class="border w-full p-2 focus:outline-none focus:border-blue-500"
                            bind:value={menuArr[idx]["pgName"]}
                        />
                    </td>
                    <td class="border p-1">
                        <input
                            type="text"
                            class="border w-full p-2 focus:outline-none focus:border-blue-500"
                            bind:value={menuArr[idx]["pgLink"]}
                        />
                    </td>
                </tr>
            {/each}
        </table>
    </div>

    <div class="py-5 px-3 border rounded-md mt-5">
        <span class="text-sm">▣ 배너 이미지</span>
        <SortableImg
            on:updateImgeList={updateBannerImgList}
            modifyImageList={bannerImgs}
        />
    </div>

    <div class="py-5 px-3 border rounded-md mt-5">
        <span class="text-sm">▣ 메인 이미지</span>
        <SortableImg
            on:updateImgeList={updateMainImgList}
            modifyImageList={mainImgs}
        />
    </div>

    {#each menuArr as menu, idx}
        {#if menuArr[idx]["pgName"] && menuArr[idx]["pgLink"]}
            <div class="py-5 px-3 border rounded-md mt-5">
                <span class="text-sm">▣ {menuArr[idx]["pgName"]} 이미지</span>
                <SortableImg
                    on:updateImgeList={(e) => {
                        nowIdx = idx;
                        updateImgList(e);
                    }}
                    modifyImageList={allData[`ld_pg${idx}_img`]}
                />
            </div>
        {/if}
    {/each}

    <div class="mt-5 pb-20 text-center">
        <button
            class=" text-xl bg-blue-500 active:bg-blue-600 py-2 px-10 rounded-lg text-white"
            value="update"
            on:click={uploadData}
        >
            업데이트
        </button>
    </div>
</div>
