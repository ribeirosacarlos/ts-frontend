import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

type Task = {
  _id: {
    $oid: string;
  };
  name: string;
  status: "PENDING" | "DONE";
  createdAt: {
    $date: {
      $numberLong: string;
    };
  };
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/to-do-lists");
      const data = await response.json();
      console.log("Dados brutos recebidos:", data);
      // Transformando os dados para o formato esperado
      const formattedTasks = data.map((task: any) => ({
        ...task,
        _id: task._id || task.id // Tentando pegar o ID de diferentes formas
      }));
      console.log("Dados formatados:", formattedTasks);
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const createTask = async () => {
    if (!newTask.trim()) return;
    try {
      await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTask }),
      });
      setNewTask("");
      fetchTasks(); // Atualiza a lista após adicionar
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      console.log("Tarefa para atualizar:", task);
      const taskId = typeof task._id === 'string' ? task._id : task._id.$oid;
      console.log("ID da tarefa:", taskId);
      await fetch(`http://localhost:3333/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: task.status === "DONE" ? "PENDING" : "DONE",
        }),
      });
      fetchTasks(); // Atualiza a lista após alterar
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3333/tasks/${taskId}`, {
        method: "DELETE",
      });
      fetchTasks(); // Atualiza a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Digite uma nova tarefa..."
          value={newTask}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") createTask();
          }}
        />
        <Button onClick={createTask}>Adicionar</Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          console.log("Renderizando tarefa:", task);
          const taskId = typeof task._id === 'string' ? task._id : task._id.$oid;
          return (
            <Card key={taskId}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={task.status === "DONE"}
                    onCheckedChange={() => toggleTask(task)}
                  />
                  <span
                    className={`${
                      task.status === "DONE" ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => deleteTask(taskId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default App
