<script>
	import "$src/app.pcss";
	import { page } from "$app/stores";
	import SeoMeta from "$lib/components/SeoMeta.svelte";
	import { onMount } from "svelte";

	let seoValue = {};
	let siteData = {};
	export let data;
	$: data, setData();
	function setData() {
		seoValue = data.seoValue;
		siteData = data.subView;
		console.log(siteData);
	}

	onMount(() => {
		AOS.init();
	});
</script>

<svelte:head>
	<SeoMeta bind:seoValue />
	<!-- SUIT 폰트 CSS -->
	<link
		href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
		rel="stylesheet"
	/>
	<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
	<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
</svelte:head>

<div class="fixed bottom-6 right-6">
	<div class="w-30 h-30 border p-3">상담 신청</div>
</div>

<div
	class="fixed left-0 top-0 w-full suit-font border-b border-gray-400 bg-white z-50"
	style=""
>
	<div class="flex max-w-[896px] mx-auto p-3">
		<div class="w-1/6 text-center flex justify-center items-center">
			{#if siteData.ld_logo}
				<a href="/">
					<img src={siteData.ld_logo} alt="" class="w-full" />
				</a>
			{:else}
				<a href="/"> </a>
			{/if}
		</div>

		<ul class="flex justify-around items-center w-5/6 text-sm md:text-base">
			<a href="/overview">
				<li>사업소개</li>
			</a>
			<a href="/environ">
				<li>입지환경</li>
			</a>
			<a href="/premium">
				<li>프리미엄</li>
			</a>
			<a href="/product">
				<li>상품안내</li>
			</a>
		</ul>
	</div>
</div>

<div class="mt-20 max-w-[1200px] mx-auto">
	<slot />
</div>

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
