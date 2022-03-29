import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RecoilRoot } from "recoil";

import {store} from "./store";
import './style.css';
import Game from "./components/game";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <RecoilRoot>
        <Provider store={store}>
            <Game />
        </Provider>
    </RecoilRoot>,
    document.getElementById('root')
);
registerServiceWorker();
