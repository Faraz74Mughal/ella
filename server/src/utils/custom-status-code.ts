import { StatusCodes, ReasonPhrases } from 'http-status-codes';

// Custom status codes (using unassigned HTTP codes)
export const CustomStatusCodes = {
  // Standard codes
  ...StatusCodes,

  // Custom application-specific codes
  NO_TOKEN: 600,
  TOKEN_EXPIRED: 601,
  INVALID_TOKEN: 602,
  INVALID_SIGNATURE: 603,
  INSUFFICIENT_PERMISSIONS: 604,
  ACCOUNT_NOT_VERIFIED: 605,
  ACCOUNT_ALREADY_VERIFIED: 606,
  NO_REFRESH_TOKEN: 611,
  REFRESH_TOKEN_EXPIRED: 612,
  INVALID_REFRESH_TOKEN: 613,
} as const;

// Custom reason phrases
export const CustomReasonPhrases = {
  ...ReasonPhrases,
  600: 'No Token Provided',
  601: 'Token Expired',
  602: 'Invalid Token',
  603: 'Invalid Signature',
  604: 'Insufficient Permissions',
  605: 'Account Not Verified',
  606: 'Account Already Verified',

  611: 'No Refresh Token Provided',
  612: 'Refresh Token Expired',
  613: 'Invalid Refresh Token',
};

// Type definitions
export type CustomStatusCode = keyof typeof CustomStatusCodes;
export type StatusCodeValue = (typeof CustomStatusCodes)[CustomStatusCode];

// Utility functions
export const getStatusText = (code: number): string => {
  return (
    CustomReasonPhrases[code as keyof typeof CustomReasonPhrases] ||
    ReasonPhrases[code as unknown as keyof typeof ReasonPhrases] ||
    'Unknown Status'
  );
};

export const isSuccessCode = (code: number): boolean => code >= 200 && code < 300;
export const isErrorCode = (code: number): boolean => code >= 400;

export default CustomStatusCodes;
