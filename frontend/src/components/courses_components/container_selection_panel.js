import ContainerSelectionPanelTopics from "./container_selection_panel_topics";
import ContainerSelectionPanelLanguages from "./container_selection_panel_languages";
import ContainerSelectionPanelCosts from "./container_selection_panel_costs";
import ContainerSelectionPanelDuration from "./container_selection_panel_duration";
import ContainerSelectionExpandedBox from "./container_selection_expanded_box";

export default function ContainerSelectionPanel() {
    return (
        <div className="container-selection-panel inline-block align-top border-r border-gray-300 pr-6">
            {/* Content for Container Selection Panel goes here */}
            <ContainerSelectionPanelTopics />
            <ContainerSelectionPanelCosts />
            <ContainerSelectionPanelDuration />
            <ContainerSelectionPanelLanguages />
            <ContainerSelectionExpandedBox />
        </div>
    );
}