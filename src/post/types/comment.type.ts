import { User } from 'src/user/types/user.type';

export class Reply {
  owner: User;
  text: String;
  time?: Date;
}

export class Comment {
  owner: User;
  text: String;
  time?: Date;
  replies?: Array<Reply>
  likes?: Array<User>
}