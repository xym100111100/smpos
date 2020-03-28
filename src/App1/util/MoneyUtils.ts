/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatCurrency(num: number): string {
    if (isInteger(num)) return num.toString() + '.';
    let result = (Math.round(num * 100) / 100).toString();
    const dotIndex = result.indexOf('.');
    if (dotIndex === result.length - 2)
        result += '0';
    return result;
}

/** 判断数值是否是整数 */
function isInteger(num: number): boolean {
    return num % 1 === 0;
}

/**将字符串格式化成数字 */
export function formatStringToNumber(unm: string): number {
    let dotIndex = unm.indexOf('.');
    if (dotIndex === -1) return parseInt(unm);
    // 小数位数
    let decimalDigits = unm.length - dotIndex - 1;
    // 整数位和小数位
    let dataArr = unm.split(".");
    return parseInt(dataArr[0] + dataArr[1]) / Math.pow(10, decimalDigits)
}

/**计算两个数据 (加法和减法)*/
export function calculationTwoNumber(nub1: string, nub2: string, fun: string): number {
    if (nub1.indexOf('.') === -1) {
        nub1 += ".0"
    }
    if (nub2.indexOf('.') === -1) {
        nub2 += ".0"
    }
    let dotIndex1 = nub1.indexOf('.') + 1;
    let dotIndex2 = nub2.indexOf('.') + 1;

    // 小数位数(以最大的小数位数来调整))
    let decimalDigits = nub1.length - dotIndex1 > nub2.length - dotIndex2 ? nub1.length - dotIndex1 : nub2.length - dotIndex2;

    // 整数位和小数位
    let dataArr1 = nub1.split(".");
    // 整数位和小数位
    let dataArr2 = nub2.split(".");


    if (fun === "-") {
    return (((parseInt(dataArr1[0] + dataArr1[1]) * Math.pow(10, decimalDigits - (nub1.length - dotIndex1))) - (parseInt(dataArr2[0] + dataArr2[1]) * Math.pow(10, decimalDigits - (nub2.length - dotIndex2)))) / Math.pow(10, decimalDigits))
    } 
    else {
        return (((parseInt(dataArr1[0] + dataArr1[1]) * Math.pow(10, decimalDigits - (nub1.length - dotIndex1))) + (parseInt(dataArr2[0] + dataArr2[1]) * Math.pow(10, decimalDigits - (nub2.length - dotIndex2)))) / Math.pow(10, decimalDigits))
    }


}