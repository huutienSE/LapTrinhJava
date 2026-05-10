import { useEffect, useState } from "react";
import { adminService } from "../../services/api";

const ManageTopics = () => {

    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchTopics = async () => {

            try {
                const response =
                    await adminService.getTopics();

                if (response.success) {
                    setTopics(response.data);
                }
            } catch (error) {
                console.error(
                    "Error fetch topics:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopics();

    }, []);

    if (isLoading) {
        return (
            <div className="text-zinc-400">
                Loading topics...
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Manage Topics
                    </h1>
                    <p className="text-zinc-500 mt-2">
                        CRUD topics for speaking system
                    </p>
                </div>
                <button
                    className="
                        bg-indigo-500
                        hover:bg-indigo-600
                        px-5 py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    + Add Topic
                </button>
            </div>
            <div
                className="
                    bg-zinc-900
                    border border-zinc-800
                    rounded-2xl
                    overflow-hidden
                "
            >
                <table className="w-full">
                    <thead className="bg-zinc-800/50">
                        <tr className="text-left">
                            <th className="p-5">
                                ID
                            </th>
                            <th className="p-5">
                                Topic Name
                            </th>
                            <th className="p-5">
                                Description
                            </th>
                            <th className="p-5">
                                Difficulty
                            </th>
                            <th className="p-5 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((topic) => (
                            <tr
                                key={topic.topicId}
                                className="
                                    border-t border-zinc-800
                                    hover:bg-zinc-800/30
                                "
                            >
                                <td className="p-5">
                                    {topic.topicId}
                                </td>
                                <td className="p-5">
                                    {topic.topicName}
                                </td>
                                <td className="p-5 text-zinc-400">
                                    {topic.description}
                                </td>
                                <td className="p-5">
                                    <span
                                        className="
                                            px-3 py-1
                                            rounded-full
                                            text-xs
                                            font-semibold
                                            bg-indigo-500/20
                                            text-indigo-400
                                        "
                                    >
                                        {topic.difficultyLevel}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            className="
                                                px-4 py-2
                                                rounded-lg
                                                bg-yellow-500/20
                                                text-yellow-400
                                            "
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="
                                                px-4 py-2
                                                rounded-lg
                                                bg-red-500/20
                                                text-red-400
                                            "
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ManageTopics;