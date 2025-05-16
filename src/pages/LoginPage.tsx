import { useNavigate } from 'react-router-dom';
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        onLoginSuccess();
        navigate('/');
    };

    return (
        <AuthLayout
            title="Entrar"
            subtitle="Entre com sua conta para continuar"
            footerText="Não tem uma conta?"
            footerLink="/register"
            footerLinkText="Registre-se"
        >
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </AuthLayout>
    );
} 