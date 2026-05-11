import {
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc
} from "firebase/firestore";

import { db } from "./config";

// Get collection name based on user
export const getCollectionName = (user) => {
    return user
        ? `interviewTasks_${user.uid}`
        : "interviewTasks_guest";
};

// LOAD TASKS
export const loadTasks = async (user) => {
    try {
        const collectionName = getCollectionName(user);

        const querySnapshot = await getDocs(
            collection(db, collectionName)
        );

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Failed to load tasks", error);

        return [];
    }
};

// SAVE TASKS
export const saveTasks = async (user, tasks) => {
    try {
        const collectionName = getCollectionName(user);

        // Save each task individually
        const promises = tasks.map((task) => {
            return setDoc(
                doc(db, collectionName, task.id.toString()),
                task
            );
        });

        await Promise.all(promises);
    } catch (error) {
        console.error("Failed to save tasks", error);
    }
};

// DELETE TASK
export const deleteTaskFromFirebase = async (
    user,
    taskId
) => {
    try {
        const collectionName = getCollectionName(user);
        await deleteDoc(
            doc(
                db,
                collectionName,
                taskId.toString()
            )
        );

    } catch (error) {
        console.error("Failed to delete task", error);
    }
};