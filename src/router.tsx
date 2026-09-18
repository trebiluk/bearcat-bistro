import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

/** Production is proxied at apps.kulibert.net/bistro so Chromebooks never hit vercel.app. */
const basepath = import.meta.env.PROD ? "/bistro" : "";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    ...(basepath ? { basepath } : {}),
  });
}