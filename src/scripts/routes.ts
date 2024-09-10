import { METHOD, Route, TYPE } from "./API";

export default {
    AUTH: {
        TOKEN: () => new Route(`auth/token`, METHOD.GET),
        LOGIN: (token: string) => new Route(`auth/login`, METHOD.GET, { token }),
    },
    USERS: {
        GET: (id: number | undefined = undefined) => new Route(`users${id ? `/${id}` : ''}`, METHOD.GET),
        CREATE: (pseudo: string, email: string) => new Route(`users`, METHOD.POST, undefined, { pseudo, email }),
        UPDATE: (id: number, pseudo: string | undefined, email: string | undefined = undefined, bio: string | undefined = undefined) => new Route(`users/${id}`, METHOD.PATCH, undefined, { pseudo, email, bio }),
        DELETE: (id: number) => new Route(`users/${id}`, METHOD.DELETE),
        POLLS: (id: number) => new Route(`users/${id}/polls`, METHOD.GET),
        FOLLOW: (id: number) => new Route(`users/${id}/follow`, METHOD.POST),
        UNFOLLOW: (id: number) => new Route(`users/${id}/follow`, METHOD.DELETE),
        FOLLOWERS: (id: number) => new Route(`users/${id}/followers`, METHOD.GET),
        FOLLOWING: (id: number) => new Route(`users/${id}/following`, METHOD.GET),
        ME: {
            GET: () => new Route(`users/me`, METHOD.GET),
            UPDATE: (pseudo: string | undefined, email: string | undefined = undefined, bio: string | undefined = undefined) => new Route(`users/me`, METHOD.PATCH, undefined, { pseudo, email, bio }),
            DELETE: () => new Route(`users/me`, METHOD.DELETE),
        }
    },
    DEVICE: { CREATE: () => new Route(`users`, METHOD.POST, undefined, {}) },
    EMAIL: {
        LOGIN: (token: string) => new Route(`email/login`, METHOD.POST, undefined, { token }),
        SENDMAIL: (email: string) => new Route(`email/login`, METHOD.GET, { email }),
        CHANGE: (token: string) => new Route(`email/change`, METHOD.POST, undefined, { token }),
    },
    POLLS: {
        CREATE: (title: string, description: string, type: string, answers: { emoji: string, label: string }[], tags: string[]) => {
            return new Route(`polls`, METHOD.POST, undefined, { title, description, type, answers, tags });
        },
        GET: (id: number | undefined = undefined) => new Route(`polls${id ? `/${id}` : ''}`, METHOD.GET),
        DELETE: (id: number) => new Route(`polls/${id}`, METHOD.DELETE),
        MEDIA: (id: number) => new Route(`polls/${id}/media`, METHOD.POST, undefined, undefined, TYPE.FORM),
        ANSWERS: {
            CREATE: (pollId: number, answerId: number) => new Route(`polls/${pollId}/answers`, METHOD.POST, undefined, { answerId }),
            GET: (id: number) => new Route(`polls/${id}/answers`, METHOD.GET),
            DELETE: (pollId: number, answerId: number) => new Route(`polls/${pollId}/answers/${answerId}`, METHOD.DELETE),
        },
        REPORTS: {
            CREATE: (id: number, reason: string) => new Route(`polls/${id}/reports`, METHOD.POST, undefined, { reason }),
            GET: (id: number) => new Route(`polls/${id}/reports`, METHOD.GET),
        },
    },
    MEDIAS: {
        GET: (id: number) => new Route(`medias/${id}`, METHOD.GET),
        PREVIEW: (id: number) => new Route(`medias/${id}/preview`, METHOD.GET),
        VIEW: (id: number) => new Route(`medias/${id}/view`, METHOD.GET),
    },
    STATS: {
        SKIPPED_POLL: (pollId: number) => new Route(`stats/skipPoll`, METHOD.POST, undefined, { pollId }),
        LOOKED_ACCOUNT: (pollId: number) => new Route(`stats/lookAccount`, METHOD.POST, undefined, { pollId }),
    },
    SEARCH: (query: string, displayUsers: boolean, displayPolls: boolean) => new Route(`search`, METHOD.GET, { query, displayUsers, displayPolls }),
};
