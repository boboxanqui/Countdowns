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
        lastUpdate?: Date
}

export interface TimeLeft {
        years: number,
        days: number,
        hours: number,
        minutes: number,
        seconds: number
}
