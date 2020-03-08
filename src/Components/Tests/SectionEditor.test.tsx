import * as React from 'react';
import ReactDOM from 'react-dom';
import SectionEditor from '../dialogs/SectionEditor';
import { emptySection } from '../Utils';

it('SectionEditor renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SectionEditor 
        section={emptySection} 
        updateSection={() => void 0}
        deleteSection={() => void 0}
        cancel={() => void 0}
        />, div);
    ReactDOM.unmountComponentAtNode(div);
  });