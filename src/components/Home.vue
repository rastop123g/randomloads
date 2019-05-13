<template>
    <div id="home">
        <img id="logo" height="" src="../assets/mainlogo.svg" alt="">
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
#home {
    height: 100%;
    background-color: #212121;
    display: grid;
    align-items: center;
    justify-items: center;
}

#logo {
    height: 80%;
}

@media only screen and (max-device-width: 480px) {
    #logo {
        width: 100%;
        height: min-content;
    }
}
</style>
