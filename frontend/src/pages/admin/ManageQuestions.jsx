import { useEffect, useState } from "react";
import { adminService } from "../../services/api";



const ManageQuestions = () => {

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newQuestion, setQuestion] = useState({
        topicId: "",
        description: "",
        correctAnswer: "",
        difficultyLevel: "BEGINNER",
    });
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = 
                    await adminService.getQuestions();

                if (response.success) {
                    setQuestions(response.data);
                }

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestions();
    }, [])

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
                <ActionButton variant="add" size="lg" onClick={() => setShowCreateModal(true)}>
                    + Add Topic
                </ActionButton>
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
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">

                                        <ActionButton
                                            variant="edit"
                                            onClick={() => handleEdit(topic)}
                                        >
                                            Edit
                                        </ActionButton>

                                        <ActionButton
                                            variant="delete"
                                            onClick={() => handleDelete(topic.topicId)}
                                        >
                                            Delete
                                        </ActionButton>

                                    </div>
                                </td>           
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {
                showCreateModal && (
                    <div className="
                        fixed inset-0
                        bg-black/60
                        flex items-center justify-center
                        z-50
                    ">
                        <div className="
                            bg-zinc-900
                            border border-zinc-800
                            rounded-2xl
                            p-6
                            w-full
                            max-w-lg
                        ">
                            <h2 className="
                                text-2xl
                                font-bold
                                text-white
                                mb-6
                            ">
                                Create Topic
                            </h2>
                            <div className="space-y-4">
                                {/* TOPIC NAME */}
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        text-zinc-400
                                        mb-2
                                    ">
                                        Topic Name
                                    </label>

                                    <input
                                        type="text"
                                        value={newTopic.topicName}
                                        onChange={(e) =>
                                            setNewTopic({
                                                ...newTopic,
                                                topicName: e.target.value,
                                            })
                                        }
                                        className="
                                            w-full
                                            p-3
                                            rounded-xl
                                            bg-zinc-800
                                            border border-zinc-700
                                            text-white
                                        "
                                        placeholder="Enter topic name"
                                    />
                                </div>
                                {/* DESCRIPTION */}
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        text-zinc-400
                                        mb-2
                                    ">
                                        Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={newTopic.description}
                                        onChange={(e) =>
                                            setNewTopic({
                                                ...newTopic,
                                                description: e.target.value,
                                            })
                                        }
                                        className="
                                            w-full
                                            p-3
                                            rounded-xl
                                            bg-zinc-800
                                            border border-zinc-700
                                            text-white
                                        "
                                        placeholder="Enter description"
                                    />
                                </div>
                                {/* DIFFICULTY */}
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        text-zinc-400
                                        mb-2
                                    ">
                                        Difficulty
                                    </label>
                                    <select
                                        value={newTopic.difficultyLevel}
                                        onChange={(e) =>
                                            setNewTopic({
                                                ...newTopic,
                                                difficultyLevel: e.target.value,
                                            })
                                        }
                                        className="
                                            w-full
                                            p-3
                                            rounded-xl
                                            bg-zinc-800
                                            border border-zinc-700
                                            text-white
                                        "
                                    >
                                        <option value="BEGINNER">
                                            Beginner
                                        </option>
                                        <option value="INTERMEDIATE">
                                            Intermediate
                                        </option>
                                        <option value="ADVANCED">
                                            advanced
                                        </option>
                                    </select>
                                </div>
                            </div>
                            {/* ACTIONS */}
                            <div className="
                                flex justify-end gap-3
                                mt-6
                            ">
                                <ActionButton
                                    variant="delete"
                                    onClick={() =>
                                        setShowCreateModal(false)
                                    }
                                >
                                    Cancel
                                </ActionButton>

                                <ActionButton
                                    variant="add"
                                    onClick={handleCreateTopic}
                                >
                                    {isCreating ? "Creating..." : "Create"}
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showEditModal && (
                    <div className="
                        fixed inset-0
                        bg-black/60
                        flex items-center justify-center
                        z-50
                    ">
                        <div className="
                            bg-zinc-900
                            border border-zinc-800
                            rounded-2xl
                            p-6
                            w-full
                            max-w-lg
                        ">
                            <h2 className="
                                text-2xl
                                font-bold
                                text-white
                                mb-6
                            ">
                                Edit Topic
                            </h2>
                            <div className="space-y-4">
                                {/* TOPIC NAME */}
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        text-zinc-400
                                        mb-2
                                    ">
                                        Topic Name
                                    </label>

                                    <input
                                        type="text"
                                        value={editingTopic.topicName}
                                        onChange={(e) =>
                                            setEditingTopic({
                                                ...editingTopic,
                                                topicName: e.target.value,
                                            })
                                        }
                                        className="
                                            w-full
                                            p-3
                                            rounded-xl
                                            bg-zinc-800
                                            border border-zinc-700
                                            text-white
                                        "
                                        placeholder="Enter topic name"
                                    />
                                </div>
                                {/* DESCRIPTION */}
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        text-zinc-400
                                        mb-2
                                    ">
                                        Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={editingTopic.description}
                                        onChange={(e) =>
                                            setEditingTopic({
                                                ...editingTopic,
                                                description: e.target.value,
                                            })
                                        }
                                        className="
                                            w-full
                                            p-3
                                            rounded-xl
                                            bg-zinc-800
                                            border border-zinc-700
                                            text-white
                                        "
                                        placeholder="Enter description"
                                    />
                                </div>
                                {/* DIFFICULTY */}
                                <div>
                                    <label className="
                                        block
                                        text-sm
                                        text-zinc-400
                                        mb-2
                                    ">
                                        Difficulty
                                    </label>
                                    <select
                                        value={editingTopic.difficultyLevel}
                                        onChange={(e) =>
                                            setEditingTopic({
                                                ...editingTopic,
                                                difficultyLevel: e.target.value,
                                            })
                                        }
                                        className="
                                            w-full
                                            p-3
                                            rounded-xl
                                            bg-zinc-800
                                            border border-zinc-700
                                            text-white
                                        "
                                    >
                                        <option value="BEGINNER">
                                            Beginner
                                        </option>
                                        <option value="INTERMEDIATE">
                                            Intermediate
                                        </option>
                                        <option value="ADVANCED">
                                            advanced
                                        </option>
                                    </select>
                                </div>
                            </div>
                            {/* ACTIONS */}
                            <div className="
                                flex justify-end gap-3
                                mt-6
                            ">
                                <ActionButton
                                    variant="delete"
                                    onClick={() =>
                                        setShowEditModal(false)
                                    }
                                >
                                    Cancel
                                </ActionButton>

                                <ActionButton
                                    variant="add"
                                    onClick={handleUpdateTopic}
                                >
                                    {isCreating ? "Creating..." : "Create"}
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ManageQuestions;