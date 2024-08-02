<template>
    <div class="flex flex-col h-full w-full p-4">
        <div class="flex flex-col grow justify-center items-center w-full h-full space-y-4">
            <div class="show-up flex space-x-4">
                <div class="flex justify-center items-center">
                    <img src="/favicon.svg" alt="pypoll icon" class="w-24 h-24">
                </div>
                <div class="flex justify-center items-center">
                    <p class="text-5xl md:text-6xl lg:text-7xl font-extrabold">Pypoll</p>
                </div>
            </div>
        </div>
        <div class="flex show-up delay-1 w-full h-full justify-center items-start">
            <p v-show="loading" class="text-xl font-semibold">
                <GetText :context="Lang.CreateTranslationContext('login', 'EmailLogging')" />
            </p>
            <p v-show="done" class="text-xl font-semibold text-emerald-500">
                <GetText :context="Lang.CreateTranslationContext('login', 'EmailLogged')" />
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import User from '@/scripts/User';
import Lang from '@/scripts/Lang';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import GetText from '@/components/GetText.vue';

export default Vue.defineComponent({
    components: {
        GetText
    },
    setup() {
        return {}
    },
    data() {
        return {
            Lang,
            loading: true,
            done: false
        }
    },
    async mounted() {
        const token = this.$route.query.token;
        if (!token) {
            this.$router.push({ name: 'login' });
            return;
        }

        const res = await API.Request(ROUTES.EMAIL.LOGIN(token as string));
        if (res.error) {
            console.error(res.message);
            this.$router.push({ name: 'login' });
            return;
        }

        new User({ token: res.data }).fetch();
        this.loading = false;
        this.done = true;

        setTimeout(() => {
            this.$router.push({ name: 'content' });
        }, 500);
    }
});
</script>
