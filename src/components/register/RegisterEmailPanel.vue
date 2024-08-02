<template>
    <div class="flex flex-col flex-col h-fit w-full max-w-full max-h-full space-y-4">
        <div class="flex flex-col space-y-4 px-2">
            <div class="flex flex-col justify-center items-start">
                <p> Pseudo </p>
                <InputView type="text" name="pseudo" />
            </div>
            <div class="flex flex-col justify-center items-start">
                <p> Email </p>
                <InputView type="email" name="email" />
            </div>
        </div>
        <div class="flex justify-between items-center pt-1">
            <ButtonView :bg="false" :click="() => onCancel()">
                <p> Annuler </p>
            </ButtonView>
            <ButtonView :bg="true" :click="() => onRegister()">
                <p> Valider </p>
            </ButtonView>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonView from '../ButtonView.vue';
import InputView from '../InputView.vue';

export default defineComponent({
    components: {
        ButtonView,
        InputView
    },
    props: {
        onRegister: {
            type: Function,
            required: true,
        },
        onCancel: {
            type: Function,
            required: true,
        }
    },
    setup() {
        return {}
    },
    methods: {}
});
</script>