export default interface IProject {
    id: string;
    name: string;
    description: string;
    creator: string;
    assignees: string[];
}

interface IStatsPerProject {
    [key: string]: {
        name: string;
        totalTime: number;
        completedTasks: number;
        missedDeadlines: number;
        averageTime: number;
    };
}

export type { IStatsPerProject };
