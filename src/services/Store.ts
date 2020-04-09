import { ITimelineMoment } from '../components/TimelineMoment';
import timelineJson from '../timeline.json';

export interface ITimelineJson {
	outbreak: string,
	moments: ITimelineJsonMoments,
}

export type ITimelineJsonMoments = ITimelineJsonMoment[];

export interface ITimelineJsonMoment {
	date: string,
	events: ITimelineJsonEvents,
}

export type ITimelineJsonEvents = ITimelineJsonEvent[];

export interface ITimelineJsonEvent {
	show: string,
	season: number,
	episode: number,
	title: string,
	image: string,
}

export const timeline = timelineJson as ITimelineJson;

class _Store {
	outbreak: Date;
	moments: Map<number, ITimelineMoment>;
	days: number[];

	constructor() {
		this.outbreak = new Date(timeline.outbreak);
		this.moments = new Map<number, ITimelineMoment>();
		this.days = [];
		for (const timelineMoment of timeline.moments) {
			const moment = {} as ITimelineMoment;
			moment.dateStr = timelineMoment.date;
			moment.date = new Date(moment.dateStr);
			moment.events = timelineMoment.events;
			moment.day = (moment.date.getTime() - this.outbreak.getTime()) / 86400000 + 1;
			this.days.push(moment.day);
			this.moments.set(moment.day, moment);
		}
	}
}

const Store = new _Store();

export { Store };