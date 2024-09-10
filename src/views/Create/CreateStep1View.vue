<template>
    <div class="flex flex-col grow h-full w-full space-y-8">
        <!-- TITLE SECTION -->
        <div class="flex flex-col h-fit w-full space-y-2">
            <div class="flex justify-start items-center space-x-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-bold">
                        <GetText :context="Lang.CreateTranslationContext('create', 'Title')" />
                    </p>
                </div>
            </div>
            <div class="flex bordered p-2">
                <input type="text" name="title" class="w-full bg-transparent outline-none"
                    :placeholder="titlePlaceholder" @change="title = ($event.target as any).value" />
            </div>
        </div>

        <!-- DESCRIPTION SECTION -->
        <div class="flex flex-col h-fit w-full space-y-2">
            <div class="flex justify-start items-center space-x-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-bold">
                        <GetText :context="Lang.CreateTranslationContext('create', 'Description')" />
                    </p>
                </div>
            </div>
            <div class="flex bordered p-2">
                <textarea name="description" rows="3" class="w-full bg-transparent outline-none"
                    :placeholder="descriptionPlaceholder" spellcheck="true"
                    @change="description = ($event.target as any).value" />
            </div>
        </div>

        <!-- TAGS SECTION -->
        <div class="flex flex-col h-fit w-full space-y-2">
            <div class="flex justify-start items-center space-x-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-bold">
                        <GetText :context="Lang.CreateTranslationContext('create', 'Tags')" />
                    </p>
                </div>
                <div class="flex justify-center items-center card space-x-2 px-2 pt-1 pb-0.5">
                    <p class="text-base"> {{ selectedTags.length }} </p>
                    <p class="text-base"> / </p>
                    <p class="text-base"> {{ nbTagsTotal }} </p>
                </div>
            </div>
            <div class="flex bordered p-2">
                <div class="flex grow w-full h-full overflow-y-hidden overflow-x-auto items-center">
                    <div class="flex h-fit w-fit space-x-2">
                        <button v-for="(tag, index) in selectedTags" :key="tag" @click="removeTag(index)"
                            class="card py-1 px-2 min-w-0 max-w-[8em]">
                            <p class="whitespace-nowrap text-ellipsis overflow-hidden max-w-full min-w-0">
                                #{{ tag }}
                            </p>
                        </button>
                    </div>
                </div>
                <div class="flex w-fit h-full">
                    <span class="h-full w-[3px] card mx-2" />
                    <button @click="openCreateTagsModal()"
                        class="flex w-fit h-full justify-center items-center p-1 pl-0.5">
                        <PlusIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
        <ModalView ref="modalCreateTags">
            <div class="flex flex-col justify-center items-center space-y-4">
                <div class="flex justify-center items-center">
                    <p class="text-xl font-semibold">
                        <GetText :context="Lang.CreateTranslationContext('create', 'NewTag')" />
                    </p>
                </div>
                <div>
                    <div class="bordered p-2">
                        <input type="text" name="tagname" ref="modalCreateTagsText"
                            class="w-full bg-transparent outline-none" />
                    </div>
                </div>
                <span class="flex my-2 h-1 w-full card" />
                <div class="flex h-fit w-full justify-between items-center">
                    <ButtonView @click="modalCreateTags?.hide()" :bg="false">
                        <GetText :context="Lang.CreateTranslationContext('verbs', 'Cancel')" />
                    </ButtonView>
                    <ButtonView @click="createNewTag">
                        <GetText :context="Lang.CreateTranslationContext('verbs', 'Add')" />
                    </ButtonView>
                </div>
            </div>
        </ModalView>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalView from '@/components/ModalView.vue';
import { PlusIcon } from '@heroicons/vue/24/outline';
import ButtonView from '@/components/ButtonView.vue';
import Lang from '@/scripts/Lang';
import GetText from '@/components/GetText.vue';

export default defineComponent({
    components: {
        PlusIcon,
        ModalView,
        ButtonView,
        GetText
    },
    props: {
        poll: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            Lang,
            nbTagsTotal: 5,
            selectedTags: [] as string[],
            title: '',
            description: '',
            modalCreateTags: null as typeof ModalView | null,
            modalCreateTagsText: null as HTMLInputElement | null,
            titlePlaceholder: '',
            descriptionPlaceholder: '',
        }
    },
    mounted() {
        this.modalCreateTags = this.$refs['modalCreateTags'] as typeof ModalView;
        this.modalCreateTagsText = this.$refs['modalCreateTagsText'] as HTMLInputElement;

        Lang.GetText(Lang.CreateTranslationContext('create', 'TitlePlaceholder'), text => this.titlePlaceholder = text);
        Lang.GetText(Lang.CreateTranslationContext('create', 'DescriptionPlaceholder'), text => this.descriptionPlaceholder = text);

        const tagNameInput = document.querySelector('input[name="tagname"]') as HTMLInputElement;
        tagNameInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { this.createNewTag(); } });
    },
    watch: {
        title() {
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.title = this.title;
        },
        description() {
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.description = this.description;
        }
    },
    methods: {
        openCreateTagsModal() {
            if (this.selectedTags.length >= this.nbTagsTotal) {
                return;
            }
            this.modalCreateTags?.show();
            this.modalCreateTagsText!.value = '';
            this.modalCreateTagsText?.focus();
        },
        createNewTag() {
            const tag = this.modalCreateTagsText?.value.trim().toLowerCase() || '';
            if (!tag || tag.length < 2 || this.selectedTags.includes(tag)) return;
            this.selectedTags.push(tag);
            this.$forceUpdate();
            this.modalCreateTags?.hide();
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.tags = this.selectedTags;
        },
        removeTag(index) {
            this.selectedTags.splice(index, 1);
            this.$forceUpdate();
            // eslint-disable-next-line vue/no-mutating-props
            this.poll.tags = this.selectedTags;
        },
        validate() {
            const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
            const descriptionInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
            return titleInput && titleInput.value.length > 2 && descriptionInput && descriptionInput.value.length > 2;
        }
    }
});
</script>
