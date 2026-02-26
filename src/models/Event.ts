import { Schema, model, Document } from 'mongoose';


interface Event extends Document {
  title: string;
  description: string;
  local:string,
  date: Date;
  capacity: number;
  participantsCount: number;
  organizerId: Schema.Types.ObjectId;
}

const EventSchema = new Schema <Event>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  local: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  participantsCount: { type: Number, default: 0 },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});


export const Event = model<Event>('Event', EventSchema);