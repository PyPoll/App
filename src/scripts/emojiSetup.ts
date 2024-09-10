import 'unicode-emoji-picker';
import Lang from "./Lang";

let emojiPicker: any;

export function configEmojiPicker() {
    emojiPicker = document.querySelector('unicode-emoji-picker') as any

    console.log("configEmojiPicker", emojiPicker);
    emojiPicker.addEventListener('emoji-pick', (event) => {
        console.log("emoji-pick", event.detail.emoji);
        // this.setAnswerEmoji(event.detail.emoji);
    });

    window.customElements.whenDefined('unicode-emoji-picker').then(async () => {
        console.log("customElements.whenDefined");
        emojiPicker.setTranslation({
            'search': {
                emoji: '🔎',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.search')),
                inputPlaceholder: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'SearchEmoji')),
            },
            'face-emotion': {
                emoji: '😀️',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.face-emotion')),
            },
            'food-drink': {
                emoji: '🥕️',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.food-drink')),
            },
            'animals-nature': {
                emoji: '🦜️',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.animals-nature')),
            },
            'activities-events': {
                emoji: '♟️',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.activities-events')),
            },
            'person-people': {
                emoji: '🧍',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.person-people')),
            },
            'travel-places': {
                emoji: '✈️',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.travel-places')),
            },
            'objects': {
                emoji: '👒',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.objects')),
            },
            'symbols': {
                emoji: '💬️',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.symbols')),
            },
            'flags': {
                emoji: '🚩',
                title: await Lang.GetTextAsync(Lang.CreateTranslationContext('create', 'Emoji.flags')),
            }
        });
    });
}
