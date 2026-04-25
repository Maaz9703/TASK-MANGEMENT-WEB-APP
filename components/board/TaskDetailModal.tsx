"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("../editor/RichTextEditor").then(m => m.RichTextEditor), { ssr: false });
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Clock, Flag, User, Trash2 } from "lucide-react";

interface TaskDetailModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onUpdate, onDelete }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [assignee, setAssignee] = useState(task.assignee || "unassigned");
  const [subtasks, setSubtasks] = useState<{id: string, title: string, completed: boolean}[]>(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");

  const handleSave = () => {
    onUpdate({ title, description, priority, status, dueDate, assignee, subtasks });
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtask, completed: false }]);
    setNewSubtask("");
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
             <DialogTitle className="flex-1">
               <Input 
                 value={title} 
                 onChange={(e) => setTitle(e.target.value)}
                 className="text-xl font-bold border-none px-0 focus-visible:ring-0 shadow-none"
               />
             </DialogTitle>
             <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
               <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 pt-4">
          <div className="col-span-2 space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Description</Label>
              <RichTextEditor 
                content={description} 
                onChange={setDescription} 
                placeholder="Add a detailed description..."
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Subtasks</Label>
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newSubtask} 
                  onChange={(e) => setNewSubtask(e.target.value)} 
                  placeholder="Add a new subtask..." 
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addSubtask(); } }} 
                />
                <Button type="button" onClick={addSubtask} variant="secondary">Add</Button>
              </div>
              
              {subtasks.length === 0 ? (
                <div className="border rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/50 text-center text-sm text-muted-foreground italic">
                  No subtasks yet. Add one above.
                </div>
              ) : (
                <div className="space-y-2">
                  {subtasks.map(st => (
                    <div key={st.id} className="flex items-center justify-between p-2 border rounded-md group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={st.completed} 
                          onChange={() => toggleSubtask(st.id)} 
                          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" 
                        />
                        <span className={`text-sm ${st.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {st.title}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSubtask(st.id)}>
                        <Trash2 className="h-3 w-3"/>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                <Flag className="h-3 w-3" /> Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                <User className="h-3 w-3" /> Assignee
              </Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="raptr_maaz">RAPTR MAAZ</SelectItem>
                  <SelectItem value="team_member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                <Clock className="h-3 w-3" /> Due Date
              </Label>
              <Input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
