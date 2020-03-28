import { observable, computed } from 'mobx';
import OnlineDetailMo from './OnlineDetailMo';
import env from '../env';

/**
 * 上线信息
 */
export default class OnlineMo {
    /**
     * 上线ID
     */
    id!: string;
    /**
     * 上线标题
     */
    title!: string;
}
