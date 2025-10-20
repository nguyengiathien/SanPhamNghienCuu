export default function OfferItem({ offer }) {
    return (
        <div className="offer-item border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 w-[20rem] relative">
            <img src="/offer-placeholder.png" alt={offer.title} className="w-full h-32 object-cover rounded mb-4" />
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{offer.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
            <button className="enroll-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                Purchase Now
            </button>
            <p className="text-gray-600 text-sm absolute bottom-4 right-4">{offer.cost}</p>
        </div>
    );
}