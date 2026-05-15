import React from "react";

const LocationSearchPanel = (props ) => {
  return (
    <div className="p-4 space-y-3">
      {props.loading && (
        <div className="flex items-center justify-center py-4">
          <div className="text-white/70">Loading suggestions...</div>
        </div>
      )}

      {!props.loading && props.suggestions && props.suggestions.length === 0 && (
        <div className="text-white/50 text-sm py-4">
          No suggestions found
        </div>
      )}

      {props.suggestions && props.suggestions.map((elem, idx) => {
        return (
          <div
            onClick={() => {
              props.onSuggestionSelect(elem);
            }}
            key={idx}
            className="flex gap-3 border-2 p-2 active:border-white active:border-2 items-center bg-white/10 backdrop-blur-md  border-white/10 px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="bg-white/20 h-8 w-11 flex items-center justify-center rounded-full text-white/80">
              <i className="ri-map-pin-fill"></i>
            </div>
            <h4 className="text-white text-sm font-medium leading-tight">
              {elem}
            </h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
