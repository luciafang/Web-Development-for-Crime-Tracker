import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { find } from "lodash";
import { get, post, put } from "../api";
import FormattedDate from "./FormattedDate";

function SuspectEditor({ close, onSave, currentCriminals }) {
  const [options, setOptions] = React.useState([]);
  const [criminalId, setCriminalId] = React.useState();

  React.useEffect(() => {
    get(`/v1/criminals`).then((response) => {
      setOptions(
        response.criminals.map((criminal) => {
          const criminalAlreadyExists = !!find(currentCriminals, {
            data: { id: criminal.data.id },
          });
          const { first_name, last_name } = criminal.data.attributes;
          return {
            value: criminal.data.id,
            label: `${first_name} ${last_name}`,
            disabled: criminalAlreadyExists,
          };
        })
      );
    });
  }, []);

  return (
    <>
      <Select
        options={options}
        onChange={({ value }) => setCriminalId(value)}
        isOptionDisabled={(option) => option.disabled}
      />
      <button onClick={() => onSave(criminalId)} disabled={!criminalId}>
        Save
      </button>
      <button onClick={close}>Cancel</button>
    </>
  );
}

SuspectEditor.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentCriminals: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function SuspectHistory({ suspects, investigationId }) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [currentSuspects, setCurrentSuspects] = React.useState(suspects);

  function onSave(criminalId) {
    post(`/v1/investigations/${investigationId}/suspects`, {
      suspect: {
        criminal_id: criminalId,
      },
    }).then((result) => {
      setEditorOpen(false);
      setCurrentSuspects([result].concat(currentSuspects));
    });
  }

  function handleDrop(suspectId) {
    put(`/v1/drop_suspect/${suspectId}`, {
        suspect: {
          suspect_id: suspectId,
        },}).then((data) => {
          if (data.errors) {
            console.log(data.errors);
          } else {
            setCurrentSuspects(currentSuspects.map(s => {
              if (s.data.id === data.data.id){return data} 
              return s
            }))
          }
        });
  }

  const content =
    currentSuspects.length === 0 ? (
      <p>This investigation does not have suspects associated with it.</p>
    ) : (
      <>
        <ul>
          {currentSuspects.map((suspect) => {
            const { criminal, added_on, dropped_on } = suspect.data.attributes;
            const {first_name, last_name} = criminal.data.attributes;
            return (
              <li key={`suspect-${suspect.data.id}`}>
                 <i>{first_name} {last_name} </i><br/>  
                    <ul>
                        <li>- Added: &nbsp; {FormattedDate(added_on)}</li>
                        <li>- Dropped: &nbsp; {dropped_on ? FormattedDate(dropped_on) : "N/A" } &nbsp; &nbsp;
                        {!dropped_on && (
                        <button onClick={() => handleDrop(suspect.data.id)}>Drop</button>
                        )}
                        &nbsp;
                        </li> 
                    </ul>
                
              </li>
            );
          })}
        </ul>
      </>
    );
  return (
    <>
      <div class="card red lighten-5">
        <div class="card-content">
          <span class="card-title">Suspects</span>
            {content}
            {editorOpen && (
              <SuspectEditor
                close={() => setEditorOpen(false)}
                onSave={onSave}
                currentCriminals={currentSuspects}
              />
            )}
            {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}
        </div>
      </div>
    </>
  );
}

SuspectHistory.propTypes = {
  suspects: PropTypes.arrayOf(PropTypes.object).isRequired,
  investigationId: PropTypes.string.isRequired,
};

export default SuspectHistory;
