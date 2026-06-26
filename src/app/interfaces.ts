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
        color?: string,
        icon?: string,
        recurrence?: string,
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
        color?: string;
        icon?: string;
        recurrence?: string;
}

export interface CreationDateClass {
        seconds: number;
        nanoseconds: number;
}

// Card color presets for countdowns. Each value maps to a `.countdown-color-{value}`
// class (defined per-theme in styles.scss) so the swatch and card background
// adapt to light/dark mode while keeping the existing text/accent contrast.
// The first entry ('') represents "no color" (theme's default card background).
export const COUNTDOWN_COLORS: string[] = ['', 'blue', 'green', 'rose', 'purple', 'amber']

// Predefined Material Icons symbols used to mark a countdown's theme.
// Shown subtly in a corner of the card. The first entry ('') means "no icon".
export const COUNTDOWN_ICONS: string[] = ['', 'cake', 'flight', 'celebration', 'favorite', 'school']

// Recurrence options for a countdown. The first entry ('none') means the
// countdown does not repeat once it reaches zero.
export const COUNTDOWN_RECURRENCES: string[] = ['none', 'weekly', 'monthly', 'yearly']

