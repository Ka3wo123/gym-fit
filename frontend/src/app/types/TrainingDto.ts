export default interface TrainingDto {
    id: string,
    name: string,
    dateStart: Date,
    workoutType: string,
    capacity?: number,
    freeSpaces: number
}