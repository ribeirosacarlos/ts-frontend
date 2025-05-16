import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export function RegisterForm() {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.password_confirmation) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "As senhas não coincidem",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar');
            }

            toast({
                title: "Sucesso",
                description: "Conta criada com sucesso!",
            });

            // Redirect to login page
            navigate('/login');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: error instanceof Error ? error.message : "Erro ao criar conta",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
            <div className="space-y-2">
                <Input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="space-y-2">
                <Input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirmar Senha"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
            </Button>
        </form>
    );
} 