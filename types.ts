import type { RowDataPacket } from "mysql2"

export interface Post extends RowDataPacket {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  url: string;
}

export interface Stat extends RowDataPacket {
  route: string;
  uniqueUsers: number;
  mobileCount: number;
  desktopCount: number;
}

export interface Referer extends RowDataPacket {
  referer: string;
  uniqueUsers: number;
  mobileCount: number;
  desktopCount: number;
}