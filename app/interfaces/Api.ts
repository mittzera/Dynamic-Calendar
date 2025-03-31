export interface IApiEvent {
  _id: string;
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  dayOfTheWeek: string;
  title: string;
  description: string;
  createdBy: {
    username: string;
    _id: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
  updatedBy?: {
    username: string;
    _id: string;
    picture: string;
  };
}
