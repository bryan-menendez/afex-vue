<script setup>
import { ref, computed, inject, onUpdated } from 'vue'
import LiteYouTubeEmbed from 'vue-lite-youtube-embed'
import 'vue-lite-youtube-embed/style.css'

const selected_video = inject('selected_video')

const video_uid = computed(() => { return selected_video.value.uid })
const video_desc = computed(() => { return selected_video.value.desc })
const video_title = computed(() => { return selected_video.value.title })

const yt_iframe = ref(null)
const desc_ref = ref(null)
const isHidden = ref(true)

function close(){
  try {
    isHidden.value = true
    yt_iframe.value?.pauseVideo()
  }
  catch(err) {
    console.log("Cant pause the video because iframe has not been instantiated.")
    //console.log(err)
  }
}

function show() {
  isHidden.value = false
}

onUpdated(() => {
  desc_ref.value.scrollTop = 0
})

defineExpose({
  close,
  show
})
</script>
<template>
  <div :class="{ 'modal-hidden': isHidden }">
    <transition name="modal-fade">
        <div class="modal-backdrop" @click="close">
            <div class="modal" @click.stop>
                <header class="modal-header">
                    <button type="button" class="btn-close" @click="close">X</button>
                </header>
                <div class="content">
                    <div class="video-container">
                        <div class="video-embed">
                            <LiteYouTubeEmbed
                              :id="video_uid"
                              :title="video_title"
                              ref="yt_iframe"
                              />                    
                        </div>
                    </div>
                    <div class="video-details">
                      <div class="video-title">{{ video_title }}</div>
                      <div class="video-desc" ref="desc_ref">{{ video_desc }}</div>
                    </div>
                </div>                
            </div>
        </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

.modal {
  background: #FFFFFF;
  width: 850px;
  height: 345px;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
}

.modal-hidden {
  display: none;
}

.modal-header
{
  padding: 15px;
  display: flex;
  margin-top: 20px;
  font-size: 20px;
  position: relative;
  color: #000000;
  justify-content: space-between;
}

.content {
  display: flex;
  flex-direction: row;
  height: 275px;
}

.video-details {
  margin-left: 32px;
  width: 375px;
  max-height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.video-title {
  color: black;
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
}

.video-desc {
  color: black;
  max-height: 160px;
  width: 100%;
  overflow: auto;
  white-space: pre-wrap;
}

.video-embed {
  margin-left: 32px;
  width: 300px;
  height: fit-content;
}

.video-container {
  display: flex;
  align-items: center;
  height: 250px;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 3px;
    margin-right: 18px;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #000000;
    background: transparent;
  }
  
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease;
}
</style>
