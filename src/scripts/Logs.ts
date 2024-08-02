import Lang from "@/scripts/Lang";
import { applyClasses } from "@/scripts/dom";

class Log {
    static LogIdCounter = 0;
    static INFO = "dark:text-slate-300 text-slate-600";
    static ERROR = "text-red-500";
    static WARNING = "text-orange-500";
    static SUCCESS = "text-teal-500";

    public id: number;
    public zone: LogZone|null;
    public type: string;
    public dom: HTMLElement;
    public resizeTimeout: number|null = null;

    constructor(msg, type = Log.INFO) {
        this.id = Log.LogIdCounter++;
        this.zone = null;
        this.type = type;
        this.dom = document.createElement("p");
        this.dom.innerHTML = msg;
        applyClasses(this.dom, "text-lg h-fit text-center font-semibold transition-all overflow-hidden " + this.type);
        this.dom.style.maxHeight = "100px";
    }

    resize() {
        this.resizeTimeout = setTimeout(() => {
            this.dom.style.maxHeight = this.dom.getBoundingClientRect().height + "px";
            if (this.zone) this.zone.render();
            this.resizeTimeout = null;
        }, 200);
    }

    attachTo(zone) {
        if (this.zone)
            this.zone.removeLog(this);

        this.zone = zone;
        if (!zone.hasLog(this))
            zone.addLog(this);
    }

    setText(msg, animate=true) {
        if (this.resizeTimeout !== null) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }

        this.dom.style.maxHeight = "100px";
        if (animate) {
            this.dom.style.opacity = "0";
            setTimeout(() => {
                this.dom.innerHTML = msg;
                this.dom.style.opacity = "1";
                this.resize();
            }, 200);
        } else {
            this.dom.innerHTML = msg;
            this.resize();
        }
    }

    setType(type) {
        this.dom.classList.remove(...this.type.split(" "));
        this.type = type;
        this.dom.classList.add(...this.type.split(" "));
    }

    update(msg, type, animate=true) {
        this.setText(msg, animate);
        if (type) this.setType(type);
    }

    async error(err) {
        switch (err.status) {
        case 400: this.update(err.message, Log.ERROR); break;
        case 417: this.update(err.message, Log.WARNING); break;
        default:  this.update(await Lang.GetTextAsync(Lang.CreateTranslationContext('common', 'Error')) + " : " + err.message, Log.ERROR); break;
        }
    }

    delete() {
        if (this.zone) {
            this.zone.removeLog(this);
        } else console.error("Log not attached to a zone", this.dom);
    }
}

class LogZone {
    public dom: HTMLElement;
    public logs: Log[];
    public toadd: Log[];
    public toremove: Log[];

    constructor(dom) {
        this.dom = dom;
        this.logs = [];
        this.toadd = [];
        this.toremove = [];
    }

    #getLogSize() {
        return Math.max(
            this.dom.children[0]?.getBoundingClientRect().height ?? 0,
            (this.dom.children[1]?.getBoundingClientRect().top ?? 0) - (this.dom.children[0]?.getBoundingClientRect().top ?? 0),
            56
        );
    }

    render() {
        const nbLogs = this.toadd.length + this.logs.length - this.toremove.length;
        this.dom.style.maxHeight = this.#getLogSize() * nbLogs + "px";

        this.toadd.forEach(l => {
            this.dom.appendChild(l.dom);
            this.logs.push(l);
        });
        this.toadd = [];

        this.toremove.forEach(l => {
            l.dom.style.maxHeight = "0px";
        });
        this.toremove.forEach(l => {
            setTimeout(() => { l.dom.remove(); }, 500);
        });
        this.logs = this.logs.filter(log => !this.toremove.includes(log));
        this.toremove = [];
    }

    addLog(log) {
        this.toadd.push(log);
        this.render();
    }

    hasLog(log) {
        switch (typeof log) {
        case "object":
            return this.logs.includes(log);
        case "number":
            return this.logs.some(l => l.id === log);
        default: return false;
        }
    }

    removeLog(log) {
        switch (typeof log) {
        case "object":
            this.toremove.push(log);
            break;
        case "number": {
            const l = this.logs.find(l => l.id === log);
            if (l) this.toremove.push(l);
            break;
        }
        default: break;
        }
        this.render();
    }
}

export { Log, LogZone };