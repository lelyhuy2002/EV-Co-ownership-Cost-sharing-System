"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FindGroupsDetailRedirect({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new consolidated groups page with the group ID
    router.replace(`/groups/${params.id}/details`);
  }, [router, params.id]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontSize: "18px",
      color: "#6b7280"
    }}>
      Đang chuyển hướng đến trang chi tiết nhóm...
        </div>
  );
}