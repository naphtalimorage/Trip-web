import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserPlus, CheckCircle, AlertCircle, DollarSign, Clock, Upload, Image } from 'lucide-react';
import { participantService } from '../services/participantService';
import { RegistrationFormData } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

// Form validation schema
const schema = yup.object({
  full_name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  phone_number: yup.string().required('Phone number is required').matches(/^(\+254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  number_of_guests: yup.number().required('Number of guests is required').min(1, 'At least 1 guest is required').max(10, 'Maximum 10 guests allowed'),
  payment_status: yup.string().required('Payment status is required').oneOf(['pending', 'partial', 'paid'], 'Invalid payment status'),
  amount_paid: yup.number().required('Amount paid is required').min(0, 'Amount paid cannot be negative'),
});


const RegistrationPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  /**
   * Uploads the selected avatar file to Supabase Storage
   * 
   * @returns The public URL of the uploaded avatar, or null if upload failed
   */
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !isSupabaseConfigured()) return null;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create a unique filename
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      number_of_guests: 1,
      payment_status: 'pending',
      amount_paid: 0,
    },
  });


  const onSubmit = async (data: RegistrationFormData) => {
    if (!isSupabaseConfigured()) {
      setSubmitError('Database connection not configured. Please contact the organizer.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Upload avatar if one is selected, or generate one if not
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
        if (!avatarUrl && uploadError) {
          setSubmitError(uploadError);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Generate an avatar using UI Avatars API
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name)}&background=random&color=fff&size=128`;
      }

      // Ensure amount_paid is 0 when payment_status is 'pending'
      const formData = {
        ...data,
        amount_paid: data.payment_status === 'pending' ? 0 : data.amount_paid,
        avatar_url: avatarUrl
      };

      const result = await participantService.registerParticipant(formData);

      if (result.success) {
        setIsSubmitted(true);
        reset();
        // Reset avatar state
        setAvatarFile(null);
        setAvatarPreview(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error(error); // Changed from console.log to console.error for consistency
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-8 text-center transform hover:scale-105 transition-all duration-300">
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Setup Required</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              The registration system needs to be connected to the database. 
              Please click the "Connect to Supabase" button in the top right to set up the database connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-6 sm:py-12">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-8 text-center transform animate-bounce-in">
            <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4 sm:mb-6 animate-pulse" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Registration Successful!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
              Thank you for registering for the Nyandarua trip. You'll receive more details via email and WhatsApp soon.
            </p>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center justify-center text-sm sm:text-base">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-600" />
                Payment Status
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-2">
                Your registration has been recorded with the following payment status:
              </p>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
                {watch('payment_status') === 'paid' ? (
                  <>
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-bold">Fully Paid</span>
                  </>
                ) : watch('payment_status') === 'partial' ? (
                  <>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-bold">Partial Payment</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-bold">Payment Pending</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-6 sm:py-12">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 transform hover:shadow-3xl transition-all duration-300">
          <div className="text-center mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <UserPlus className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Trip Registration</h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Register for the Nyandarua adventure on August 24, 2025
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Full Name *
              </label>
              <input
                {...register('full_name')}
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Phone Number *
              </label>
              <input
                {...register('phone_number')}
                type="tel"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                placeholder="e.g., +254712345678 or 0712345678"
              />
              {errors.phone_number && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="number_of_guests" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Number of Guests (including yourself) *
              </label>
              <select
                {...register('number_of_guests')}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
              {errors.number_of_guests && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {errors.number_of_guests.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Profile Picture (Optional)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar Preview */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  <div className="relative">
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
                      {avatarFile ? 'Change Image' : 'Upload Image'}
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {uploadError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-600" />
                Payment Information
              </h3>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Payment Status *
                </label>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center p-2 sm:p-0 border border-gray-200 rounded-lg sm:border-0 sm:rounded-none">
                    <input
                      {...register('payment_status')}
                      type="radio"
                      value="pending"
                      id="status-pending"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="status-pending" className="ml-2 block text-sm text-gray-700">
                      Payment Pending
                    </label>
                  </div>
                  <div className="flex items-center p-2 sm:p-0 border border-gray-200 rounded-lg sm:border-0 sm:rounded-none">
                    <input
                      {...register('payment_status')}
                      type="radio"
                      value="partial"
                      id="status-partial"
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <label htmlFor="status-partial" className="ml-2 block text-sm text-gray-700">
                      Partial Payment
                    </label>
                  </div>
                  <div className="flex items-center p-2 sm:p-0 border border-gray-200 rounded-lg sm:border-0 sm:rounded-none">
                    <input
                      {...register('payment_status')}
                      type="radio"
                      value="paid"
                      id="status-paid"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="status-paid" className="ml-2 block text-sm text-gray-700">
                      Fully Paid
                    </label>
                  </div>
                </div>
                {errors.payment_status && (
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {errors.payment_status.message}
                  </p>
                )}
              </div>

              {watch('payment_status') !== 'pending' && (
                <div>
                  <label htmlFor="amount_paid" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Amount Paid (KSh) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs sm:text-sm">KSh</span>
                    </div>
                    <input
                      {...register('amount_paid')}
                      type="number"
                      id="amount_paid"
                      className="w-full pl-10 sm:pl-12 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  {errors.amount_paid && (
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {errors.amount_paid.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
                <p className="text-red-600 text-xs sm:text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {submitError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center group"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-200" />
                  Register for Trip
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 border-t pt-4 sm:pt-6">
            <p>
              By registering, you agree to receive updates about the trip via email and WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
