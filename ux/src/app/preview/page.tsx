import { redirect } from "next/navigation";
import DashboardPreview from "../../components/dashboard/DashboardPreview";

export default function PreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  return <DashboardPreview />;
}
