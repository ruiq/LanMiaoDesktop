const STORAGE_KEY = 'cars_data_key'

export default store => {
    store.subscribe((mutation, state) => {
        console.log('store data  : ',mutation, state.car.cars)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.car.cars))
    })
}
