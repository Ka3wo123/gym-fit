import TrainingDto from "./TrainingDto";

export default interface TrainingResponse {
    status: number,
    data: TrainingDto[]
}