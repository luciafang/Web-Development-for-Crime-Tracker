import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormattedDate from './FormattedDate'; 
import StringInput from './StringInput';
import {post} from '../api';


function InvestigationNoteEditor({ onSave, close }) {
    const [noteContent, setNoteContent] = React.useState('');

    return (
      <>
        <StringInput 
          value={noteContent}
          setValue={setNoteContent}
      />
      <button onClick={() => onSave(noteContent)} disabled={noteContent.length === 0}>
        Save
      </button>
      <button onClick={close}>Cancel</button>
    </>
    );
    }
    
    InvestigationNoteEditor.propTypes = {
      close: PropTypes.func.isRequired,
      onSave: PropTypes.func.isRequired,
    };

  function InvestigationNotes({ notes, investigationId }) {
    const [editorOpen, setEditorOpen] = React.useState(false);
    // const [currentNotes, setCurrentNotes] = React.useState(notes);
    const [currentNotes, setCurrentNotes] = React.useState(notes);


    function onSave(noteContent) {
      post(`/v1/investigations/${investigationId}/notes`, {
        investigation_note: {
          content: noteContent,
        },
      }).then((result) => {
        setEditorOpen(false);
        setCurrentNotes([result].concat(currentNotes));
      } );
    }

    const content = currentNotes.length === 0 ? (
      <p>This investigation does not have notes associated with it.</p>
    ) : (
      <>
        <ul>
          {currentNotes.map((note) => {
            const { content, date, officer } = note.data.attributes;
            const { first_name, last_name } = officer.data.attributes;
            return (
              <li key={`note-${note.data.id}`}>
                <p>{FormattedDate(date)}: {content}</p>
                <p> - {first_name} {last_name}</p>
              </li>
            );
          })}
        </ul>
      </>
    );
    
    return (
        <div className="card red lighten-5">
            <div className="card-content">
                <span className="card-title">Investigation Notes</span>
                  {content}
                  
                  {editorOpen && (
                    <InvestigationNoteEditor
                      close={() => setEditorOpen(false)}
                      onSave={onSave}
                    />
                  )}
                  {!editorOpen && (
                    <button onClick={() => setEditorOpen(true)}>Add Note</button>
                  )}
            </div>
        </div>
    );
}

InvestigationNotes.propTypes = 
{
    notes: PropTypes.arrayOf(PropTypes.objects).isRequired,
    investigationId: PropTypes.string.isRequired,
};

export default InvestigationNotes;
