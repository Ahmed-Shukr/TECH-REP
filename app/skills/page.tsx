import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { SkillGroup } from "@/components/SkillGroup";
import { skillGroups } from "@/content/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "ERP, frontend, DevOps, telecom and AI skills — grouped, not scored.",
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="A working inventory, not a percentage bar"
        description="Subjective scores are omitted on purpose. These are the tools used in delivery, grouped the way the work is actually organized."
      />
      <Container className="py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((group) => (
            <SkillGroup key={group.title} group={group} />
          ))}
        </div>
      </Container>
    </>
  );
}
