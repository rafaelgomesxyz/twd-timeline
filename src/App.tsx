import * as React from 'react';
import { hot } from 'react-hot-loader';
import 'typeface-roboto';
import './App.css';
import { MomentView } from './components/MomentView';
import { Timeline } from './components/Timeline';

const App = () => {
	return (
		<div className="app">
			<MomentView/>
			<Timeline/>
		</div>
	);
};

export default hot(module)(App);