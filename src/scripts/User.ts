import { API } from "./API";
import ROUTES from "./routes";

class User {
    /** @type {User} */
    static #currentUser: User | null = null;
    static get CurrentUser() {
        return User.#currentUser || User.FromLocalStorage();
    }

    public static FromLocalStorage() {
        const data = localStorage.getItem('user');
        if (!data) return null;
        return new User(JSON.parse(data));
    }

    public static Forget() {
        localStorage.removeItem('user');
        User.#currentUser = null;
        window.location.reload();
    }

    public id: number;
    public pseudo: string;
    public bio: string;
    public email: string;
    public nbFollowers: number;
    public nbFollowing: number;
    public token: string;

    constructor(data: any) {
        this.id = data.id;
        this.pseudo = data.pseudo;
        this.bio = data.bio;
        this.email = data.email;
        this.nbFollowers = data.nbFollowers;
        this.nbFollowing = data.nbFollowing;
        this.token = data.token;
    }

    public save() {
        localStorage.setItem('user', JSON.stringify(this));
    }

    public update(data: any) {
        this.id = data.id ?? this.id;
        this.pseudo = data.pseudo ?? this.pseudo;
        this.bio = data.bio ?? this.bio;
        this.email = data.email ?? this.email;
        this.nbFollowers = data.nbFollowers ?? this.nbFollowers;
        this.nbFollowing = data.nbFollowing ?? this.nbFollowing;
        this.token = data.token ?? this.token;
        this.save();
    }

    public async fetch() {
        this.save();
        const res = await API.RequestLogged(ROUTES.USERS.ME.GET());
        if (res.status !== 200) return;
        this.update(await res.data);
    }
}

export default User;