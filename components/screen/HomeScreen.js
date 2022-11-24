import React from "react";
import { View, Text, Pressable, Modal, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Dimensions } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RANGE = 24;
const INITIAL_DATE = new Date().toLocaleDateString('pt-br').split('/').reverse().join('-');
const widthSize = Dimensions.get('window').width;
const heightSize = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {

    const [popup, setPopup] = React.useState(false);
    const [popMove, setPopMove] = React.useState(false);
    const [serachText, setSearchText] = React.useState('');
    const [moveYear, setMoveYear] = React.useState('');
    const [moveMonth, setMoveMonth] = React.useState('');
    const [moveDay, setMoveDay] = React.useState('');
    const [selected, setSelected] = React.useState(INITIAL_DATE); // 'yyyy-MM-DD'
    const [monthChanged, setMonthChanged] = React.useState(INITIAL_DATE.slice(0, 7));
    const marked = React.useMemo(() => {
        return {
            // marked -> dot
            // [nextWeekDate]: {
            //     selected: selected === nextWeekDate,
            //     selectedTextColor: '#5E60CE',
            //     marked: true
            // },
            // [nextMonthDate]: {
            //     selected: selected === nextMonthDate,
            //     selectedTextColor: '#5E60CE',
            //     marked: true
            // },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: '#00aeff',
                selectedTextColor: 'white'
            }
        };
    }, [selected]);

    const onDayPress = React.useCallback((day) => {
        setSelected(day.dateString);
    }, []);

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Pressable
                    onPress={() => setPopMove(!popMove)}
                    style={{ flexDirection: 'row', alignItems: 'center',}}>
                    <Text style={{ color: '#fff', fontSize: 20, paddingRight: 7 }}>
                        {monthChanged}
                    </Text>
                    <AntDesign name="caretdown" size={18} color={'#fff'} />
                </Pressable>),
        });
    }, [navigation, monthChanged]);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Modal
                visible={popup}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setPopup(!popup)}
                onShow={() => console.log('modal shown')}
            >
                {/* 운동기록 등록 */}
                <View style={{ margin: 18 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ borderWidth: 1, width: '90%', borderRadius: 10 }}>
                            <TextInput style={{ padding: 10 }} onChangeText={text => setSearchText(text)} />
                        </View>
                        <Pressable
                            style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}
                            onPress={() => console.log(serachText)}
                        >
                            <AntDesign name="search1" color={'#000'} size={heightSize / 36} />
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={popMove}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => setPopMove(!popMove)}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{ width: widthSize - 50, height: widthSize - 180, padding: 20, backgroundColor: '#cdcecf', borderRadius: 10, justifyContent: 'space-around', }}>
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
                                data={[1999, 2000]}
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
                                data={[1, 2, 3, 11]}
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
                                    console.log(moveYear);
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
                markedDates={marked}
                horizontal={true}
                pagingEnabled={true}
                monthFormat={'yyyy . MM'}
                hideExtraDays={false}
                disableAllTouchEventsForDisabledDays={true}
                onMonthChange={(month) => {
                    console.log(month.dateString.slice(0, 7));
                    setMonthChanged(month.dateString.slice(0, 7));
                }}
            />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="bed-empty" size={30} color={'#000'} />
                <Text>운동기록이 없습니다</Text>
                <Text>우측 하단 + 버튼을 눌러 추가해보세요</Text>
            </View>
            {/* <View>
                <ScrollView>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                    <Pressable>
                        <Text style={{fontSize: 70}}>#1 neck raise</Text>
                    </Pressable>
                </ScrollView>
            </View> */}
            <View>
                <View style={{ margin: 20, position: 'absolute', bottom: 0, right: 0 }}>
                    <Pressable
                        onPress={() => {
                            setPopup(!popup);
                        }}>
                        <AntDesign name="pluscircle" size={widthSize / 8} color={"#00aeff"} />
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
    popMovePressable: {borderRadius: 5, borderWidth: 0.6, width: 70, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', marginLeft: 10},
    popMovePressableTxt: {color: '#000'}
});
export default HomeScreen;