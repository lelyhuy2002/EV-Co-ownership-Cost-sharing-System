"use client";

import Link from 'next/link';
import AdminLayout from '@/components/Admin/AdminLayout';

export default function SystemSettings() {
  return (
    <AdminLayout active="settings">
      <h1>System Settings</h1>
      <p>Placeholder for system configuration (payment gateway, global settings).</p>
      <p><Link href="/admin">Back to admin</Link></p>
    </AdminLayout>
  );
}
