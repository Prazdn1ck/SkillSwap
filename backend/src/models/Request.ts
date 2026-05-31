import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  from: mongoose.Types.ObjectId;
  to:   mongoose.Types.ObjectId;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    from:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, default: '' },
    status:  { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IRequest>('Request', RequestSchema);
