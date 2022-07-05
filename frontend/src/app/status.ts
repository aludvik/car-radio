import { Station } from "./station";

export interface Status {
    status: string,
    station?: Station,
    msg?: string,
}
