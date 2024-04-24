export interface langOption {
        lang: string;
        name: string;
        flag: string;
}

export interface countdown {
        name: string;
        fullDay: boolean;
        date: Date;
        hour?: number;
        minute?: number;
        caption?: string;
        creationDate: Date;
}
