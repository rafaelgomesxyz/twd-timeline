import { Public } from '@material-ui/icons';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import 'typeface-roboto';
import './App.css';

const App = () => {
	return (
		<div className="App">
			<h1>Hello, World! <Public/></h1>			
		</div>
	);
};

export default hot(module)(App);