import type { Metadata } from "next";
import { CreateWish } from "./CreateWish";

export const metadata: Metadata = {
  title: "Create a wish",
};

export default function CreatePage() {
  return <CreateWish />;
}
