import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

export default function Register() {
  return (
    <AuthLayout
      title="Creează cont nou"
      subtitle="Începe să-ți organizezi programul mai eficient"
    >
      <RegisterForm />
    </AuthLayout>
  );
}