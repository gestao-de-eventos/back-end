import { Schema, model, Document } from 'mongoose';


interface link extends Document {
  eventID: Schema.Types.ObjectId;
  userID: Schema.Types.ObjectId;
  subscribedAt: Date;
}

export const LinkSchema = new Schema<link>({
  eventID: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subscribedAt: { type: Date, default: Date.now }
});

LinkSchema.index({ eventID: 1, userID: 1 }, { unique: true });

export const Link = model<link>('Link', LinkSchema);