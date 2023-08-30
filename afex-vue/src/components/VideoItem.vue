<script setup>
import { computed, inject } from 'vue'

const props = defineProps(['id', 'uid', 'title', 'desc', 'length'])

const selected_video = inject('selected_video')
const details_modal = inject('details_modal')
const delete_modal = inject('delete_modal')

const vid_uid = props.uid
const vid_title = props.title
const vid_desc = props.desc
const vid_length = computed(() => { return ISO8601toDuration(props.length) })
const img_src = computed(() => { return "https://i.ytimg.com/vi/" + props.uid + "/mqdefault.jpg" })

function showDeleteModal(){
  selected_video.value.uid = vid_uid

  delete_modal.value.show()
}

function showDetailsModal(){
  selected_video.value.uid = vid_uid
  selected_video.value.title = vid_title
  selected_video.value.desc = vid_desc

  details_modal.value.show()
}

function formatTimeUnit(input, unit){
    var index = input.indexOf(unit);
    var output = "00"
    if(index < 0){
      return output; // unit isn't in the input
    }

    if(isNaN(input.charAt(index-2))){
      return '0' + input.charAt(index-1);
    }else{
      return input.charAt(index-2) + input.charAt(index-1);
    }
}

function ISO8601toDuration(input){
    var H = formatTimeUnit(input, 'H');
    var M = formatTimeUnit(input, 'M');
    var S = formatTimeUnit(input, 'S');

    if(H == "00"){
      H = "";
    }else{
      H += ":"
    }

    return H  + M + ':' + S ;
}
</script>

<template>
  <div class="thumbnail" @click="showDetailsModal">
    <img :src="img_src" alt="">
    <div @click.stop>
        <button @click="showDeleteModal(vid_uid)">X</button>
        <div id="vid_length">&nbsp;{{ vid_length }}&nbsp;</div>
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
#vid_length{
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
