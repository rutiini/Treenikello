import * as React from 'react';
import ReactDOM from 'react-dom';
import EditSectionDialog from '../dialogs/EditSectionDialog';

const sectionDialogProps = {
  open: true,
  section:{
    color: "white",
    description: "hey",
    duration: 1,
    key: "1",
    name: "testi",
    setupTime: 1,
  },
}

it('EditSectionDialog renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
  <EditSectionDialog {...sectionDialogProps} />
  , div);
  ReactDOM.unmountComponentAtNode(div);
});
