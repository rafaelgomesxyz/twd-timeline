import * as React from 'react';
import { EventDispatcher, EVENTS } from '../services/EventDispatcher';
import './MomentView.css';
import { ITimelineMoment } from './TimelineMoment';

export const MomentView = () => {
	const [moment, setMoment] = React.useState(null as ITimelineMoment);

	React.useEffect(() => {
		const onMomentChange = (data: { [key: string]: any }): void => {
			setMoment(data.moment || null);
		};

		const startListeners = (): void => {
			EventDispatcher.subscribe(EVENTS.MOMENT_CHANGE, onMomentChange);
		};

		const stopListeners = (): void => {
			EventDispatcher.unsubscribe(EVENTS.MOMENT_CHANGE, onMomentChange);
		};

		startListeners();
		return stopListeners;
	}, []);

	return (
		<div className="moment-view">
			<div className="moment-view-events">
				{moment && moment.events.map((event, index) => (
					<div
						key={index}
						className="moment-view-event"
						style={{ background: `url(assets/${moment.dateStr}-${index + 1}.jpg) no-repeat center center` }}
					>
						<div className="moment-view-event-title">
							<span>{event.title}</span> <span>({event.show} S{event.season}E{event.episode})</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};