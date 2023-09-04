<script setup>
import { ref, provide, reactive } from 'vue'
import UrlInputComponent from './components/UrlInputComponent.vue'
import VideoDeleteModal from './components/VideoDeleteModal.vue'
import VideoDetailsModal from './components/VideoDetailsModal.vue'
import VideoList from './components/VideoList.vue'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast()
const delete_modal = ref(null)
const details_modal = ref(null)
const videolist = ref(null)

const video_list = ref([])
const selected_video = ref({
    'uid': '',
    'title': '',
    'desc': '',
    'length': '',
    'img_url': '',
    'website': ''
  })

function onDeleteVideo() {
  videolist.value.deleteVideo()
}

provide('toast', toast)
provide('video_list', video_list)
provide('selected_video', selected_video)
provide('delete_modal', delete_modal)
provide('details_modal', details_modal)
</script>

<template>
  <main>
    <UrlInputComponent />
    <VideoList ref="videolist"/>
    <VideoDeleteModal ref="delete_modal" @deleteVideo="onDeleteVideo"/>
    <VideoDetailsModal ref="details_modal"/>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>