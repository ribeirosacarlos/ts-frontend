import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    footerText: string;
    footerLink: string;
    footerLinkText: string;
}

export function AuthLayout({
    children,
    title,
    subtitle,
    footerText,
    footerLink,
    footerLinkText
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {subtitle}
                    </p>
                </div>
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {children}
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        {footerText}{' '}
                        <Link to={footerLink} className="font-medium text-indigo-600 hover:text-indigo-500">
                            {footerLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 