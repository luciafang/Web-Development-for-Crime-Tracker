import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { find } from "lodash";
import { get, post } from "../api";

// CrimeEditor is a component that allows users to add crimes to an investigation.
function CrimeEditor({ close, onSave, currentCrimes }) {
  // Initializes options (for dropdown options) and crimeId (selected crime ID).
  const [options, setOptions] = React.useState([]);
  //  It uses get to fetch crime data and then sets options for the dropdown menu
  const [crimeId, setCrimeId] = React.useState();

  React.useEffect(() => {
    get(`/v1/crimes`).then((response) => {
      setOptions(
        response.crimes.map((crime) => {
          const crimeAlreadyExists = !!find(currentCrimes, {
            data: { id: crime.data.id },
          });
          const { name, felony } = crime.data.attributes;
          return {
            value: crime.data.id,
            label: `${name} (${felony ? "felony" : "misdemeanor"})`,
            disabled: crimeAlreadyExists,
          };
        })
      );
    });
  }, []);

  return (
    <>
      <Select
        options={options}
        onChange={({ value }) => setCrimeId(value)}
        isOptionDisabled={(option) => option.disabled}
      />
      <button onClick={() => onSave(crimeId)} disabled={!crimeId}>
        Save
      </button>{" "}
      <button onClick={close}>Cancel</button>
    </>
  );
}

CrimeEditor.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentCrimes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

// displays a list of crimes associated with an investigation and includes an interface to add new crimes.
function Crimes({ crimes, investigationId }) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [currentCrimes, setCurrentCrimes] = React.useState(crimes);


  // when use the onSave, use the crime investigation, need crime_id and investigation_id
  function onSave(crimeId) {
    post(`/v1/investigations/${investigationId}/crime_investigations`, {
      crime_investigation: {
        crime_id: crimeId,
      },
    }).then((result) => {
      setEditorOpen(false);
      // take the current crimes and add the new crime to the front of the list
      setCurrentCrimes([result].concat(currentCrimes));
    });
  }

  const content =
    currentCrimes.length === 0 ? (
      <p>This investigation does not yet have crimes associated with it.</p>
    ) : (
      <>
        <ul>
          {currentCrimes.map((crime) => {
            const { name, felony } = crime.data.attributes;
            return (
              <li key={`crime-${crime.data.id}`}>
                <p>
                  - {name} {felony ? "(felony)" : "(misdemeanor)"}
                </p>
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
          <span class="card-title">Crimes</span>
            {content}
            {editorOpen && (
              <CrimeEditor
                close={() => setEditorOpen(false)}
                onSave={onSave}
                currentCrimes={currentCrimes}
              />
            )}
            {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}

        </div>
      </div>
    </>
  );
}

Crimes.propTypes = {
  crimes: PropTypes.arrayOf(PropTypes.object).isRequired,
  investigationId: PropTypes.string.isRequired,
};

export default Crimes;