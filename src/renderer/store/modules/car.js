const STORAGE_KEY = 'cars_data_key'

const state = {
    cars: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'),

}

const getters = {
    allCars() {
        let cars = [...state.cars].map(n => {
            return Object.assign({}, n);
        });
        cars.forEach(n => {
            n.totalWXCost = n.wx_records.map(n => n.cost).reduce((n1, n2) => Number(n1) + Number(n2), 0);
            n.totalBXCost = n.bx_records.map(n => n.cost).reduce((n1, n2) => Number(n1) + Number(n2), 0);
        });
        console.log('all cars ', cars);
        return cars;
    },
    wxTargets() {
        return [...(new Set(state.cars
            .map(n => n.wx_records)
            .flat()
            .map(n => n.target).filter(n => n !== undefined)))];
    },
    bxTargets() {
        return [...(new Set(state.cars
            .map(n => n.bx_records)
            .flat()
            .map(n => n.target).filter(n => n !== undefined).concat(['大地', '人保', '太平洋', '平安', '天安', '安盛天平', '太平', '中银', '永安'])))];
    },
    operators() {
        return [...(new Set(state.cars
            .map(n => n.wx_records)
            .flat()
            .map(n => n.operator).filter(n => n !== undefined).concat(state.cars
                .map(n => n.bx_records)
                .flat()
                .map(n => n.operator).filter(n => n !== undefined))))];
    },
    persons() {
        let result = state.cars.map(n => n.owner).concat(getters.operators());
        return [...(new Set(result))];
    },

    recordsByCarid(carid, type) {
        if (type == 0) {
            return state.cars.find(n => n.id === carid).wx_records;
        }
        return state.cars.find(n => n.id === carid).bx_records;
    }
}

const mutations = {
    addcar(state, car) {
        console.log('add car', car);
        car.id = Date.now();
        car.bx_records = [];
        car.wx_records = [];
        car.code = car.code.toUpperCase();
        state.cars.push(car)
    },
    removecar(state, carid) {
        console.log('remove car', carid);
        state.cars.splice(state.cars.findIndex(n => n.id === carid), 1)
    },
    editcar(state, car) {
        let index = state.cars.findIndex(n => n.id === car.id);
        console.log('edit car', index, car)
        if (index > -1) {
            Object.assign(state.cars[index], car);
            console.log('edit car !');
        }
    },

    addrecord(state, {
        carid,
        record,
        type = 0,
    }) {
        console.log(state, type, carid, record);
        record.id = Date.now();
        record.type = type;
        record.cid = carid;
        let obj = state.cars.find(n => n.id === carid);
        if (type === 0) {
            obj.wx_records.push(record);
        } else if (type === 1) {
            obj.bx_records.push(record);
            mutations.reloadBXDQTime(carid);
        }
    },

    updaterecord(state, record) {
        console.log('update record', record.type, record.cid, record);
        let obj = state.cars.find(n => n.id === record.cid);
        if (obj !== undefined) {
            if (record.type === 0) {
                obj.wx_records = obj.wx_records.map(n => {
                    if (n.id === record.id) return record
                    return n;
                });
            } else if (record.type === 1) {
                obj.bx_records = obj.bx_records.map(n => {
                    if (n.id === record.id) return record
                    return n;
                });
                mutations.reloadBXDQTime(carid);
            }
        }
    },
    deleterecord(state, record) {
        console.log('update record', type, carid, records);
        let obj = state.cars.find(n => n.id === record.cid);
        if (obj !== undefined) {
            if (record.type === 0) {
                obj.wx_records = obj.wx_records.filter(n => n.id !== record.id);
            } else if (record.type === 1) {
                obj.bx_records = obj.bx_records.filter(n => n.id !== record.id);
                mutations.reloadBXDQTime(carid);
            }
        }
    },
    reloadBXDQTime(carid) {
        let obj = state.cars.find(n => n.id === carid);
        if (obj.bx_records.length === 0) {
            obj.bxdq_time = '';
        } else if (obj.bx_records.length === 1) {
            obj.bxdq_time = obj.bx_records[0].due_time;
        } else {
            obj.bxdq_time = obj.bx_records.map(r => {
                r.due_time_obj = new Date(r.due_time);
                return r;
            }).sort((a, b) => {
                return b.due_time_obj > a.due_time_obj ? -1 : 1;
            })[obj.bx_records.length - 1].due_time;
        }
    },
}

const actions = {
    addCar({
        commit,
        state
    }, car) {
        commit('addcar', car)
    },
    deleteCar({
        commit
    }, car) {
        commit('removecar', car.id)
    },
    updateCar({
        commit
    }, car) {
        commit('editcar', car);
    },
    getCarDetailByCarid(carid) {
        let obj = this.state.car.cars.find(o => o.id === carid);
    },
    getBXRecrodsByCarid(carid) {
        return getCarDetailByCarid(carid).bx_records || [];
    },
    getWXRecrodsByCarid(carid) {
        return getCarDetailByCarid(carid).wx_records || [];
    },

    addRecord({
        commit
    }, {
        carid,
        record,
        type = 0,
    }) {
        commit('addrecord', {
            carid,
            record,
            type
        });
    },
    updateRecord({
        commit
    }, record) {
        commit('updaterecord', record);
    },

    deleteRecord({
        commit
    }, record) {
        console.log('delete recrod action', record);
        commit('updatewxrecord', record);
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}