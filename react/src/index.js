import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from "recoil";

import './style.css';
import Game from "./components/game";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <RecoilRoot>
        <Game />
    </RecoilRoot>,
    document.getElementById('root')
);
registerServiceWorker();
