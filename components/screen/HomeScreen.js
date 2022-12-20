import React from "react";
import { View, Text, Pressable, Modal, ScrollView, TextInput, StyleSheet, Platform } from 'react-native';
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Dimensions } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { FlatList } from "react-native-gesture-handler";

const RANGE = 24;
let INITIAL_DATE = new Date().toLocaleDateString('pt-br').split('/').reverse().join('-');
const widthSize = Dimensions.get('window').width;
const HomeScreen = ({ navigation }) => {

    const [data, setData] = React.useState([]);
    const [popMove, setPopMove] = React.useState(false);
    const [markedDays, setMarkedDays] = React.useState({});
    const [moveYear, setMoveYear] = React.useState('');
    const [moveMonth, setMoveMonth] = React.useState('');
    const [moveDay, setMoveDay] = React.useState('');
    const [selected, setSelected] = React.useState(INITIAL_DATE); // 'yyyy-MM-DD'
    const [monthChanged, setMonthChanged] = React.useState(INITIAL_DATE.slice(0, 7));

    // const mark = React.useMemo(() => {

    //     // return {
    //     //     [markedDays]: {marked: true},
    //     //     [selected]: {
    //     //         selected: true,
    //     //         disableTouchEvent: true,
    //     //         selectedColor: '#00aeff',
    //     //         selectedTextColor: 'white'
    //     //     }
    //     // };
    //     console.log(markedDays);
    //     return {
    //         [selected]: {
    //             selected: true, selectedColor: '#00aeff',
    //         },
    //         // } markedDays[selected] = {
    //         //     selected: true, selectedColor: '#00aeff',
    //         // };
    //     }
    // }, [selected, markedDays]);

    const onDayPress = React.useCallback((day) => {
        (typeof day === 'string' ? setSelected(day) : setSelected(day.dateString));
        // day in markedDays.keys
    }, []);

    React.useEffect(() => {
        database().ref('/exercise/' + auth().currentUser.uid).on('value', snapshot => {
            if (snapshot.exists()) {
                setData(snapshot.val());
                // const temp = Object.keys(snapshot.val()).reduce((c, v) => Object.assign(c, {[v]: {marked: true}}), {});
                Object.keys(snapshot.val()).forEach((item) => {
                    setMarkedDays(prev => ({ ...prev, [item]: { marked: true, } }));
                });
            }
        });
        database().ref('/users/'+auth().currentUser.uid).update({
            latestAccess: Date.now(),
        });
    }, []);
    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Pressable
                    onPress={() => setPopMove(!popMove)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 20, paddingRight: 7 }}>
                        {monthChanged}
                    </Text>
                    {Platform.OS === 'android' ? (<AntDesign name="caretdown" size={18} color={'#fff'} style={{ paddingTop: 5 }} />) : null}
                </Pressable>),
        });
    }, [navigation, monthChanged]);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Modal
                visible={popMove}
                animationType={'slide'}
                transparent={true}
                onShow={() => {
                    setMoveYear(selected.split('-')[0]);
                    setMoveMonth(selected.split('-')[1]);
                    setMoveDay(selected.split('-')[2]);
                }}
                onRequestClose={() => setPopMove(!popMove)}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={styles.popView}>
                        <View>
                            <Text style={{ fontSize: 20, color: '#000' }}>날짜 이동하기</Text>
                            <View style={{ borderWidth: 0.6, marginVertical: 8 }} />
                        </View>
                        <View style={{ alignItems: 'center', marginVertical: 5, flexDirection: 'row', justifyContent: 'center' }}>
                            <SelectDropdown
                                buttonStyle={styles.dropdown1BtnStyle}
                                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={10} />;
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdown1DropdownStyle}
                                rowStyle={styles.dropdown1RowStyle}
                                rowTextStyle={styles.dropdown1RowTxtStyle}
                                data={[2022, 2023]}
                                onSelect={(selectedItem, index) => {
                                    // context, index
                                    console.log(selectedItem, index);
                                    setMoveYear(selectedItem);
                                }}
                                defaultButtonText={selected.split('-')[0]}
                            />
                            <SelectDropdown
                                buttonStyle={styles.dropdown1BtnStyle}
                                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={10} />;
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdown1DropdownStyle}
                                rowStyle={styles.dropdown1RowStyle}
                                rowTextStyle={styles.dropdown1RowTxtStyle}
                                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                                onSelect={(selectedItem, index) => {
                                    // context, index
                                    console.log(selectedItem, index);
                                    setMoveMonth(selectedItem);
                                }}
                                defaultButtonText={selected.split('-')[1]}
                            />
                            <SelectDropdown
                                buttonStyle={styles.dropdown1BtnStyle}
                                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                renderDropdownIcon={isOpened => {
                                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={10} />;
                                }}
                                dropdownIconPosition={'right'}
                                dropdownStyle={styles.dropdown1DropdownStyle}
                                rowStyle={styles.dropdown1RowStyle}
                                rowTextStyle={styles.dropdown1RowTxtStyle}
                                data={[20, 21, 22, 23, 24, 25, 26]}
                                onSelect={(selectedItem, index) => {
                                    // context, index
                                    console.log(selectedItem, index);
                                    setMoveDay(selectedItem);
                                }}
                                defaultButtonText={selected.split('-')[2]}
                            />
                        </View>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Pressable
                                style={styles.popMovePressable}
                                onPress={() => {
                                    // move to
                                    console.log(moveYear, moveMonth, moveDay);
                                    const selectedDay = moveYear + '-' + moveMonth + '-' + moveDay;
                                    console.log(selectedDay);
                                    INITIAL_DATE = selectedDay;
                                    onDayPress(selectedDay);
                                    setPopMove(!popMove);
                                }}>
                                <Text style={styles.popMovePressableTxt}>확인</Text>
                            </Pressable>
                            <Pressable
                                style={styles.popMovePressable}
                                onPress={() => {
                                    setPopMove(!popMove);
                                }}>
                                <Text style={styles.popMovePressableTxt}>취소</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <CalendarList
                testID="calenderList"
                current={INITIAL_DATE}
                pastScrollRange={RANGE}
                futureScrollRange={RANGE}
                onDayPress={onDayPress}
                markedDates={{
                    ...markedDays, [selected]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: '#00aeff',
                        selectedTextColor: 'white'
                    }
                }}
                horizontal={true}
                pagingEnabled={true}
                monthFormat={'yyyy . MM'}
                hideExtraDays={false}
                disableAllTouchEventsForDisabledDays={true}
                onMonthChange={(month) => {
                    setMonthChanged(month.dateString.slice(0, 7));
                    setSelected(selected.slice(0, 8) + '01');
                }}
            />
            {Object.keys(markedDays).includes(selected) ? (
                <View style={{ flex:1 }}>
                    <FlatList
                        data={Object.values(data[selected])}
                        renderItem={item => (
                            <View style={{ flex: 1, borderWidth: 0.6, borderRadius: 20, borderColor: '#000', padding: 10, margin: 10 }}>
                                    <Text>{Object.values(item.item)[0].split(',')[3]}</Text>
                                    <Text>{Object.values(item.item)[0].split(',')[0]}</Text>
                                    <Text>{Object.values(item.item)[1]}</Text>
                                    <Text>{Object.values(item.item)[2]}</Text>
                                    <Text>{Object.values(item.item)[2]}</Text>
                            </View>
                        )} />
                    {/* {Object.values(data[selected]).map(item => {
                        <View style={{borderWidth: 0.6, borderRadius: 20, borderColor: '#000'}}>
                        </View>
                        console.log(typeof item);
                    })} */}
                </View>
            ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="bed-empty" size={30} color={'#000'} />
                    <Text>운동기록이 없습니다</Text>
                    <Text>우측 하단 + 버튼을 눌러 추가해보세요</Text>
                </View>
            )}


            <View>
                <View style={styles.plusBtn}>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Feed', { 'selected': selected });
                        }}>
                        {Platform.OS === 'android' ? (<AntDesign name="pluscircle" size={widthSize / 8} color={"#00aeff"} style={styles.shadowProp} />)
                            : (
                                <View style={styles.plusText}>
                                    <Text style={{ color: '#fff', alignItems: 'center', fontSize: 30, justifyContent: 'center' }}>+</Text>
                                </View>
                            )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    dropdown1BtnStyle: {
        width: '30%',
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#444',
        marginHorizontal: 5
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 16 },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF', borderRadius: 8 },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
    popMovePressable: {
        borderRadius: 5, borderWidth: 0.6, width: 70, height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginLeft: 10
    },
    popMovePressableTxt: { color: '#000' },
    plusBtn: {
        margin: 20, position: 'absolute', bottom: 0, right: 0,
    },
    plusText: {
        width: widthSize / 8, height: widthSize / 8,
        backgroundColor: '#00aeff',
        borderRadius: widthSize / 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popView: {
        width: widthSize - 50, height: widthSize - 180,
        padding: 20,
        backgroundColor: '#cdcecf',
        borderRadius: 10,
        justifyContent: 'space-around',
    },
    shadowProp: {
        ...Platform.select({
            ios: {
                shadowColor: "rgb(50,50,50)",
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: {
                    height: -1, width: 0
                },
            },
            android: {
                elevation: 3,
            }
        })
    }
});
export default HomeScreen;