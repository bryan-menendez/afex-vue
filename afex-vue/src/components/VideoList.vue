<script setup>
import { inject } from 'vue'
import VideoItem from '../components/VideoItem.vue'

const $toast = inject('toast')
const video_list = inject('video_list')
const selected_video = inject('selected_video')
const delete_modal = inject('delete_modal')

function fetchVideos() {
    fetch("https://xyyyukxba8.execute-api.sa-east-1.amazonaws.com/videos")
    .then(response => response.json())
    .then(function(data) {
        video_list.value = data
    })
}

function deleteVideo(){
  try {
      fetch('https://xyyyukxba8.execute-api.sa-east-1.amazonaws.com/videos/'+ selected_video.value.uid, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
          body: ''
      }).then(function () {
        $toast.success('Video eliminado')
      })
  }
  catch (err){
    $toast.error('Ocurrio un error al eliminar el video');
    console.log(err)
    return
  }

  video_list.value = video_list.value.filter(vid => vid.uid !== selected_video.value.uid)
  delete_modal.value.close()
}

fetchVideos()

defineExpose({
  fetchVideos,
  deleteVideo
})
</script>

<template>
    <div id="video-list">
        <VideoItem 
            v-for="vid in video_list"
            :key="vid.id"
            :id="vid.id"
            :uid="vid.uid"
            :title="vid.title"
            :desc="vid.desc"
            :length="vid.length"
        />        
    </div>
</template>

<style scoped>
#video-list{
    width: 865px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>