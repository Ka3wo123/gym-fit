import GymUser from "./GymUser";

export default interface GymUserResponse {
    status: number,
    data: GymUser[]
}