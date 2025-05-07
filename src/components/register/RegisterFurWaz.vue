<template>
    <button @click="onclick"
        class="flex w-full h-full justify-center items-center p-2 space-x-2 rounded-lg shadow-lg bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200
        hover:border-2 border-slate-300 hover:dark:border-slate-500 transition-all hover:text-slate-800 hover:dark:text-slate-50">
        <div class="flex justify-center items-center h-full w-16">
            <img src="https://furwaz.com/icon.png" alt="FurWaz Logo" class="w-12 h-12">
        </div>
        <div class="flex justify-center items-center h-full grow">
            <p class="w-fit h-fit">
                <slot />
            </p>
        </div>
    </button>
    <ModalView ref="conflictModal">
        <div class="flex flex-col w-fit h-fit max-w-[50em] space-y-2">
            <div class="pb-2">
                <p class="text-xl font-semibold text-center">
                    Il existe déjà un compte
                    <span v-if="conflict?.pseudo"> avec le pseudo <b class="text-indigo-400">{{ conflict.pseudo }}</b>
                    </span>
                    <span v-if="conflict?.pseudo && conflict.email"> et </span>
                    <span v-if="conflict?.email"> avec l'email <b class="text-indigo-400">{{ conflict.email }}</b>
                    </span>
                    !
                </p>
            </div>
            <br>
            <p>
                Si vous avez déjà créé un compte sur Pypoll, associez votre compte FurWaz dans les paramètres !
            </p>
            <br>
            <p>
                Sinon, modifiez vos informations pour créer un nouveau compte.
            </p>
            <div class="flex flex-col py-4 space-y-4">
                <div v-if="conflict?.pseudo" class="flex space-x-2 justify-center items-center">
                    <p> Pseudo </p>
                    <InputView type="text" name="conflictPseudo" :value="conflict?.pseudo" />
                </div>
                <div v-if="conflict?.email" class="flex space-x-2 justify-center items-center">
                    <p> Email </p>
                    <InputView type="text" name="conflictEmail" :value="conflict?.email" />
                </div>
            </div>
            <div class="flex w-fukk h-fit py-2">
                <span class="flex h-1 w-full rounded-full bg-slate-200 dark:bg-slate-600" />
            </div>
            <div class="flex w-full h-fit justify-between items-center">
                <ButtonView @click="cancelLogin" :bg="false"> Annuler </ButtonView>
                <ButtonView @click="resendRegister"> Valider </ButtonView>
            </div>
        </div>
    </ModalView>
</template>

<script lang="ts">
import FurWazPortal from '@/scripts/FurWazPortal';
import User from '@/scripts/User';
import { defineComponent } from 'vue'
import ModalView from '../ModalView.vue';
import InputView from '../InputView.vue';
import ButtonView from '../ButtonView.vue';
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';

export default defineComponent({
    name: 'RegisterFurWaz',
    components: {
        ModalView,
        InputView,
        ButtonView
    },
    setup() {
        return {
            user: null as User | null,
            conflict: null as any,
            portalToken: null as string | null
        }
    },
    methods: {
        onclick() {
            const portal = new FurWazPortal();
            portal.on('ready', () => {
                portal.open();
                this.portalToken = portal.token;
            });
            portal.on('success', async (data) => {
                this.onAccepted(data);
            });
            portal.on('error', (error) => {
                this.onRejected(error);
            });
        },
        async onRejected(error: any) {
            if (error.status !== 409) {
                console.error(error);
                return;
            }

            this.conflict = error.data;
            const conflictModal = this.$refs.conflictModal as any;
            conflictModal.show();
        },
        async onAccepted(data: any) {
            this.user = new User({ token: data.token });
            if (!this.user) return;

            await this.user.fetch();
            this.user.save();
            this.$router.push({ name: 'content' });
        },
        cancelLogin() {
            this.conflict = null;
            const conflictModal = this.$refs.conflictModal as any;
            conflictModal.hide();
        },
        async resendRegister() {
            if (!this.portalToken) return;

            this.conflict = null;
            const conflictModal = this.$refs.conflictModal as any;
            conflictModal.hide();

            const pseudo = window.document.querySelector("input[name=conflictPseudo]") as any;
            const email = window.document.querySelector("input[name=conflictEmail]") as any;

            console.log("conflictModal ", conflictModal.$el);
            console.log("pseudo ", pseudo);
            console.log("email ", email);

            const res = await API.Request(ROUTES.AUTH.FURWAZ.TOKEN(
                this.portalToken,
                pseudo?.value.trim().length > 0 ? pseudo?.value.trim() : undefined,
                email?.value.trim().length > 0 ? email?.value.trim() : undefined
            ));

            if (res.error) {
                this.onRejected(res);
                return;
            }
            this.onAccepted(res.data);
        }
    }
});
</script>