export interface langOption {
        lang: string;
        name: string;
        flag: string;
}

export interface Countdown {
        name: string,
        caption?: string,
        date: Date,
        style?: string,
        creationDate: Date,
        id: number,
        timeLeft?: number,
        lastUpdate?: Date,
        closed: boolean,
        removed: boolean,
        removeDate?: Date 
}

export interface TimeLeft {
        years: number,
        days: number,
        hours: number,
        minutes: number,
        seconds: number
}

export interface UserData {
        active: boolean,
        email?: string | null,
        displayName?: string | null,
        UID?: string,
}

export interface CountdownFirestore {
        removed: any;
        closed: any;
        name: string;
        creationDate: CreationDateClass;
        id: string;
        date: CreationDateClass;
        caption: string;
}

export interface CreationDateClass {
        seconds: number;
        nanoseconds: number;
}

