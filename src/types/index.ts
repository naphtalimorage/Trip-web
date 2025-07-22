export interface Participant {
  id?: string;
  full_name: string;
  phone_number: string;
  email: string;
  number_of_guests: number;
  payment_status: 'pending' | 'partial' | 'paid';
  amount_paid: number;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegistrationFormData {
  full_name: string;
  phone_number: string;
  email: string;
  number_of_guests: number;
  payment_status: 'pending' | 'partial' | 'paid';
  amount_paid: number;
  avatar_url?: string;
}

export interface Donation {
  id?: string;
  participant_id: string;
  participant_name: string;
  item_name: string;
  quantity: number;
  description?: string;
  created_at?: string;
}

export interface DonationFormData {
  item_name: string;
  quantity: number;
  description?: string;
}
