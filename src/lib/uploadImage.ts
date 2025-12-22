import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FirebaseError } from 'firebase/app';
import { storage } from './firebase';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Uploads a profile image to Firebase Storage
 * @param userId - The user's unique ID
 * @param file - The image file to upload
 * @returns Promise with the download URL and storage path
 */
export async function uploadProfileImage(userId: string, file: File): Promise<UploadResult> {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB. Please upload a smaller image.');
  }

  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const fileName = `profile_${userId}_${timestamp}.${fileExtension}`;
  const storagePath = `profile-images/${userId}/${fileName}`;

  try {
    if (!storage) {
      throw new Error('Firebase Storage is not initialized. Please check your Firebase configuration.');
    }

    const storageRef = ref(storage, storagePath);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      }
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: storagePath,
    };
  } catch (error: unknown) {
    console.error('Error uploading image:', error);

    if (error instanceof FirebaseError) {
      if (error.code === 'storage/unauthorized') {
        throw new Error('You do not have permission to upload images. Please check Firebase Storage rules.');
      } else if (error.code === 'storage/canceled') {
        throw new Error('Upload was canceled. Please try again.');
      } else if (error.code === 'storage/unknown') {
        throw new Error('An unknown error occurred. Please check your internet connection and try again.');
      } else if (error.code === 'storage/retry-limit-exceeded') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else {
        throw new Error('Failed to upload image. Please try again.');
      }
    } else if (error instanceof Error && error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to upload image. Please try again.');
    }
  }
}

/**
 * Deletes a profile image from Firebase Storage
 * @param storagePath - The path to the file in storage
 */
export async function deleteProfileImage(storagePath: string): Promise<void> {
  if (!storagePath) return;

  try {
    if (!storage) {
      console.warn('Firebase Storage is not initialized');
      return;
    }

    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.log('Successfully deleted old profile image');
  } catch (error: unknown) {

    if (error instanceof FirebaseError && error.code === 'storage/object-not-found') {
      console.log('File not found, skipping deletion');
      return;
    }
    console.error('Error deleting image:', error);
  }
}

/**
 * Validates an image file before upload
 * @param file - The file to validate
 * @returns Boolean indicating if file is valid
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB. Please upload a smaller image.',
    };
  }

  return { valid: true };
}