<template>
    <div class="flex flex-col h-full w-full bg-indigo-500">
        <div ref="title-zone" class="relative flex h-1/2 w-full justify-center items-center animate text-slate-50">
            <div class="absolute top-0 left-0 w-full h-full">
                <div class="h-1/2 w-full bg-indigo-400" />
                <svg style="transform:rotate(180deg);" viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor" class="text-indigo-400">
                    <path
                        d="M0,63L30,70C60,77,120,91,180,87.5C240,84,300,63,360,73.5C420,84,480,126,540,133C600,140,660,112,720,101.5C780,91,840,98,900,115.5C960,133,1020,161,1080,164.5C1140,168,1200,147,1260,133C1320,119,1380,112,1440,112C1500,112,1560,119,1620,119C1680,119,1740,112,1800,98C1860,84,1920,63,1980,63C2040,63,2100,84,2160,108.5C2220,133,2280,161,2340,175C2400,189,2460,189,2520,168C2580,147,2640,105,2700,84C2760,63,2820,63,2880,73.5C2940,84,3000,105,3060,122.5C3120,140,3180,154,3240,136.5C3300,119,3360,70,3420,42C3480,14,3540,7,3600,7C3660,7,3720,14,3780,38.5C3840,63,3900,105,3960,115.5C4020,126,4080,105,4140,108.5C4200,112,4260,140,4290,154L4320,168L4320,210L4290,210C4260,210,4200,210,4140,210C4080,210,4020,210,3960,210C3900,210,3840,210,3780,210C3720,210,3660,210,3600,210C3540,210,3480,210,3420,210C3360,210,3300,210,3240,210C3180,210,3120,210,3060,210C3000,210,2940,210,2880,210C2820,210,2760,210,2700,210C2640,210,2580,210,2520,210C2460,210,2400,210,2340,210C2280,210,2220,210,2160,210C2100,210,2040,210,1980,210C1920,210,1860,210,1800,210C1740,210,1680,210,1620,210C1560,210,1500,210,1440,210C1380,210,1320,210,1260,210C1200,210,1140,210,1080,210C1020,210,960,210,900,210C840,210,780,210,720,210C660,210,600,210,540,210C480,210,420,210,360,210C300,210,240,210,180,210C120,210,60,210,30,210L0,210Z">
                    </path>
                </svg>
            </div>
            <div class="z-50 flex flex-col w-fit h-fit max-w-full max-h-full space-y-4">
                <div class="flex justify-evenly items-center space-x-4">
                    <PypollIcon class="w-20 h-20" />
                    <h1 class="text-5xl font-extrabold"> Pypoll </h1>
                </div>
                <div class="flex w-full h-fit justify-center">
                    <h2 class="text-xl">
                        <GetText v-if="pageMode === 'register'" class="show-up"
                            :context="Lang.CreateTranslationContext('register', 'Welcome')" />
                        <GetText v-else class="show-up"
                            :context="Lang.CreateTranslationContext('login', 'WelcomeBack')" />
                    </h2>
                </div>
            </div>
        </div>
        <div ref="register-zone"
            class="relative flex flex-col h-1/2 w-full bg-slate-50 dark:bg-slate-700 rounded-t-3xl animate overflow-hidden p-2">
            <div class="absolute top-0 left-0 w-full h-full">
                <BubbleIcon v-for="(bubble, index) in bubbles" :key="index"
                    class="absolute show-up text-slate-200 dark:text-slate-800"
                    :style="'top: ' + bubble.y + '%; left: ' + bubble.x + '%; animation-delay: ' + index * 100 + 'ms; width: ' + bubble.s + 'px; height: ' + bubble.s + 'px;'" />
            </div>
            <div class="z-50 flex grow w-full h-full transition-all duration-500 ease-out-expo"
                :class="pageMode === 'login' ? '-translate-x-[100%]' : ''">
                <div class="flex grow shrink-0 w-full h-full justify-center items-center">
                    <div class="flex flex-col w-min h-fit max-w-full max-h-full">
                        <div class="show-up" style="animation-delay: 100ms;">
                            <RegisterButton :data="{ name: 'Email' }" :selected="registerMode === 'Email'"
                                :display="!registerMode || registerMode === 'Email'"
                                @click="registerMode = registerMode ? undefined : 'Email'">
                                <RegisterEmailPanel ref="registerEmailPanel" :onRegister="registerEmail"
                                    class="text-slate-700 dark:text-slate-200"
                                    :onCancel="() => registerMode = undefined" />
                            </RegisterButton>
                            <RegisterButton :data="{ name: 'Google' }" :selected="registerMode === 'Google'"
                                :display="!registerMode || registerMode === 'Google'"
                                @click="registerMode = registerMode ? undefined : 'Google'">
                                <p>Work in progress</p>
                            </RegisterButton>
                            <RegisterButton :data="{ name: 'FurWaz' }" :selected="registerMode === 'FurWaz'"
                                :display="!registerMode || registerMode === 'FurWaz'"
                                @click="registerMode = registerMode ? undefined : 'FurWaz'">
                                <p>Work in progress</p>
                            </RegisterButton>
                        </div>
                        <div class="flex justify-center items-center"
                            :class="registerMode === undefined ? 'show-up' : 'hide-down'">
                            <button class="flex p-2">
                                <p class="text-indigo-400">
                                    <GetText
                                        :context="Lang.CreateTranslationContext('register', 'ContinueUnregistered')" />
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex grow shrink-0 w-full h-full justify-center items-center">
                    <div class="flex flex-col w-min h-fit max-w-full max-h-full">
                        <div class="show-up" style="animation-delay: 100ms;">
                            <RegisterButton :loginMode="true" :data="{ name: 'Email' }"
                                :selected="loginMode === 'Email'" :display="!loginMode || loginMode === 'Email'"
                                @click="loginMode = loginMode ? undefined : 'Email'">
                                <LoginEmailPanel ref="loginEmailPanel" :onLogin="loginEmail"
                                    class="text-slate-700 dark:text-slate-200"
                                    :onCancel="() => loginMode = undefined" />
                            </RegisterButton>
                            <RegisterButton :loginMode="true" :data="{ name: 'Google' }"
                                :selected="loginMode === 'Google'" :display="!loginMode || loginMode === 'Google'"
                                @click="loginMode = loginMode ? undefined : 'Google'">
                                <p>Work in progress</p>
                            </RegisterButton>
                            <RegisterButton :loginMode="true" :data="{ name: 'FurWaz' }"
                                :selected="loginMode === 'FurWaz'" :display="!loginMode || loginMode === 'FurWaz'"
                                @click="loginMode = loginMode ? undefined : 'FurWaz'">
                                <p>Work in progress</p>
                            </RegisterButton>
                        </div>
                        <div class="flex justify-center items-center"
                            :class="loginMode === undefined ? 'show-up' : 'hide-down'">
                            <button class="flex p-2">
                                <p class="text-transparent">
                                    - - - - -
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-2 left-2 right-2 z-50 flex justify-end"
                :class="pageMode === 'register' ? 'show-right' : 'hide-left pointer-events-none'">
                <RouterLink to="/login" class="flex space-x-2 justify-center items-center">
                    <p>
                        <GetText :context="Lang.CreateTranslationContext('register', 'AlreadyHaveAnAccount')" />
                    </p>
                    <ArrowRightIcon class="w-4 h-4" />
                </RouterLink>
            </div>
            <div class="absolute bottom-2 left-2 right-2 z-50 flex justify-start"
                :class="pageMode === 'login' ? 'show-left' : 'hide-right pointer-events-none'">
                <RouterLink to="/register" class="flex space-x-2 justify-center items-center">
                    <ArrowLeftIcon class="w-4 h-4" />
                    <p>
                        <GetText :context="Lang.CreateTranslationContext('login', 'DontHaveAnAccount')" />
                    </p>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import GetText from '@/components/GetText.vue';
import User from '@/scripts/User';
import Lang from '@/scripts/Lang';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import PypollIcon from '@/components/PypollIcon.vue';
import RegisterButton from '@/components/register/RegisterButton.vue';
import {
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/vue/24/outline';
import BubbleIcon from '@/components/BubbleIcon.vue';
import RegisterEmailPanel from '@/components/register/RegisterEmailPanel.vue';
import LoginEmailPanel from '@/components/register/LoginEmailPanel.vue';

export default Vue.defineComponent({
    components: {
        ArrowRightIcon,
        ArrowLeftIcon,
        GetText,
        PypollIcon,
        RegisterButton,
        BubbleIcon,
        RegisterEmailPanel,
        LoginEmailPanel
    },
    setup() {
        return {}
    },
    data() {
        return {
            Lang,
            pageMode: this.$route.fullPath.split('/').pop(), // 'register' or 'login'
            registerMode: undefined as string | undefined,
            loginMode: undefined as string | undefined,
            bubbles: [
                { x: 10, y: 5, s: 14 },
                { x: 15, y: 90, s: 20 },
                { x: 5, y: 55, s: 16 },
                { x: 25, y: 20, s: 18 },
                { x: 85, y: 20, s: 14 },
                { x: 35, y: 60, s: 12 },
                { x: 70, y: 40, s: 18 },
                { x: 60, y: 80, s: 22 },
                { x: 90, y: 50, s: 16 },
                { x: 45, y: 2, s: 12 }
            ]
        }
    },
    mounted() {
        const titleZone = this.$refs['title-zone'] as HTMLElement;
        const registerZone = this.$refs['register-zone'] as HTMLElement;

        setTimeout(() => {
            titleZone.style.height = '33%';
            registerZone.style.height = '67%';
        }, 10);
    },
    watch: {
        $route(to, from) {
            this.pageMode = to.fullPath.split('/').pop();
            this.registerMode = undefined;
            this.loginMode = undefined;
        }
    },
    methods: {
        registerWithEmail() {
            if (this.registerMode)
                this.registerMode = undefined;
            else this.registerMode = 'Email';
        },
        registerWithGoogle() {
            if (this.registerMode)
                this.registerMode = undefined;
            else this.registerMode = 'Google';
        },
        registerWithFurWaz() {
            if (this.registerMode)
                this.registerMode = undefined;
            else this.registerMode = 'FurWaz';
        },
        continueUnregistered() {
            this.$router.push({ name: 'content' });
        },

        async registerEmail() {
            const registerEmailPanel = this.$refs['registerEmailPanel'] as any;
            const inputs = {
                pseudo: (registerEmailPanel.$el.querySelector('input[name="pseudo"]') as HTMLInputElement),
                email: (registerEmailPanel.$el.querySelector('input[name="email"]') as HTMLInputElement)
            };

            for (const key in inputs) {
                if (!inputs[key].value) {
                    inputs[key].focus();
                    console.error('Missing field:', key);
                    return;
                }
            }

            const res = await API.Request(ROUTES.USERS.CREATE(
                inputs.pseudo.value,
                inputs.email.value
            ));
            if (res.error) {
                console.error(res.message);
                return;
            }

            const user = new User({ ...res.data.user, token: res.data.token });
            user.save();

            setTimeout(() => {
                this.$router.push({ name: 'content' });
            }, 500);
        },

        async loginEmail() {
            const loginEmailPanel = this.$refs['loginEmailPanel'] as any;
            const inputs = {
                email: (loginEmailPanel.$el.querySelector('input[name="email"]') as HTMLInputElement)
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
