import mongoose, { Schema } from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string;
  ownerId: mongoose.Types.ObjectId;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', productSchema);