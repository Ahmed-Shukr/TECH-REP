import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ProjectFilter } from "@/components/ProjectFilter";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected ERP, Odoo, telecom and AI systems designed and implemented by Ahmed Muhumed.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="What has actually been built"
        description="Filter by domain. Each card opens a structured project page: problem, role, architecture, implementation and impact."
      />
      <Container className="py-14">
        <ProjectFilter projects={projects} />
      </Container>
    </>
  );
}
