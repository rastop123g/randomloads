<template>
  <v-app id="main" class="grey lighten-5">
    <toolbar/>
    <v-content>
      <transition name="bounce">
      <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import Toolbar from './components/Toolbar'

export default {
  components: {
    Toolbar
  }
}
</script>

<style>
html {
  overflow: auto;
}
</style>

<style scoped>
.bounce-enter-active {
  animation: bounce-in .3s;
}
.bounce-leave-active {
  animation: bounce-in .3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
