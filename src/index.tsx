import React from 'react';
import ReactDOM from 'react-dom';
import Snake from './Snake';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Snake cellSize={20} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
