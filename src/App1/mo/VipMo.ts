import env from "../env";


export default class VipMo {
    /** vipID */
    id?: string;
    /** vip昵称 */

    nickname?: string;
    /** vip头像 */

    face?: string;

    /** vip头像的绝对路径 */

    get faceAbsPath(): string | undefined {
        if (this.face) {
            if (this.face.startsWith('http')) return this.face;
            return env.PIC_BASE_URL + this.face;
        }
        return 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=581589389,4176489335&fm=26&gp=0.jpg';
    } 
}