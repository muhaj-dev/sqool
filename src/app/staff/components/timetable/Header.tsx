import React from "react";

export const HeaderSection = () => (
  <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold">Timetable</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
        <span>Home</span>
        <span>›</span>
        <span>Timetable</span>
      </div>
    </div>
  </header>
);