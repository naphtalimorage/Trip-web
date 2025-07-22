import { useState, useEffect } from 'react';
import { Gift, Plus, AlertCircle, Package, Users } from 'lucide-react';
import { participantService } from '../services/participantService';
import { Donation, Participant } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import DonationForm from '../components/DonationForm';

const DonationsPage = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured()) {
        setError('Database connection not configured.');
        setLoading(false);
        return;
      }

      try {
        const [donationsData, participantsData] = await Promise.all([
          participantService.getDonations(),
          participantService.getParticipants()
        ]);

        setDonations(donationsData);
        setParticipants(participantsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions if Supabase is configured
    if (isSupabaseConfigured()) {
      // Subscribe to donations table changes
      const donationsSubscription = supabase
        .channel('donations-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'donations' 
          }, 
          async () => {
            try {
              const donationsData = await participantService.getDonations();
              setDonations(donationsData);
            } catch (err) {
              console.error('Error refreshing donations:', err);
            }
          }
        )
        .subscribe();

      // Subscribe to participants table changes
      const participantsSubscription = supabase
        .channel('participants-changes-for-donations')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'participants' 
          }, 
          async () => {
            try {
              const participantsData = await participantService.getParticipants();
              setParticipants(participantsData);
            } catch (err) {
              console.error('Error refreshing participants:', err);
            }
          }
        )
        .subscribe();

      // Clean up subscriptions when component unmounts
      return () => {
        donationsSubscription.unsubscribe();
        participantsSubscription.unsubscribe();
      };
    }
  }, []);

  const handleDonationSuccess = async () => {
    setShowDonationForm(false);
    setSelectedParticipant(null);

    // No need to manually refresh donations list as it will be updated by the real-time subscription
  };

  const totalDonations = donations.length;
  const uniqueDonors = new Set(donations.map(d => d.participant_id)).size;

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Required</h2>
            <p className="text-gray-600">
              The donations feature requires database connection. 
              Please click the "Connect to Supabase" button in the top right to set up the database connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Group Donations</h1>
          <p className="text-lg text-gray-600 mb-8">
            See what our amazing group members are contributing for everyone's enjoyment!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalDonations}</h3>
            <p className="text-gray-600">Total Donations</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{uniqueDonors}</h3>
            <p className="text-gray-600">Contributing Members</p>
          </div>
        </div>

        {/* Add Donation Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Add Your Contribution</h2>
            {!showDonationForm && (
              <button
                onClick={() => setShowDonationForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Donation
              </button>
            )}
          </div>

          {showDonationForm && !selectedParticipant && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Name</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {participants.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => setSelectedParticipant(participant)}
                    className="text-left p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{participant.full_name}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDonationForm(false)}
                className="mt-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {showDonationForm && selectedParticipant && (
            <DonationForm
              participantId={selectedParticipant.id!}
              participantName={selectedParticipant.full_name}
              onSuccess={handleDonationSuccess}
              onCancel={() => {
                setShowDonationForm(false);
                setSelectedParticipant(null);
              }}
            />
          )}
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Donation List</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading donations...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No donations yet.</p>
                <p className="text-sm text-gray-500 mt-2">Be the first to contribute something for the group!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donations.map((donation, index) => (
                  <div
                    key={donation.id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Gift className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">{donation.item_name}</h3>
                          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                            {donation.quantity} {donation.quantity === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Donated by <span className="font-medium">{donation.participant_name}</span>
                        </p>
                        {donation.description && (
                          <p className="text-sm text-gray-500 mb-2">{donation.description}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Added on {donation.created_at ? new Date(donation.created_at).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        {donations.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              Thank you to everyone contributing to make this trip amazing!
            </p>
            {!showDonationForm && (
              <button
                onClick={() => setShowDonationForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
              >
                <Gift className="mr-2 h-5 w-5" />
                Add Your Contribution
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsPage;
