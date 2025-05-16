import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

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

type ApiError = {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

function App() {
    const [todoLists, setTodoLists] = useState<TodoList[]>([]);
    const [newTasks, setNewTasks] = useState<{ [key: number]: string }>({});
    const [newListName, setNewListName] = useState("");
    const { toast } = useToast();

    const showError = (error: ApiError) => {
        let errorMessage = error.message;
        if (error.errors) {
            errorMessage = Object.values(error.errors)
                .flat()
                .join('\n');
        }
        toast({
            variant: "destructive",
            title: "Erro",
            description: errorMessage,
        });
    };

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
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar as listas. Por favor, tente novamente.",
            });
        }
    };

    const createNewList = async () => {
        if (!newListName.trim()) return;
        
        const tempId = Date.now(); // ID temporário para o otimistic update
        const newList = {
            id: tempId,
            name: newListName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tasks: []
        };

        // Otimistic update
        setTodoLists(prev => [...prev, newList]);
        setNewListName("");
        
        try {
            const response = await fetch("http://localhost:8080/api/to-do-lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newListName }),
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                showError(errorData);
                // Reverter o otimistic update em caso de erro
                setTodoLists(prev => prev.filter(list => list.id !== tempId));
                return;
            }

            const data = await response.json();
            // Atualizar com o ID real da API
            setTodoLists(prev => prev.map(list => 
                list.id === tempId ? { ...list, id: data.id } : list
            ));
            
            toast({
                title: "Sucesso",
                description: "Lista criada com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao criar lista:", error);
            // Reverter o otimistic update em caso de erro
            setTodoLists(prev => prev.filter(list => list.id !== tempId));
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao criar lista. Por favor, tente novamente.",
            });
        }
    };

    const deleteList = async (listId: number) => {
        // Otimistic update
        setTodoLists(prev => prev.filter(list => list.id !== listId));
        
        try {
            const response = await fetch(`http://localhost:8080/api/to-do-lists/${listId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                showError(errorData);
                // Reverter o otimistic update em caso de erro
                fetchTodoLists();
                return;
            }

            toast({
                title: "Sucesso",
                description: "Lista excluída com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao excluir lista:", error);
            // Reverter o otimistic update em caso de erro
            fetchTodoLists();
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao excluir lista. Por favor, tente novamente.",
            });
        }
    };

    const createTask = async (listId: number) => {
        const taskDescription = newTasks[listId];
        if (!taskDescription?.trim()) return;
        
        const tempId = Date.now(); // ID temporário para o otimistic update
        const newTask = {
            id: tempId,
            to_do_list_id: listId,
            description: taskDescription,
            is_completed: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Otimistic update
        setTodoLists(prev => prev.map(list => 
            list.id === listId 
                ? { ...list, tasks: [...list.tasks, newTask] }
                : list
        ));
        setNewTasks(prev => ({ ...prev, [listId]: "" }));
        
        try {
            const response = await fetch("http://localhost:8080/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    description: taskDescription,
                    to_do_list_id: listId 
                }),
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                showError(errorData);
                // Reverter o otimistic update em caso de erro
                setTodoLists(prev => prev.map(list => 
                    list.id === listId 
                        ? { ...list, tasks: list.tasks.filter(task => task.id !== tempId) }
                        : list
                ));
                return;
            }

            const data = await response.json();
            // Atualizar com o ID real da API
            setTodoLists(prev => prev.map(list => 
                list.id === listId 
                    ? { 
                        ...list, 
                        tasks: list.tasks.map(task => 
                            task.id === tempId ? { ...task, id: data.id } : task
                        )
                    }
                    : list
            ));
            
            toast({
                title: "Sucesso",
                description: "Tarefa criada com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
            // Reverter o otimistic update em caso de erro
            setTodoLists(prev => prev.map(list => 
                list.id === listId 
                    ? { ...list, tasks: list.tasks.filter(task => task.id !== tempId) }
                    : list
            ));
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao criar tarefa. Por favor, tente novamente.",
            });
        }
    };

    const toggleTask = async (taskId: number, listId: number, isCompleted: number) => {
        // Otimistic update
        setTodoLists(prev => prev.map(list => 
            list.id === listId 
                ? { 
                    ...list, 
                    tasks: list.tasks.map(task => 
                        task.id === taskId 
                            ? { ...task, is_completed: isCompleted ? 0 : 1 }
                            : task
                    )
                }
                : list
        ));
        
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    is_completed: !isCompleted
                }),
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                showError(errorData);
                // Reverter o otimistic update em caso de erro
                setTodoLists(prev => prev.map(list => 
                    list.id === listId 
                        ? { 
                            ...list, 
                            tasks: list.tasks.map(task => 
                                task.id === taskId 
                                    ? { ...task, is_completed: isCompleted }
                                    : task
                            )
                        }
                        : list
                ));
                return;
            }

            toast({
                title: "Sucesso",
                description: "Tarefa atualizada com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            // Reverter o otimistic update em caso de erro
            setTodoLists(prev => prev.map(list => 
                list.id === listId 
                    ? { 
                        ...list, 
                        tasks: list.tasks.map(task => 
                            task.id === taskId 
                                ? { ...task, is_completed: isCompleted }
                                : task
                        )
                    }
                    : list
            ));
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao atualizar tarefa. Por favor, tente novamente.",
            });
        }
    };

    const deleteTask = async (taskId: number, listId: number) => {
        // Otimistic update
        setTodoLists(prev => prev.map(list => 
            list.id === listId 
                ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
                : list
        ));
        
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                showError(errorData);
                // Reverter o otimistic update em caso de erro
                fetchTodoLists();
                return;
            }

            toast({
                title: "Sucesso",
                description: "Tarefa excluída com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
            // Reverter o otimistic update em caso de erro
            fetchTodoLists();
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao excluir tarefa. Por favor, tente novamente.",
            });
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold">Criar Nova Lista</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="Nome da nova lista..."
                            value={newListName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === "Enter") createNewList();
                            }}
                            className="flex-1"
                        />
                        <Button onClick={createNewList} className="flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nova Lista
                        </Button>
                    </div>
                </div>

                {todoLists.map((list) => (
                    <div key={list.id} className="space-y-4 border border-gray-100 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold">{list.name}</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => deleteList(list.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500">
                                {list.tasks.filter(task => task.is_completed === 1).length}/{list.tasks.length} tarefas completas
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                placeholder="Digite uma nova tarefa..."
                                value={newTasks[list.id] || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    setNewTasks(prev => ({ ...prev, [list.id]: e.target.value }))
                                }
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === "Enter") createTask(list.id);
                                }}
                                className="flex-1"
                            />
                            <Button onClick={() => createTask(list.id)} className="whitespace-nowrap">
                                Adicionar
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {list.tasks.map((task) => (
                                <Card key={task.id} className="hover:bg-gray-50 transition-colors border-gray-100">
                                    <CardContent className="flex items-center justify-between p-3 sm:p-4">
                                        <div 
                                            className="flex items-center gap-2 flex-1 cursor-pointer min-w-0"
                                            onClick={() => toggleTask(task.id, list.id, task.is_completed)}
                                        >
                                            <Checkbox
                                                checked={task.is_completed === 1}
                                                onCheckedChange={() => toggleTask(task.id, list.id, task.is_completed)}
                                                className="shrink-0"
                                            />
                                            <span
                                                className={`truncate ${
                                                    task.is_completed === 1 ? "line-through text-gray-400" : ""
                                                }`}
                                            >
                                                {task.description}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 ml-2"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                deleteTask(task.id, list.id);
                                            }}
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
            <Toaster />
        </>
    );
}

export default App
