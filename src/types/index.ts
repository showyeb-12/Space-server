import type { BookingStatus, StudioCategory } from "@/lib/constants";

export type AuthProvider = "credentials" | "google";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
  provider: AuthProvider;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  photoURL: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StudioOwner {
  email: string;
  name: string;
  photoURL: string | null;
}

export interface Studio {
  id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  capacity: number;
  location: string;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  overview: string;
  owner: StudioOwner;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  ownerEmail: string;
  guestEmail: string;
  guestName: string;
  guestPhoto: string | null;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  securityDeposit: number;
  note: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedStudios {
  studios: Studio[];
  pagination: Pagination;
}
