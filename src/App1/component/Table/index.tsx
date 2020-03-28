import * as React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Table组件的属性
 */
interface TableProps<T> {
    /** 标题字体大小 */
    thFontSize?: number;
    /** 单元格字体大小 */
    tdFontSize?: number;
    /** 行高 */
    lineHeight?: number;
    /** 列数据 */
    columns: Array<ColumnDataType<T>>;
    /** 表格数据 */
    data: Array<T>;
}

/**
 * Table组件的状态
 */
interface TableStates {
}

interface ColumnDataType<T> {
    /** 
     * 列名称
     * 需要与Table属性中的data对象的属性名对应
     */
    name: string;
    /** 列标题 */
    title: string;
    /** 
     * 列宽度
     * number类型，表示与其它列的宽度比例，默认为0
     */
    width?: number;
    /** 列文本对齐 */
    textAlign?: 'left' | 'center' | 'right' | 'justify' | 'auto';
    /** 
     * 格式化器 
     * @param value 当前单元格的值
     * @param record 当前行的记录
     */
    formatter?: (value: any, record: T) => string;
    /**
     * 自定义渲染该列单元格的事件
     */
    render?: (value: any, record: T, columnName: string) => React.ReactNode;
}

export default class Table<T> extends React.Component<TableProps<T>, TableStates> {
    render() {
        const { thFontSize, tdFontSize, lineHeight, columns, data } = this.props;
        const dataTemp = data && data.length > 0 ? Array.from(data) : [];
        return (
            <View style={styles.container}>
                {/* 表头 */}
                <View style={styles.header}>
                    {columns.map(column => {
                        return (
                            <View
                                key={column.name}
                                style={[
                                    styles.th,
                                    column.width && { flex: column.width }
                                ]}
                            >
                                <Text style={[
                                    styles.thText,
                                    thFontSize && { fontSize: thFontSize } || undefined,
                                    column.textAlign && { textAlign: column.textAlign },
                                ]}>
                                    {column.title}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                {/* 表主体 */}
                <View style={styles.body}>
                    <FlatList<T>
                        data={dataTemp}
                        renderItem={({ item, index }) =>
                            // 行
                            <View style={[
                                styles.row,
                                index % 2 === 1 && { backgroundColor: '#99ccff' },
                                lineHeight && { height: lineHeight } || undefined
                            ]}>
                                {columns.map(column => {
                                    let text = (item as any)[column.name];
                                    // 格式化文本
                                    if (column.formatter) text = column.formatter(text, item);
                                    return (
                                        // 单元格
                                        <View key={column.name} style={[
                                            styles.td,
                                            column.width && { flex: column.width }
                                        ]}>
                                            {column.render && column.render(text, item, column.name)}
                                            {!column.render && (
                                                <Text style={[
                                                    styles.tdText,
                                                    tdFontSize && { fontSize: tdFontSize } || undefined,
                                                    column.textAlign && { textAlign: column.textAlign },
                                                ]}>
                                                    {text}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        }
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 15,
        borderBottomWidth: 3,
        borderBottomColor: '#666',
    },
    th: {
    },
    thText: {
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 15,
    },
    body: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    td: {
    },
    tdText: {
        paddingHorizontal: 15,
    },
});
