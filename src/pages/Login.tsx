import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <AuthLayout
      title="Bine ai revenit!"
      subtitle="Conectează-te pentru a-ți gestiona programul"
    >
      <LoginForm />
    </AuthLayout>
  );
}