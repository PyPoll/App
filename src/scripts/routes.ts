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
        ME: {
            GET: () => new Route(`users/me`, METHOD.GET),
            UPDATE: (pseudo: string | undefined, email: string | undefined = undefined, bio: string | undefined = undefined) => new Route(`users/me`, METHOD.PATCH, undefined, { pseudo, email, bio }),
            DELETE: () => new Route(`users/me`, METHOD.DELETE),
        }
    },
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
    },
    MEDIAS: {
        GET: (id: number) => new Route(`medias/${id}`, METHOD.GET),
        PREVIEW: (id: number) => new Route(`medias/${id}/preview`, METHOD.GET),
        VIEW: (id: number) => new Route(`medias/${id}/view`, METHOD.GET),
    }
};
