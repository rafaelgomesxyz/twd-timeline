import * as React from 'react';
import { TimelineController } from '../controllers/TimelineController';
import './TimelineMoment.css';

export interface ITimelineMomentProps {
	moment: ITimelineMoment,
}

export type ITimelineMoments = ITimelineMoment[];

export interface ITimelineMoment {
	dateStr: string,
	date: Date,
	events: ITimelineMomentEvents,
	day: number,
}

export type ITimelineMomentEvents = ITimelineMomentEvent[];

export interface ITimelineMomentEvent {
	show: string,
	season: number,
	episode: number,
	title: string,
	image: string,
}

export const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'Mai',
	'Jun',
	'Jul',
	'Aug',
	'Set',
	'Oct',
	'Nov',
	'Dec',
];

export const TimelineMoment = (props: ITimelineMomentProps) => {
	const { moment } = props;

	const setMomentRef = (ref: HTMLDivElement): void => {
		TimelineController.momentRefs.set(moment.day, ref);
		TimelineController.momentPositions.set(moment.day, ref.getBoundingClientRect().left);
	};

	return (
		<div className="timeline-moment">
			<div
				className="timeline-moment-marker"
				data-day={moment.day}
				ref={setMomentRef}
				onClick={TimelineController.goTo.bind(null, moment.day)
			}></div>
			<div className="timeline-moment-title">
				{moment.day > 0 && (<div className="timeline-moment-day">Day {moment.day}</div>)}
				<div className="timeline-moment-date">{moment.date.getDate()} {MONTHS[moment.date.getMonth()]}, {moment.date.getFullYear()}</div>
			</div>
		</div>
	);
};