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
            <p class="show-up delay-1 text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-500">
                <GetText :context="Lang.CreateTranslationContext('login', 'WelcomeBack')" />
            </p>
        </div>
        <div v-show="!loginMode" class="flex flex-col show-up delay-2 flex w-full h-full rounded-2xl py-8">
            <div class="flex flex-col justify-center items-center p-4 space-y-8 w-full">
                <div class="flex flex-col w-fit space-y-4 mx-auto">
                    <button v-for="(option, index) in loginOptions" :key="option.name"
                        @click="() => option.disabled ? '' : option.onclick()"
                        class="show-up flex rounded-md border-2 border-slate-200 dark:border-slate-600 w-full h-fit p-4 space-x-2"
                        :class="option.disabled ? ' text-slate-500 pointer-events-none ' : ' '"
                        :style="'animation-delay: ' + (index * 0.1 + 0.2) + 's'">
                        <div class="flex justify-center items-center h-full">
                            <ChevronRightIcon class="w-5 h-5" />
                        </div>
                        <p class="flex pt-0.5">
                            <GetText :context="Lang.CreateTranslationContext('login', 'LoginWith')" />
                            <span class="font-bold pl-1.5">{{ option.name }}</span>
                        </p>
                    </button>
                </div>
            </div>
        </div>
        <div v-show="loginMode === 'email'" class="w-full h-full">
            <div class="show-left w-full px-4 space-y-4">
                <div class="space-y-2">
                    <div>
                        <p class="text-slate-600 dark:text-slate-300">
                            <GetText :context="Lang.CreateTranslationContext('register', 'Email')" />
                        </p>
                        <div class="flex bordered p-1">
                            <input type="email" name="email" class="w-full outline-none bg-transparent px-1">
                        </div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <ButtonView :bg="false" class="px-0" @click="loginMode = undefined">
                        <div class="flex space-x-2 justify-center items-center">
                            <ChevronLeftIcon class="w-5 h-5" />
                            <GetText :context="Lang.CreateTranslationContext('verbs', 'Cancel')" />
                        </div>
                    </ButtonView>
                    <ButtonView :click="loginEmail">
                        <div class="flex space-x-2 justify-center items-center">
                            <GetText :context="Lang.CreateTranslationContext('verbs', 'Validate')" />
                            <ChevronRightIcon class="w-5 h-5" />
                        </div>
                    </ButtonView>
                </div>
            </div>
        </div>
        <div class="show-left flex justify-start">
            <button @click="$router.push({ name: 'register' })" class="flex space-x-2">
                <div class="flex justify-center items-center h-full">
                    <ArrowLeftIcon class="w-4 h-4" />
                </div>
                <div class="flex justify-center items-center h-full">
                    <p>
                        <GetText :context="Lang.CreateTranslationContext('login', 'DontHaveAnAccount')" />
                    </p>
                </div>
            </button>
        </div>
        <ModalView ref="emailModal">
            <div class="flex flex-col justify-center items-center space-y-4">
                <p class="text-xl font-bold pb-4">
                    <GetText :context="Lang.CreateTranslationContext('login', 'LookMails')" />
                </p>
                <p class="text-center">
                    <GetText :context="Lang.CreateTranslationContext('login', 'LookMailsDesc1')" />
                </p>
                <p class="text-center">
                    <GetText :context="Lang.CreateTranslationContext('login', 'LookMailsDesc2')" />
                </p>
            </div>
        </ModalView>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '../components/BackButtonView.vue';
import ButtonView from '../components/ButtonView.vue';
import { ChevronLeftIcon, ArrowLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import GetText from '@/components/GetText.vue';
import Lang from '@/scripts/Lang';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import ModalView from '@/components/ModalView.vue';
import User from '@/scripts/User';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        ArrowLeftIcon,
        ChevronRightIcon,
        ChevronLeftIcon,
        GetText,
        ButtonView,
        ModalView
    },
    setup() {
        return {}
    },
    data() {
        return {
            Lang,
            loginMode: undefined as string | undefined,
            loginOptions: [
                {
                    name: "Email",
                    disabled: false,
                    onclick: () => this.loginWithEmail()
                },
                {
                    name: "Google",
                    disabled: true,
                    onclick: () => this.loginWithGoogle()
                },
                {
                    name: "FurWaz",
                    disabled: true,
                    onclick: () => this.loginWithFurWaz()
                }
            ]
        }
    },
    methods: {
        loginWithEmail() {
            this.loginMode = 'email';
        },
        loginWithGoogle() {

        },
        loginWithFurWaz() {

        },

        async loginEmail() {
            const inputs = {
                email: (document.querySelector('input[name="email"]') as HTMLInputElement)
            };

            for (const key in inputs) {
                if (!inputs[key].value) {
                    inputs[key].focus();
                    console.error('Missing field:', key);
                    return;
                }
            }

            const res = await API.Request(ROUTES.EMAIL.SENDMAIL(
                inputs.email.value
            ));
            if (res.error) {
                console.error(res.message);
                return;
            }

            const modal = (this.$refs['emailModal'] as any);
            modal.show();

            this.loginUsingPollingToken(res.data);
        },
        async loginUsingPollingToken(token) {
            const res = await API.Request(ROUTES.AUTH.LOGIN(token));
            if (res.status === 504) {
                this.loginUsingPollingToken(token);
                return;
            }

            if (res.error) {
                console.error(res.message);
                return;
            }

            new User({ token: res.data }).fetch();
            this.$router.push({ name: 'content' });
            (this.$refs['emailModal'] as any)?.hide();
        }
    }
});
</script>
