import ContainerSelectionPanel from "./container_selection_panel";
import ContainerContents from "./container_contents";

export default function Container(role) {
    
    return (
        <div className="w-full flex flex-row justify-between items-start px-6 py-4">
            {/* Content for Container goes here */}
            <ContainerSelectionPanel />
            <ContainerContents role={role} />
        </div>
    );
}