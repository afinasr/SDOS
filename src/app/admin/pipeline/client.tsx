"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { playTickSound, playSwooshSound } from "@/lib/audio";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { updateTaskStatus, addTask, deleteTask } from "./actions";

export default function PipelineClient({ initialData }: { initialData: any }) {
  const [tasks, setTasks] = useState<any[]>(initialData.tasks);
  const projects = initialData.projects;

  const [isPending, startTransition] = useTransition();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", project_id: "" });

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    // Add a slight delay to allow the drag image to be generated before styling
    setTimeout(() => {
      const el = document.getElementById(`task-${taskId}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, taskId: string) => {
    const el = document.getElementById(`task-${taskId}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    playTickSound();
    
    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: targetStatus } : t));

    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, targetStatus);
      } catch (err: any) {
        toast.error(err.message);
        // Revert on error
        setTasks(initialData.tasks); 
      }
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project_id) {
      toast.error("Please fill all fields");
      return;
    }
    
    startTransition(async () => {
      try {
        await addTask(newTask.project_id, newTask.title, 'To Do');
        setShowAddTask(false);
        setNewTask({ title: "", project_id: "" });
        toast.success("Task added");
        playSwooshSound();
        // The server action revalidates the path, so props will update.
        // But for snappy UI, we could mock it.
        window.location.reload(); 
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      try {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end pt-2">
        <div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-white">Task Pipeline</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Post-production Kanban board for tracking edits and deliverables.</p>
        </div>
        <button 
          onClick={() => setShowAddTask(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {showAddTask && (
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 p-5 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddTask} className="flex gap-4 items-end">
             <div className="flex-1 space-y-2">
               <label className="text-xs font-semibold text-zinc-500 uppercase">Project</label>
               <select 
                 value={newTask.project_id}
                 onChange={e => setNewTask({...newTask, project_id: e.target.value})}
                 className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm"
               >
                 <option value="">Select Project...</option>
                 {projects.map((p: any) => (
                   <option key={p.id} value={p.id}>{p.title}</option>
                 ))}
               </select>
             </div>
             <div className="flex-1 space-y-2">
               <label className="text-xs font-semibold text-zinc-500 uppercase">Task Title</label>
               <input 
                 type="text" 
                 value={newTask.title}
                 onChange={e => setNewTask({...newTask, title: e.target.value})}
                 placeholder="e.g. Edit sneak peeks"
                 className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm"
               />
             </div>
             <div className="flex gap-2">
               <button type="button" onClick={() => setShowAddTask(false)} className="px-4 py-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 text-sm font-bold">Cancel</button>
               <button type="submit" disabled={isPending} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold">Save</button>
             </div>
          </form>
        </div>
      )}
      
      <div className="flex gap-6 overflow-x-auto pb-4 h-[70vh] no-scrollbar">
        {columns.map((col, colIndex) => {
          const columnTasks = tasks.filter(t => t.status === col);
          
          return (
            <div
              key={col}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
              className="w-80 min-w-[20rem] bg-zinc-100/50 dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 p-4 rounded-[1.5rem] flex flex-col gap-4 transition-colors"
            >
              <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/10 pb-3">
                 <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">{col}</h3>
                 <span className="text-[10px] font-bold text-zinc-500 bg-zinc-200 dark:bg-white/10 px-2 py-1 rounded-md">{columnTasks.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`task-${task.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={(e) => handleDragEnd(e, task.id)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        {col === 'Done' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mt-0.5 shrink-0" />
                        )}
                        <div>
                          <h4 className={`font-bold text-sm ${col === 'Done' ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-white'}`}>
                            {task.title}
                          </h4>
                          <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
                            {task.projects?.title}
                          </p>
                          {task.crew_members && (
                            <p className="text-[10px] text-zinc-500 mt-1">Assigned: {task.crew_members.name}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="h-full border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-xl flex items-center justify-center text-zinc-400 text-sm">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
