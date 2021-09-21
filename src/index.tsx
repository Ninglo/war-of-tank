import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './view/App';
import store from './modal/index';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
