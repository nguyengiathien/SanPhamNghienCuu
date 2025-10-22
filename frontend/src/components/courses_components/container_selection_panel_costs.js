export default function ContainerSelectionPanelCosts() {
    const costs = [
        {id: 1, title: "Free"},
        {id: 2, title: "From 0 to 100", min: 0, max: 100},
        {id: 3, title: "From 100 to 500", min: 100, max: 500},
        {id: 4, title: "From 500 to 1,000", min: 500, max: 1000},
        {id: 5, title: "Above 1,000", min: 1000, max: null},
    ];

    return (
        <div className="container-selection-panel-costs after:clear-both after:content-[''] after:block after:mt-4 after:mb-4 after:border-b after:border-gray-300">
            {/* Content for Container Selection Panel Costs goes here */}
            <h3 className="font-bold leading-normal text-base mb-2">Costs</h3>
            <ul>
                {costs.map((cost) => (
                    <li key={cost.id} className="text-xs leading-normal flex items-center gap-1">
                        <input type="checkbox" /> {cost.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}