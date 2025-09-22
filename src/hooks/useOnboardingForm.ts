import { useState } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { createSchool } from '@/utils/api';

// Define the owner information type
interface OwnerInfo {
  firstName: string;
  lastName: string;
  country: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dob: string;
  idCard: {
    idType: string;
    idNumber: string;
  };
}

// Extend OnboardingData to support multiple owners
interface ExtendedOnboardingData extends Omit<OnboardingData, 'ownerInformation'> {
  ownerInformation: OwnerInfo[];
}

const defaultFormData: ExtendedOnboardingData = {
  name: '',
  plan: 'Basic Plan',
  country: 'Nigeria',
  type: 'medium',
  size: 0,
  schoolInformation: {
    description: '',
    name: '',
    schoolType: '',
    address: {
      schoolAddress: '',
      localGovernment: '',
      state: '',
    },
  },
  ownerInformation: [], // Initialize as empty array
  schoolSetup: {
    foundingDate: '',
    schoolShortName: '',
    schoolMotto: '',
    studentGender: 'Mixed',
    schoolPhoneNumber: '',
    schoolEmailAddress: '',
    schoolAddress: '',
    country: "",
    lga: '',
    state: '',
    schoolWebsite: '',
    
  },
  uploadedFiles: [],
};

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState<ExtendedOnboardingData>(defaultFormData);

  // Update school information
  const updateSchoolInfo = (data: Partial<ExtendedOnboardingData['schoolInformation']>) => {
    setFormData(prev => ({
      ...prev,
      schoolInformation: {
        ...prev.schoolInformation,
        ...data,
      },
    }));
  };

  // Add a new owner
  const addOwner = (owner: OwnerInfo) => {
    setFormData(prev => ({
      ...prev,
      ownerInformation: [...prev.ownerInformation, owner],
    }));
  };

  // Update specific owner by index
  const updateOwner = (index: number, data: Partial<OwnerInfo>) => {
    setFormData(prev => {
      const updatedOwners = [...prev.ownerInformation];
      if (index >= 0 && index < updatedOwners.length) {
        updatedOwners[index] = {
          ...updatedOwners[index],
          ...data,
        };
      }
      return {
        ...prev,
        ownerInformation: updatedOwners,
      };
    });
  };

  // Remove owner by index
  const removeOwner = (index: number) => {
    setFormData(prev => {
      const updatedOwners = [...prev.ownerInformation];
      updatedOwners.splice(index, 1);
      return {
        ...prev,
        ownerInformation: updatedOwners,
      };
    });
  };

  // Update school setup
  const updateSchoolSetup = (data: Partial<ExtendedOnboardingData['schoolSetup']>) => {
    setFormData(prev => ({
      ...prev,
      schoolSetup: {
        ...prev.schoolSetup,
        ...data,
      },
    }));
  };

  const updateUploadedFiles = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files], // Append files
    }));
  };

  // Update general info
  const updateGeneralInfo = (data: Partial<Omit<ExtendedOnboardingData, 'schoolInformation' | 'ownerInformation' | 'schoolSetup' | 'uploadedFiles'>>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const submitForm = async () => {
    try {
      // Define the expected file names
      const filesList = ['schoolLogoId', 'cacId', 'utility'];
  
      // Rename files
      const renamedFiles: File[] = formData.uploadedFiles.map((file, index) => {
        if (index >= filesList.length) {
          console.warn(`Extra file detected: ${file.name}. Using fallback name.`);
          return file;
        }
        const newFileName = filesList[index];
        const extension = file.name.split('.').pop() || '';
        const renamedFileName = `${newFileName}.${extension}`;
        return new File([file], renamedFileName, { type: file.type });
      });
  
      // Prepare FormData for API submission
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('plan', formData.plan);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('size', String(formData.size));
      formDataToSend.append('schoolInformation', JSON.stringify(formData.schoolInformation));
      formDataToSend.append('ownerInformation', JSON.stringify(formData.ownerInformation));
      formDataToSend.append('schoolSetup', JSON.stringify(formData.schoolSetup));
  
      renamedFiles.forEach((file, index) => {
        const fileKey = filesList[index];
        formDataToSend.append(fileKey, file);
      });
  
      console.log('Submitting API data:', {
        ...formData,
        uploadedFiles: renamedFiles.map(f => f.name),
      });
  
      const response = await createSchool(formDataToSend);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    formData,
    updateSchoolInfo,
    addOwner,
    updateOwner,
    removeOwner,
    updateSchoolSetup,
    updateUploadedFiles,
    updateGeneralInfo,
    submitForm,
  };
};


