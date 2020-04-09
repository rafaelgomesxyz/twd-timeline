import * as React from 'react';
import { TimelineController } from '../controllers/TimelineController';
import { Store } from '../services/Store';
import './Timeline.css';
import { TimelineMoment } from './TimelineMoment';

export const Timeline = () => {
	React.useEffect(() => {
		const startListeners = (): void => {
			window.addEventListener('resize', TimelineController.onResize);
			document.addEventListener('keydown', TimelineController.onKeyPress);
		};

		const stopListeners = (): void => {
			window.removeEventListener('resize', TimelineController.onResize);
			document.removeEventListener('keydown', TimelineController.onKeyPress);
		};

		TimelineController.goTo(1);
		startListeners();
		return stopListeners;
	}, []);

	const setPickerRef = (ref: HTMLDivElement): void => {
		TimelineController.pickerRef = ref;
		TimelineController.pickerPosition = ref.getBoundingClientRect().left;
	};

	const setMomentsRef = (ref: HTMLDivElement): void => {
		TimelineController.momentsRef = ref;
		TimelineController.momentsPosition = ref.getBoundingClientRect().left;
	};

	const reactMoments = [];
	for (const moment of Store.moments.values()) {
		reactMoments.push(
			<TimelineMoment
				key={moment.day}
				moment={moment}
			/>
		);
	}
	return (
		<div
			className="timeline"
			onMouseDown={TimelineController.onMouseDown}
			onMouseUp={TimelineController.onMouseUp}
			onMouseMove={TimelineController.onMouseMove}
			onTouchStart={TimelineController.onMouseDown}
			onTouchEnd={TimelineController.onMouseUp}
			onTouchMove={TimelineController.onMouseMove}
		>
			<div className="timeline-picker" ref={setPickerRef}></div>
			<div className="timeline-moments" ref={setMomentsRef}>
				<div className="timeline-line"></div>
				{reactMoments}
			</div>
		</div>
	);
};