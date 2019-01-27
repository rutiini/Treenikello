import * as React from 'react';
import ReactDOM from 'react-dom';
import ConfirmationDialog from '../dialogs/ConfirmationDialog';

it('ConfirmationDialog renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <ConfirmationDialog />
  , div);
  ReactDOM.unmountComponentAtNode(div);
});
