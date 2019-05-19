<template>
    <div>
    <v-navigation-drawer
          v-model="drawer"
          absolute
          dark
          temporary
        >
        <v-list>
            <v-list-tile v-for="(item, i) in menuItems" :key="`dw${i}`" :to="item.path">
                <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            </v-list>

        </v-navigation-drawer>
    <v-toolbar dark class="grey darken-4">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
        <v-toolbar-title @click="gomain" class="tologo" v-if="showlogo">
            <img id="logo" height="45" src="../assets/logo.svg" alt="">
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items v-for="(item, i) in menuItems" :key="`mi${i}`" class="hidden-sm-and-down">
          <v-btn :to="item.path" flat>{{item.name}}</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    </div>
</template>

<script>
export default {
    data () {
        return {
            showlogo: false,
            drawer: false,
            menuItems: [
                {name: '0.4 кВ', path: '/load04'},
                {name: '10 кВ', path: '/load10'}
            ]
        }
    },
    methods: {
        gomain() {
            this.$router.push('/')
        }
    },
    mounted () {
        this.showlogo = (this.$router.currentRoute.fullPath == '/') ? false : true;
        this.$router.afterEach((to) => {
            if(to.path == '/')
            this.showlogo = false
            else
            this.showlogo = true
        })
    }
}
</script>

<style scoped>
#logo {
    margin-top: 5px;
}

.tologo {
    cursor: pointer;
}
</style>