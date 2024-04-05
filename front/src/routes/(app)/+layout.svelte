<script>
	import "$src/app.pcss";
	import { page } from "$app/stores";
	import SeoMeta from "$lib/components/SeoMeta.svelte";
	import { onMount } from "svelte";
	import ModalCustom from "$lib/components/ModalCustom.svelte";
	import { customerSubmit } from "$lib/lib";
	import Cookies from "js-cookie";
	import axios from "axios";
	import { back_api } from "$src/lib/const";

	let seoValue = {};
	let siteData = {};
	let menuList = [];
	let bannerList = [];
	let customerName = "";
	let customerPhone = "";
	let showPopup = false;

	let formModalopen = false;
	export let data;
	$: data, setData();
	function setData() {
		const popupShow = Cookies.get("popup_close");
		if (popupShow == "ok") {
			showPopup = false;
		} else {
			showPopup = true;
		}
		seoValue = data.seoValue;
		siteData = data.subView;
		menuList = JSON.parse(siteData.ld_menu);
		if (siteData.ld_banner_img) {
			bannerList = siteData.ld_banner_img.split(",");
		}
	}

	function closePopup() {
		Cookies.set("popup_close", "ok", { expires: 1 });
		showPopup = false;
	}

	onMount(async () => {
		const getVisitedCookie = Cookies.get("topby_visited");
		console.log(getVisitedCookie);
		const referrer = document.referrer;
		console.log(referrer);
		if (!getVisitedCookie) {
			console.log("쿠키 없어???");

			const res = await axios.post(`${back_api}/update_visit_count`, {
				ld_id: siteData["ld_id"],
				ld_domain : siteData["ld_domain"],
				ld_visit_count: siteData["ld_visit_count"],
				referrer
			});

			Cookies.set("topby_visited", "ok", { expires: 1 });
		}
		AOS.init();
	});
</script>

<svelte:head>
	{#if siteData.ld_add_scripts}
		{@html siteData.ld_add_scripts}
	{/if}
	<SeoMeta bind:seoValue />
	<!-- SUIT 폰트 CSS -->
	<link
		href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
		rel="stylesheet"
	/>
	<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
	<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
</svelte:head>

{#if siteData.ld_popup_img && showPopup}
	<div
		class="fixed border left-5 md:left-56 top-44 z-[99] max-w-[450px] w-2/3 bg-white suit-font"
	>
		<div class="p-1 text-xs flex justify-end items-center gap-2">
			<span>24시간 동안 보지 않기</span>
			<button
				class="text-lg flex justify-center items-center"
				on:click={closePopup}
			>
				<i class="fa fa-times" aria-hidden="true"></i>
			</button>
		</div>
		<img src={siteData.ld_popup_img} alt="" />
	</div>
{/if}

<ModalCustom bind:open={formModalopen}>
	<div class="suit-font">
		<div class="text-center font-bold text-xl mb-5">
			{siteData.ld_name} 관심고객 등록
		</div>
		<div class="bg-gray-300 rounded-lg p-3">
			<div class="mb-3">
				<input
					type="text"
					class="w-full rounded-md p-2.5 focus:outline-none focus:border-gray-500"
					placeholder="이름을 입력하세요 (필수)"
				/>
			</div>

			<div class="mb-3">
				<input
					type="text"
					class="w-full rounded-md p-2.5 focus:outline-none"
					placeholder="전화번호를 입력하세요 (필수)"
				/>
			</div>

			<div
				class="bg-white p-3 h-32 overflow-auto rounded-md text-sm mb-3"
			>
				<p>개인정보 수집동의</p>
				<p>
					​1. 수집하는 개인정보 내용 상담, 문의신청 등을 위해 아래와
					같은 개인정보를 수집하고 있습니다.
				</p>
				<p>- 수집항목 : 이름, 연락처</p>
				<p>
					- 수집방법 : http://adpeak.kr을 통한 수집 (온라인 상담 예약)
				</p>
				<p><br /></p>
				<p>
					2. 개인정보의 수집 및 이용방법 수집한 개인정보를 다음의
					목적을 위해 활용합니다.
				</p>
				<p>- 모델하우스 예약 및 온라인 상담</p>
				<p><br /></p>
				<p>
					3. 개인정보의 보유 및 이용기간 개인정보 수집 및 이용목적이
					달성된 후에는 해당 정보를 지체 없이 파기합니다.
				</p>
			</div>
			<div>
				<button
					class=" bg-blue-500 active:bg-blue-600 w-full rounded-md p-3 text-white"
					>신청 완료 하기</button
				>
			</div>
		</div>
	</div>
</ModalCustom>

<div class="fixed bottom-52 right-1 md:right-6 z-[999]">
	<ul>
		{#if siteData.ld_phone_num}
			<li
				class="rounded-full border md:border-2 p-3 md:p-4 bg-white mb-3"
			>
				<a href="TEL:{siteData.ld_phone_num}">
					<img src="/call_icon.png" alt="" class="w-10 md:w-14" />
				</a>
			</li>
		{/if}
		{#if siteData.ld_sms_num}
			<li
				class="rounded-full border md:border-2 p-3 md:p-4 bg-white mb-3"
			>
				<a
					href="SMS:{siteData.ld_sms_num}?body={siteData.ld_name} 문의드립니다. 분양가 / 모델하우스위치가 어떻게 되나요?"
				>
					<img src="/sms_icon.png" alt="" class="w-10 md:w-14" />
				</a>
			</li>
		{/if}
		<!-- <li class="rounded-full border md:border-2 p-3 md:p-4 bg-white">
			<button
				on:click={() => {
					formModalopen = true;
				}}
			>
				<img src="/form_icon.png" alt="" class="w-10 md:w-14" />
			</button>
		</li> -->
	</ul>
</div>

<div
	class="fixed left-0 top-0 w-full suit-font border-b border-gray-400 bg-white z-50"
	style=""
>
	<div class="max-w-[896px] mx-auto p-3">
		<div class="text-center flex justify-between items-center mb-3">
			{#if siteData.ld_logo}
				<a href="/">
					<img
						src={siteData.ld_logo}
						alt=""
						class="w-full max-w-72"
					/>
				</a>
			{:else}
				<a href="/">logo</a>
			{/if}

			{#if siteData.ld_ph_img && siteData.ld_phone_num}
				<a href="TEL:{siteData.ld_phone_num}">
					<img
						src={siteData.ld_ph_img}
						alt=""
						class="w-full max-w-72"
					/>
				</a>
			{/if}
		</div>

		<ul
			class="flex justify-around items-center font-semibold text-base md:text-lg"
		>
			{#each menuList as menu}
				{#if menu.pgLink && menu.pgName}
					<a href="/{menu.pgLink}">
						<li>{menu.pgName}</li>
					</a>
				{/if}
			{/each}
		</ul>
	</div>
</div>

<div class="mt-40 md:mt-48 max-w-[1200px] mx-auto">
	<slot />
</div>

{#if (siteData.ld_site && siteData.ld_db_location == "down") || siteData.ld_db_location == "both"}
	<div class="p-3">
		<div
			class="shadow-sm border p-4 md:pr-10 rounded-md suit-font block md:flex md:justify-around"
		>
			<div class="mb-3 md:mb-0">
				<p class="text-sm text-red-500">무엇이 궁금하세요?</p>
				<p class="text-2xl font-bold">빠른 상담 요청</p>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					class="p-2 border focus:outline-none focus:border-yellow-600 rounded-sm w-2/5"
					placeholder="이름"
					bind:value={customerName}
				/>
				<input
					type="text"
					class="p-2 border focus:outline-none focus:border-yellow-600 rounded-sm w-2/5"
					placeholder="연락처"
					bind:value={customerPhone}
				/>
				<button
					class=" bg-yellow-600 py-2 rounded-lg text-white text-sm md:text-base active:bg-yellow-700 w-1/5"
					on:click={() => {
						customerSubmit(
							customerName,
							customerPhone,
							siteData.ld_site,
						);
					}}
				>
					접수하기
				</button>
			</div>
		</div>
	</div>
{/if}

<hr class="mt-6" />
<div class="container mx-auto max-w-4xl mb-10 p-4 suit-font">
	copyright@ {$page.url.origin}
</div>

<style>
	@font-face {
		font-family: "OKDDUNG";
		src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/OKDDUNG.woff2")
			format("woff2");
		font-weight: normal;
		font-style: normal;
	}
	@font-face {
		font-family: "KBO-Dia-Gothic_bold";
		src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/KBO-Dia-Gothic_bold.woff")
			format("woff");
		font-weight: 700;
		font-style: normal;
	}

	:global(.kbo-font) {
		font-family: "KBO-Dia-Gothic_bold";
	}

	:global(.title-font) {
		font-family: "OKDDUNG";
	}

	:global(.suit-font) {
		font-family: "SUIT";
	}

	:global(.max_screen) {
		max-width: 868px;
	}

	:global(.max_screen_inner) {
		max-width: 616px;
	}

	:global(.main_img h1) {
		text-align: center;
		font-size: 40px;
		font-weight: bolder;
		position: relative;
	}
</style>
