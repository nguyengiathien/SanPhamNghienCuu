import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBox({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value?.trim?.() ?? value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex justify-center"
    >
      <div className="relative w-full max-w-[560px]">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-11 bg-white border border-indigo-300 rounded-full shadow-md
                     pl-4 pr-[120px] text-sm outline-none
                     focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2
                     h-9 px-4 rounded-full
                     bg-indigo-500 hover:bg-indigo-600
                     text-white font-semibold text-sm
                     flex items-center gap-2 shadow"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          Search
        </button>
      </div>
    </form>
  );
}
