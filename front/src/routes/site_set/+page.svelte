<script>
    const actionList = [
        "fade-up",
        "fade-down",
        "flip-left",
        "flip-right",
        "flip-up",
        "flip-down",
        "none",
    ];
</script>

<div class="container max-w-[900px] py-10 px-3 mx-auto pretendard">
    <div class="w-full flex items-center gap-4">
        <table class=" w-[350px]">
            <tr>
                <th class="border p-2.5 w-[100px]">도메인</th>
                <td class="border p-2.5 pl-5"> </td>
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
                <td class="border px-1 py-2 w-3/4">asdfasdf</td>
            </tr>
            <tr>
                <th class="border px-1 py-2">로고 위치</th>
                <td class="border px-1 py-2 w-3/4">가운데 / 중간</td>
            </tr>
            <tr>
                <th class="border px-1 py-2">이미지 가로 사이즈</th>
                <td class="border px-1 py-2 w-3/4">
                    <input type="text" class="border p-1" /> px
                </td>
            </tr>

            <tr>
                <th class="border px-1 py-2">헤더 높이 / 여백</th>
                <td class="border px-1 py-2 w-3/4">
                    헤더 높이 : <input type="text" class="border p-1 w-24" /> px
                    / 위 아래 여백 :
                    <input type="text" class="border p-1 w-24" /> px
                </td>
            </tr>
        </table>
    </div>

    <div class="mt-8 mb-4">
        ※ 메인 페이지 섹션!! <button
            class="btn btn-info btn-sm text-white ml-5"
        >
            섹션 추가
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
        </button>
    </div>

    <div>
        <table class="w-full text-sm">
            <tr>
                <th class="border px-1 py-2">백그라운드 이미지</th>
                <td class="border px-1 py-2 w-3/4"> </td>
            </tr>
            <tr>
                <th class="border px-1 py-2">섹션 높이</th>
                <td class="border px-1 py-2 w-3/4"> </td>
            </tr>
            <tr>
                <td class="border px-1 py-2" colspan="2">
                    <div>
                        <button class="btn btn-sm btn-success text-white mr-5">
                            컨텐츠 추가
                            <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        </button>

                        <label class="mr-3">
                            <input
                                type="radio"
                                name="radio-7"
                                class="radio radio-success radio-xs"
                            />
                            <span class="ml-0.5">여백</span>
                        </label>

                        <label class="mr-3">
                            <input
                                type="radio"
                                name="radio-7"
                                class="radio radio-success radio-xs"
                            />
                            <span class="ml-0.5">텍스트</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="radio-7"
                                class="radio radio-success radio-xs"
                            />
                            <span class="ml-0.5">이미지</span>
                        </label>
                    </div>

                    <div class="mt-3 border p-2">
                        <div
                            class="my-3 py-2 text-center border border-green-500"
                        >
                            <div class="text-base">
                                <span>여백 삽입</span>
                            </div>
                            <div class="mb-2">
                                <span class="text-xs"
                                    >(여백 및 이미지의 합이 섹션 높이보다 낮게
                                    해주세요)</span
                                >
                            </div>
                            <div>
                                여백 높이 : <input
                                    type="text"
                                    class="border p-1 w-24"
                                /> px
                            </div>
                        </div>

                        <div
                            class="my-3 py-2 text-center border border-green-500"
                        >
                            <div class="mb-2 text-base">
                                <span>텍스트 삽입</span>
                                <span class="text-xs"
                                    >(텍스트 넣을때만 입력 해주세요)</span
                                >
                            </div>
                            <textarea class="border w-1/2" rows="3"></textarea>
                            <div>
                                폰트 사이즈 : <input
                                    type="text"
                                    class="border p-1 w-24"
                                /> px / 폰트 종류 :
                            </div>

                            <div class="my-3 text-center">
                                정렬 기준 :

                                <label>
                                    <input
                                        type="radio"
                                        name="radio-7"
                                        class="radio radio-success radio-xs"
                                    />
                                    <span class="ml-0.5">왼쪽</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="radio-7"
                                        class="radio radio-success radio-xs"
                                    />
                                    <span class="ml-0.5">가운데</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="radio-7"
                                        class="radio radio-success radio-xs"
                                    />
                                    <span class="ml-0.5">오른쪽</span>
                                </label>
                            </div>

                            <div>
                                <span>효과 : </span>
                                <select class="select select-sm w-32">
                                    {#each actionList as action}
                                        <option>{action}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <div
                            class="my-3 py-2 text-center border border-blue-500"
                        >
                            <div class="text-base">
                                <span>이미지 삽입</span>
                                <span class="text-xs"
                                    >(이미지 사이즈는 섹션 높이보다 작게
                                    해주세요)</span
                                >
                            </div>

                            <div class="mt-3">
                                이미지 가로 사이즈 : <input
                                    type="text"
                                    class="border p-1 w-24"
                                /> px
                            </div>

                            <div class="my-3 text-center">
                                정렬 기준 :

                                <label>
                                    <input
                                        type="radio"
                                        name="radio-7"
                                        class="radio radio-success radio-xs"
                                    />
                                    <span class="ml-0.5">왼쪽</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="radio-7"
                                        class="radio radio-success radio-xs"
                                    />
                                    <span class="ml-0.5">가운데</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="radio-7"
                                        class="radio radio-success radio-xs"
                                    />
                                    <span class="ml-0.5">오른쪽</span>
                                </label>
                            </div>

                            <div>
                                <span>효과 : </span>
                                <select class="select select-sm w-32">
                                    {#each actionList as action}
                                        <option>{action}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 text-center">
                        <button class="btn btn-accent text-white"
                            >컨텐츠 추가 완료하기</button
                        >
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>
