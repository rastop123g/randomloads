<template>
    <div class="schema">
        <canvas :id="`canvasline${numline}`" :width="width" :height="height" ref="graph"></canvas>
    </div>
</template>

<script>
export default {
    props: ['width', 'height', 'schema', 'numline'],
    data() {
        return {
            startx: 5,
            radius: 15,
        }
    },
    computed: {
        starty() {
            return this.height / 2
        },
        distanceX1() {
            return (this.width - 2 * this.radius - this.distanceX2 - 10) / this.schema.length
        },
        distanceX2(){
            return this.radius * 2
        },
        distanceY() {
            return (this.height - 10 - 2 * this.radius) / (2 * Math.max(...this.schema))
        }
    },
    watch: {
        schema() {
            this.draw()
        }
    },
    methods: {
        init() {
            this.radius = 15;
        },
        draw() {
            console.log(this.schema)
            let counter = 0;
            let seCounter = 0
            let canvas = this.$refs.graph
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let x = this.startx;
            let y = this.starty;
            let directionX = -1;
            let directionY = -1;
            let backX, backY
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.closePath()
            this.schema.forEach((item, num) => {
                counter += 1
                ctx.fillStyle = "#000";
                ctx.font = "15px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.beginPath()
                ctx.moveTo(x, y)
                x += this.distanceX1
                ctx.lineTo(x, y)
                ctx.moveTo(x, y)
                ctx.fillText(`${num + 1}`, x, (directionY == 1) ? y - 15 : y + 15)
                backX = x
                for(let i = 0; i < item; i++) {
                    y += this.distanceY * directionY
                    ctx.lineTo(x, y)
                    ctx.moveTo(x, y);
                    if(item > 1){
                        ctx.fillText(`${num + 1}.${i + 1}`, (directionX == 1) ? x - 15 : x + 15, y)
                    }
                    x += this.distanceX2 * directionX
                    ctx.lineTo(x, y)
                    x += (directionX == 1) ? this.radius * 2 : 0
                    ctx.moveTo(x, y);
                    ctx.arc(x - this.radius, y, this.radius, 0,Math.PI*2,true)
                    directionX *= -1;
                    x = backX
                    ctx.moveTo(x, y);
                }
                y = this.starty
                ctx.moveTo(x, y);
                ctx.closePath()
                ctx.stroke()
                directionY *= -1;
            })
        }
    },
    mounted() {
        this.draw()
    }
}
</script>

<style scoped>
.schema {
    overflow: auto;
    display: grid;
    justify-content: center;
}

@media only screen and (max-device-width: 700px) {
    .schema {
        display: block;
    }
}
/* canvas{ 
    margin-left: auto;
    margin-right: auto;
} */
</style>
