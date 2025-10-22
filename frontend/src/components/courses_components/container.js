import ContainerSelectionPanel from "./container_selection_panel";

export default function Container() {
    return (
        <div className="w-full flex flex-row justify-between items-start px-6 py-4">
            {/* Content for Container goes here */}
            <ContainerSelectionPanel />
        </div>
    );
}