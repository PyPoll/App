import { API } from './API';
import ROUTES from './routes';

type FurWazPortalEvent = 'success' | 'error' | 'ready';
type FurWazPortalOpenMode = 'popup' | 'redirect' | 'tab';
type FurWazPortalCallback = (data: any) => void;

function isMobile() {
    return window.innerWidth <= 768;
}

export default class FurWazPortal {
    public static catchRedirectLogin(callback: (data: any) => void) {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        if (token) {
            const portal = new FurWazPortal(token);
            portal.on('ready', () => { portal.waitForAuth(); });
            portal.on('success', callback);
        }

        return token !== null;
    }

    private eventListeners: { [key: string]: FurWazPortalCallback[] } = {};
    private portalToken: string | null = null;
    private authRoute = (token: string) => ROUTES.AUTH.FURWAZ.TOKEN(token);
    private loggedIn = false;

    private triggerEvent(event: FurWazPortalEvent, data: any) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach((callback) => {
                callback(data);
            });
        }
    }

    private waitForAuth(route?: any, recursive: number = 5) {
        if (!this.portalToken) {
            console.error('FurWazPortal waitForAuth error', 'portalToken not found');
            this.triggerEvent('error', 'portalToken not found');
            return;
        }

        (this.loggedIn ? API.RequestLogged : API.Request)(this.authRoute(this.portalToken))
            .then((authRes) => {
                if (authRes.error) {
                    console.error('FurWazPortal waitForAuth error', authRes.message);
                    this.triggerEvent('error', authRes);
                    return;
                }
                this.triggerEvent('success', authRes.data);
            })
            .catch((err) => {
                if (recursive > 0) {
                    setTimeout(() => {
                        this.waitForAuth(recursive - 1);
                    }, 1000);
                } else {
                    console.error('FurWazPortal waitForAuth error', err);
                    this.triggerEvent('error', err);
                }
            });
    }

    constructor(portalToken?: string, authRoute?: any, loggedIn: boolean = false) {
        this.loggedIn = loggedIn;
        if (authRoute) {
            this.authRoute = authRoute;
        }

        if (!portalToken) {
            API.Request(ROUTES.AUTH.FURWAZ.GENERATE)
                .then((portalRes) => {
                    if (portalRes.error) {
                        console.error('FurWazPortal constructor error', portalRes.message);
                        this.triggerEvent('error', portalRes);
                        return;
                    }
                    this.portalToken = portalRes.data;
                    this.triggerEvent('ready', this.portalToken);
                })
                .catch((err) => {
                    console.error('FurWazPortal constructor error', err);
                    this.triggerEvent('error', err);
                });
        } else {
            setTimeout(() => {
                this.portalToken = portalToken;
                this.triggerEvent('ready', this.portalToken);
            }, 10);
        }
    }

    open(mode: FurWazPortalOpenMode = (isMobile() ? 'tab' : 'popup')) {
        if (!this.portalToken) {
            console.error('FurWazPortal open error', 'portalToken not found');
            this.triggerEvent('error', 'portalToken not found');
            return;
        }

        const url = `https://furwaz.com/portal?token=${this.portalToken}`;
        switch (mode) {
            case 'tab': {
                const tab = window.open(url, '_blank');
                if (!tab) {
                    console.error('FurWazPortal open error', 'tab blocked');
                    this.open('redirect');
                } else {
                    this.waitForAuth();
                }
                break;
            }

            case 'redirect':
                window.location.href = url + '&redirect=' + encodeURIComponent(window.location.href);
                break;

            default: {
                const width = 400;
                const height = 650;
                const left = window.screen.width / 2 - width / 2;
                const top = window.screen.height / 2 - height / 2;
                const features = `popup,width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,toolbar=no,location=no,menubar=no`;
                const popup = window.open(url, 'FurWazPortal', features);
                if (!popup) {
                    console.error('FurWazPortal open error', 'popup blocked');
                    this.open('redirect');
                } else {
                    popup.focus();
                    this.waitForAuth();
                }
                break;
            }
        }
    }

    on(event: FurWazPortalEvent, callback: FurWazPortalCallback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    get token() {
        return this.portalToken;
    }
}
