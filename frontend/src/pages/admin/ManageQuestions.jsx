import { useEffect, useState } from "react";
import { adminService } from "../../services/api";
import { getApiErrorMessage } from "../../utils/apiError.js";
import ActionButton from "../../components/common/ActionButton";
import SearchInput from "../../components/common/SearchInput";

const ManageQuestions = () => {

    const [questions, setQuestions] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isSearching, setIsSearching] =useState(false);
    const [searchQuestion, setSearchQuestion] =useState("");

    const [newQuestion, setNewQuestion] = useState({
        topicId: "",
        description: "",
        difficultyLevel: "BEGINNER",
    });

    // ── EDIT ──────────────────────────────────────────────────────────────
    const handleEdit = (question) => {
        setEditingQuestion(question);
        setShowEditModal(true);
    };

    const handleSearch = async (value) => {
        
        try {
            setIsSearching(true);
            setSearchQuestion(value);

            if (!value.trim()) {
                const response = await adminService.getQuestions();

                setQuestions(response.data ?? [])
                return;
            }

            const response = await adminService.getQuestionsByDescription(value);

            setQuestions(response.data ? [response.data] : []);

        } catch (error) {
            console.error(error);
            setQuestions([]);
        } finally {
            setIsSearching(false)
        }


    }

    const handleUpdateQuestion = async () => {
        try {
            setIsUpdating(true);

            const response = await adminService.updateQuestion(
                editingQuestion,
                editingQuestion.questionId   // fix #9: was topicId
            );

            if (response.success) {
                setQuestions((prev) =>
                    prev.map((question) =>
                        question.questionId === editingQuestion.questionId  // fix #10
                            ? response.data
                            : question
                    )
                );
                setShowEditModal(false);
                alert("Update success");
            }
        } catch (error) {
            console.error(error);
            alert(getApiErrorMessage(error, "Update failed"));
        } finally {
            setIsUpdating(false);
        }
    };

    // ── DELETE ─────────────────────────────────────────────────────────────
    const handleDelete = async (questionId) => {   // fix #11: was topicId
        const confirmDelete = window.confirm("Delete this question?");
        if (!confirmDelete) return;

        try {
            const response = await adminService.deleteQuestion(questionId);  // fix #11

            if (response.success) {
                setQuestions((prev) =>
                    prev.filter(
                        (question) => question.questionId !== questionId  // fix #11
                    )
                );
                alert("Delete success");
            }
        } catch (error) {
            console.error(error);
            alert(getApiErrorMessage(error, "Delete failed"));
        }
    };

    // ── CREATE ─────────────────────────────────────────────────────────────
    const handleCreateQuestion = async () => {
        // fix #15: validate topicId too
        if (
            !newQuestion.topicId ||
            !newQuestion.description.trim()
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            setIsCreating(true);

            const response = await adminService.createQuestion(newQuestion);

            if (response.success) {
                alert("Create question success");

                setQuestions((prev) => [...prev, response.data]);

                setShowCreateModal(false);

                setNewQuestion({
                    topicId: "",
                    description: "",
                    difficultyLevel: "BEGINNER",
                });
            }
        } catch (error) {
            console.error(error);
            alert(getApiErrorMessage(error, "Create question failed"));
        } finally {
            setIsCreating(false);
        }
    };

    // ── FETCH ──────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await adminService.getQuestions();
                if (response.success) {
                    setQuestions(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchTopics = async () => {
            try {
                const response = await adminService.getTopics();
                if (response.success) {
                    setTopics(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchTopics();
        fetchQuestions();
    }, []);

    if (isLoading) {
        return (
            <div className="text-zinc-400">Loading questions...</div>
        );
    }

    return (
        <div>
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Manage Questions
                    </h1>
                    <p className="text-zinc-500 mt-2">
                        CRUD questions for speaking system
                    </p>
                </div>
                <ActionButton
                    variant="add"
                    size="lg"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Add Question
                </ActionButton>
            </div>

            <div className="mb-6">
                <SearchInput
                    placeholder="Search question by description... "
                    onSearch={handleSearch}
                    isSearching={isSearching}
                    className="max-w-md"
                />
            </div>

            {/* ── TABLE ──────────────────────────────────────────────────── */}
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
                            <th className="p-5">Topic</th>
                            <th className="p-5">Question</th>
                            <th className="p-5">Date</th>
                            <th className="p-5">Level</th>
                            <th className="p-5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length === 0 ? (
                           <tr>
                                <td
                                    colSpan={7}
                                    className="
                                        p-10
                                        text-center
                                        text-zinc-500
                                    "
                                >
                                    {
                                     `No user found with email "${searchQuestion}"`
                                    }
                                </td>
                            </tr> 
                        ) : (questions.map((question) => (
                            <tr
                                key={question.questionId}
                                className="
                                    border-t border-zinc-800
                                    hover:bg-zinc-800/30
                                "
                            >
                                {/* fix #4: render topicName */}
                                <td className="p-5 text-zinc-400">
                                    {question.topicName}
                                </td>
                                {/* fix #3: render description, not questionName */}
                                <td className="p-5 text-white">
                                    {question.description}
                                </td>
                                <td className="p-5 text-zinc-400 text-sm">
                                    {question.createdDate} 
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
                                        {question.difficultyLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3 justify-center">
                                        <ActionButton
                                            variant="edit"
                                            onClick={() => handleEdit(question)}
                                        >
                                            Edit
                                        </ActionButton>
                                        <ActionButton
                                            variant="delete"
                                            onClick={() =>
                                                handleDelete(question.questionId)
                                            }
                                        >
                                            Delete
                                        </ActionButton>
                                    </div>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>

            {/* ── CREATE MODAL ────────────────────────────────────────────── */}
            {showCreateModal && (
                <div
                    className="
                        fixed inset-0
                        bg-black/60
                        flex items-center justify-center
                        z-50
                    "
                >
                    <div
                        className="
                            bg-zinc-900
                            border border-zinc-800
                            rounded-2xl
                            p-6
                            w-full
                            max-w-lg
                        "
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Create Question
                        </h2>

                        <div className="space-y-4">
                            {/* fix #7: Topic dropdown */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">
                                    Topic
                                </label>
                                <select
                                    value={newQuestion.topicId}
                                    onChange={(e) =>
                                        setNewQuestion({
                                            ...newQuestion,
                                            topicId: Number(e.target.value),
                                        })
                                    }
                                    className="
                                        w-full p-3
                                        rounded-xl
                                        bg-zinc-800
                                        border border-zinc-700
                                        text-white
                                    "
                                >
                                    <option value="">Select Topic</option>
                                    {topics.map((topic) => (
                                        <option
                                            key={topic.topicId}
                                            value={topic.topicId}
                                        >
                                            {topic.topicName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* fix #5 + #6: Question textarea bound to description */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">
                                    Question
                                </label>
                                <textarea
                                    rows="4"
                                    value={newQuestion.description}
                                    onChange={(e) =>
                                        setNewQuestion({
                                            ...newQuestion,
                                            description: e.target.value,
                                        })
                                    }
                                    className="
                                        w-full p-3
                                        rounded-xl
                                        bg-zinc-800
                                        border border-zinc-700
                                        text-white
                                    "
                                    placeholder="Enter question"
                                />
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={newQuestion.difficultyLevel}
                                    onChange={(e) =>
                                        setNewQuestion({
                                            ...newQuestion,
                                            difficultyLevel: e.target.value,
                                        })
                                    }
                                    className="
                                        w-full p-3
                                        rounded-xl
                                        bg-zinc-800
                                        border border-zinc-700
                                        text-white
                                    "
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <ActionButton
                                variant="delete"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="add"
                                onClick={handleCreateQuestion}
                            >
                                {isCreating ? "Creating..." : "Create"}
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ──────────────────────────────────────────────── */}
            {showEditModal && editingQuestion && (
                <div
                    className="
                        fixed inset-0
                        bg-black/60
                        flex items-center justify-center
                        z-50
                    "
                >
                    <div
                        className="
                            bg-zinc-900
                            border border-zinc-800
                            rounded-2xl
                            p-6
                            w-full
                            max-w-lg
                        "
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Edit Question
                        </h2>

                        <div className="space-y-4">
                            {/* Topic dropdown */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">
                                    Topic
                                </label>
                                <select
                                    value={editingQuestion.topicId}
                                    onChange={(e) =>
                                        setEditingQuestion({
                                            ...editingQuestion,
                                            topicId: Number(e.target.value),
                                        })
                                    }
                                    className="
                                        w-full p-3
                                        rounded-xl
                                        bg-zinc-800
                                        border border-zinc-700
                                        text-white
                                    "
                                >
                                    <option value="">Select Topic</option>
                                    {topics.map((topic) => (
                                        <option
                                            key={topic.topicId}
                                            value={topic.topicId}
                                        >
                                            {topic.topicName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* fix #12 + #13: Question bound to editingQuestion.description */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">
                                    Question
                                </label>
                                <textarea
                                    rows="4"
                                    value={editingQuestion.description}
                                    onChange={(e) =>
                                        setEditingQuestion({   // fix #13: was setNewQuestion
                                            ...editingQuestion,
                                            description: e.target.value,
                                        })
                                    }
                                    className="
                                        w-full p-3
                                        rounded-xl
                                        bg-zinc-800
                                        border border-zinc-700
                                        text-white
                                    "
                                    placeholder="Enter question"
                                />
                            </div>
                            {/* fix #12: Difficulty bound to editingQuestion.difficultyLevel */}
                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={editingQuestion.difficultyLevel}  // fix #12: was newQuestion.topicId
                                    onChange={(e) =>
                                        setEditingQuestion({   // fix #13: was setNewQuestion
                                            ...editingQuestion,
                                            difficultyLevel: e.target.value,
                                        })
                                    }
                                    className="
                                        w-full p-3
                                        rounded-xl
                                        bg-zinc-800
                                        border border-zinc-700
                                        text-white
                                    "
                                >
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <ActionButton
                                variant="delete"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="add"
                                onClick={handleUpdateQuestion}
                            >
                                {/* fix #14: was isCreating / "Create" */}
                                {isUpdating ? "Updating..." : "Update"}
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageQuestions;