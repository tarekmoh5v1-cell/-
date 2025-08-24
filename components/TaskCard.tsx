import React, { useState, useMemo } from 'react';
import { Task, SubTask } from '../types';
import ProgressBar from './ProgressBar';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import Modal from './Modal';
import AddTaskDialog from './AddTaskDialog';
import FolderIcon from './icons/FolderIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import EditIcon from './icons/EditIcon';
import RepeatIcon from './icons/RepeatIcon';


interface TaskCardProps {
    task: Task;
    onDeleteTask: (task: Task) => void;
    onToggleTask: (taskId: string) => void;
    onAddSubTask: (taskId: string, subTaskName: string, subTaskDueDate: string) => void;
    onDeleteSubTask: (taskId: string, subTask: SubTask) => void;
    onToggleSubTask: (taskId: string, subTaskId: string) => void;
    onEdit: (task: Task) => void;
    onRepeatTask: (taskId: string) => void;
    onRepeatSubTask: (taskId: string, subTaskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onDeleteTask,
    onToggleTask,
    onAddSubTask,
    onDeleteSubTask,
    onToggleSubTask,
    onEdit,
    onRepeatTask,
    onRepeatSubTask,
}) => {
    const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const { mainTaskStartDate, mainTaskDueDate, hasSubTasks } = useMemo(() => {
        if (!task.subTasks || task.subTasks.length === 0) {
            return { 
                mainTaskStartDate: task.createdAt, 
                mainTaskDueDate: task.dueDate, 
                hasSubTasks: false 
            };
        }
        
        const startDates = task.subTasks.map(st => st.createdAt);
        const dueDates = task.subTasks.map(st => st.dueDate);
        
        return {
            mainTaskStartDate: Math.min(...startDates),
            mainTaskDueDate: Math.max(...dueDates),
            hasSubTasks: true,
        };
    }, [task.subTasks, task.createdAt, task.dueDate]);


    const handleAddSubTask = (subTaskName: string, subTaskDueDate: string) => {
        if (subTaskName.trim() && subTaskDueDate) {
            onAddSubTask(task.id, subTaskName.trim(), subTaskDueDate);
            setIsSubTaskModalOpen(false);
        }
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--surface-color)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    };

    const folderHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
    };
    
    const taskNameStyle: React.CSSProperties = {
        fontSize: '1.2rem',
        textDecoration: task.isCompleted ? 'line-through' : 'none',
        opacity: task.isCompleted ? 0.6 : 1,
    };
    
    const folderHeaderClickableAreaStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexGrow: 1,
        cursor: 'pointer',
    };

    const subTaskCountBadgeStyle: React.CSSProperties = {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        flexShrink: 0,
    };

    const subTaskNameStyle = (completed: boolean): React.CSSProperties => ({
        flexGrow: 1,
        fontSize: '1rem',
        textDecoration: completed ? 'line-through' : 'none',
        opacity: completed ? 0.6 : 1,
    });
    
    const iconButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted-color)',
        cursor: 'pointer',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s',
    };

    const actionIconsContainerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    };

    const subTaskContainerStyle: React.CSSProperties = {
        padding: '1.5rem',
        paddingRight: '2rem',
        maxHeight: isExpanded ? '1000px' : '0',
        transition: 'max-height 0.5s ease-in-out, padding 0.5s ease-in-out',
        overflow: 'hidden',
        paddingTop: isExpanded ? '1.5rem' : '0',
        paddingBottom: isExpanded ? '1.5rem' : '0',
    };

    const subTaskWrapperStyle: React.CSSProperties = {
        backgroundColor: 'var(--subtask-bg-color)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
    };
    
    const subTaskItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    };
    
    return (
        <div style={cardStyle}>
            {/* Main Task as Folder Header */}
            <div style={folderHeaderStyle}>
                 <div onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }} style={{display: 'flex', alignItems: 'center'}}>
                    <input type="checkbox" checked={task.isCompleted} readOnly style={{marginRight: '1rem', cursor: 'pointer'}} />
                </div>
                <div onClick={() => setIsExpanded(!isExpanded)} style={folderHeaderClickableAreaStyle}>
                    <FolderIcon style={{color: 'var(--primary-color)'}}/>
                    <span style={taskNameStyle}>{task.name}</span>
                     {task.subTasks && task.subTasks.length > 0 && (
                        <span style={subTaskCountBadgeStyle}>
                            {task.subTasks.length}
                        </span>
                    )}
                </div>

                <div style={actionIconsContainerStyle}>
                    <button style={iconButtonStyle} onMouseOver={e => e.currentTarget.style.color='var(--text-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted-color)'} onClick={(e) => {e.stopPropagation(); onRepeatTask(task.id)}} aria-label="تكرار المهمة">
                        <RepeatIcon style={{width: '20px', height: '20px'}} />
                    </button>
                    <button style={iconButtonStyle} onMouseOver={e => e.currentTarget.style.color='var(--text-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted-color)'} onClick={(e) => {e.stopPropagation(); onEdit(task)}} aria-label="تعديل المهمة">
                        <EditIcon style={{width: '20px', height: '20px'}} />
                    </button>
                     <button style={iconButtonStyle} onMouseOver={e => e.currentTarget.style.color='var(--text-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted-color)'} onClick={(e) => {e.stopPropagation(); setIsSubTaskModalOpen(true)}} aria-label="إضافة مهمة فرعية">
                        <PlusIcon style={{width: '22px', height: '22px'}} />
                    </button>
                    <button style={iconButtonStyle} onMouseOver={e => e.currentTarget.style.color='var(--danger-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted-color)'} onClick={(e) => {e.stopPropagation(); onDeleteTask(task)}} aria-label="حذف المهمة">
                        <TrashIcon style={{width: '20px', height: '20px'}} />
                    </button>
                </div>

                 <button style={iconButtonStyle} onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'طي المهام' : 'عرض المهام'}>
                    <ChevronDownIcon style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}/>
                 </button>
            </div>
            <div style={{padding: '0 1.5rem 1rem 1.5rem'}}>
              <ProgressBar 
                createdAt={mainTaskStartDate} 
                dueDate={mainTaskDueDate} 
                isCompleted={task.isCompleted}
                labelType="total"
                isEmpty={!hasSubTasks}
              />
            </div>


            {/* Sub-tasks Section (Collapsible) */}
            <div style={subTaskContainerStyle}>
                {task.subTasks.map(subTask => (
                    <div key={subTask.id} style={subTaskWrapperStyle}>
                        <div style={subTaskItemStyle}>
                             <input type="checkbox" checked={subTask.isCompleted} onChange={() => onToggleSubTask(task.id, subTask.id)} />
                             <span style={subTaskNameStyle(subTask.isCompleted)}>{subTask.name}</span>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                <button style={iconButtonStyle} onMouseOver={e => e.currentTarget.style.color='var(--text-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted-color)'} onClick={() => onRepeatSubTask(task.id, subTask.id)} aria-label="تكرار المهمة الفرعية">
                                    <RepeatIcon style={{width: '20px', height: '20px'}} />
                                </button>
                                <button style={iconButtonStyle} onMouseOver={e => e.currentTarget.style.color='var(--danger-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-muted-color)'} onClick={() => onDeleteSubTask(task.id, subTask)} aria-label="حذف المهمة الفرعية">
                                    <TrashIcon style={{width: '20px', height: '20px'}} />
                                </button>
                             </div>
                        </div>
                        <ProgressBar createdAt={subTask.createdAt} dueDate={subTask.dueDate} isCompleted={subTask.isCompleted} />
                    </div>
                ))}
            </div>
            
            <Modal isOpen={isSubTaskModalOpen} onClose={() => setIsSubTaskModalOpen(false)}>
                <AddTaskDialog 
                    title="إضافة مهمة فرعية"
                    onSubmit={handleAddSubTask}
                    onClose={() => setIsSubTaskModalOpen(false)}
                    mode="add"
                    buttonText='إضافة'
                />
            </Modal>
        </div>
    );
};

export default TaskCard;