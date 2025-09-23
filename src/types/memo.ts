export type Memo = {
  id: string;
  userId: string;
  text: string;
  pinned: boolean;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};
