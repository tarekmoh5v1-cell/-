import React, { useState, useEffect } from 'react';
import { Task, SubTask } from './types';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import PlusIcon from './components/icons/PlusIcon';
import Modal from './components/Modal';
import AddTaskDialog from './components/AddTaskDialog';
import ConfirmDialog from './components/ConfirmDialog';


const App = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem('tasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error("Could not parse tasks from localStorage", error);
            return [];
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<{ taskId: string; subTaskId?: string; name: string } | null>(null);


    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);
    

    const addTask = (taskName: string) => {
        if (taskName.trim()) {
            const now = Date.now();
            const newTask: Task = {
                id: now.toString(),
                name: taskName.trim(),
                isCompleted: false,
                createdAt: now,
                dueDate: now, // Default due date is same as creation, derived from subtasks later
                subTasks: [],
            };
            setTasks([...tasks, newTask]);
            setIsModalOpen(false);
        }
    };
    
    const deleteTask = (task: Task) => {
        setTaskToDelete({ taskId: task.id, name: task.name });
    };
    
    const toggleTaskCompletion = (taskId: string) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleUpdateTaskName = (name: string) => {
        if (editingTask) {
            setTasks(tasks.map(t => 
                t.id === editingTask.id ? { ...t, name: name.trim() } : t
            ));
        }
        setEditingTask(null);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };
    
    const addSubTask = (taskId: string, subTaskName: string, subTaskDueDate: string) => {
        const parentTask = tasks.find(task => task.id === taskId);
        if (!parentTask) {
            console.error("Parent task not found for sub-task creation.");
            return;
        }

        const newSubTaskDueDateMs = new Date(subTaskDueDate).getTime();

        const newSubTask: SubTask = {
            id: Date.now().toString(),
            name: subTaskName,
            isCompleted: false,
            createdAt: Date.now(),
            dueDate: newSubTaskDueDateMs,
        };

        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, subTasks: [...task.subTasks, newSubTask] } : task
        ));
    };

    const deleteSubTask = (taskId: string, subTask: SubTask) => {
        setTaskToDelete({ taskId, subTaskId: subTask.id, name: subTask.name });
    };
    
    const toggleSubTaskCompletion = (taskId: string, subTaskId: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, subTasks: task.subTasks.map(st => 
                    st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
                  ) }
                : task
        ));
    };
    
    const repeatTask = (taskId: string) => {
        const taskToRepeat = tasks.find(t => t.id === taskId);
        if (!taskToRepeat) return;

        const now = Date.now();
        const originalStartDate = taskToRepeat.createdAt;

        const newSubTasks = taskToRepeat.subTasks.map(subTask => {
            const offset = subTask.createdAt - originalStartDate;
            const duration = subTask.dueDate - subTask.createdAt;
            const newCreatedAt = now + offset;
            const newDueDate = newCreatedAt + (duration > 0 ? duration : 60 * 60 * 1000);
            
            return {
                ...subTask,
                id: `${Date.now()}-${Math.random()}`,
                isCompleted: false,
                createdAt: newCreatedAt,
                dueDate: newDueDate,
            };
        });
        
        const taskDuration = taskToRepeat.dueDate - taskToRepeat.createdAt;

        const newTask: Task = {
            ...taskToRepeat,
            id: `${now}`,
            isCompleted: false,
            createdAt: now,
            dueDate: now + (taskDuration > 0 ? taskDuration : 24 * 60 * 60 * 1000),
            subTasks: newSubTasks,
        };

        setTasks(prevTasks => [...prevTasks, newTask]);
    };
    
    const repeatSubTask = (taskId: string, subTaskId: string) => {
        setTasks(currentTasks => currentTasks.map(task => {
            if (task.id !== taskId) return task;

            const subTaskToRepeat = task.subTasks.find(st => st.id === subTaskId);
            if (!subTaskToRepeat) return task;

            const now = Date.now();
            const duration = subTaskToRepeat.dueDate - subTaskToRepeat.createdAt;

            const newSubTask: SubTask = {
                ...subTaskToRepeat,
                id: `${now}-${Math.random()}`,
                isCompleted: false,
                createdAt: now,
                dueDate: now + (duration > 0 ? duration : 60 * 60 * 1000), // Default 1 hour duration
            };

            return {
                ...task,
                subTasks: [...task.subTasks, newSubTask],
            };
        }));
    };

    const handleConfirmDelete = () => {
        if (!taskToDelete) return;

        if (taskToDelete.subTaskId) {
            // Delete sub-task
            setTasks(tasks.map(task =>
                task.id === taskToDelete.taskId 
                    ? { ...task, subTasks: task.subTasks.filter(st => st.id !== taskToDelete.subTaskId) }
                    : task
            ));
        } else {
            // Delete main task
            setTasks(tasks.filter(task => task.id !== taskToDelete.taskId));
        }
        
        setTaskToDelete(null); // Close the dialog
    };

    const containerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '800px',
    };
    
    const fabStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 999,
        transition: 'transform 0.2s, background-color 0.2s',
    };


    return (
        <div style={containerStyle}>
            <Header />
            <div>
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onDeleteTask={deleteTask}
                        onToggleTask={toggleTaskCompletion}
                        onAddSubTask={addSubTask}
                        onDeleteSubTask={deleteSubTask}
                        onToggleSubTask={toggleSubTaskCompletion}
                        onEdit={handleEditTask}
                        onRepeatTask={repeatTask}
                        onRepeatSubTask={repeatSubTask}
                    />
                ))}
            </div>
             <button
                onClick={() => setIsModalOpen(true)}
                style={fabStyle}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                aria-label="إضافة مهمة جديدة"
            >
                <PlusIcon style={{ width: '32px', height: '32px' }} />
            </button>

            <Modal isOpen={isModalOpen || !!editingTask} onClose={closeModal}>
                {editingTask ? (
                    <AddTaskDialog
                        title="تعديل المهمة"
                        onSubmit={(name) => handleUpdateTaskName(name)}
                        onClose={closeModal}
                        initialName={editingTask.name}
                        mode="edit-name"
                        buttonText="حفظ"
                    />
                ) : (
                    <AddTaskDialog
                        title="إضافة مهمة رئيسية جديدة"
                        onSubmit={(name) => addTask(name)}
                        onClose={closeModal}
                        mode="add"
                        buttonText="إضافة"
                        hideDurationSelector
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="تأكيد الحذف"
                message={taskToDelete ? `هل أنت متأكد أنك تريد حذف "${taskToDelete.name}"؟` : ''}
            />
        </div>
    );
};

export default App;