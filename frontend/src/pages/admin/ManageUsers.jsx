import { useEffect, useState } from "react";
import { adminUserService } from "../../services";
import ActionButton from "../../components/common/ActionButton";
import SearchInput from "../../components/common/SearchInput";

// ─────────────────────────────────────────────────────────────
// ROLE BADGE
// ─────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {

    const styles = {
        ADMIN: "bg-purple-500/20 text-purple-400",
        LEARNER: "bg-blue-500/20 text-blue-400",
        MENTOR: "bg-emerald-500/20 text-emerald-400",
    };

    return (
        <span
            className={`
                px-3 py-1
                rounded-full
                text-xs
                font-semibold
                ${styles[role] ?? "bg-zinc-700 text-zinc-400"}
            `}
        >
            {role}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {

    return (
        <span
            className={`
                px-3 py-1
                rounded-full
                text-xs
                font-semibold
                ${
                    status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                }
            `}
        >
            {status === "ACTIVE"
                ? "Activate"
                : "Disable"}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────
const ConfirmModal = ({
    user,
    onConfirm,
    onCancel,
    isLoading,
}) => {

    return (
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
                    max-w-sm
                "
            >
                <h2
                    className="
                        text-xl
                        font-bold
                        text-white
                        mb-3
                    "
                >
                    {user.status === "ACTIVE"
                        ? "Disable user?"
                        : "Activate user?"}
                </h2>

                <p className="text-zinc-400 text-sm mb-6">
                    {user.status === "ACTIVE"
                        ? (
                            <>
                                Account{" "}
                                <span className="text-white font-medium">
                                    {user.email}
                                </span>{" "}
                                will be disable.
                            </>
                        )
                        : (
                            <>
                                Account{" "}
                                <span className="text-white font-medium">
                                    {user.email}
                                </span>{" "}
                                will be activated.
                            </>
                        )}
                </p>

                <div className="flex justify-end gap-3">

                    <ActionButton
                        variant="delete"
                        onClick={onCancel}
                    >
                        Cancel
                    </ActionButton>

                    <ActionButton
                        variant={
                            user.status === "ACTIVE"
                                ? "delete"
                                : "add"
                        }
                        onClick={onConfirm}
                    >
                        {isLoading
                            ? "Saving..."
                            : user.status === "ACTIVE"
                                ? "Disable"
                                : "Activate"}
                    </ActionButton>

                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const ManageUsers = () => {

    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSearching, setIsSearching] =
        useState(false);

    const [searchEmail, setSearchEmail] =
        useState("");

    const [confirmUser, setConfirmUser] =
        useState(null);

    const [isToggling, setIsToggling] =
        useState(false);

    // ─────────────────────────────────────────────────────────
    // FETCH USERS
    // ─────────────────────────────────────────────────────────
    useEffect(() => {

        const fetchUsers = async () => {

            try {

                setIsLoading(true);

                const response =
                    await adminUserService.getAllUsers();

                if (response.success) {
                    setUsers(response.data ?? []);
                }

            } catch (error) {

                console.error(error);

            } finally {

                setIsLoading(false);
            }
        };

        fetchUsers();

    }, []);

    // ─────────────────────────────────────────────────────────
    // SEARCH USER BY EMAIL
    // ─────────────────────────────────────────────────────────
    const handleSearch = async (value) => {

        try {

            setSearchEmail(value);

            setIsSearching(true);

            // EMPTY SEARCH => GET ALL USERS
            if (!value.trim()) {

                const response =
                    await adminUserService.getAllUsers();

                setUsers(response.data ?? []);

                return;
            }
            
            const response =
                await adminUserService.getUserByEmail(value);

            setUsers(
                response.data
                    ? [response.data]
                    : []
            );

        } catch (error) {

            console.error(error);

            setUsers([]);

        } finally {

            setIsSearching(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // TOGGLE USER STATUS
    // ─────────────────────────────────────────────────────────
    const handleToggleStatus = async () => {

        if (!confirmUser) return;

        try {

            setIsToggling(true);

            const response =
                await adminUserService.updateUserStatus(
                    confirmUser.userId
                );

            if (response.success) {

                setUsers((prev) =>
                    prev.map((user) =>
                        user.userId === confirmUser.userId
                            ? response.data
                            : user
                    )
                );

                setConfirmUser(null);
            }

        } catch (error) {

            console.error(error);

            alert("Update status failed");

        } finally {

            setIsToggling(false);
        }
    };

    // ─────────────────────────────────────────────────────────
    // LOADING
    // ─────────────────────────────────────────────────────────
    if (isLoading) {

        return (
            <div className="text-zinc-400">
                Loading users...
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <div>

            {/* HEADER */}
            <div className="mb-8">

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-white
                    "
                >
                    Manage Users
                </h1>

                <p className="text-zinc-500 mt-2">
                    View and manage user accounts
                </p>

            </div>

            {/* SEARCH */}
            <div className="mb-6">

                <SearchInput
                    placeholder="Search user by email..."
                    onSearch={handleSearch}
                    isSearching={isSearching}
                    className="max-w-md"
                />

            </div>

            {/* TABLE */}
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

                        <tr
                            className="
                                text-left
                                text-zinc-400
                                text-sm
                            "
                        >
                            <th className="p-5">#</th>
                            <th className="p-5">User</th>
                            <th className="p-5">Email</th>
                            <th className="p-5">Role</th>
                            <th className="p-5">Joined</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-center">
                                Actions
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {users.length === 0 ? (

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
                                     `No user found with email "${searchEmail}"`
                                    }
                                </td>
                            </tr>

                        ) : (

                            users.map((user, index) => (

                                <tr
                                    key={user.userId}
                                    className="
                                        border-t border-zinc-800
                                        hover:bg-zinc-800/30
                                        transition-colors
                                    "
                                >

                                    {/* INDEX */}
                                    <td
                                        className="
                                            p-5
                                            text-zinc-500
                                            text-sm
                                        "
                                    >
                                        {index + 1}
                                    </td>

                                    {/* USER */}
                                    <td className="p-5">

                                        <div
                                            className="
                                                flex items-center gap-3
                                            "
                                        >

                                            <div
                                                className="
                                                    w-9 h-9
                                                    rounded-full
                                                    bg-indigo-500/20
                                                    text-indigo-400
                                                    flex items-center justify-center
                                                    text-sm
                                                    font-semibold
                                                    shrink-0
                                                "
                                            >
                                                {(user.userName ?? user.email ?? "?")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <span
                                                className="
                                                    text-white
                                                    font-medium
                                                "
                                            >
                                                {user.userName ?? "—"}
                                            </span>

                                        </div>

                                    </td>

                                    {/* EMAIL */}
                                    <td
                                        className="
                                            p-5
                                            text-zinc-400
                                            text-sm
                                        "
                                    >
                                        {user.email}
                                    </td>

                                    {/* ROLE */}
                                    <td className="p-5">
                                        <RoleBadge role={user.role} />
                                    </td>

                                    {/* CREATED DATE */}
                                    <td
                                        className="
                                            p-5
                                            text-zinc-400
                                            text-sm
                                        "
                                    >
                                        {user.createdDate ?? "—"}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-5">
                                        <StatusBadge status={user.status} />
                                    </td>

                                    {/* ACTION */}
                                    <td className="px-5 py-4">

                                        <div className="flex justify-center">

                                            <ActionButton
                                                variant={
                                                    user.status === "ACTIVE"
                                                        ? "delete"
                                                        : "add"
                                                }
                                                onClick={() =>
                                                    setConfirmUser(user)
                                                }
                                            >
                                                {user.status === "ACTIVE"
                                                    ? "Disable"
                                                    : "Activate"}
                                            </ActionButton>

                                        </div>

                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>
            </div>

            {/* CONFIRM MODAL */}
            {
                confirmUser && (
                    <ConfirmModal
                        user={confirmUser}
                        onConfirm={handleToggleStatus}
                        onCancel={() =>
                            setConfirmUser(null)
                        }
                        isLoading={isToggling}
                    />
                )
            }
        </div>
    );
};

export default ManageUsers;