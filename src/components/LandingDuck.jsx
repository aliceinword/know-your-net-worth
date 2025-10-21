import React from "react";

const LandingDuck = ({ style, className }) => (
  <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
    <img
      src={"/Chic Female Duck with Money Bag and Glasses.png"}
      alt="Chic Female Duck with Money Bag and Glasses"
      style={{ maxWidth: 240, width: "100%", height: "auto", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
    />
  </div>
);

export default LandingDuck;
