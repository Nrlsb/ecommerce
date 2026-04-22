'use client';

import AuthForm from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <AuthForm />
            </motion.div>
        </div>
    );
}
