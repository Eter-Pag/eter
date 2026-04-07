export interface BirthdayEntry {
  name: string;
  group?: string;
  category: string;
  year?: number;
}

export interface BirthdayData {
  [key: string]: BirthdayEntry[];
}
