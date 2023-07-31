import React from "react";

function Spinner() {
  return (
    <div className="text-center my-4">
      <img src={"/images/loading.gif"} alt="" style={{ width: 50 }} />
    </div>
  );
}

export default Spinner;
