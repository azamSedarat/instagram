import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photoOrVideo: {type: Array<String>},
  caption: {type: String},
  taggedpeople: {type: Array<String>},
  location: {type: String},
  comments: [
    {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: {type: String},
    time: { type: Date},
    replies: [{
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      time: { type: Date},
      text: {type: String},
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

export const Post = mongoose.model('Post', PostSchema);