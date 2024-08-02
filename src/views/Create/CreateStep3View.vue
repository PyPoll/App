<template>
    <div class="flex flex-col grow min-h-0 max-h-full h-full w-full space-y-8">
        <!-- TYPE OF ANSWERS SECTION -->
        <div class="flex flex-col h-fit w-full space-y-2">
            <div class="flex justify-start items-center space-x-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-bold">Type of answer</p>
                </div>
            </div>
            <div class="flex bordered p-2">
                <select name="answertype" class="w-full bg-transparent outline-none" :value="answerType"
                    @change="answerType = ($event.target as any).value">
                    <option v-for="type in answerTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                </select>
            </div>
        </div>

        <!-- ANSWERS LIST SECTION -->
        <div class="flex flex-col min-h-0 max-h-full h-fit w-full space-y-2">
            <div class="flex justify-start items-center space-x-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-bold">Answers</p>
                </div>
            </div>
            <div class="flex flex-col min-h-0 max-h-full">
                <div class="flex p-2 overflow-x-hidden overflow-y-auto w-full">
                    <div class="flex flex-col space-y-2 w-full">
                        <div v-for="(answer, index) in answers" :key="index"
                            class="flex bordered space-x-2 h-fit min-w-0 max-w-full w-full p-2">
                            <div class="flex h-full w-fit justify-center items-center">
                                <button @click="selectAnswerEmoji(index)">
                                    <span>{{ answer.emoji }}</span>
                                </button>
                            </div>
                            <div class="flex h-full grow w-full justify-center items-center">
                                <input type="text" class="w-full bg-transparent outline-none text-left"
                                    :value="answer.label" @change="answer.label = ($event.target as any).value" />
                            </div>
                            <div v-show="answers.length > 1" class="flex h-full w-fit justify-center items-center">
                                <button @click="removeAnswer(index)">
                                    <XMarkIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="answers.length < nbAnswersTotal" class="flex justify-center items-center w-full">
                    <ButtonView @click="addAnswer()" class="w-fit">Add answer</ButtonView>
                </div>
            </div>
        </div>
        <ModalView ref="answerEmojiModal">
            <div class="flex flex-col justify-center items-center space-y-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-semibold"> Choose an emoji </p>
                </div>
                <div class="flex grow h-full w-full p-2 flex-wrap justify-evenly">
                    <div v-for="emoji in emojis" :key="emoji" class="w-fit h-fit m-2">
                        <button @click="setAnswerEmoji(emoji)">
                            <span class="text-2xl">{{ emoji }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </ModalView>
    </div>
</template>

<script lang="ts">
import ButtonView from '@/components/ButtonView.vue';
import ModalView from '@/components/ModalView.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { defineComponent } from 'vue';

interface Answer {
    emoji: string;
    label: string;
}

const answerTypes = [
    { value: 'unique', label: 'Unique choice' },
    { value: 'multiple', label: 'Multiple choice' }
];

export default defineComponent({
    components: {
        ButtonView,
        XMarkIcon,
        ModalView
    },
    props: {
        poll: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            answerType: 'unique',
            answerTypes,
            answers: [] as Answer[],
            emojis: ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑'],
            nbAnswersTotal: 4,
            answerEmojiModal: null as typeof ModalView | null,
            targetAnswerIndex: -1
        }
    },
    mounted() {
        this.answerEmojiModal = this.$refs['answerEmojiModal'] as typeof ModalView;
        for (const i in [1, 2]) this.addAnswer(); // add 2 answers by default
    },
    watch: {
        answerType() {
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.type = this.answerType;
        }
    },
    methods: {
        addAnswer() {
            this.answers.push({ emoji: this.getRandomEmoji(), label: this.getRandomAnswer() });
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.answers = this.answers;
        },
        getRandomEmoji() {
            return this.emojis[Math.floor(Math.random() * this.emojis.length)];
        },
        getRandomAnswer() {
            const answers = ['Yes :)', 'No :(', 'Maybe ...', 'I don\'t know :/', 'I don\'t care >:('];
            return answers[Math.floor(Math.random() * answers.length)];
        },
        removeAnswer(index) {
            this.answers.splice(index, 1);
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.answers = this.answers;
        },
        selectAnswerEmoji(index) {
            this.targetAnswerIndex = index;
            this.answerEmojiModal?.show();
        },
        setAnswerEmoji(emoji) {
            if (this.targetAnswerIndex < 0) return;
            this.answers[this.targetAnswerIndex]!.emoji = emoji;
            this.answerEmojiModal?.hide();
        }
    }
});
</script>
