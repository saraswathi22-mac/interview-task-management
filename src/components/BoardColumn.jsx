import { useDroppable } from "@dnd-kit/core";

const BoardColumn = ({
    id,
    title,
    children,
    className,
}) => {
    const { setNodeRef, isOver } =
        useDroppable({
            id,
        });

    return (
        <div
            ref={setNodeRef}
            className={`${className} ${isOver
                    ? "ring-2 ring-blue-400"
                    : ""
                }`}
        >
            <h3 className="font-semibold text-gray-700 mb-4 capitalize">
                {title}
            </h3>

            {children}
        </div>
    );
};

export default BoardColumn;