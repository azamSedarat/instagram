import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
    mobileNumber: String,
    email: String,
    fullName: {
      type: String,
      required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
      },
    password: {
      type: String,
      required: true,
    },
    photo: String,
    privateStatus : {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: '{VALUE} is not supported'
      }},
    birthDay: {
      type: Date,
    },
    pronouns: {
      type: String,
    },
    bio: {
      type: String,
    },
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

export const User = mongoose.model('User', UserSchema);