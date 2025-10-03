"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FindGroupsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new consolidated groups page
    router.replace("/groups");
  }, [router]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontSize: "18px",
      color: "#6b7280"
    }}>
      Đang chuyển hướng đến trang Quản lý nhóm...
    </div>
  );
}