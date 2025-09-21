export interface bodyData {
    user?: {
      name: string;
      token: string;
    };
    post?: {
      title?: string;
      content?: string;
      id?: number;
      poster?: string;
      views?: number;
    };
    chat?: {
        id: number;
        muted?: string[];
        name?: string;
        owner?: string;
        participants?: string[];
        sender?: string;
        target?: string;
    }
    filter?: string;
}