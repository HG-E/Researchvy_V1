"use client";

import dynamic from "next/dynamic";

export const LessonPlayerClient = dynamic(
  () => import("./LessonPlayer").then((m) => m.LessonPlayer),
  { ssr: false },
);
