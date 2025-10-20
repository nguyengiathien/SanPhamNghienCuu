import CurrentClassesCard from "@/components/provider_home_components/current_classes_card";

export default function CurrentClasses() {
    return (
        <section className="current-classes-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Current Classes</h1>
            <div className="course-list grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <CurrentClassesCard classes={{ name: "Class 1"}} />
                <CurrentClassesCard classes={{ name: "Class 2"}} />
                <CurrentClassesCard classes={{ name: "Class 3"}} />
                <CurrentClassesCard classes={{ name: "Class 4"}} />
                <CurrentClassesCard classes={{ name: "Class 5"}} />
            </div>
        </section>
    );
}