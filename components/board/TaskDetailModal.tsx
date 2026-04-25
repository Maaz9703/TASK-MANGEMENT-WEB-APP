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

  const handleSave = () => {
    onUpdate({ title, description, priority, status });
    onClose();
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
              <div className="border rounded-md p-4 bg-zinc-50 dark:bg-zinc-900/50 text-center text-sm text-muted-foreground italic">
                No subtasks yet. Click to add one.
              </div>
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
              <div className="flex items-center gap-2 p-2 border rounded-md bg-white dark:bg-zinc-900">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                  U
                </div>
                <span className="text-sm">Unassigned</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                <Clock className="h-3 w-3" /> Due Date
              </Label>
              <div className="text-sm p-2 border rounded-md bg-white dark:bg-zinc-900 text-muted-foreground">
                Set due date
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
