<template>
    <div class="show-left flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">
                    <GetText :context="Lang.CreateTranslationContext('settings', 'AccountSettings')" />
                </p>
            </div>
        </div>
        <div class="flex grow max-h-full max-w-full min-h-0 min-w-0 h-full w-full p-4 overflow-auto">
            <div class="flex flex-col h-fit w-full space-y-8">
                <div class="flex flex-col w-full">
                    <div>
                        <h2 class="text-xl font-bold">
                            <GetText :context="Lang.CreateTranslationContext('settings', 'Informations')" />
                        </h2>
                    </div>
                    <div class="flex flex-col space-y-4 p-2 w-full">
                        <div class="flex space-x-2 min-w-full max-w-full h-fit w-full justify-between items-center">
                            <p class="whitespace-nowrap"> Pseudo : </p>
                            <InputView type="text" name="pseudo" :value="User.CurrentUser?.pseudo" class="w-[12em]" />
                        </div>
                        <div class="flex space-x-2 min-w-full max-w-full h-fit w-full justify-between items-center">
                            <p class="whitespace-nowrap"> Email : </p>
                            <InputView type="email" name="email" :value="User.CurrentUser?.email" class="w-[12em]" />
                        </div>
                        <div class="flex justify-between items-center">
                            <span />
                            <ButtonView :bg="true" :class="savable ? '' : 'opacity-50 pointer-events-none'"
                                :onclick="saveUser">
                                <GetText :context="Lang.CreateTranslationContext('verbs', 'Save')" />
                            </ButtonView>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full">
                    <div>
                        <h2 class="text-xl font-bold">
                            <GetText :context="Lang.CreateTranslationContext('settings', 'Actions')" />
                        </h2>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 w-full">
                        <div class="flex flex-col space-y-5 p-4 bordered w-full">
                            <button @click="deleteAccount()"
                                class="flex justify-between items-center min-w-0 max-w-full">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <TrashIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText
                                            :context="Lang.CreateTranslationContext('settings', 'DeleteAccount')" />
                                    </p>
                                </div>
                            </button>
                            <button @click="logout()" class="flex justify-between items-center min-w-0 max-w-full">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <ArrowLeftStartOnRectangleIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText :context="Lang.CreateTranslationContext('settings', 'Logout')" />
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalView ref="modal-delete">
            <div class="flex flex-col justify-center items-center space-y-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-semibold">
                        <GetText :context="Lang.CreateTranslationContext('settings', 'DeleteAccount')" />
                    </p>
                </div>
                <div>
                    <p class="text-lg text-center">
                        <GetText :context="Lang.CreateTranslationContext('settings', 'DeleteAccountConfirm')" />
                    </p>
                </div>
                <span class="flex my-2 h-1 w-full card" />
                <div class="flex h-fit w-full justify-between items-center">
                    <ButtonView @click="($refs['modal-delete'] as any).hide()" :bg="false">
                        <GetText :context="Lang.CreateTranslationContext('verbs', 'Cancel')" />
                    </ButtonView>
                    <ButtonView @click="sendDeleteRequest">
                        <GetText :context="Lang.CreateTranslationContext('verbs', 'Delete')" />
                    </ButtonView>
                </div>
            </div>
        </ModalView>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '@/components/BackButtonView.vue';
import ButtonView from '@/components/ButtonView.vue';
import {
    ArrowLeftStartOnRectangleIcon,
    ChevronRightIcon,
    TrashIcon
} from '@heroicons/vue/24/outline';
import Lang from '@/scripts/Lang';
import GetText from '@/components/GetText.vue';
import { Browser } from '@capacitor/browser';
import InputView from '@/components/InputView.vue';
import User from '@/scripts/User';
import ModalView from '@/components/ModalView.vue';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        ButtonView,
        GetText,
        InputView,
        ChevronRightIcon,
        ArrowLeftStartOnRectangleIcon,
        TrashIcon,
        ModalView
    },
    setup() {
        return {
            Lang,
            User,
            savable: false,
            languages: Lang.getLanguages(),
            currentLanguage: Lang.getLanguage()
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        setInterval(() => {
            this.savable = this.canSaveUser();
            this.$forceUpdate();
        }, 500);
    },
    methods: {
        async browseUrl(url: string) {
            return await Browser.open({ url });
        },
        changeLanguage(language: string) {
            Lang.setLanguage(language);
        },
        deleteAccount() {
            (this.$refs['modal-delete'] as any).show();
        },
        async sendDeleteRequest() {
            const res = await API.RequestLogged(ROUTES.USERS.ME.DELETE());
            if (res.error) {
                console.error(res.message);
            } else {
                User.Forget();
            }
        },
        canSaveUser() {
            const email = document.querySelector('input[name="email"]') as HTMLInputElement;
            const pseudo = document.querySelector('input[name="pseudo"]') as HTMLInputElement;
            if (email && email.value && pseudo && pseudo.value) {
                if ((email.value !== User.CurrentUser?.email || pseudo.value !== User.CurrentUser?.pseudo))
                    return true;
            }
            return false;
        },
        async saveUser() {
            if (!this.canSaveUser()) return;
            const emailValue = (document.querySelector('input[name="email"]') as HTMLInputElement).value;
            const pseudoValue = (document.querySelector('input[name="pseudo"]') as HTMLInputElement).value;

            const res = await API.RequestLogged(ROUTES.USERS.ME.UPDATE(pseudoValue, emailValue));
            if (res.error) {
                console.error(res.message);
            } else {
                User.CurrentUser?.update(res.data);
            }
        },
        logout() {
            User.Forget();
        }
    }
});
</script>
