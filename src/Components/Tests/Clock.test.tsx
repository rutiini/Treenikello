import * as React from 'react';
import ReactDOM from 'react-dom';
import Clock, { TimerMode } from '../Clock';
import { ClockData } from '../Utils/ClockUtilities';

const testProps = {
  canvasSide: 100,
  centerCoordinate: 10,
  clockData: new ClockData(new Date),
  sectionItems: [],
  stopWatchRotation: 230,
  timerMode: TimerMode.Hidden,
}

it('Clock renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Clock {...testProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});