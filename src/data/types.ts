export interface Info {
    location: string
    startTime: string
    endTime: string
}

export interface Schedule {
    dayId: string
    info: Info[]
}

export interface Performance {
    id: string
    name: string
    organization: string
    description: string
    schedules: Schedule[]
    images?: string[]
}

export interface Day {
    id: string
    date: string
    name: string
}

export interface Exhibition {
    id: string
    name: string
    organization: string
    description: string
    roomId: string
    images?: string[]
}

export type UnifiedEvent = (Performance & { category: 'performance' }) | (Exhibition & { category: 'exhibition' })
