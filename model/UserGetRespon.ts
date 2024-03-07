export interface UserGetRespon {
    uid: number;
    username: string;
    email: string;
    password: string;
    imguser: string;
    type: string;
}

export interface ScoreTotal {
    pid: any;
    totalScore: number;
}
