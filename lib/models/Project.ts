export interface IProject {
  id: string;
  name: string;
  workspaceId: string;
  visibility: "PUBLIC" | "PRIVATE";
  color?: string;
  createdAt: string;
  updatedAt: string;
}
