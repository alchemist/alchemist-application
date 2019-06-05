import Vue from "vue";

export class EventBus {
    private _bus = new Vue();

    public subscribe = (event: string, callback: (arg: any, sender: any) => void) => this._bus.$on(event, callback);
    public unsubscribe = (event: string, callback: (arg: any, sender: any) => void) => this._bus.$off(event, callback);
    public unsubscribeAll = (event: string) => this._bus.$off(event);
    public publish = (event: string, arg: any, sender: any) => this._bus.$emit(event, {arg, sender});
}

export const eventBus = new EventBus();
