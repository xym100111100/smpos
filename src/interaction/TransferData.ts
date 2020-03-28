/**
 * 传输数据的类型(以此来判断数据该如何处理)
 */
export class DataType {
    static readonly hello = '01';
}

/**
 * 传输的数据
 */
export class TransferData {
    dataType!: string;
    data!: string;
}
