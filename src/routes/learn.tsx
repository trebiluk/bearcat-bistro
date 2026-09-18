import { createFileRoute } from "@tanstack/react-router";
import { NutritionLab } from "@/components/nutrition-lab";

export const Route = createFileRoute("/learn")({ component: NutritionLab });
