import { useState, useEffect, useRef } from 'react';
import { Users, Calendar, MapPin, AlertCircle, CheckCircle, Clock, DollarSign, Upload, Image, Edit, X } from 'lucide-react';
import { participantService } from '../services/participantService';
import { Participant } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

// Cost per person for the trip
const TRIP_COST = 1500; // KShs per person

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Avatar editing state
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!isSupabaseConfigured()) {
        setError('Database connection not configured.');
        setLoading(false);
        return;
      }

      try {
        const data = await participantService.getParticipants();
        setParticipants(data);
      } catch (err) {
        console.error('Error loading participants:', err);
        setError('Failed to load participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();

    // Set up real-time subscription to participants table
    if (isSupabaseConfigured()) {
      const subscription = supabase
        .channel('participants-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'participants' 
          }, 
          async () => {
            // Refresh the entire list when any change occurs
            try {
              const data = await participantService.getParticipants();
              setParticipants(data);
            } catch (err) {
              console.error('Error refreshing participants:', err);
            }
          }
        )
        .subscribe();

      // Clean up subscription when component unmounts
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const totalGuests = participants.reduce((sum, participant) => sum + participant.number_of_guests, 0);
  const totalRevenue = participants.reduce((sum, participant) => sum + (participant.amount_paid || 0), 0);
  const expectedRevenue = participants.reduce((sum, participant) => sum + (participant.number_of_guests * TRIP_COST), 0);
  const paidParticipants = participants.filter(p => p.payment_status === 'paid').length;
  const partialParticipants = participants.filter(p => p.payment_status === 'partial').length;
  const pendingParticipants = participants.filter(p => p.payment_status === 'pending').length;

  const handleEditAvatar = (participant: Participant) => {
    setSelectedParticipant(participant);
    setAvatarPreview(participant.avatar_url || null);
    setAvatarFile(null);
    setUploadError(null);
    setIsEditingAvatar(true);
  };

  const handleCloseModal = () => {
    setIsEditingAvatar(false);
    setSelectedParticipant(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    setUploadError(null);
    setUploadProgress(0);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadError(null);

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !isSupabaseConfigured() || !selectedParticipant) return null;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('participant-avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          },
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('participant-avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setUploadError('Failed to upload avatar. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedParticipant || !selectedParticipant.id) {
      setUploadError('Participant information is missing');
      return;
    }

    try {
      setIsUploading(true);

      // Upload new avatar if one is selected
      let avatarUrl = selectedParticipant.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
        if (!avatarUrl) {
          setUploadError('Failed to upload avatar. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      // Update participant record with new avatar URL
      const result = await participantService.updateParticipantAvatar(selectedParticipant.id, avatarUrl || '');

      if (result.success) {
        // Update local state to reflect the change
        setParticipants(participants.map(p => 
          p.id === selectedParticipant.id ? { ...p, avatar_url: avatarUrl } : p
        ));

        // Close the modal
        handleCloseModal();
      } else {
        setUploadError(result.error || 'Failed to update avatar. Please try again.');
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
      setUploadError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center transform hover:scale-105 transition-all duration-300">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Required</h2>
            <p className="text-gray-600">
              The participant list requires database connection. 
              Please click the "Connect to Supabase" button in the top right to set up the database connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trip Participants</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            See who's joining us for the Nyandarua adventure!
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
            <div className="flex items-center space-x-3 text-green-600 bg-green-50 px-4 py-2 rounded-full">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">August 24, 2025</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Nyandarua County</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{participants.length}</h3>
            <p className="text-gray-600">Registered Participants</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{totalGuests}</h3>
            <p className="text-gray-600">Total Attendees</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">KSh {totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-600">Total Collected</p>
            <p className="text-sm text-gray-500">of KSh {expectedRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{paidParticipants}</h3>
            <p className="text-gray-600">Fully Paid</p>
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 sm:p-8 mb-8 border border-gray-100 transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Payment Status Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 transform hover:scale-105 transition-all duration-200">
              <CheckCircle className="h-10 w-10 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900 text-lg">{paidParticipants} Fully Paid</p>
                <p className="text-sm text-green-700">KSh 1,500 per person</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100 transform hover:scale-105 transition-all duration-200">
              <Clock className="h-10 w-10 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-yellow-900 text-lg">{partialParticipants} Partial Payment</p>
                <p className="text-sm text-yellow-700">Some amount paid</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 transform hover:scale-105 transition-all duration-200">
              <AlertCircle className="h-10 w-10 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-900 text-lg">{pendingParticipants} Pending</p>
                <p className="text-sm text-red-700">No payment yet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Participant List</h2>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading participants...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No participants registered yet.</p>
                <p className="text-sm text-gray-500 mt-2">Be the first to register for this amazing trip!</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {participants.map((participant, index) => (
                  <div
                    key={participant.id || index}
                    className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                          <div className="flex items-center">
                            <div className="relative group">
                              <img 
                                src={participant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.full_name)}&background=random&color=fff&size=40`} 
                                alt={`${participant.full_name}'s avatar`}
                                className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200 object-cover"
                                onLoad={() => {
                                  // If the participant doesn't have an avatar_url, save the generated one
                                  if (!participant.avatar_url) {
                                    const generatedAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.full_name)}&background=random&color=fff&size=40`;
                                    participantService.updateParticipantAvatar(participant.id || '', generatedAvatarUrl)
                                      .then(result => {
                                        if (result.success) {
                                          // Update local state to reflect the change
                                          setParticipants(participants.map(p => 
                                            p.id === participant.id ? { ...p, avatar_url: generatedAvatarUrl } : p
                                          ));
                                        }
                                      })
                                      .catch(error => console.error('Error saving generated avatar:', error));
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleEditAvatar(participant)}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="Change avatar"
                              >
                                <Edit className="h-4 w-4 text-white" />
                              </button>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl">{participant.full_name}</h3>
                          </div>
                          <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium w-fit">
                            {participant.number_of_guests} {participant.number_of_guests === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Registered on {participant.created_at ? new Date(participant.created_at).toLocaleDateString() : 'Unknown date'}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                          <div className="text-sm">
                            <span className="text-gray-600">Expected: </span>
                            <span className="font-bold text-gray-900">KSh {(participant.number_of_guests * TRIP_COST).toLocaleString()}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Paid: </span>
                            <span className="font-bold text-green-600">KSh {(participant.amount_paid || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="lg:ml-6">
                        {participant.payment_status === 'paid' ? (
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full shadow-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-bold">Fully Paid</span>
                          </div>
                        ) : participant.payment_status === 'partial' ? (
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-4 py-2 rounded-full shadow-sm">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-bold">Partial Payment</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-4 py-2 rounded-full shadow-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-bold">Payment Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        {participants.length > 0 && (
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Want to join this amazing group? Register now!
            </p>
            <a
              href="/register"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center group"
            >
              <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Register Now
            </a>
          </div>
        )}

        {/* Avatar Edit Modal */}
        {isEditingAvatar && selectedParticipant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform transition-all animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Change Profile Picture</h3>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center mb-4">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : selectedParticipant.avatar_url ? (
                    <img 
                      src={selectedParticipant.avatar_url} 
                      alt="Current avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="h-12 w-12 text-gray-400" />
                  )}
                </div>

                <p className="text-gray-700 font-medium mb-2">{selectedParticipant.full_name}</p>

                <div className="w-full">
                  <input
                    type="file"
                    id="avatar"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {avatarFile ? 'Change Image' : 'Upload New Image'}
                  </button>
                  <p className="mt-1 text-xs text-gray-500 text-center">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">Uploading: {uploadProgress}%</p>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {uploadError}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAvatar}
                  disabled={isUploading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-medium py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPage;
