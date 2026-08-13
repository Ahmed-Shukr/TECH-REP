import {
  Activity,
  BarChart3,
  Building2,
  GraduationCap,
  Hospital,
  Radio,
  School,
  Stethoscope,
} from "lucide-react";
import type { Project } from "@/lib/types";

const icons = {
  hospital: Hospital,
  chart: BarChart3,
  exam: GraduationCap,
  ai: Activity,
  dashboard: Building2,
  radio: Radio,
  school: School,
  clinic: Stethoscope,
};

export function ProjectIcon({
  name,
  className,
}: {
  name: Project["icon"];
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} size={22} strokeWidth={1.75} />;
}
