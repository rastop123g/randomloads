<template>
    <div class="load10">
        <div></div>
        <div style="overflow: auto">
            <h1 class=".font-weight-medium text-xs-center">Расчет нагрузок 10кВ</h1>
            <div class="line" v-for="(line, index) in lineload" :key="`line${index}`">
            <div class="inpcontainer">
                <div><h3>Линия {{index + 1}}</h3></div>
                <div></div>
                <div></div>
            </div>
            <div class="inpcontainer">
                <div>Дневная нагрузка</div>
                <div>Вечерняя нагрузка</div>
                <div></div>
            </div>
            <div class="inpcontainer" v-for="(tp, count) in line" :key="`tp${count}`">
                <div><v-text-field
                    v-model="tp.Pd"
                    label="Pд, кВт"
                    solo
                    ></v-text-field></div>
                <div><v-text-field
                    v-model="tp.Pv"
                    label="Pв, кВт"
                    solo
                    ></v-text-field></div>
                <div>
                    <v-btn v-if="line.length == count + 1" @click="addtp(index)" flat icon color="indigo">
                      <v-icon>add</v-icon>
                    </v-btn>
                    <v-btn v-if="line.length > count + 1" @click="cleartp(index, count)" flat icon color="red darken-3">
                      <v-icon>clear</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-btn @click="deleteline(index)" block color="red darken-3" dark>Удалить линию</v-btn>
            </div>
            <v-btn @click="addline" block color="indigo" dark>Добавить линию</v-btn>
            <v-btn block color="green accent-4" dark @click="createSchemes">Расчитать</v-btn>
            <p class="font-italic">*Нажимайте повторно для перегенерации схем</p>
            <div class="scroll" v-for="(line, i) in result" :key="`table${i}`">
                <h3>Линия {{i + 1}}</h3>
                <schema height="300" width="700" :numline="i" :schema="schemes[i]"></schema>
                  <v-data-table
                  :id="`line${i + 1}`"
                  v-if="ready_table"
                  disable-initial-sort
                  :headers="headers"
                  :items="line"
                  class="elevation-1"
                  hide-actions
                  :sort-icon="''"
                >
                <template v-slot:items="props">
                  <td class="text-xs-center">{{ props.item.name }}</td>
                  <td class="text-xs-center">{{ props.item.sumPd }}</td>
                  <td class="text-xs-center">{{ props.item.sumPv }}</td>
                  <td class="text-xs-center">{{ props.item.k_o }}</td>
                  <td class="text-xs-center">{{ props.item.cosd }}</td>
                  <td class="text-xs-center">{{ props.item.cosv }}</td>
                  <td class="text-xs-center">{{ props.item.sumSd }}</td>
                  <td class="text-xs-center">{{ props.item.sumSv }}</td>
                  <td class="text-xs-center">{{ props.item.Id }}</td>
                  <td class="text-xs-center">{{ props.item.Iv }}</td>
                </template>
                </v-data-table>
              </div>
              <v-btn v-if="ready_table" block color="green accent-4" dark @click="savetable">Сохранить в Excel</v-btn>
              <p v-if="ready_table" class="font-italic">*Каждая линия будет сохранена в отдельной вкладке снизу.</p>
        </div>
        <div></div>
    </div>
</template>

<script>
import Schema from './Schema'
import { saveAs } from 'file-saver';
import xlsx from 'xlsx'

export default {
    data() {
        return {
            lineload: [
                [
                    {
                        Pd: null,
                        Pv: null
                    }
                ]
            ],
            schemes: [],
            result: [],
            headers: [
                {text: 'Участок', value: 'name'},
                {text: 'Psum д', value: 'sumPd'},
                {text: 'Psum в', value: 'sumPv'},
                {text: 'Ko', value: 'k_o'},
                {text: 'cos д', value: 'cosd'},
                {text: 'cos в', value: 'cosv'},
                {text: 'S д', value: 'sumSd'},
                {text: 'S в', value: 'sumSv'},
                {text: 'I д', value: 'Id'},
                {text: 'I в', value: 'Iv'}
            ],
            ready_table: false
        }
    },
    methods: {
        addline() {
            this.lineload.push([
                {
                    Pd: null,
                    Pv: null
                }
            ])
        },
        deleteline(index) {
            this.lineload.splice(index, 1)
        },
        addtp(index) {
            this.lineload[index].push({
                Pd: null,
                Pv: null
            })
        },
        cleartp(index, count) {
            this.lineload[index].splice(count, 1)
        },
        createSchemes() {
            this.schemes = []
            this.result = []
            function summ(arr) {
                let sum = 0
                arr.forEach(el => {
                    sum += el
                })
                return sum
            }
            this.lineload.forEach((line, i) => {
                let len = line.length
                let scheme = [1]
                while(true) {
                    let current = Math.ceil(Math.random() * 3)
                    if(len == summ(scheme))
                        break
                    if(current > len - summ(scheme)) {
                        continue
                    } else {
                        scheme.push(current)
                    }
                }
                this.schemes.push(scheme)
            })
            this.calc();
            this.ready_table = true
        },
        calc() {
            let cosd = 0.8
            let cosv = 0.83
            let k_r = 1.3
            this.schemes.forEach((schema, iline) => {
                this.result.push([]);
                let lineln = this.lineload[iline].length;
                let count = 0
                let i = schema.length - 1;
                let maxpoint = schema.length;
                while(true) {
                    let current = schema[i]
                    count += current
                    if(current > 1) {
                        for(let j = current - 1; j >= 0; j--){
                            let sumPd = this.summ_P(this.lineload[iline].slice(lineln - count, lineln - count + (current - j)), 'Pd') * k_r * this.k_o(current - j)
                            let sumPv = this.summ_P(this.lineload[iline].slice(lineln - count, lineln - count + (current - j)), 'Pv') * k_r * this.k_o(current - j)
                            let sumSd = sumPd / cosd
                            let sumSv = sumPv / cosv
                            let Id = sumSd / (Math.sqrt(3) * 10)
                            let Iv = sumSv / (Math.sqrt(3) * 10)
                            this.result[this.result.length - 1].push({
                                name: String(maxpoint).concat('.', String(j + 1), ' - ', String(maxpoint), (j == 0) ? '' : '.'.concat(String(j))), // Например 3.2 - 3.1
                                sumPd: Math.round(sumPd*100) / 100,
                                sumPv: Math.round(sumPv*100) / 100,
                                k_o: this.k_o(current - j),
                                cosd: Math.round(cosd*100) / 100,
                                cosv: Math.round(cosv*100) / 100,
                                sumSd: Math.round(sumSd*100) / 100,
                                sumSv: Math.round(sumSv*100) / 100,
                                Id: Math.round(Id*100) / 100,
                                Iv: Math.round(Iv*100) / 100
                            })
                        }
                    }
                    let sumPd = this.summ_P(this.lineload[iline].slice(lineln - count), 'Pd') * k_r * this.k_o(count)
                    let sumPv = this.summ_P(this.lineload[iline].slice(lineln - count), 'Pv') * k_r * this.k_o(count)
                    let sumSd = sumPd / cosd
                    let sumSv = sumPv / cosv
                    let Id = sumSd / (Math.sqrt(3) * 10)
                    let Iv = sumSv / (Math.sqrt(3) * 10)
                    this.result[this.result.length - 1].push({
                        name: `${maxpoint} - ${maxpoint - 1}`,
                        sumPd: Math.round(sumPd*100) / 100,
                        sumPv: Math.round(sumPv*100) / 100,
                        k_o: this.k_o(count),
                        cosd: Math.round(cosd*100) / 100,
                        cosv: Math.round(cosv*100) / 100,
                        sumSd: Math.round(sumSd*100) / 100,
                        sumSv: Math.round(sumSv*100) / 100,
                        Id: Math.round(Id*100) / 100,
                        Iv: Math.round(Iv*100) / 100
                    })
                    if(i == 0) {
                        break;
                    }
                    i--;
                    maxpoint--;
                }
            })
        },
        summ_P(mass, lit) {
            let sum = 0
            mass.forEach(item => {
                sum += this.toN(item[lit])
            })
            return sum
        },
        toN(s) {
            if(s === undefined) {
                return 0
            } else if(typeof s === 'string') {
                return Number(s.replace(',', '.'))
            } else if(typeof s === 'number') {
                return s;
            }
        },
        k_o(num) {
            let k = [[1, 1], [2, 0.9], [3, 0.85], [5, 0.8], [10, 0.75], [20, 0.7], [25, 0.65]]
            let buffer_min = [1, 1]
            let buffer_max = [25, 0.65]
            let xint, yint, percent, result;
            if(num >= 25) 
                return 0.65
            k.some(item => {
                if(num > item[0]) {
                    buffer_min = [item[0], item[1]]
                } else if(num == item[0]) {
                    result = item[1]
                    return true
                } else {
                    buffer_max = [item[0], item[1]]
                    xint = buffer_max[0] - buffer_min[0]
                    yint = buffer_max[1] - buffer_min[1]
                    percent = (num - buffer_min[0]) / xint
                    result = buffer_min[1] + yint * percent
                    return true
                }
            })
            return result
        },
        savetable() {
            var wb = xlsx.utils.book_new();
            for(let i = 0; i < this.result.length; i++) {
                wb.SheetNames.push(`line${i + 1}`);
                wb.Sheets[`line${i + 1}`] = xlsx.utils.table_to_sheet(document.querySelector(`#line${i + 1} div table`))
            }
            xlsx.writeFile(wb, '10kV.xlsx')
        }
    },
    components: {
        Schema
    }
}
</script>

<style scoped>
.load10 {
    height: 100%;
    display: grid;
    align-content: center;
    justify-content: center;
    grid-template-columns: 2fr 4fr 2fr;
}
.inpcontainer {
    margin-top:5px;
    display: grid;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    grid-template-columns: 3fr 3fr min-content
}


@media only screen and (max-device-width: 600px) {
    .load10 {
        grid-template-columns: 1fr 20fr 1fr;
    }

    .inpcontainer {
        grid-template-columns:3fr 3fr min-content
    }
}
</style>
