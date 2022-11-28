import { Document } from 'mongoose';
import { Comment } from "./comment.type";

export class Post extends Document {
  owner: string;
  photoOrVideo: Array<string>;
  caption?: string;
  taggedpeople?: Array<string>;
  location?: string;
  comments?: Array<Comment>;
  likes?: Array<string>;
}
