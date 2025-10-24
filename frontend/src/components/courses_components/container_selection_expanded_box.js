"use client";
import { useEffect, useState } from "react";
import SearchBox from "@/components/search_box";
import ContainerSelectionExpandedBoxTopics from "./container_selection_expanded_box_topics";

export default function ContainerSelectionExpandedBox({ children = [], visible = false, onClose = () => {} }) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredChildren, setFilteredChildren] = useState(children || []);

  // useEffect(() => {
  //   setFilteredChildren(children || []);
  // }, [children]);

  function handleSearchSubmit (value) {
    setSearchValue(value);
    // Optionally filter children by title/description
    if (!value) {
      setFilteredChildren(children || []);
      return;
    }
    const normalized = value.toLowerCase();
    setFilteredChildren((children || []).filter((c) => (c.title || "").toLowerCase().includes(normalized)));
  };

  const baseClasses = "container-selection-expanded-box fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] lg:w-[700px] h-[500px] bg-indigo-50 border rounded-2xl border-gray-200 px-6 py-8 overflow-y-auto z-50 shadow-xl";
  const classes = visible ? `${baseClasses} block` : `${baseClasses} hidden`;

  return (
    <div className={classes} role="dialog" aria-modal={visible}>
      <div className="flex justify-between items-center mb-4">
        <SearchBox placeholder="Search..." value={searchValue} onSubmit={handleSearchSubmit} />
        <button aria-label="Close" className="ml-4 text-gray-600 hover:text-gray-800 font-bold" onClick={onClose}>
          ✕
        </button>
      </div>
      <ContainerSelectionExpandedBoxTopics topicsCategory={filteredChildren} />
    </div>
  );
};
