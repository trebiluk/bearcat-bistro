import { createFileRoute } from "@tanstack/react-router";
import { CivilRightsPage } from "@/components/civil-rights";

export const Route = createFileRoute("/rights")({ component: CivilRightsPage });
