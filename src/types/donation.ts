// types/donation.ts

export interface Donation {
  id: number;
  title: string;
  description: string;
  deadline: string;              // ISO-строка (можно преобразовать через new Date)
  createdBy: number;
  createdAt: string;
  status: 'active' | 'expired';
  creatorName: string;

  // 👇 эти поля приходят только в некоторых запросах (например, getDonationById)
  total_collected?: number;
  donor_count?: number;
  has_donated?: boolean;
}