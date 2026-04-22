import mongoose, { Schema, Document } from 'mongoose';

// --- Enums ---
export const REPORT_STATUS = {
  PENDING: 'pending',           // Admin needs to look at this
  REVIEWED: 'reviewed',         // Admin is investigating
  ACTION_TAKEN: 'action_taken', // Admin blocked the user or gave a warning
  DISMISSED: 'dismissed',       // Admin decided the report was false/invalid
} as const;

// --- TypeScript Interface ---
export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;   // Who made the report
  reportedUserId: mongoose.Types.ObjectId; // Who is being reported
  reason: string;
  status: typeof REPORT_STATUS[keyof typeof REPORT_STATUS];
  adminNotes?: string; // Private notes for the admin team
  createdAt: Date;
  updatedAt: Date;
}

// --- Mongoose Schema ---
const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'A reason for reporting is required'],
      minlength: [10, 'Please provide more details (minimum 10 characters)'],
      maxlength: [1000, 'Reason cannot exceed 1000 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', reportSchema);