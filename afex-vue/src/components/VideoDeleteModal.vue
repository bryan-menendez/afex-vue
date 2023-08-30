<script setup>
import { ref } from 'vue'

const isHidden = ref(true)

function close(){
  isHidden.value = true
}

function show() {
  isHidden.value = false
}

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
                    <slot name="header">¿Seguro que quieres eliminar este video?</slot>
                    <button type="button" class="btn-close" @click="close">X</button>
                </header>
                <footer class="modal-footer">
                    <button type="button" class="btn-cancel" @click="close">Cancelar</button>
                    <button type="button" class="btn-delete" @click="$emit('deleteVideo')">Eliminar</button>
                </footer>
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
    width: 640px;
    height: 210px;
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
    margin-top: 32px;
    font-size: 20px;
  }

  .modal-header {
    position: relative;
    color: #000000;
    justify-content: space-between;
  }

  .modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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
  
  .btn-cancel, .btn-delete {
    width: 164px;
    height: 48px;
    margin-right: 32px;
    margin-top: 32px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 800px;
  }

  .btn-cancel {
    background-color: white;
    border-color: rgb(42, 95, 240);
    color: rgb(42, 95, 240);
  }

  .btn-delete {
    background-color: rgb(42, 95, 240);
    color: white;
    border-color: rgb(42, 95, 240);
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
