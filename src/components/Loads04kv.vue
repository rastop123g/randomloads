<template>
        <div id="centergrid">
        <div id="container">
            <div></div>
            <div><h2 class=".font-weight-medium text-xs-center">Генератор нагрузок 0.4 кВ</h2></div>
            <div></div>
            <div></div>
            <div id="blockinp">
                <v-text-field v-model="inpvalue"
                    label="Введите номинальные напряжения через пробел"
                ></v-text-field>
                <v-btn @click="generate" flat icon color="indigo darken-4">
                  <v-icon>arrow_forward_ios</v-icon>
                </v-btn>
              </div>
              <div></div>
              <div></div>
              <div class="scroll">
                  <v-data-table
                  v-if="ready_table"
                  disable-initial-sort
                  :headers="headers"
                  :items="result"
                  class="elevation-1"
                  hide-actions
                >
                <template v-slot:items="props">
                  <td class="text-xs-center">{{ props.item.Pd }}</td>
                  <td class="text-xs-center">{{ props.item.Pv }}</td>
                  <td class="text-xs-center">{{ props.item.cosd }}</td>
                  <td class="text-xs-center">{{ props.item.cosv }}</td>
                  <td class="text-xs-center">{{ props.item.Sd }}</td>
                  <td class="text-xs-center">{{ props.item.Sv }}</td>
                  <td class="text-xs-center">{{ props.item.Sn }}</td>
                </template>
                </v-data-table>
              </div>
              <div></div>
              <!-- <div></div>
              <div></div>
              <div></div> -->
        </div>
        </div>
</template>

<script>
export default {
    data () {
        return {
            inpvalue: '',
            ready_table:false,
            headers: [
                {text: 'P дневная', value: 'Pd'},
                {text: 'P вечерняя', value: 'Pv'},
                {text: 'cos дневной', value: 'cosd'},
                {text: 'cos вечерний', value: 'cosv'},
                {text: 'S Дневная', value: 'Sd'},
                {text: 'S Вечерняя', value: 'Sv'},
                {text: 'S транс', value: 'Sn'}
            ],
            result: []
        }
    },
    methods: {
        generate() {
            this.ready_table = false
            this.result = []
            const nominalPower = [0, 25, 40, 63, 100, 160, 250, 400, 630, 1000]
            let mass = this.inpvalue.split(' ')
            mass.forEach(item => {
                let index = 0
                let power = Number(item)
                nominalPower.forEach((np, i) => {
                    if(np == power)
                    index = i;
                })
                let Sv = nominalPower[index - 1] + (nominalPower[index] - nominalPower[index - 1])*(Math.random()*0.78 + 0.2);
                let Sd = Sv + (nominalPower[index] - Sv) * Math.random() -
                    (nominalPower[index] - Sv) * (0.8 + 0.2 * Math.random());
                let cosv = 0.86 + 0.05 * Math.random();
                let cosd = cosv + 0.03 * (0.3 + 0.7* Math.random()) - 0.03 * (0.7 + 0.3* Math.random())
                let Pv = Sv * cosv
                let Pd = Sd * cosd
                this.result.push({
                    Sn: power,
                    Pd: Math.round(Pd *100)/100,
                    Pv: Math.round(Pv *100)/100,
                    cosd: Math.round(cosd *100)/100,
                    cosv: Math.round(cosv *100)/100,
                    Sd: Math.round(Sd *100)/100,
                    Sv: Math.round(Sv *100)/100,
                })
            })
            console.log(this.result)
            this.ready_table = true
        }
    }
}
</script>

<style scoped>
#blockinp {
    display: grid;
    grid-template-columns: 1fr min-content;
    align-items: center;
}

h2 {
    margin-top: 10px;
}
</style>

<style>
.scroll {
    overflow: auto;
}

#centergrid {
    height: 100%;
    width: 100%;
    display: grid;
    align-items: center;
    justify-items: center;
}

#container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    grid-template-rows: repeat(3, min-content);
    grid-row-gap: 10px;
}

@media only screen and (max-device-width: 480px) {
#container {
    grid-template-columns: 1fr 10fr 1fr;
}
}
</style>
