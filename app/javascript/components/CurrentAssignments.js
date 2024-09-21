import React from 'react';
import PropTypes from 'prop-types';
import FormattedDate from './FormattedDate';

function CurrentAssignments({ assignments }) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="card yellow lighten-5">
        <div className="card-content">
          <span className="card-title">Current Assignments</span>
          <p>No current assignments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card red lighten-5">
      <div className="card-content">
        <span className="card-title">Current Assignments</span>
        <p>
          {assignments.map((assignment) => (
            <li key={assignment.data.id}>
              {assignment.data.attributes.officer.data.attributes.rank} {' '}
               {assignment.data.attributes.officer.data.attributes.first_name} {' '}
               {assignment.data.attributes.officer.data.attributes.last_name}
              <span> (as of: {FormattedDate(assignment.data.attributes.start_date)})</span>
            </li>
          ))}
        </p>
      </div>
    </div>
  );
}

CurrentAssignments.propTypes = {
  assignments: PropTypes.array.isRequired
};

export default CurrentAssignments;
