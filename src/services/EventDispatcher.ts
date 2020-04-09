export enum EVENTS {
	MOMENT_CHANGE,
}

class _EventDispatcher {
	listeners: { [eventId: number]: Function[] };

	constructor() {
		this.listeners = {};
	}

	subscribe(eventId: EVENTS, listener: Function): void {
		if (!this.listeners[eventId]) {
			this.listeners[eventId] = [];
		}
		this.listeners[eventId].push(listener);
	}

	unsubscribe(eventId: EVENTS, listener: Function): void {
		if (this.listeners[eventId]) {
			this.listeners[eventId] = this.listeners[eventId].filter(fn => fn !== listener);
		}
	}

	dispatch(eventId: EVENTS, data: { [key: string]: any }) {
		if (this.listeners[eventId]) {
			this.listeners[eventId].forEach(listener => listener(data));
		}
	}
}

export const EventDispatcher = new _EventDispatcher();