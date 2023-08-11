export type CommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  likeApplied?: boolean,
  dislikesCount: number,
  dislikeApplied?:boolean,
  violateApplied?:boolean,
  user: {
    id: string,
    name: string
  }
}
