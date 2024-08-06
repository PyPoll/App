<template>
    <div class="show-left flex flex-col h-full w-full p-2 md:p-3 lg:p-4">
        <div class="relative flex h-fit w-full">
            <div class="absolute flex h-full justify-center items-center p-2">
                <BackButtonView />
            </div>
            <div class="flex grow w-full h-full justify-center items-center p-4">
                <p class="text-2xl md:text-3xl lg:text-4xl font-bold">
                    <GetText :context="Lang.CreateTranslationContext('settings', 'Settings')" />
                </p>
            </div>
        </div>
        <div class="flex grow max-h-full max-w-full min-h-0 min-w-0 h-full w-full p-4 overflow-auto">
            <div class="flex flex-col h-fit w-full space-y-8">
                <div class="flex flex-col w-full">
                    <div>
                        <h2 class="text-xl font-bold">
                            <GetText :context="Lang.CreateTranslationContext('settings', 'Account')" />
                        </h2>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 w-full">
                        <div class="flex flex-col space-y-4 p-4 bordered w-full">
                            <button @click="this.$router.push({ name: 'settings-account' })"
                                class="flex justify-between items-center min-w-0 max-w-full">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <UserIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText :context="Lang.CreateTranslationContext('settings', 'Informations')" />
                                    </p>
                                </div>
                                <div class="w-fit h-fit">
                                    <ChevronRightIcon class="w-6 h-6" />
                                </div>
                            </button>
                            <div class="flex justify-between items-center min-w-0 max-w-full">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <LanguageIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText :context="Lang.CreateTranslationContext('settings', 'Language')" />
                                    </p>
                                </div>
                                <div class="w-fit h-fit">
                                    <SelectView :options="languages" :onChange="changeLanguage"
                                        :value="currentLanguage" />
                                </div>
                            </div>
                            <button @click="() => { }"
                                class="flex justify-between items-center min-w-0 max-w-full opacity-50 pointer-events-none">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <BellIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText
                                            :context="Lang.CreateTranslationContext('settings', 'Notifications')" />
                                    </p>
                                </div>
                                <div class="w-fit h-fit">
                                    <ChevronRightIcon class="w-6 h-6" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-full">
                    <div>
                        <h2 class="text-xl font-bold">
                            <GetText :context="Lang.CreateTranslationContext('settings', 'Other')" />
                        </h2>
                    </div>
                    <div class="flex flex-col space-y-2 p-2 w-full">
                        <div class="flex flex-col space-y-4 p-4 bordered w-full">
                            <button @click="browseUrl('https://pypoll.com/privacy')"
                                class="flex justify-between items-center min-w-0 max-w-full">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <DocumentTextIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText
                                            :context="Lang.CreateTranslationContext('settings', 'PrivacyPolicy')" />
                                    </p>
                                </div>
                                <div class="w-fit h-fit">
                                    <ChevronRightIcon class="w-6 h-6" />
                                </div>
                            </button>
                            <button @click="browseUrl('https://pypoll.com/terms')"
                                class="flex justify-between items-center min-w-0 max-w-full">
                                <div class="flex space-x-2 min-w-0 max-w-full">
                                    <div class="flex">
                                        <DocumentTextIcon class="w-6 h-6" />
                                    </div>
                                    <p class="whitespace-nowrap text-ellipsis overflow-hidden">
                                        <GetText
                                            :context="Lang.CreateTranslationContext('settings', 'TermsOfService')" />
                                    </p>
                                </div>
                                <div class="w-fit h-fit">
                                    <ChevronRightIcon class="w-6 h-6" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import BackButtonView from '@/components/BackButtonView.vue';
import ButtonView from '@/components/ButtonView.vue';
import {
    BellIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    LanguageIcon,
    UserIcon
} from '@heroicons/vue/24/outline';
import Lang from '@/scripts/Lang';
import GetText from '@/components/GetText.vue';
import { Browser } from '@capacitor/browser';
import SelectView from '@/components/SelectView.vue';

export default Vue.defineComponent({
    components: {
        BackButtonView,
        ButtonView,
        GetText,
        ChevronRightIcon,
        UserIcon,
        LanguageIcon,
        BellIcon,
        DocumentTextIcon,
        SelectView
    },
    setup() {
        return {
            Lang,
            languages: Lang.getLanguages(),
            currentLanguage: Lang.getLanguage()
        }
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {
        async browseUrl(url: string) {
            return await Browser.open({ url });
        },
        changeLanguage(language: string) {
            Lang.setLanguage(language);
        }
    }
});
</script>
