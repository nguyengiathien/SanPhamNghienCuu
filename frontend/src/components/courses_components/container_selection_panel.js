import ContainerSelectionPanelTopics from "./container_selection_panel_topics";
import ContainerSelectionPanelLanguages from "./container_selection_panel_languages";

export default function ContainerSelectionPanel() {
    return (
        <div className="container-selection-panel inline-block align-top">
            {/* Content for Container Selection Panel goes here */}
            <ContainerSelectionPanelTopics />
            <ContainerSelectionPanelLanguages />
        </div>
    );
}