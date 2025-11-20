export interface SchoolAddress {
  schoolAddress: string;
  localGovernment: string;
  state: string;
}

export interface SchoolInformation {
  description: string;
  name: string;
  schoolType: string;
  address: SchoolAddress;
}

export interface IdCard {
  idType: string;
  idNumber: string;
}

export interface OwnerInformation {
  firstName: string;
  lastName: string;
  country: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dob: string;
  idCard: IdCard;
}

export interface SchoolSetup {
  schoolShortName: string;
  country: string;
  foundingDate: string;
  // schoolBlockName: string;
  schoolMotto: string;
  studentGender: string;
  schoolPhoneNumber: string;
  schoolEmailAddress: string;
  schoolAddress: string;
  lga: string;
  state: string;
  schoolWebsite: string;
}

export interface OnboardingData {
  name: string;
  plan: string;
  country: string;
  type: string;
  size: number;
  schoolInformation: SchoolInformation;
  ownerInformation: OwnerInformation[]; // Change to array
  schoolSetup: SchoolSetup;
  uploadedFiles: File[];
}
