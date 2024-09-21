import React from "react";
import PropTypes from "prop-types";
import { get } from "../api";
import InvestigationOverview from "./InvestigationOverview";
import Crimes from "./Crimes";
import InvestigationNote from "./InvestigationNote";
import CurrentAssignments from "./CurrentAssignments";
import SuspectHistory from "./SuspectHistory";

function Investigation({ investigationId }) {
  const [investigation, setInvestigation] = React.useState();

  React.useEffect(() => {
    get(`/v1/investigations/${investigationId}`).then((response) => {
      console.log(response);
      setInvestigation(response);
    });
  }, [investigationId, setInvestigation]);

  if (!investigation) {
    return <>loading...</>;
  }

  const investigationData = investigation.data.attributes;

  return (
    <>
      <h4>
        Investigation #{investigation.data.id}: {investigationData.title}
      </h4>
      <div className="row">
        <div className="col s6">
          <InvestigationOverview investigation={investigation} />
        </div>

        <div className="col s6">
          <Crimes crimes={investigationData.crimes} 
          investigationId={investigationId} />
        </div>  

        <div className="col s6">
          <SuspectHistory suspects = {investigationData.suspects}
          investigationId={investigationId} 
          />
          {/* <SuspectHistory suspects={investigationData.suspects} /> */}
        </div>

        <div className="col s6">
          <CurrentAssignments assignments={investigationData.current_assignments} />
        </div>
       
        

        <div className="col s12">
          <InvestigationNote 
          notes={investigationData.notes}
          investigationId={investigationId} />
        </div>
      </div>
    </>
  );
}

Investigation.propTypes = {
  investigationId: PropTypes.string.isRequired,
};

export default Investigation;
