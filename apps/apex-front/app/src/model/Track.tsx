export interface Track {
  _id: string;
  name: string;
  wsUrl: string;
  httpPort: number;
  officialTiming: string;
  imgUrl: string;
  openedWs: boolean;
}
