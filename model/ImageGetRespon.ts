export interface ImageGetRespon {
    rank: number;
    color: string;
    pid: number;
    imganime: string;
    score: number;
    uid: number;
    total_score: number;

}

export interface Sevendaybefore {
    pid: number;
    voting_day: Date;
    total_score_last_7_days: number;
}

