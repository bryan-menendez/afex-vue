<script setup>
import { ref } from 'vue'
import { inject } from 'vue'

const yt_url = ref('')
const $toast = inject('toast')
const video_list = inject('video_list')
const selected_video = inject('selected_video')
const details_modal = inject('details_modal')

function processUrl (){
  //https://www.youtube.com/watch?v=RbmS3tQJ7Os
  let uid = getIDfromURL(yt_url.value)
  let video_data = {}

  //check if valid url
  if (uid == ''){
    $toast.error('El link que ha introducido no es válido');
    return
  }

  //check if bookmark already exists
  if (video_list.value.filter(item => item.uid === uid).length != 0){
    $toast.info('El video ingresado ya existe en la lista de marcadores');
    selected_video.value = video_list.value.filter(item => item.uid === uid)[0]
    details_modal.value.show()
    
    return
  }

  try {
    fetch("https://xyyyukxba8.execute-api.sa-east-1.amazonaws.com/videos/" + uid)
    .then(response => response.json())
    .then(function(data) {
      if (data.items.length == 0){
        $toast.error('El video no existe');
        return
      }

      video_data = {
        'uid': data.items[0].id,
        'title': data.items[0].snippet.title,
        'desc': data.items[0].snippet.description,
        'length': data.items[0].contentDetails.duration
      }

      video_list.value.push(video_data)
      selected_video.value = video_data
      details_modal.value.show()
      //send ajax request
      fetch('https://xyyyukxba8.execute-api.sa-east-1.amazonaws.com/videos', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "uid": video_data.uid, 'title': video_data.title, "desc": video_data.desc, "length": video_data.length})
      })
      $toast.success('Video ingresado');
      yt_url.value = ''
    })
  }
  catch (err){
    $toast.error('Ocurrio un error al ingresar el video');
    console.log(err)
    return
  }
}

function getIDfromURL(url) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return '';
}

</script>

<template>
    <div class="main-container">
        <div class="main-title">
            <h1>Añadir nuevo video</h1>
        </div>
        <div class="input-container"> 
            <input type="text" v-model="yt_url" id="yt_url" placeholder=" Añadir">
            <button id="btn_submit" @click="processUrl">Añadir</button>
        </div>
    </div>
</template>

<style scoped>
#yt_url{
  width: 80%;
  height: 42px;
}
#btn_submit{
  width: 20%;
  height: 42px;
  background-color: rgb(42, 95, 240);
  color: white;
  font-size: 14px;
  border: 0px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.main-title {
  display: flex;
  margin-bottom: 32px;
  align-items: flex-start;
}
.main-container {
  display: flex;
  flex-direction: column;
  width: 80%;
}
.input-container {
  display: flex; 
  flex-direction: row; 
  justify-content: center; 
  width: 100%;
}
</style>