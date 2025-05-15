import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

type Task = {
  id: number;
  to_do_list_id: number;
  description: string;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

type TodoList = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}

function App() {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [newTasks, setNewTasks] = useState<{ [key: number]: string }>({});
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const fetchTodoLists = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/to-do-lists");
      const data = await response.json();
      setTodoLists(data);
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return;
    
    try {
      await fetch("http://localhost:8080/api/to-do-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName }),
      });
      setNewListName("");
      fetchTodoLists();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
    }
  };

  const deleteList = async (listId: number) => {
    try {
      await fetch(`http://localhost:8080/api/to-do-lists/${listId}`, {
        method: "DELETE",
      });
      fetchTodoLists();
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
    }
  };

  const createTask = async (listId: number) => {
    const taskDescription = newTasks[listId];
    if (!taskDescription?.trim()) return;
    
    try {
      await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description: taskDescription,
          to_do_list_id: listId 
        }),
      });
      setNewTasks(prev => ({ ...prev, [listId]: "" }));
      fetchTodoLists();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await fetch(`http://localhost:3333/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_completed: task.is_completed ? 0 : 1,
        }),
      });
      fetchTodoLists();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      fetchTodoLists();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <div className="flex gap-2 mb-8">
        <Input
          placeholder="Nome da nova lista..."
          value={newListName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") createNewList();
          }}
        />
        <Button onClick={createNewList} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {todoLists.map((list) => (
        <div key={list.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{list.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={() => deleteList(list.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma nova tarefa..."
              value={newTasks[list.id] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewTasks(prev => ({ ...prev, [list.id]: e.target.value }))
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") createTask(list.id);
              }}
            />
            <Button onClick={() => createTask(list.id)}>Adicionar</Button>
          </div>

          <div className="space-y-2">
            {list.tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.is_completed === 1}
                      onCheckedChange={() => toggleTask(task)}
                    />
                    <span
                      className={`${
                        task.is_completed === 1 ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.description}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App
