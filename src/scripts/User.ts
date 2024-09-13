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
    public furwazId: number;

    constructor(data: any) {
        this.id = data.id;
        this.pseudo = data.pseudo;
        this.bio = data.bio;
        this.email = data.email;
        this.nbFollowers = data.nbFollowers;
        this.nbFollowing = data.nbFollowing;
        this.token = data.token;
        this.furwazId = data.furwazId;
    }

    public save() {
        localStorage.setItem('user', JSON.stringify(this));
    }

    public update(data: any) {
        if (data.token) {
            this.fetch();
            return;
        }

        this.id = (data.id !== undefined) ? data.id : this.id;
        this.pseudo = (data.pseudo !== undefined) ? data.pseudo : this.pseudo;
        this.bio = (data.bio !== undefined) ? data.bio : this.bio;
        this.email = (data.email !== undefined) ? data.email : this.email;
        this.nbFollowers = (data.nbFollowers !== undefined) ? data.nbFollowers : this.nbFollowers;
        this.nbFollowing = (data.nbFollowing !== undefined) ? data.nbFollowing : this.nbFollowing;
        this.token = (data.token !== undefined) ? data.token : this.token;
        this.furwazId = (data.furwazId !== undefined) ? data.furwazId : this.furwazId;
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