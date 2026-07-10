function TechStackCoverage({ techStackStats }) {
    const techStackData = Object.entries(techStackStats).map(
        ([name, value]) => ({
            name,
            value,
        })
    );

    return (
        <div className="rounded-2xl border border-gray-100 p-5">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">
                🚀 Tech Stack Coverage
            </h4>

            {Object.keys(techStackStats).length ? (
                <ul className="space-y-2">
                    {Object.entries(techStackStats).map(([stack, count]) => (
                        <li
                            key={stack}
                            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"
                        >
                            <span className="text-gray-700">{stack}</span>

                            <span className="font-semibold text-gray-900">{count}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
                    No tasks this week
                </div>
            )}
        </div>
    );
}

export default TechStackCoverage;