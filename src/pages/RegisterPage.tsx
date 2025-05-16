import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export function RegisterPage() {
    return (
        <AuthLayout
            title="Registrar"
            subtitle="Crie sua conta para começar"
            footerText="Já tem uma conta?"
            footerLink="/login"
            footerLinkText="Entre aqui"
        >
            <RegisterForm />
        </AuthLayout>
    );
} 