import OfferItem from "./Offer_card";

export default function Offers() {
    return (
        <section className="offers-section p-8">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Offers</h1>
            <div className="offer-list flex flex-row items-start justify-center flex-wrap gap-10">
                <OfferItem
                    offer={{
                        title: "Special Discount on Course A",
                        description: "Get 20% off on Course A for a limited time.",
                        cost: "$79.99"
                    }}
                />
                <OfferItem
                    offer={{
                        title: "Bundle Offer: Course B + Course C",
                        description: "Enroll in all Courses for $149.99 per month.",
                        cost: "$149.99"
                    }}
                />
            </div>
        </section>
    );
}