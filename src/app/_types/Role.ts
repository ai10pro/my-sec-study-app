// ロールの定義
// zodのnativeEnumを使用して、Roleの型をzodスキーマとして定義。

export const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
