import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { participantService } from '../services/participantService';
import { DonationFormData } from '../types';

const schema = yup.object({
  item_name: yup.string().required('Item name is required').min(2, 'Item name must be at least 2 characters'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1').max(100, 'Maximum 100 items allowed'),
  description: yup.string().max(200, 'Description must be less than 200 characters'),
});

interface DonationFormProps {
  participantId: string;
  participantName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ 
  participantId, 
  participantName, 
  onSuccess, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await participantService.addDonation(participantId, participantName, data);
      
      if (result.success) {
        reset();
        onSuccess();
      } else {
        setSubmitError(result.error || 'Failed to add donation. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Gift className="h-6 w-6 text-green-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">Add Donation</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="item_name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            {...register('item_name')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="e.g., Water bottles, Snacks, First aid kit"
          />
          {errors.item_name && (
            <p className="mt-1 text-sm text-red-600">{errors.item_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            {...register('quantity')}
            type="number"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Additional details about the item..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Add Donation
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;