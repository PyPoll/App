<template>
    <RouterLink :to="link" class="whitespace-nowrap w-fit h-fit px-1 bg-indigo-500 text-slate-200 rounded">
        {{ text }}
    </RouterLink>
</template>

<script lang="ts">
import { API } from '@/scripts/API';
import ROUTES from '@/scripts/routes';
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
    props: {
        text: {
            type: String,
            required: true
        }
    },
    components: {
        RouterLink
    },
    data() {
        return {
            link: '' as any
        }
    },
    mounted() {
        this.updateLink();
    },
    watch: {
        text() {
            this.updateLink();
        }
    },
    methods: {
        async updateLink() {
            const searchResults = await API.RequestLogged(ROUTES.SEARCH(this.text, true, false));
            if (searchResults.error) {
                console.error(searchResults.message);
                return;
            }
            const user = searchResults.data.users.length > 0 ? searchResults.data.users[0] : undefined;
            if (!user) {
                console.error('No user found for search term: ' + this.text);
                return;
            }

            this.link = {
                name: 'account',
                query: {
                    id: user.id
                }
            };
        }
    }
});
</script>