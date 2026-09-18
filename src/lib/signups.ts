import { createServerFn } from "@tanstack/react-start";

export type StudentBag = {
  name: string;
  sandwich: string;
  allergy: string;
};

export type BagSignup = {
  id: string;
  tripDate: string;
  packDate: string;
  teacher: string;
  group: string;
  destination: string;
  pickupTime: string;
  students: StudentBag[];
  status: string;
};

function rowOf(r: Record<string, unknown>): BagSignup {
  const students = typeof r.students === "string" ? JSON.parse(r.students) : r.students;
  return {
    id: String(r.id),
    tripDate: String(r.trip_date).slice(0, 10),
    packDate: String(r.pack_date).slice(0, 10),
    teacher: String(r.teacher),
    group: String(r.group_name),
    destination: String(r.destination ?? ""),
    pickupTime: String(r.pickup_time ?? ""),
    students: Array.isArray(students) ? students : [],
    status: String(r.status),
  };
}

export const submitSignup = createServerFn({ method: "POST" })
  .validator((d: Omit<BagSignup, "id" | "status">) => d)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const id = `b${Date.now()}`;
    await sql`
      insert into bag_signups (id, trip_date, pack_date, teacher, group_name, destination, pickup_time, students, status)
      values (
        ${id},
        ${data.tripDate},
        ${data.packDate},
        ${data.teacher},
        ${data.group},
        ${data.destination},
        ${data.pickupTime},
        ${JSON.stringify(data.students)}::jsonb,
        'pending'
      )
    `;
    return { id };
  });

export const listSignups = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql`select * from bag_signups order by trip_date, created_at`;
  return rows.map(rowOf);
});

export const setSignupStatus = createServerFn({ method: "POST" })
  .validator((d: { id: string; status: string }) => d)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`update bag_signups set status = ${data.status} where id = ${data.id}`;
    return { ok: true };
  });
