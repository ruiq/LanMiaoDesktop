<template>
    <v-layout row wrap>
        <v-flex d-flex sm12>
            <v-layout row wrap>
                <v-flex >
                    <v-layout row wrap >
                        <v-flex d-flex
                                xs12>
                            <!-- <StatsIcon></StatsIcon> -->
                            <Car></Car>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>

    import Car from './components/Car/car'

    export default {
        components: {
            Car,
        },
        data: () => ({
            dialogAdd: false
        }),
        mounted() {

        },
        methods:{

        }
    }
</script>

<style>

</style>
