import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { renderFamilyHtml } from "@/lib/family-html";
import { buildFamilyPayload } from "@/lib/family-menu";
import { useDesk } from "@/lib/store";

export const Route = createFileRoute("/family")({ component: FamilySite });

function FamilySite() {
  const school = useDesk((s) => s.school);
  const days = useDesk((s) => s.days);
  const cycle = useDesk((s) => s.cycle);
  const defaults = useDesk((s) => s.defaults);
  const menus = useDesk((s) => s.menus);
  const copy = useDesk((s) => s.copy);
  const icons = useDesk((s) => s.icons);
  const html = useMemo(
    () => renderFamilyHtml(buildFamilyPayload({ school, days, cycle, defaults, menus, copy, icons })),
    [school, days, cycle, defaults, menus, copy, icons],
  );
  return (
    <iframe
      title="Bearcat Bistro family lunch menu"
      srcDoc={html}
      className="h-dvh w-full border-0 bg-paper"
    />
  );
}
