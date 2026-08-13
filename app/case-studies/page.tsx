import type { Metadata } from "next";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getCaseStudies } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Detailed case studies: business problem, architecture, implementation and result.",
};

export default function CaseStudiesPage() {
  const studies = getCaseStudies();

  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Problem → architecture → implementation → result"
        description="Longer write-ups of the engagements where the engineering decisions matter as much as the screens."
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {studies.map((project) => (
            <CaseStudyCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </>
  );
}
