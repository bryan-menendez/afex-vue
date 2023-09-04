<script setup>
import { inject } from "vue";

const props = defineProps([
	"uid",
	"title",
	"desc",
	"length",
	"img_url",
	"website",
]);

const selected_video = inject("selected_video");
const details_modal = inject("details_modal");
const delete_modal = inject("delete_modal");

function showDeleteModal() {
	selected_video.value = {
		"uid": props.uid,
		"title": props.title,
		"desc": props.desc,
		"length": props.length,
		"img_url": props.img_url,
		"website": props.website,
	}

	delete_modal.value.show();
}

function showDetailsModal() {
	selected_video.value = {
		"uid": props.uid,
		"title": props.title,
		"desc": props.desc,
		"length": props.length,
		"img_url": props.img_url,
		"website": props.website,
	}

  	details_modal.value.show();
}
</script>

<template>
	<div class="thumbnail" @click="showDetailsModal">
		<img :src="props.img_url" alt="" style="height: 135px" />
		<div @click.stop>
			<button @click="showDeleteModal()">X</button>
			<div id="vid_length">&nbsp;{{ props.length }}&nbsp;</div>
		</div>
	</div>
</template>

<style scoped>
.thumbnail {
	background-color: gray;
	width: 240px;
	height: 135px;
	max-width: 90%;
	margin-left: 24px;
	margin-right: 24px;
	margin-top: 42px;
	margin-bottom: 42px;
}

img {
	max-width: 100%;
	max-height: 100%;
}

button {
	position: absolute;
	margin-left: 210px;
	margin-top: -134px;
	background-color: black;
	opacity: 0.8;
	border: 0;
	border-radius: 2px;
	width: 24px;
	height: 24px;
	color: white;
	font-weight: 800;
	font-size: 16px;
	z-index: 0;
}
#vid_length {
	float: right;
	margin-right: 8px;
	margin-top: -35px;
	background-color: black;
	opacity: 0.8;
	border: 0;
	border-radius: 2px;
	width: fit-content;
	min-width: 42px;
	height: 24px;
	text-align: center;
	color: white;
	font-weight: 700;
	font-size: 14px;
	z-index: 0;
}
</style>
