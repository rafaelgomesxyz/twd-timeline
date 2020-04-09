import * as React from 'react';
import { EventDispatcher, EVENTS } from '../services/EventDispatcher';
import { Store } from '../services/Store';

class _TimelineController {
	pickerRef: HTMLDivElement;
	pickerPosition: number;
	momentsRef: HTMLDivElement;
	momentsPosition: number;
	momentRefs: Map<number, HTMLDivElement>;
	momentPositions: Map<number, number>;
	isMouseDown: boolean;
	mouseX: number;
	translateX: number;
	firstDay: number;
	lastDay: number;
	currentDay: number;
	currentDayIndex: number;
	firstMomentPosition: number;
	lastMomentPosition: number;

	constructor() {
		this.pickerRef = null;
		this.pickerPosition = 0;
		this.momentsRef = null;
		this.momentsPosition = 0;
		this.momentRefs = new Map<number, HTMLDivElement>();
		this.momentPositions = new Map<number, number>();
		this.isMouseDown = false;
		this.mouseX = 0;
		this.translateX = 0;
		this.firstDay = Store.days[0];
		this.lastDay = Store.days[Store.days.length - 1];
		this.currentDay = 0;
		this.currentDayIndex = 0;
		this.firstMomentPosition = 0;
		this.lastMomentPosition = 0;

		this.isTouchEvent = this.isTouchEvent.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onResize = this.onResize.bind(this);
		this.updatePositions = this.updatePositions.bind(this);
		this.checkNearest = this.checkNearest.bind(this);
		this.goToNearest = this.goToNearest.bind(this);
		this.goToNext = this.goToNext.bind(this);
		this.goToPrevious = this.goToPrevious.bind(this);
		this.goTo = this.goTo.bind(this);
	}

	isTouchEvent(event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>): event is React.TouchEvent<HTMLDivElement> {
		return 'touches' in event;
	}

	onMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>): void {
		if (this.isTouchEvent(event)) {
			event.persist();
			this.isMouseDown = event.touches && event.touches.length > 0;
			if (this.isMouseDown) {
				this.mouseX = event.touches[0].clientX;
			}
		} else {
			this.isMouseDown = event.button === 0;
			if (this.isMouseDown) {
				this.mouseX = event.clientX;
			}
		}
		if (this.isMouseDown) {
			this.momentsRef.classList.remove('animation');
		}
	}

	onMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>): void {
		this.isMouseDown = false;
		this.mouseX = 0;
		this.goToNearest();
	}

	onMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>): void {
		if (!this.isMouseDown) {
			return;
		}
		let mouseX = 0;
		if (this.isTouchEvent(event)) {
			event.persist();
			if (event.touches && event.touches.length > 0) {
				mouseX = event.touches[0].clientX;
			}
		} else {
			mouseX = event.clientX;
		}
		if (!this.firstMomentPosition) {
			this.firstMomentPosition = this.momentPositions.get(this.firstDay) + 4;
			this.lastMomentPosition = this.momentPositions.get(this.lastDay) + 4;
		}
		const difference = mouseX - this.mouseX;
		const translateX = this.translateX + difference;
		if (translateX + this.firstMomentPosition <= this.pickerPosition && translateX + this.lastMomentPosition >= this.pickerPosition) {
			this.translateX = translateX;
			this.mouseX = mouseX;
			this.momentsRef.style.transform = `translateX(${this.translateX}px)`;
			this.checkNearest();
		} else if (translateX + this.firstMomentPosition <= this.pickerPosition) {
			this.translateX = this.pickerPosition - this.lastMomentPosition;
			this.momentsRef.style.transform = `translateX(${this.translateX}px)`;
			this.checkNearest();
		} else if (translateX + this.lastMomentPosition >= this.pickerPosition) {
			this.translateX = this.pickerPosition - this.firstMomentPosition;
			this.momentsRef.style.transform = `translateX(${this.translateX}px)`;
			this.checkNearest();
		}
	}

	onKeyPress(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft') {
			this.goToPrevious();
		} else if (event.key === 'ArrowRight') {
			this.goToNext();
		}
	}

	onResize(): void {
		this.updatePositions();
		this.goTo(this.currentDay);
	}

	updatePositions(): void {
		this.pickerPosition = this.pickerRef.getBoundingClientRect().left;
		this.momentsPosition = this.momentsRef.getBoundingClientRect().left;
		for (const momentRef of this.momentRefs) {
			this.momentPositions.set(momentRef[0], momentRef[1].getBoundingClientRect().left - this.momentsPosition);
		}
		this.firstMomentPosition = this.momentPositions.get(this.firstDay) + 4;
		this.lastMomentPosition = this.momentPositions.get(this.lastDay) + 4;
	}

	checkNearest(): void {
		for (const momentPosition of this.momentPositions) {
			const position = momentPosition[1] + this.translateX;
			const distance = Math.abs(this.pickerPosition - position);
			if (distance < 10) {
				if (momentPosition[0] !== this.currentDay) {
					this.currentDay = momentPosition[0];
					this.currentDayIndex = Store.days.indexOf(this.currentDay);
					EventDispatcher.dispatch(EVENTS.MOMENT_CHANGE, {
						moment: Store.moments.get(this.currentDay),
					});
				}
				return;
			}
		}
	}

	goToNearest(): void {
		const nearest = {
			day: null as number,
			distance: 999999999,
		};
		for (const momentPosition of this.momentPositions) {
			const position = momentPosition[1] + this.translateX;
			const distance = Math.abs(this.pickerPosition - position);
			if (distance < nearest.distance) {
				nearest.day = momentPosition[0];
				nearest.distance = distance;
			}
		}
		if (nearest.day !== null) {
			this.goTo(nearest.day);
		}
	}

	goToNext(): void {
		const day = Store.days[this.currentDayIndex + 1];
		if (typeof day !== 'undefined') {
			this.goTo(day);
		}
	}

	goToPrevious(): void {
		const day = Store.days[this.currentDayIndex - 1];
		if (typeof day !== 'undefined') {
			this.goTo(day);
		}
	}

	goTo(day: number): void {
		const position = this.momentPositions.get(day) + 4;
		this.translateX = this.pickerPosition - position;
		this.momentsRef.classList.add('animation');
		this.momentsRef.style.transform = `translateX(${this.translateX}px)`;
		if (day !== this.currentDay) {
			this.currentDay = day;
			this.currentDayIndex = Store.days.indexOf(this.currentDay);
			EventDispatcher.dispatch(EVENTS.MOMENT_CHANGE, {
				moment: Store.moments.get(this.currentDay),
			});
		}
	}
}

export const TimelineController = new _TimelineController();