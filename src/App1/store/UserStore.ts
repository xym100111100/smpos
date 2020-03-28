import { observable, computed } from "mobx";
import env from "../env";

export default class UserStore {
    /** 用户ID */
    @observable
    id!: string;
    /** 用户昵称 */
    @observable
    nickname?: string;
    /** 用户头像 */
    @observable
    face?: string;

    /** 用户头像的绝对路径 */
    @computed
    get faceAbsPath(): string | undefined {
        if (this.face) {
            if (this.face.startsWith('http')) return this.face;
            return env.PIC_BASE_URL + this.face;
        }
        return undefined;
    }
}
