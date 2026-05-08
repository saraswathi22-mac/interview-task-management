export const getStorageKey = (user) => {
    return user
        ? `interviewTasks_${user.uid}`
        : "interviewTasks_guest";
};

export const loadTasks = (user) => {
    try {
        const key = getStorageKey(user);

        const tasks = localStorage.getItem(key);

        return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
        console.error("Failed to load tasks", error);

        return [];
    }
};

export const saveTasks = (user, tasks) => {
    try {
        const key = getStorageKey(user);

        localStorage.setItem(
            key,
            JSON.stringify(tasks)
        );
    } catch (error) {
        console.error("Failed to save tasks", error);
    }
};