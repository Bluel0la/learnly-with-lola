
import React from "react";

const ProfileInfo = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-center gap-2 text-xs md:text-sm">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default ProfileInfo;
