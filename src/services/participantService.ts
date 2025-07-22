import { supabase } from '../lib/supabase';
import { Participant, RegistrationFormData, Donation, DonationFormData } from '../types';

export const participantService = {
  async registerParticipant(data: RegistrationFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('participants')
        .insert([data]);

      if (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async getParticipants(): Promise<Participant[]> {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('id, full_name, number_of_guests, payment_status, amount_paid, created_at, avatar_url, email, phone_number')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching participants:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
  },

  async addDonation(participantId: string, participantName: string, data: DonationFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('donations')
        .insert([{
          participant_id: participantId,
          participant_name: participantName,
          ...data
        }]);

      if (error) {
        console.error('Donation error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Donation error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  async getDonations(): Promise<Donation[]> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  async updateParticipantAvatar(participantId: string, avatarUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ avatar_url: avatarUrl })
        .eq('id', participantId);

      if (error) {
        console.error('Avatar update error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Avatar update error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
};
